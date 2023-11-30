// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "../interfaces/IERC721Enumerable.sol";

contract ERC721Enumerable is ERC721, IERC721Enumerable {
    uint256[] private _allTokens;

    mapping(uint256 => uint256) private _allTokensIndex;

    mapping(address => uint256[]) private _ownedTokens;

    mapping(uint256 => uint256) private _ownedTokensIndex;

    constructor() {
        registerInterface(
            bytes4(
                keccak256("totalSupply(bytes4)") ^
                    keccak256("tokenByIndex(bytes4)") ^
                    keccak256("tokenOfOwnerByIndex(bytes4)")
            )
        );
    }

    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    function tokenByIndex(uint256 _index) external view returns (uint256) {
        require(_index < totalSupply(), "global index out of bounds");
        return _allTokens[_index];
    }

    function tokenOfOwnerByIndex(
        address _owner,
        uint256 _index
    ) external view returns (uint256) {
        require(_index < balanceOf(_owner), "owner index out of bounds");
        return _ownedTokens[_owner][_index];
    }

    function _mint(address _to, uint256 _tokenId) internal override(ERC721) {
        super._mint(_to, _tokenId);
        _addTokensToAllTokenEnumeration(_tokenId);
        _addTokensToOwnerEnumeration(_to, _tokenId);
    }

    function _addTokensToAllTokenEnumeration(uint256 _tokenId) private {
        _allTokensIndex[_tokenId] = _allTokens.length;
        _allTokens.push(_tokenId);
    }

    function _addTokensToOwnerEnumeration(
        address _to,
        uint256 _tokenId
    ) private {
        _ownedTokensIndex[_tokenId] = _ownedTokens[_to].length;
        _ownedTokens[_to].push(_tokenId);
    }
}
