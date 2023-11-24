// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./ERC721MetaData.sol";

contract ERC721Connector is ERC721MetaData, ERC721Enumerable {
    constructor(string memory n, string memory s) ERC721MetaData(n, s) {}
}
