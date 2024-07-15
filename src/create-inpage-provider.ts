import {EIP6963ProviderInfo} from "./service/EIP6963";
import Provider from "./service/impl/provider";
import {announceProvider} from "./service/impl/announce-provider";

export function createInpageProvider({providerInfo}: { providerInfo: EIP6963ProviderInfo }): void {
    const provider = new Provider()
    const proxyProvider = new Proxy(provider, {
        // some common libraries, e.g. web3@1.x, mess with our API
        deleteProperty: () => true,
        // fix issue with Proxy unable to access private variables from getters
        // https://stackoverflow.com/a/73051482
        get(target, propName: 'chainId' | 'selectedAddress') {
            return target[propName];
        },
    });

    announceProvider({
        info: providerInfo,
        provider: proxyProvider
    });

    (window as Record<string, any>).ethereum = proxyProvider;
}
