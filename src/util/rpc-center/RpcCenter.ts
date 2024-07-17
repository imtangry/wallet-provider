import { v4 as uuid } from 'uuid';

interface rpcOptions {
    name: string;
    target: string;
    targetOrigin?: string;
    targetWindow?: Window;
}

export interface rpcRequest {
    params?: any
    method: string
}

export type RpcResponseData = number | string | Record<string, unknown> | unknown[];

export interface PostMessageEvent {
    data?: RpcResponseData
    origin: string
    source: typeof window
    target: string
    id: string
}

export class RpcCenter {
    #maxRequestCount: number
    #requestMap: Map<string, (error: Error, response: any) => void>
    #target: string
    #name: string
    #targetOrigin: string
    #targetWindow: Window

    constructor({name, target, targetOrigin = location.origin, targetWindow = window}: rpcOptions) {
        if (
            typeof window === 'undefined' ||
            typeof window.postMessage !== 'function'
        ) {
            throw new Error('window.postMessage is not a function. This class should only be instantiated in a Window.');
        }

        this.#maxRequestCount = 100;
        this.#requestMap = new Map();

        this.#name = name;
        this.#target = target;
        this.#targetOrigin = <string>targetOrigin;
        this.#targetWindow = <Window>targetWindow;

        // this.receive = this.receive.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.postMessage = this.postMessage.bind(this);

        window.addEventListener('message', this.onMessage as any, false);
    }

    // receive(callback: (data: any) => void) {
    // }

    send(data: rpcRequest, callback: (error: Error, response: any) => void): void {
        this.postMessage(data, callback);
    }

    // TODO 需要处理 后端主动推送的消息 比如切换链 断开连接等
    private onMessage(event: PostMessageEvent): void {
        if(event.origin!== this.#targetOrigin || event.target!== this.#name) return
        const msgId = event.id;
        const callback = this.#requestMap.get(msgId);
        if (callback) {
            callback((null as unknown) as Error, event.data);
            this.#requestMap.delete(msgId);
        } else {
            // TODO content scripts 推送消息
        }
    }

    // 如果服务端超时 或者其他问题导致对方没有收到消息怎么处理 ？
    private postMessage(data: rpcRequest, callback: (error: Error, response: any) => void): void {
        if (this.#requestMap.size >= this.#maxRequestCount) {
            return callback(new Error('Too many requests in progress. Please try again later.'), null);
        }
        const msgId = uuid()
        this.#targetWindow.postMessage(
            {
                id: msgId,
                target: this.#target,
                data,
            },
            this.#targetOrigin,
        );
        this.#requestMap.set(msgId, callback);
    }
}
