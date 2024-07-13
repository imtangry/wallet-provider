export interface RequestArguments {
    readonly method: string;
    readonly params?: readonly any[] | object;
}

export interface ProviderMessage {
    readonly type: string;
    readonly data: any;
}

export interface EthSubscription extends ProviderMessage {
    readonly type: 'eth_subscription';
    readonly data: {
        readonly subscription: string;
        readonly result: any;
    };
}

export interface EIP1613 {
    // integer ID of the connected chain as a hexadecimal string
    chainId: string | null;

    request(args: RequestArguments): Promise<any>;

    handleConnect(): void;

    handleDisconnect(): void;

    handleChainChanged(): void;

    handleAccountsChanged(): void;
}
