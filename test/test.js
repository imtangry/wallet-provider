const createInpageProvider = require('../dist/index.cjs').createInpageProvider
let providers = []
createInpageProvider(
    {
        providerInfo:
            {
                uuid: '350670db-19fa-4704-a166-e52e178b59d2',
                name: 'Example Wallet',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
                rdns: 'com.example.wallet',
            }
    }
)

function onAnnouncement(event) {
    if (providers.map(p => p.info.uuid).includes(event.detail.info.uuid)) return
    providers = [...providers, event.detail]
}

window.addEventListener("eip6963:announceProvider", onAnnouncement);
window.dispatchEvent(new Event("eip6963:requestProvider"));

requestBTN.onclick = () => {
    console.log('click',providers)
    providers[0].provider.request({method: 'eth_requestAccounts'})
}



