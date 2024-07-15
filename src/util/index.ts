export const isValidChainId = (chainId: unknown): chainId is string =>
    Boolean(chainId) && typeof chainId === 'string' && chainId.startsWith('0x');

// resolve response.result or response, reject errors
export const getRpcPromiseCallback =
    (
        resolve: (value?: any) => void,
        reject: (error?: Error) => void,
        unwrapResult = true,
    ) =>
        (error: Error, response: any): void => {
            if (error || response.error) {
                reject(error || response.error);
            } else {
                !unwrapResult || Array.isArray(response)
                    ? resolve(response)
                    : resolve(response.result);
            }
        };
