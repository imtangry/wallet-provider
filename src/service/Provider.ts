import {EIP1193, RequestArguments} from "./EIP1193";
import {rpcErrors} from "../util/rpc-error";

export default class Provider implements EIP1193 {
    chainId: string | null; //当前连接的链id
    accounts: string | string[]; // 当前账户地址
    isConnected: boolean; // 当前连接状态
    idUnLocked: boolean; // 账户是否解锁

    handleAccountsChanged(): void {
    }

    handleChainChanged(): void {
    }

    handleConnect(): void {
    }

    handleDisconnect(): void {
    }

    async request(args: RequestArguments): Promise<any> {
        // 检验参数格式
        if(!args || typeof args!== 'object' || Array.isArray(args)) {
            throw rpcErrors.invalidRequest('invalid request arguments');
        }

        return Promise.resolve(undefined);
    } // 账户是否解锁

}
