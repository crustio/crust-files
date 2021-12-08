import { useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from '@crustio/type-definitions'

export function initApi(): ApiPromise | null {
  const [api, setApi] = useState<ApiPromise | null>(null)
  useEffect(() => {
    const provider = new WsProvider(['wss://rpc-subscan.crust.network', 'wss://rpc-crust-mainnet.decoo.io'], 5000)
    new ApiPromise({
      provider,
      typesBundle: typesBundleForPolkadot,
    }).isReady.then(setApi)
  }, [])
  return api
}
