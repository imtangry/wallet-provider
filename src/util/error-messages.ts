const messages = {
    errors: {
        disconnected: () => 'Octopus Wallet: Disconnected from chain. Attempting to connect.',
        permanentlyDisconnected: () => 'Octopus Wallet: Disconnected from MetaMask background. Page reload required.',
        sendSiteMetadata: () => `Octopus Wallet: Failed to send site metadata. This is an internal error, please report this bug.`,
        unsupportedSync: (method: string) => `Octopus Wallet: The MetaMask Ethereum provider does not support synchronous methods like ${method} without a callback parameter.`,
        invalidDuplexStream: () => 'Must provide a Node.js-style duplex stream.',
        invalidNetworkParams: () => 'Octopus Wallet: Received invalid network parameters. Please report this bug.',
        invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
        invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
        invalidRequestParams: () => `'args.params' must be an object or array if provided.`,
        invalidLoggerObject: () => `'args.logger' must be an object if provided.`,
        invalidLoggerMethod: (method: string) => `'args.logger' must include required method '${method}'.`,
    },
    info: {
        connected: (chainId: string) => `Octopus Wallet: Connected to chain with ID "${chainId}".`,
    },
    warnings: {
        // deprecated properties
        chainIdDeprecation: `Octopus Wallet: 'ethereum.chainId' is deprecated and may be removed in the future. Please use the 'eth_chainId' RPC method instead.\nFor more information, see: https://github.com/MetaMask/metamask-improvement-proposals/discussions/23`,
        networkVersionDeprecation: `Octopus Wallet: 'ethereum.networkVersion' is deprecated and may be removed in the future. Please use the 'net_version' RPC method instead.\nFor more information, see: https://github.com/MetaMask/metamask-improvement-proposals/discussions/23`,
        selectedAddressDeprecation: `Octopus Wallet: 'ethereum.selectedAddress' is deprecated and may be removed in the future. Please use the 'eth_accounts' RPC method instead.\nFor more information, see: https://github.com/MetaMask/metamask-improvement-proposals/discussions/23`,
        // deprecated methods
        enableDeprecation: `Octopus Wallet: 'ethereum.enable()' is deprecated and may be removed in the future. Please use the 'eth_requestAccounts' RPC method instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1102`,
        sendDeprecation: `Octopus Wallet: 'ethereum.send(...)' is deprecated and may be removed in the future. Please use 'ethereum.sendAsync(...)' or 'ethereum.request(...)' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193`,
        // deprecated events
        events: {
            close: `Octopus Wallet: The event 'close' is deprecated and may be removed in the future. Please use 'disconnect' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#disconnect`,
            data: `Octopus Wallet: The event 'data' is deprecated and will be removed in the future. Use 'message' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#message`,
            networkChanged: `Octopus Wallet: The event 'networkChanged' is deprecated and may be removed in the future. Use 'chainChanged' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#chainchanged`,
            notification: `Octopus Wallet: The event 'notification' is deprecated and may be removed in the future. Use 'message' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#message`,
        },
        rpc: {
            ethDecryptDeprecation: `Octopus Wallet: The RPC method 'eth_decrypt' is deprecated and may be removed in the future.\nFor more information, see: https://medium.com/metamask/metamask-api-method-deprecation-2b0564a84686`,
            ethGetEncryptionPublicKeyDeprecation: `Octopus Wallet: The RPC method 'eth_getEncryptionPublicKey' is deprecated and may be removed in the future.\nFor more information, see: https://medium.com/metamask/metamask-api-method-deprecation-2b0564a84686`,
            walletWatchAssetNFTExperimental: `Octopus Wallet: The RPC method 'wallet_watchAsset' is experimental for ERC721/ERC1155 assets and may change in the future.\nFor more information, see: https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-1.md and https://github.com/MetaMask/metamask-improvement-proposals/blob/main/PROCESS-GUIDE.md#proposal-lifecycle`,
        },
        // misc
        experimentalMethods: `Octopus Wallet: 'ethereum._metamask' exposes non-standard, experimental methods. They may be removed or changed without warning.`,
    },
};
export default messages;
