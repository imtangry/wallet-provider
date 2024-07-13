interface rpcErrorAgs {
    message: string,
    data?: any
}

class ProviderRpcError extends Error {
    public code: number;
    public data?: any;

    constructor(code: number, message: string | undefined, data?: any) {
        if (!Number.isInteger(code)) {
            throw new Error('"code" must be an integer.');
        }

        if (!message) {
            throw new Error('"message" must be a non-empty string.');
        }
        super(message);
        if (data !== undefined) {
            this.data = data;
        }

        this.code = code;
    }
}

type errorsArg =
    | rpcErrorAgs
    | string;


import {errorCodes} from "./error-constant";

// 错误包含 EIP-1193 标准的错误码 和其他可能的错误
export const providerRpcErrors = {
    /**
     * Get an Ethereum Provider User Rejected Request (4001) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} interface.
     */
    userRejectedRequest: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.userRejectedRequest, arg)
    },

    /**
     * Get an Ethereum Provider Unauthorized (4100) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} interface.
     */
    unauthorized: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.unauthorized, arg);
    },

    /**
     * Get an Ethereum Provider Unsupported Method (4200) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} interface.
     */
    unsupportedMethod: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.unsupportedMethod, arg);
    },

    /**
     * Get an Ethereum Provider Not Connected (4900) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} interface.
     */
    disconnected: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.disconnected, arg);
    },

    /**
     * Get an Ethereum Provider Chain Not Connected (4901) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} interface.
     */
    chainDisconnected: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.chainDisconnected, arg);
    }
}

export const rpcErrors = {
    invalidRequest: (arg?: errorsArg) => {
        return getProviderError(errorCodes.rpc.invalidRequest, arg);
    },
};

function getProviderError(
    code: number,
    arg?: errorsArg,
): ProviderRpcError {
    const [message, data] = parseOpts(arg);
    return new ProviderRpcError(code, message, data);
}

function parseOpts(arg?: errorsArg): [message?: string, data?: any] {
    if (arg) {
        if (typeof arg === 'string') {
            return [arg];
        } else if (typeof arg === 'object' && !Array.isArray(arg)) {
            const {message, data} = arg;

            if (!message) {
                throw new Error('Must specify string message.');
            }
            return [message, data];
        }
    }
    return [];
}

