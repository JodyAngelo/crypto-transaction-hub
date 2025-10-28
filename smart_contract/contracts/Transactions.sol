// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct {
        address sender; 
        address receiver; 
        uint amount; 
        string message; 
        uint256 timestamp; 
        string keyword;
    }

    TransferStruct[] transactions;
    function createTransaction(address payable receiver, string memory keyword, string memory message) public payable {
        require(msg.value > 0, "Must Send some ETH");
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, msg.value, message, block.timestamp, keyword));

        receiver.transfer(msg.value);

        emit Transfer(msg.sender, receiver, msg.value, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }
}