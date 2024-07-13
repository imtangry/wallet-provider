import SafeEventEmitter from './util/SafeEventEmitter'

const WebWalletProvider = {}

export type RequestArguments = {
    /** The RPC method to request. */
    method: string;
    /** The params of the RPC method, if any. */
    params?: unknown[] | Record<string, unknown>;
};

export {
    WebWalletProvider
}
