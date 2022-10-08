import type { TFunction } from 'i18next';
import { IS_DEV } from './env';

export interface AuthIpfsEndpoint {
  text?: string;
  value: string;
  location?: string;
  group?: string
}


// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location
export function createAuthIpfsEndpoints(t: TFunction): AuthIpfsEndpoint[] {
  return [
    // for Beta
    // {
    //   location: t('BETA'),
    //   text: t('Beta'),
    //   value: 'https://beta.ipfs-auth.decoo.io'
    // },
    // for prod
    {
      location: t('️Shanghai'),
      text: t('️⚡ Thunder Gateway'),
      value: 'https://gw.crustapps.net',
      // group: "Thunder Gateway"
    },
    {
      location: t('Seattle'),
      text: t('⚡ Thunder Gateway'),
      value: 'https://crustwebsites.net',
      // group: "Public Gateway"
    },
    // {
    //   location: t('Beijing'),
    //   text: t('⚡ Deklod'),
    //   value: 'https://ipfs-gw.dkskcloud.com',
    //   // group: "Public Gateway"
    // },
    {
      location: t('Singapore'),
      text: t('DCF'),
      value: 'https://crustipfs.xyz',
      // group: "Public Gateway"
    },
    {
      location: t('United States'),
      text: t('Crust Network'),
      value: 'https://ipfs-gw.decloud.foundation',
      // group: "Public Gateway"
    }
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
      text: t<string>('Crust Pinner'),
      value: 'https://pin.crustcode.com'
    }
  ];
}

export const MOBILE_WIDTH = 960;

export const CrustWalletDownUrl = 'https://chrome.google.com/webstore/detail/crust-wallet/jccapkebeeiajkkdemacblkjhhhboiek';
export const CrustGetCRU = 'https://swap.crustapps.net';

// export const IS_DEV = process.env.NODE_ENV === 'development'
// beta prod
export const ShareEarnENV = IS_DEV ? 'beta' : 'prod'
export const ShareEarnBaseUrl = IS_DEV ? 'https://files-api.decoo.io' : 'https://api.crustfiles.com'
export const RecaptchKey = IS_DEV ? 'f8bd392f-2ff5-4dc7-bedd-1be9f175885b' : '09ef6613-21f0-4fb6-ab1f-ded9bedb291e'
export const GA_ID = IS_DEV ? 'G-HH6CWDPZJ2' : 'G-LP5BSW8V06'
export const GTM_ID = 'GTM-NPZMBPN'