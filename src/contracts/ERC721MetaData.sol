// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC165.sol";
import "../interfaces/IERC721Metadata.sol";

contract ERC721MetaData is IERC721Metadata, ERC165 {
    string private _name;
    string private _symbol;

    constructor(string memory n, string memory s) {
        _name = n;
        _symbol = s;
        registerInterface(
            bytes4(keccak256("name(bytes4)") ^ keccak256("symbol(bytes4)"))
        );
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }
}
