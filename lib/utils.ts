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