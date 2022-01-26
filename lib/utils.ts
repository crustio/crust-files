import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import type { ISubmittableResult } from '@polkadot/types/types';
import { BN, formatBalance } from '@polkadot/util';
import _ from 'lodash';
import numbro from 'numbro';

export const shortStr = (name: string, count = 6): string => {
  if (name.length > (count * 2)) {
    return `${name.substring(0, count)}...${name.substring(name.length - count)}`;
  }
  return name;
};

const createZero = (count: number) => {
  let z = ''
  for (let index = 0; index < count; index++) {
    z = `${z}0`
  }
  return z
}

export const strToBn = (str: string): BN => {
  const [l, r] = str.split('.')
  const right = r.length < 12 ? `${r}${createZero(12 - r.length)}` : r.substring(0, 12)
  return new BN(l).mul(new BN('1000000000000')).add(new BN(right))
}

export const trimZero = (str: string, decimals = 4): string => {
  let t = `${str.trim()}`
  const dotIndex = t.indexOf('.')
  if (dotIndex >= 0 && (t.length - dotIndex - 1) > decimals) {
    t = t.substring(0, dotIndex + decimals + 1)
  }
  while (t !== '0' && t.endsWith('0')) {
    t = t.substring(0, t.length - 1)
  }
  if (t.endsWith('.')) return t.substring(0, t.length - 1)
  return t
}

export const formatCRU = (cru: string | BN, decimals = 4): string => {
  if (!cru) return '-'
  const f = formatBalance(cru, { decimals: 12, forceUnit: "Unit", withSi: false })
  return trimZero(f, decimals)
}
// window._formatCRU = formatCRU


export const openDocs = (path: string) => {
  window.open(`${window.location.origin}${path}`, '_blank')
}
export const locationUrl = (path: string) => `${window.location.origin}${path}`

export const formatNumber = (num: number): string => {
  return numbro(num).format()
}

export function formatValue(value: any, def: any = '-') {
  if (value !== def && value !== null && value !== undefined) {
    const num = _.toNumber(value)
    const clampNum = num < 0 ? 0 : num
    return numbro(clampNum).format({ thousandSeparated: true })
  }
  return def
}

export function getFormatValue(obj: any, key: string, def: any = '-') {
  return formatValue(_.get(obj, key, def), def)
}



export const findEvent = (res: ISubmittableResult, key: string) => {
  return res.events.find((e) => `${e.event.section.toString()}(${e.event.method.toString()})` === key)
}

export const formatToCrustAccount = (address: string) => {
  return encodeAddress(decodeAddress(address), 66)
}

export const isSameCrustAddress = (address1: string, address2: string) => {
  return formatToCrustAccount(address1) === formatToCrustAccount(address2)
}

export const cutEnd = (str: string, end: number) => {
  if (str.length <= end) return str
  return str.substring(0, str.length - end)
}

// // abcdefghijklmnopqrstuvwxyzA-Z
// export const zipStr = (str: string) => {
//   return compress(str)
// }

// export const unZipStr = (str: string) => {
//   return decompress(str)
// }


export const toHex = (str: string) => {
  return Buffer.from(str, 'utf-8').toString('hex')
}

export const unHex = (hex: string) => {
  return Buffer.from(hex, 'hex').toString('utf-8')
}

export const getErrorMsg = (error: any, def = 'Network Error'): string => {
  if(!error) return def
  if(typeof error === 'string') return error
  if(typeof error.message === 'string' ) return error.message
  return def
}