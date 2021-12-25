import { useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from '@crustio/type-definitions'
const wss = [
  'wss://rpc-subscan.crust.network',
  'wss://rpc.crustnetwork.io',
  'wss://rpc-crust-mainnet.decoo.io'
]
export function initApi(): ApiPromise | null {
  const [api, setApi] = useState<ApiPromise | null>(null)
  useEffect(() => {
    const provider = new WsProvider(wss, 5000)
    provider.on('error', console.error)
    new ApiPromise({
      provider,
      typesBundle: typesBundleForPolkadot,
    }).isReady.then(setApi).catch(console.error)
  }, [])
  return api
}
