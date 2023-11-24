// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";

contract ERC721Enumerable is ERC721 {
    uint256[] private _allTokens;

    mapping(uint256 => uint256) private _allTokensIndex;

    mapping(address => uint256[]) private _ownedTokens;

    mapping(uint256 => uint256) private _ownedTokensIndex;

    function totalSupply() external view returns (uint256) {
        return _allTokens.length;
    }

    function tokenByIndex(uint256 _index) external view returns (uint256) {}

    function tokenOfOwnerByIndex(
        address _owner,
        uint256 _index
    ) external view returns (uint256) {}

    function _mint(address _to, uint256 _tokenId) internal override(ERC721) {
        super._mint(_to, _tokenId);
        _addTokensToTotalSupply(_tokenId);
    }

    function _addTokensToTotalSupply(uint256 _tokenId) private {
        _allTokens.push(_tokenId);
    }
}
