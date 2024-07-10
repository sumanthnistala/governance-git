// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IGovernance {
    function changeAdmin(address payable _user) external;
    function enrollMember(address _user) external;
    function getEnrolledMembers() external returns(address[] memory users);
    function addMember(address _member) external;
    function removeMember(address _member) external;
    function distributeRewards(uint proposalId , string[] memory choices) external;
    function penalize(address _member, uint256 _penaltyAmount) external;    
}