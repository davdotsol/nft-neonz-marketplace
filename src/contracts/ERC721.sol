// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    mapping(uint256 => address) private _tokensOwner;

    mapping(address => uint256) private _tokensOwnedCount;

    mapping(uint256 => address) private _tokenApprovals;

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

    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(_to != address(0), "ERC721: Transfer to the zero address");
        require(
            ownerOf(_tokenId) == _from,
            "ERC721: Trying to transfer a token the address does not own"
        );
        _tokensOwnedCount[_from] -= 1;
        _tokensOwnedCount[_to] += 1;
        _tokensOwner[_tokenId] = _to;

        emit Transfer(address(_from), _to, _tokenId);
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

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        require(_isApprovedOrOwner(msg.sender, _tokenId));
        _transferFrom(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        address _owner = ownerOf(_tokenId);
        require(_to != _owner, "ERC721: approval to current owner");
        require(
            msg.sender == _owner,
            "ERC721: current caller is not the owner of the token"
        );
        _tokenApprovals[_tokenId] = _to;

        emit Approval(_owner, _to, _tokenId);
    }

    function _isApprovedOrOwner(
        address _spender,
        uint256 _tokenId
    ) internal view returns (bool) {
        require(_exists(_tokenId), "Token does not exists");
        address _owner = ownerOf(_tokenId);
        return (_spender == _owner);
    }
}
