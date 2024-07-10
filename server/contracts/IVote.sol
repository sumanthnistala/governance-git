// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

enum VotingType { SingleChoice, MultipleChoice }

interface IVote {
    function voteSingleChoice(uint256 proposalIndex, uint256 choiceIndex) external;
    function voteMultipleChoice(uint256 proposalIndex, uint256[] memory choiceIndices) external;
}