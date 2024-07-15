import Provider from "./impl/provider";

// 事件名称的枚举
export enum EIP6963EventNames {
    Announce = 'eip6963:announceProvider',
    Request = 'eip6963:requestProvider', // eslint-disable-line @typescript-eslint/no-shadow
}

declare global{
    interface WindowEventMap {
        [EIP6963EventNames.Request]: EIP6963RequestProviderEvent;
        [EIP6963EventNames.Announce]: EIP6963AnnounceProviderEvent;
    }
}

export type EIP6963RequestProviderEvent = Event & {
    type: EIP6963EventNames.Request;
};

export type EIP6963AnnounceProviderEvent = CustomEvent & {
    type: EIP6963EventNames.Announce;
    detail: EIP6963;
};

export type EIP6963ProviderInfo = {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
};

export interface EIP6963 {
    info: EIP6963ProviderInfo
    provider: Provider
}
