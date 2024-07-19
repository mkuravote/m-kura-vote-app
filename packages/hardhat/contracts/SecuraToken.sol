// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ISecuraToken} from "./interfaces/ISecuraTokenMint.sol";

contract SecuraToken is ISecuraToken, ERC20, Ownable {
    IERC20 public cusdToken;
    IERC20 public ckesToken;

    uint256 public cusdRate;  // Number of CUSD required to mint 1 SECURA
    uint256 public ckesRate;  // Number of CKES required to mint 1 SECURA

    constructor(address _cusdAddress, address _ckesAddress, uint256 _cusdRate, uint256 _ckesRate) ERC20("SECURA", "SEC") {
        cusdToken = IERC20(_cusdAddress);
        ckesToken = IERC20(_ckesAddress);
        cusdRate = _cusdRate;
        ckesRate = _ckesRate;
    }

    // Function to handle the receipt of CUSD tokens
    function receiveCUSD(uint256 amount) external {
        require(cusdRate > 0, "CUSD rate not set");
        uint256 mintAmount = (amount / cusdRate) * 1e18;
        require(mintAmount > 0, "Amount too low to mint any SECURA");
        require(cusdToken.transferFrom(msg.sender, address(this), amount), "CUSD Transfer failed");
        _mint(msg.sender, mintAmount);
    }

    // Function to handle the receipt of CKES tokens
    function receiveCKES(uint256 amount) external {
        require(ckesRate > 0, "CKES rate not set");
        uint256 mintAmount = (amount / ckesRate) * 1e18;
        require(mintAmount > 0, "Amount too low to mint any SECURA");
        require(ckesToken.transferFrom(msg.sender, address(this), amount), "CKES Transfer failed");
        _mint(msg.sender, mintAmount);
    }

    // Function to retrieve the tokens sent to the contract
    function retrieveTokens(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner(), amount);
    }

    // Setter function for cusdRate
    function setCusdRate(uint256 _cusdRate) external onlyOwner {
        cusdRate = _cusdRate;
    }

    // Setter function for ckesRate
    function setCkesRate(uint256 _ckesRate) external onlyOwner {
        ckesRate = _ckesRate;
    }

    // withraw all cusd tokens from the contract
    function withdrawCUSD() external onlyOwner {
        uint256 balance = cusdToken.balanceOf(address(this));
        require(cusdToken.transfer(owner(), balance), "CUSD Transfer failed");
    }

    // withraw all ckes tokens from the contract
    function withdrawCKES() external onlyOwner {
        uint256 balance = ckesToken.balanceOf(address(this));
        require(ckesToken.transfer(owner(), balance), "CKES Transfer failed");
    }
}
