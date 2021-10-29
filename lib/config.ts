import type {TFunction} from 'i18next';

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
      location: t('Singapore'),
      text: t('DCF'),
      value: 'https://crustipfs.xyz',
      group: "Public Gateway"
    },
    {
      location: t('United States'),
      text: t('Crust Network'),
      value: 'https://crustwebsites.net',
      group: "Public Gateway"
    },
    {
      location: t('United States'),
      text: t('Crust Network'),
      value: 'https://ipfs-gw.decloud.foundation',
      group: "Public Gateway"
    },
    {
      location: t('️2.5x speed up'),
      text: t('️⚡ Thunder Gateway'),
      value: 'https://gw.crustapps.net',
      group: "Thunder Gateway"
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
