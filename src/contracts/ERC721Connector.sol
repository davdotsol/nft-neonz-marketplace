// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721MetaData.sol";

contract ERC721Connector is ERC721MetaData {
    constructor(string memory n, string memory s) ERC721MetaData(n, s) {}
}
