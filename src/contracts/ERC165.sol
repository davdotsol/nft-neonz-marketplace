// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IERC165.sol";

contract ERC165 is IERC165 {
    mapping(bytes4 => bool) private _supportedInterfaces;

    constructor() {
        registerInterface(_calcFingerPrint());
    }

    function _calcFingerPrint() private view returns (bytes4) {
        return bytes4(keccak256("supportsInterface(bytes4)"));
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external view override returns (bool) {
        return _supportedInterfaces[interfaceId];
    }

    function registerInterface(bytes4 interfaceId) public {
        require(interfaceId != 0xffffffff, "ERC165: invalid interface");
        _supportedInterfaces[interfaceId] = true;
    }
}
