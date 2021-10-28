export const shortStr = (name: string, count = 6): string => {
  if (name.length > (count * 2)) {
    return `${name.substr(0, count)}...${name.substr(name.length - count)}`;
  }
  return name;
};
