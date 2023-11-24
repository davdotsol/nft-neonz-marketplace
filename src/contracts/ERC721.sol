// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint indexed tokenId
    );

    mapping(uint256 => address) private _tokensOwner;

    mapping(address => uint256) private _tokensOwnedCount;

    function _exists(uint256 tokenId) internal view returns (bool) {
        address _owner = _tokensOwner[tokenId];
        return _owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        require(
            to != address(0),
            "ERC721: minting to the zero address not possible"
        );
        require(!_exists(tokenId), "ERC721: token already minted");
        _tokensOwner[tokenId] = to;
        _tokensOwnedCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        require(
            _owner != address(0),
            "ERC721: owner query for non-existent token"
        );
        return _tokensOwnedCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        require(
            _exists(_tokenId),
            "owner query for non-query for non-existent token"
        );
        return _tokensOwner[_tokenId];
    }
}
