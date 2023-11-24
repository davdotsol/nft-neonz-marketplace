// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Connector.sol";

contract KryptoNeonz is ERC721Connector {
    string[] public neonz;

    mapping(string => bool) neonzExists;

    constructor() ERC721Connector("KryptoNeonz", "KNEONZ") {}

    function mint(string memory _neonz) public {
        require(!neonzExists[_neonz], "Error - KryptoNeon already exists");
        neonz.push(_neonz);

        uint _id = neonz.length - 1;

        _mint(msg.sender, _id);

        neonzExists[_neonz] = true;
    }
}
