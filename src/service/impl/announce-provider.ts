import {EIP6963, EIP6963EventNames, EIP6963RequestProviderEvent} from "../EIP6963";

export const announceProvider = (providerDetail: EIP6963): void => {
    if (!isValidProviderDetail(providerDetail)) {
        throwErrorEIP6963('Invalid EIP-6963 ProviderDetail object.');
    }
    const {info, provider} = providerDetail;

    const handleAnnounceProvider = () =>
        window.dispatchEvent(
            new CustomEvent(EIP6963EventNames.Announce, {
                detail: Object.freeze({info: {...info}, provider}),
            }),
        );

    handleAnnounceProvider();
    window.addEventListener(
        EIP6963EventNames.Request,
        (event: EIP6963RequestProviderEvent) => {
            if (!isValidRequestProviderEvent(event)) {
                throwErrorEIP6963(
                    `Invalid EIP-6963 RequestProviderEvent object received from ${EIP6963EventNames.Request} event.`,
                );
            }
            handleAnnounceProvider();
        },
    );
}


// https://github.com/thenativeweb/uuidv4/blob/bdcf3a3138bef4fb7c51f389a170666f9012c478/lib/uuidv4.ts#L5
const UUID_V4_REGEX =
    /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u;

// https://stackoverflow.com/a/20204811
const FQDN_REGEX =
    /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/u;

// 判断event 是否是一个事件 并且类型符合 EIP6963EventNames.Request
function isValidRequestProviderEvent(event: unknown): event is EIP6963RequestProviderEvent {
    return event instanceof Event && event.type === EIP6963EventNames.Request;
}

function throwErrorEIP6963(message: string) {
    throw new Error(
        `${message} See https://eips.ethereum.org/EIPS/eip-6963 for requirements.`,
    );
}

function isValidProviderDetail(
    providerDetail: EIP6963,
): providerDetail is EIP6963 {
    if (
        !isObject(providerDetail) ||
        !isObject(providerDetail.info) ||
        !isObject(providerDetail.provider)
    ) {
        return false;
    }
    const {info} = providerDetail;

    return (
        typeof info.uuid === 'string' &&
        UUID_V4_REGEX.test(info.uuid) &&
        typeof info.name === 'string' &&
        Boolean(info.name) &&
        typeof info.icon === 'string' &&
        info.icon.startsWith('data:image') &&
        typeof info.rdns === 'string' &&
        FQDN_REGEX.test(info.rdns)
    );
}

function isObject(value: unknown) {
    return typeof value === 'object' && value !== null;
}
