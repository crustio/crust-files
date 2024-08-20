import { useCallback, useEffect, useMemo, useState } from "react";
import store from "store";
import { useGet } from "./useGet";

export interface DownloadGateway {
  gateway: string;
}

export type DownloadGatewayItem = { text: string; value: string };

export const AllDownloadGateways: DownloadGatewayItem[] = [
  { text: "https://ipfs.io", value: "https://ipfs.io" },
  { text: "https://crustgateway.online", value: "https://crustgateway.online" },
  { text: "https://gw.w3ipfs.org.cn", value: "https://gw.w3ipfs.org.cn" },
];

export interface WrapDownloadGateway extends DownloadGateway {
  set: (endpoint: string) => void;
  allDownloadGateways: DownloadGatewayItem[];
}

export function useDownloadGateway(): WrapDownloadGateway {
  const [downloadGateway, setDownloadGateway] = useState<DownloadGateway>({ gateway: "https://ipfs.io" });
  const [allDownloadGateways, setAllDownloadGateways] = useState(AllDownloadGateways);
  useEffect(() => {
    const dg = store.get("downloadgateway") as DownloadGateway;
    if (dg) {
      setDownloadGateway(dg);
    }
    store.get("allDownloadGateways") as DownloadGatewayItem[];
    if (allDownloadGateways) {
      setAllDownloadGateways(allDownloadGateways);
    }
  }, []);
  const set = useCallback((endpoint: string) => {
    const dg: DownloadGateway = {
      gateway: endpoint,
    };
    setDownloadGateway(dg);
    store.set("downloadgateway", dg);
  }, []);

  const [remoteGateways] = useGet(
    () =>
      fetch("https://gist.githubusercontent.com/XueMoMo/2cfc982ce6aefb85e09313b714a029bd/raw/CrustFilesDownloadGateway.json")
        .then((res) => res.json())
        .then((res) => (res as string[]).map<DownloadGatewayItem>((item) => ({ text: item, value: item }))),
    []
  );
  useEffect(() => {
    if (remoteGateways && remoteGateways.length) {
      store.set("allDownloadGateways", remoteGateways);
      setAllDownloadGateways(remoteGateways);
    }
  }, [remoteGateways]);
  return useMemo(
    () => ({
      ...downloadGateway,
      set,
      allDownloadGateways,
    }),
    [downloadGateway, set, allDownloadGateways]
  );
}
