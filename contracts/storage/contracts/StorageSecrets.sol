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
        string indexed name,
        uint256 index
    );

    event SecretRevealed(
        address indexed creator,
        string indexed name,
        uint256 index
    );

    mapping(string => SecretNameIndex) public _nameMetas;
    SecretMetadata[] public _metas;
    bytes[] private _secrets;

    function createSecret( string calldata name, bytes calldata secret ) external {
        _metas.push(SecretMetadata({creator: msg.sender, name: name}));
        _nameMetas[name].index = _metas.length - 1;
        _nameMetas[name].isExist = true;
        _secrets.push(secret);
        emit SecretCreated(msg.sender, name, _metas.length - 1);
    }

    /// @notice Reveals the latest secret at the specified index.
    function revealNameSecret( string memory name ) external returns (bytes memory) {
        require(_nameMetas[name].isExist, "no such secret");
        address creator = _metas[_nameMetas[name].index].creator;
        emit SecretRevealed(creator, name, _nameMetas[name].index);
        return _secrets[_nameMetas[name].index];
    }

    /// @notice Reveals the secret at the specified index.
    function revealSecret(uint256 index) external returns (bytes memory) {
        require(index < _metas.length, "no such secret");
        address creator = _metas[index].creator;
        emit SecretRevealed(creator, _metas[index].name, index);
        return _secrets[index];
    }

    function getMetas( uint256 offset, uint256 count ) external view returns (SecretMetadata[] memory) {
        if (offset >= _metas.length) return new SecretMetadata[](0);
        uint256 c = offset + count <= _metas.length
            ? count
            : _metas.length - offset;
        SecretMetadata[] memory metas = new SecretMetadata[](c);
        for (uint256 i = 0; i < c; ++i) {
            metas[i] = _metas[offset + i];
        }
        return metas;
    }
}
