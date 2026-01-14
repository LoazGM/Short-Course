// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    //saya ingin menyimpan sebuah nilai dalam bentuk uint256
    uint256 private storedValue;
    string public message;
    address public owner;
    event OwnerSet(address newOwner);

    //ketika ada update, saya akan track perubahannya
    event ValueUpdated(uint256 newValue);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    //simpan nilai ke blockchain (write)
    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    //membaca nilai dari blockchain (read) terakhir kali di update
    function getValue() public view returns (uint256) {
        return storedValue;
    }

    //menampilkan message
    function setMessage(string memory _message) public onlyOwner {
        message = _message;
    }
}