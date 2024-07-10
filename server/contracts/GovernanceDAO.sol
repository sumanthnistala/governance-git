// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;
import './IVote.sol';
import './IProposal.sol';
import './IGovernance.sol';
import './IStake.sol';

contract GovernanceDAO is IVote, IProposal, IGovernance, IStake
{
    address payable public admin;

    struct Proposal
    {
        uint id;
        string description;
        VotingType votingType;
        bool isExecuted;
        Choice[] choices;
        address[] users;
    }

    struct Choice{
        string choiceValue;
        uint count;
    }

    struct UserVote{
        address user;
        uint id;
        Choice[] choices;
    }

    bool locked;
    address[] internal enrolledMembers;
    address[] internal membersList;
    Proposal[] public proposals;
    UserVote[] public voteList;

    mapping(uint => bool) public isDistributed;
    mapping(address => bool) public members;
    mapping(address => bool) public enrolledList;
    mapping(address => uint256) public stakes;
    mapping(address => mapping(uint => bool)) public votes;
    uint256 public totalStaked;
    uint256 public membersCount;
    uint256 public proposalCount;
    uint256 public enrolledMembersCount;

    event Rewards(address user, uint amout, bool success);

    constructor()
    {
        admin = payable(msg.sender);
    }

    modifier onlyOwner
    {
       require(msg.sender == admin, "Only Administrator can perform this action");
        _;
    }

    modifier onlyMember
    {
        require(members[msg.sender], "Only Member can perform this action");
        _;
    }

    function changeAdmin(address payable  _user) external onlyOwner
    {
        admin =  payable(_user);
    }

    function voteSingleChoice(uint256 proposalIndex, uint256 choiceIndex) external onlyMember noReentrancy
    {
        Proposal storage proposal  = proposals[proposalIndex];
        require(!proposal.isExecuted,"Proposal already executed");
        require(!votes[msg.sender][proposalIndex], "You have already voted on this proposal");
        require(proposal.votingType == VotingType.SingleChoice, "Not a single-choice proposal");
        require( members[msg.sender] == true,"Only Members can Vote");
        proposal.choices[choiceIndex].count++;

        UserVote storage u= voteList.push();
        u.user=msg.sender;
        u.id= proposalIndex;
        u.choices.push(Choice(proposal.choices[choiceIndex].choiceValue,choiceIndex));
        votes[msg.sender][proposalIndex]=true;
    }

    function voteMultipleChoice(uint256 proposalIndex, uint256[] memory choiceIndices) external onlyMember noReentrancy
    {
        Proposal storage proposal = proposals[proposalIndex];
        require(!proposal.isExecuted, "Proposal already executed");
        require(proposal.votingType == VotingType.MultipleChoice, "Not a multiple-choice proposal");
        require(!votes[msg.sender][proposalIndex], "You have already voted on this proposal");
        require( members[msg.sender] == true,"Only Members can Vote");
        UserVote storage u= voteList.push();
        u.user=msg.sender;
        u.id= proposalIndex;

        for (uint256 i = 0; i < choiceIndices.length; i++) {
            uint256 choiceIndex = choiceIndices[i];
            proposal.choices[choiceIndex].count++;
            u.choices.push(Choice( proposal.choices[choiceIndex].choiceValue,choiceIndex));
        }

        votes[msg.sender][proposalIndex]= true;
    }

    function addMember(address _member) external onlyOwner
    {
        require( members[_member] == false,"User already added");
        membersList.push(_member);
        members[_member] = true;
        enrolledList[_member] = false;
        enrolledMembersCount--;
        membersCount++;

    }

    function getProposalVotes(uint256 proposalIndex) external view returns(string[] memory, uint[] memory)
    {
        Proposal memory proposal = proposals[proposalIndex];
        string[] memory choiceValues = new string[](proposal.choices.length);
        uint[] memory count = new uint[](proposal.choices.length);

        for(uint i=0; i<proposal.choices.length;i++)
        {
            choiceValues[i]= proposal.choices[i].choiceValue;
            count[i] = proposal.choices[i].count;
        }
        
        return(choiceValues, count);
    }

    function getMembers() external onlyOwner view returns(address[] memory)
    {
        address[] memory addedMembers= new address[](membersCount);
        for(uint i=0; i<membersCount;i++)
        {
            if(membersList[i] != address(0))
            {
                addedMembers[i]= membersList[i];
            }
        }

        return addedMembers;
    }

    // function getProposalsForMe(address user) external returns(string[] memory, int[] memory, string[] memory)
    // {
    //     string[] memory choices;
    //     bool userExists;
    //     uint[] memory id = new uint[](proposals.length);
    //     uint pCount=0;

    //     for(uint i=0; i<proposals.length;i++)
    //     {
    //         for (uint j=0; j<proposals[i].users.length;j++)
    //         {
    //             if(proposals[i].users[j]==user)
    //             {
    //                 userExists= true;
    //                 id[pCount]=i;
    //                 pCount++;
    //             }
    //         }
    //     }
    //     if(userExists)
    //     {
    //         string[] memory description;
    //         int[] memory votingType;

    //         for(uint i=0;i<id.length;i++)
    //         {
    //             description= new string[](id.length);
    //             votingType = new int[](id.length);
    //             choices = new string[](proposals[i].choices.length);
    //             for(uint j=0;i<proposals[i].choices.length;i++)
    //             {
    //                 choices[i]= proposals[i].choices[j].choiceValue;
    //             }
    //         }

    //         return(description, votingType, choices );
    //     }
    //     else {
    //        string[] memory emptyString = new string[](0);
    //        string[] memory emptyChoice = new string[](0);
    //        int[] memory emptyInt = new int[](0);
    //        return (emptyString, emptyInt, emptyChoice);
    //    }
    // }

    function getProposal(uint id) external view returns(string memory, VotingType, bool, string[] memory, address[] memory)
    {
        string[] memory choices = new string[](proposals[id].choices.length);
        for(uint i=0;i<proposals[id].choices.length;i++)
        {
            choices[i]= proposals[id].choices[i].choiceValue;
        }
        return(proposals[id].description, proposals[id].votingType, proposals[id].isExecuted, choices, proposals[id].users );
    }

    function removeMember(address _member) external onlyOwner
    {
        require(members[_member] == true,"Member already removed");
        uint amount = stakes[_member];
        (bool success,) = admin.call{value: amount}("");
        require(success, "Failed to send Ether");
        members[_member] = false;
        stakes[_member] = 0;
        membersCount--;
    }

    function deposit() external payable {}
    function stake(uint amount) external payable onlyMember noReentrancy
    {
        stakes[msg.sender] += amount;
        totalStaked += amount;

    }

    function withdrawStake(uint256 amount) external onlyMember noReentrancy
    {
        require(stakes[msg.sender] >= amount, "Insufficient staked amount");
       (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");
        stakes[msg.sender] -= amount;
        totalStaked -= amount;
    }

    function distributeRewards(uint proposalId, string[] memory choices) external onlyOwner noReentrancy
    {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.isExecuted, "Proposal is no executed yet");
        require(!isDistributed[proposalId], "Rewards already distributed");
           
        for(uint i=0; i<voteList.length;i++)
        {
            if(voteList[i].id == proposalId)
            {
                for(uint j=0; j <voteList[i].choices.length; j++)
                {
                    if(proposal.votingType == VotingType.SingleChoice)
                    {
                        for(uint k =0; k<choices.length;k++)
                        {
                            if(keccak256(abi.encodePacked(voteList[i].choices[j].choiceValue))==keccak256(abi.encodePacked(choices[k])))
                            {
                                uint256 amount = ((stakes[voteList[i].user] / totalStaked) * 1e9);
                                uint256 reward = amount + stakes[voteList[i].user];
                                (bool success,)= voteList[i].user.call{value: reward}("");

                                emit Rewards(voteList[i].user, reward, success);
                            }   
                        }
                    }
                    else if(proposal.votingType == VotingType.MultipleChoice)
                    {
                        for(uint k =0; k<choices.length;k++)
                        {
                            if(keccak256(abi.encodePacked(voteList[i].choices[j].choiceValue))==keccak256(abi.encodePacked(choices[k])))
                            {
                                uint256 amount = ((stakes[voteList[i].user] / totalStaked) * 1e8);
                                uint256 reward = amount + stakes[voteList[i].user];
                                (bool success,) = voteList[i].user.call{value: reward}("");
                                emit Rewards(voteList[i].user, reward, success);
                            }
                        }   
                    }
                }
            }
        }

        isDistributed[proposalId]= true;
    }

    function penalize(address _member, uint256 _penaltyAmount) external onlyOwner
    {
        require(stakes[_member] >= _penaltyAmount, "Insufficient staked amount to penalize");
        stakes[_member] -= _penaltyAmount;
        totalStaked -= _penaltyAmount;

        payable(admin).transfer(_penaltyAmount);
    }

    function createSingleChoiceProposal(string memory _description, address[] memory _users, string[] memory _choices) external onlyOwner
    { 
        uint pCount = proposalCount++;
        Proposal storage p = proposals.push();
        p.id = pCount;
        p.description = _description;
        p.votingType = VotingType.SingleChoice;
        p.isExecuted = false;
        p.users = _users;
        for(uint i=0;i<_choices.length;i++)
        {
            p.choices.push(Choice(_choices[i],0));
        }
    }

    function createMultipleChoiceProposal(string memory _description, address[] memory _users, string[] memory _choices) external onlyOwner
    {       
        uint pCount = proposalCount++;
        Proposal storage p  = proposals.push();
        p.id = pCount;
        p.description = _description;
        p.votingType = VotingType.MultipleChoice;
        p.isExecuted = false;
        p.users = _users;
        for(uint i=0;i<_choices.length;i++)
        {
           p.choices.push(Choice(_choices[i],0));
        }

    }

    function proposalWinner(uint id) external view returns(string[] memory, uint[] memory)
    {
        Proposal memory proposal = proposals[id];
        string[] memory choiceValues = new string[](proposal.choices.length);
        uint[] memory count = new uint[](proposal.choices.length);
        uint winner = 0;
        for(uint i=0; i<proposal.choices.length;i++)
        {
            winner =0;
            if(proposal.choices[i].count > winner)
            {
                winner = proposal.choices[i].count;
            }
        }
        
        for(uint i=0; i<proposal.choices.length;i++)
        {

            if(proposal.choices[i].count == winner)
            {
                choiceValues[i]= proposal.choices[i].choiceValue;
                count[i] = proposal.choices[i].count;
            }
        }

        return (choiceValues, count);
    }

    function executeProposal(uint256 proposalIndex) external onlyOwner
    {
        Proposal storage proposal = proposals[proposalIndex];
        require(!proposal.isExecuted, "Proposal already executed");

        proposal.isExecuted = true;
        isDistributed[proposalIndex]=false;
    }

    function getMyStake() external view onlyMember returns(uint amount)
    {
        return stakes[msg.sender];
    }

    function getEnrolledMembers() external view onlyOwner returns(address[] memory users)
    {
        address[] memory _users = new address[](enrolledMembersCount);
        uint usersCount = 0;
        for(uint i=0; i < enrolledMembersCount;i++)
        {
            address user = enrolledMembers[i];
            if(enrolledList[user] && user!=address(0))
            {
                _users[usersCount]= user;
                usersCount++;
            }
        }
        return _users;
    }

    function enrollMember(address _user) external
    {
        if(_user != admin)
        {
            require(enrolledList[_user]== false, "User already enrolled");
            enrolledMembers.push(_user);
            enrolledList[_user] = true;
            enrolledMembersCount++;
        }
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }
}