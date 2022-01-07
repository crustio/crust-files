import { BN, formatBalance } from '@polkadot/util'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import type { ISubmittableResult } from '@polkadot/types/types'
import numbro from 'numbro';
import _ from 'lodash'

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
export const docsUrl = (path: string) => `${window.location.origin}${path}`

export const formatNumber = (num: number): string => {
  return numbro(num).format()
}


export function getFormatValue(obj: any, key: string, def: any = '-') {
  const v = _.get(obj, key, def)
  if (v !== def && v !== null && v !== undefined) {
    const num = _.toNumber(v)
    const clampNum = num < 0 ? 0 : num
    return numbro(clampNum).format({ thousandSeparated: true })
  }
  return def
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