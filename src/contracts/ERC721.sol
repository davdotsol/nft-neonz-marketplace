// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Connector.sol";

contract ERC721 {
    mapping(uint256 => address) private _tokensOwner;

    mapping(address => uint256) private _tokensOwnedCount;

    function _exists(uint256 tokenId) internal view returns (bool) {
        address _owner = _tokensOwner[tokenId];
        return _owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(
            to != address(0),
            "ERC721: minting to the zero address not possible"
        );
        require(!_exists(tokenId));
        _tokensOwner[tokenId] = to;
        _tokensOwnedCount[to] += 1;
    }
}
