import { BN, formatBalance } from '@polkadot/util'

export const shortStr = (name: string, count = 6): string => {
  if (name.length > (count * 2)) {
    return `${name.substr(0, count)}...${name.substr(name.length - count)}`;
  }
  return name;
};


export const strToHex = (str: string): string => {
  if (str) {
    const charCode: string[] = []
    for (let i = 0; i < str.length; i++) {
      charCode.push(str.charCodeAt(i).toString(16))
    }
    return `%${charCode.join("%")}`
  }
  return str
}

// export const hexToStr = (hex?: string): string => {
//   if (hex) {
//     const hexs = hex.split('%')
//     var charCode: number[] = []
//     for (const h of hexs) {
//       charCode.push(parseInt(h, 16))
//     }
//     return String.fromCharCode(...charCode)
//   }
//   return hex
// }

const createZero = (count: number) => {
  let z = ''
  for (let index = 0; index < count; index++) {
    z = `${z}0`
  }
  return z
}

export const strToBn = (str: string): BN => {
  const [l, r] = str.split('.')
  const right = r.length < 12 ? `${r}${createZero(12 - r.length)}` : r.substr(0, 12)
  return new BN(l).mul(new BN('1000000000000')).add(new BN(right))
}

export const trimZero = (str: string): string => {
  let t = `${str.trim()}`
  while (t !== '0' && t.endsWith('0') && !t.endsWith('.0')) {
    t = t.substr(0, t.length - 1)
  }
  return t
}

export const formatCRU = (cru: string | BN): string => {
  if(!cru) return '-'
  const f = formatBalance(cru, { decimals: 12, forceUnit: "Unit", withSi: false })
  return trimZero(f)
}
// window._formatCRU = formatCRU