// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;
interface IProposal
{  
    function createSingleChoiceProposal(string memory _description, address[] memory _users,string[] memory _choices) external;
    function createMultipleChoiceProposal(string memory _description, address[] memory _users, string[] memory _choices) external;
    function executeProposal(uint256 proposalIndex) external;
}