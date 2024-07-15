interface rpcErrorAgs {
    message: string
    data?: any
    code?: number
}

class ProviderRpcError extends Error {
    public code: number;
    public data?: any;

    constructor(code: number, message: string, data?: any) {
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


import {errorCodes, errorValues} from "./error-constant";

// 错误包含 EIP-1193 标准的错误码 和其他可能的错误
export const providerRpcErrors = {
    /**
     * Get an Ethereum Provider User Rejected Request (4001) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} class.
     */
    userRejectedRequest: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.userRejectedRequest, arg)
    },

    /**
     * Get an Ethereum Provider Unauthorized (4100) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} class.
     */
    unauthorized: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.unauthorized, arg);
    },

    /**
     * Get an Ethereum Provider Unsupported Method (4200) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} class.
     */
    unsupportedMethod: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.unsupportedMethod, arg);
    },

    /**
     * Get an Ethereum Provider Not Connected (4900) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} class.
     */
    disconnected: (arg?: errorsArg) => {
        return getProviderError(errorCodes.provider.disconnected, arg);
    },

    /**
     * Get an Ethereum Provider Chain Not Connected (4901) error.
     *
     * @param arg - The error message or options bag.
     * @returns An instance of the {@link ProviderRpcError} class.
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
    let {message, data} = parseOpts(arg);
    if (!message && isValidRpcErrorCode(code)) {
        message = <string>errorValues[code.toString()]?.message;
    }
    if(message === undefined){
        throw new Error('Invalid error code')
    }
    return new ProviderRpcError(code, message, data);
}

function parseOpts(arg?: errorsArg): { message?: string, data?: string, code?: number } {
    if (arg) {
        if (typeof arg === 'string') {
            return {message: arg};
        } else if (typeof arg === 'object' && !Array.isArray(arg)) {
            let {message, data, code} = arg;

            if (!message) {
                if (code!== undefined && isValidRpcErrorCode(code)) {
                    message = <string>errorValues[code.toString()]?.message;
                } else if (code !== undefined) {
                    throw new Error('Invalid error code');
                }
            }
            return {message, data};
        }
    }
    return {}
}


export const isValidRpcErrorCode = (code: number) => {
    return Number.isInteger(code) && errorValues[code.toString()]
}



