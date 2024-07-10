// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

interface IStake {
    function stake(uint amount) external payable;
    function withdrawStake(uint amount) external;
    function getMyStake() external returns(uint amount);
}
