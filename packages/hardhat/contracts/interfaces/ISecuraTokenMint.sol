// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

interface ISecuraToken {

    function receiveCKES(uint256 amount) external;

    function receiveCUSD(uint256 amount) external;
}