import { useCallback, useEffect, useMemo, useState } from "react";
import store from 'store';

export interface DownloadGateway {
    gateway: string
}

export const AllDownloadGateways: { text: string, value: string }[] = [
    { text: 'https://ipfs.io', value: 'https://ipfs.io' },
    { text: 'https://crustipfs.mobi', value: 'https://crustipfs.mobi' },
    { text: 'https://crustipfs.world', value: 'https://crustipfs.world' },
    { text: 'https://crustipfs.info', value: 'https://crustipfs.info' },
    { text: 'https://crustipfs.art', value: 'https://crustipfs.art' }
]

export interface WrapDownloadGateway extends DownloadGateway {
    set: (endpoint: string) => void
}

export function useDownloadGateway(): WrapDownloadGateway {
    const [downloadGateway, setDownloadGateway] = useState<DownloadGateway>({ gateway: "https://ipfs.io" })
    useEffect(() => {
        const dg = store.get('downloadgateway') as DownloadGateway
        if (dg) {
            setDownloadGateway(dg)
        }
    }, [])
    const set = useCallback((endpoint: string) => {
        const dg: DownloadGateway = {
            gateway: endpoint
        }
        setDownloadGateway(dg)
        store.set('downloadgateway', dg)
    }, [])

    return useMemo(() => ({
        ...downloadGateway,
        set,
    }), [downloadGateway, set])
}
