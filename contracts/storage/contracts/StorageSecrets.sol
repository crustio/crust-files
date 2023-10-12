// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract StorageSecrets {
    struct SecretNameIndex {
        uint256 index;
        bool isExist;
    }

    struct SecretMetadata {
        address creator;
        string name;
    }

    event SecretCreated(
        address indexed creator,
        uint256 index
    );

    mapping(string => SecretNameIndex) private _nameMetas;
    SecretMetadata[] private _metas;
    bytes[] private _secrets;

    function createSecret( string calldata name, bytes calldata secret ) external {
        _metas.push(SecretMetadata({creator: msg.sender, name: name}));
        _nameMetas[name].index = _metas.length - 1;
        _nameMetas[name].isExist = true;
        _secrets.push(secret);
        emit SecretCreated(msg.sender, _metas.length - 1);
    }

    /// @notice Reveals the latest secret at the specified index.
    function revealSecret( string memory name ) external view returns (bytes memory) {
        require(_nameMetas[name].isExist, "no such secret");
        return _secrets[_nameMetas[name].index];
    }
}
