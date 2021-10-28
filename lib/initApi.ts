import {useEffect, useState} from "react";
import {ApiPromise, WsProvider} from "@polkadot/api";
import {typesBundleForPolkadot} from '@crustio/type-definitions'

export function initApi(): ApiPromise | null {
  const [api, setApi] = useState<ApiPromise | null>(null)
  useEffect(() => {
    let task = null
    const init = () => {
      const provider = new WsProvider('wss://rpc-subscan.crust.network')
      return ApiPromise.create({
        provider,
        typesBundle: typesBundleForPolkadot,
      })
        .then(setApi)
        .catch(() => {
          task = setTimeout(init, 5000)
        })
    };
    init().then()
    return () => {
      if (task) {
        clearTimeout(task)
      }
    }
  }, [])
  return api
}
