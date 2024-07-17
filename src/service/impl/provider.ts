import {EIP1193, RequestArguments} from "../EIP1193";
import {rpcErrors} from "../../util/rpc-error";
import messages from "../../util/error-messages";
import SafeEventEmitter from "../../util/SafeEventEmitter";
import dequal from 'fast-deep-equal';
import {isValidChainId, getRpcPromiseCallback} from "../../util";
import {RpcResponseData, RpcCenter} from "../../util/rpc-center/RpcCenter";

export default class Provider extends SafeEventEmitter implements EIP1193 {
    protected initialized: boolean;

    // TODO 事件中心 是 content-js 和 inject-js交互的桥梁
    protected rpcCenter: RpcCenter;

    // 这里的状态变量应该都是对于客户端而言
    #chainId: string | null; //当前连接的链id
    #selectedAddress: string | null; //当前连接的链id
    protected accounts: string[] | null; // DApp 连接的账户
    protected isConnected: boolean; // 当前连接状态
    protected isUnlocked: boolean; // 钱包是否解锁

    #messageTarget: string; // 目标窗口的名称
    #messageName: string; // 消息名称

    constructor() {
        super();

        this.#chainId = null;
        this.#selectedAddress = null;
        this.#messageTarget = 'octopus-content-js';
        this.#messageName = 'octopus-request';
        this.accounts = null;
        this.initialized = false;
        this.isConnected = false;
        this.isUnlocked = false;
        this.handleRpcRequest = this.handleRpcRequest.bind(this);
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
        this.handleChainChanged = this.handleChainChanged.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);

        this.rpcCenter = new RpcCenter({target: this.#messageTarget, name: this.#messageName});

        // 初始化钱包状态
        this.init();
        // 发送网站metadata到钱包
    }

    // 获取钱包当前的状态 生命周期内智能初始化一次
    protected init(): void {
        if (this.initialized) {
            throw new Error('Provider already initialized.');
        }
        // TODO 获取插件钱包的状态
        this.initialized = true;

        this.emit('_initialized');
    }

    get chainId(): string | null {
        return this.#chainId;
    }

    get selectedAddress(): string | null {
        return this.#selectedAddress;
    }

    // Event START
    // TODO 参数校验 错误处理
    protected handleConnect(chainId: string): void {
        if (!this.isConnected) {
            this.isConnected = true;
            this.emit('connect', {chainId});
        }
    }

    protected handleDisconnect(): void {
        if (this.isConnected) {
            this.isConnected = false;
            this.#chainId = null;
            this.accounts = null;
            this.#selectedAddress = null;
            this.isUnlocked = false;
            this.emit('disconnect');
        }
    }

    protected handleUnlocked({accounts, unlocked}: { accounts: string[]; unlocked: boolean }): void {
        if (unlocked !== this.isUnlocked) {
            this.isUnlocked = unlocked;
            this.handleAccountsChanged(accounts ?? []);
        }
    }

    protected handleAccountsChanged(accounts: string[]): void {
        let _accounts = [...accounts];
        this.accounts = _accounts as string[];

        if (dequal(this.accounts, _accounts)) return

        if (this.#selectedAddress !== _accounts[0]) {
            this.#selectedAddress = (_accounts[0] as string) || null;
        }

        if (this.initialized) {
            const _nextAccounts = [..._accounts];
            this.emit('accountsChanged', _nextAccounts);
        }
    }

    protected handleChainChanged({chainId}:
                                     | { chainId?: string | undefined; networkVersion?: string | undefined }
                                     | undefined = {}) {
        if (!isValidChainId(chainId)) return;

        this.handleConnect(chainId);

        if (chainId !== this.#chainId) {
            this.#chainId = chainId;
            if (this.initialized) {
                this.emit('chainChanged', this.#chainId);
            }
        }
    }

    // Event END

    async request(args: RequestArguments): Promise<any> {
        // 检验参数格式
        if (!args || typeof args !== 'object' || Array.isArray(args)) {
            throw rpcErrors.invalidRequest('invalid request arguments');
        }

        const {method, params} = args;

        if (typeof method !== 'string' || method.length === 0) {
            throw rpcErrors.invalidRequest({
                message: messages.errors.invalidRequestMethod(),
                data: args,
            });
        }

        if (
            params !== undefined &&
            !Array.isArray(params) &&
            (typeof params !== 'object' || params === null)
        ) {
            throw rpcErrors.invalidRequest({
                message: messages.errors.invalidRequestParams(),
                data: args,
            });
        }

        const payload = (params === undefined || params === null) ? {method} : {method, params};

        return new Promise((resolve, reject) => {
            this.handleRpcRequest(payload, getRpcPromiseCallback(resolve, reject));
        });
    }

    protected handleRpcRequest(payload: any, callback: any): void {
        let callbackWrapper = callback;

        if (['eth_accounts', 'eth_requestAccounts'].includes(payload.method)) {
            // 需要包装一下回调函数，处理account变换的情况
            callbackWrapper = (
                error: Error,
                response: RpcResponseData,
            ) => {
                this.handleAccountsChanged(
                    <Array<string>>response ?? [],
                );
                callback(error, response);
            };
        }
        // 其他方法直接调用rpcCenter的send方法
        this.rpcCenter.send(payload, callbackWrapper);
    }
}
