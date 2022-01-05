import React from "react";
import styled from "styled-components";

export interface Props {
  className?: string,
  width?: number,
  height?: number
}

export function Key(props: Props) {
  const { className, width = 60, height = 60 } = props;
  return <svg className={`icon ${className}`} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
    width={width} height={height}>
    <path
      d="M726.464 69.824a289.792 289.792 0 0 1 220.16 202.24c13.76 46.336 15.808 95.36 5.952 142.72a293.312 293.312 0 0 1-283.968 230.4c-28.032 0-55.936-4.032-82.752-12.16l-51.2 60.032-24.256 11.2H448v96l-32 32H320v96l-32 32h-192l-32-32v-147.648l9.344-22.592L391.68 439.68a285.696 285.696 0 0 1-12.8-89.92 289.792 289.792 0 0 1 347.584-280z m84.352 460.8a228.352 228.352 0 0 0 79.296-128.32l0.256 0.32A226.816 226.816 0 0 0 622.08 133.12a228.864 228.864 0 0 0-179.2 217.6c-0.64 29.184 4.48 58.112 15.296 85.12l-7.04 34.752L128 793.856v102.4h128v-96l32-32H384v-96l32-32h79.68l56.064-65.024 35.904-8.96c25.856 10.112 53.44 15.296 81.216 15.232a228.288 228.288 0 0 0 141.952-50.88z m-53.632-174.848a64 64 0 1 0-106.496-71.04 64 64 0 0 0 106.56 71.04z" />
  </svg>
}

export const Coin = styled.img.attrs({ src: "/images/coin.svg"})`
  width: 2.43rem;
  height: 2.29rem;
  object-fit: contain;
  display: inline-block;
`

export const BadgeIcon1 = styled.img.attrs({ src: '/images/badge1.svg'})`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: inline-block;
`
export const BadgeIcon2 = styled.img.attrs({ src: '/images/badge2.svg'})`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: inline-block;
`

export const SVG = styled.embed`
  width: 24px;
  height: 24px;
`