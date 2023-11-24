// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721MetaData {
    string private _name;
    string private _symbol;

    constructor(string memory n, string memory s) {
        _name = n;
        _symbol = s;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }
}
