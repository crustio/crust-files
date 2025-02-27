import type { TFunction } from "i18next";
import { IS_DEV } from "./env";
import { DomainRef } from "./hooks/useConfigDomain";

export interface AuthIpfsEndpoint {
  text?: string;
  value: string;
  location?: string;
  group?: string;
}

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location
export function createAuthIpfsEndpoints(t: TFunction): AuthIpfsEndpoint[] {
  return [
    {
      location: t("️Shanghai"),
      text: t("️⚡ Thunder Gateway"),
      value: "https://gw.crustfiles.net",
    },
    {
      location: t("Singapore"),
      text: t("DCF"),
      value: "https://crustipfs.xyz",
    },
    {
      location: t("United States"),
      text: t("Crust Network"),
      value: "https://ipfs-gw.decloud.foundation",
    },
    {
      location: t("Henan"),
      text: t("️Crust IPFS GW"),
      value: "https://gw.w3ipfs.cn:10443",
    },
    {
      location: t("Los Angeles"),
      text: t("️Crust IPFS GW"),
      value: "https://gw.smallwolf.me",
    },
    {
      location: t("Henan"),
      text: t("️Crust IPFS GW"),
      value: "https://gw.w3ipfs.com:7443",
    },
    {
      location: t("Henan Unicom"),
      text: t("️Crust IPFS GW"),
      value: "https://gw.w3ipfs.net:7443",
    },
    {
      location: t("Helsinki"),
      text: t("️crust-fans"),
      value: "https://crust.fans",
    },
    {
      location: t("Phoenix"),
      text: t("️crustgateway"),
      value: "https://crustgateway.com",
    },
    {
      location: t("Germany"),
      text: t("️crustgateway-de"),
      value: "https://crustgateway.online",
    },
    {
      location: t("Los Angeles"),
      text: t("️Crust IPFS GW"),
      value: "https://gw.w3ipfs.org.cn",
    },
    {
      location: t("Shanghai"),
      text: t("Area51-GW"),
      value: "https://223.111.148.195",
    },
    {
      location: t("Shanghai"),
      text: t("Crato-GW"),
      value: "https://223.111.148.196",
    },
  ];
}

export interface AuthIpfsPinner {
  text?: string;
  value: string;
}

// Definitions here are with the following values -
//   text: the IPFS pinner name
//   value: the IPFS pinner domain
export function createAuthIpfsPinner(t: TFunction): AuthIpfsPinner[] {
  return [
    // for Beta
    // {
    //   text: t('Beta'),
    //   value: 'https://pinning-service.decoo-cloud.cn'
    // },
    // for prod
    {
      text: t<string>("Crust Pinner"),
      value: "https://pin.crustcode.com",
    },
  ];
}

export const MOBILE_WIDTH = 960;

export const CrustWalletDownUrl =
  "https://chromewebstore.google.com/detail/crust-wallet-v3/bhnjponmcdginfhpmfnplhoajoolcfhh";
export const CrustGetCRU = "https://swap.crust.network";

// export const IS_DEV = process.env.NODE_ENV === 'development'
// beta prod
export const ShareEarnENV = IS_DEV ? "beta" : "prod";
export const ShareEarnBaseUrl = () =>
  IS_DEV ? "https://files-api.decoo.io" : `https://api.${DomainRef.value}`;
export const RecaptchKey = IS_DEV
  ? "f8bd392f-2ff5-4dc7-bedd-1be9f175885b"
  : "09ef6613-21f0-4fb6-ab1f-ded9bedb291e";
export const GA_ID = IS_DEV ? "G-HH6CWDPZJ2" : "G-LP5BSW8V06";
export const GTM_ID = "GTM-NPZMBPN";
