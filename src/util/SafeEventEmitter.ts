import { EventEmitter } from 'events';

type Handler = (...args: any[]) => void;
interface EventMap {
    [k: string]: Handler | Handler[] | undefined;
}

function safeApply<T, A extends any[]>(handler: (this: T, ..._args: A) => void, context: T, args: A): void {
    try {
        Reflect.apply(handler, context, args);
    } catch (err) {
        // Throw error after timeout so as not to interrupt the stack
        setTimeout(() => {
            throw err;
        });
    }
}

function arrayClone<T>(arr: T[]): T[] {
    const n = arr.length;
    const copy = new Array(n);
    for (let i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}

// 没注册事件 不是error事件 return false；是error事件 throw error
// 注册了事件 是error事件 且没error监听 throw error；有error监听 走完整流程
// 注册了事件 不是error事件 走完整流程
export default class SafeEventEmitter extends EventEmitter {
    emit(type: string, ...args: any[]): boolean {
        let needHandleErrorByself = type === 'error';

        const events: EventMap = (this as any)._events;
        if (events !== undefined) {
            needHandleErrorByself = needHandleErrorByself && events.error === undefined;
        } else if (!needHandleErrorByself) {
            return false;
        }

        // If there is no 'error' event listener then throw.
        if (needHandleErrorByself) {
            let er;
            if (args.length > 0) {
                [er] = args;
            }
            if (er instanceof Error) {
                throw er;
            }
            // At least give some kind of context to the user
            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);
            (err as any).context = er;
            throw err; // Unhandled 'error' event
        }

        const handler = events[type];

        // 不是错误事件 并且没有handler 直接return false
        if (handler === undefined) {
            return false;
        }

        // 调用safeApply来handler里面的错误，让错误不会终止主进程。
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        } else {
            const len = handler.length;
            const listeners =   (handler);
            for (let i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }

        return true;
    }
}
