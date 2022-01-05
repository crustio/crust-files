import { BaseProps } from "./types";
import styled from "styled-components";
import React from "react";

const defSize = 32
const defSpace = 40

export interface Props extends BaseProps {
  size?: number | string,
  space?: number | string,
}
const wrapUnit = (num: number | string) => typeof num === 'number' ? `${num}px` : num as string

function _Links(props: Props) {
  const { className } = props
  return <div className={className}>
    <a href="https://discord.gg/XeY9FKBzdK" target="_blank" rel="noreferrer" ></a>
    <a href="https://twitter.com/CrustNetwork" target="_blank" rel="noreferrer" />
    <a href="https://t.me/CrustNetwork" target="_blank" rel="noreferrer" />
    <a href="https://crust.network" target="_blank" rel="noreferrer" />
  </div>
}

export const Links = styled(_Links)`
    height: ${({ size = defSize }) => wrapUnit(size)};
    align-items: flex-start;
    flex-shrink: 0;
    display: flex;

    a {
      margin-right: ${({ space = defSpace }) => wrapUnit(space)};
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: ${({ size = defSize }) => wrapUnit(size)};
      height: ${({ size = defSize }) => wrapUnit(size)};
    }
    
    a:nth-child(1) {
      background-image: url('/images/icon_discord.png');
    }
    a:nth-child(2) {
      background-image: url('/images/icon_twitter.png');
    }
    a:nth-child(3) {
      background-image: url('/images/icon_telegram.png');
    }
    a:nth-child(4) {
      background-image: url('/images/icon_crust.png');
    }
    a:last-child{
      margin-right: 0;
    }

    &.dark {
      filter: invert(80%);
    }
`

export const Links2 = styled(_Links)`
    height: ${({ size = defSize }) => wrapUnit(size)};
    align-items: flex-start;
    flex-shrink: 0;
    display: flex;

    a {
      margin-right: ${({ space = defSpace }) => wrapUnit(space)};
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: ${({ size = defSize }) => wrapUnit(size)};
      height: ${({ size = defSize }) => wrapUnit(size)};
    }
    a:nth-child(1) {
      background-image: url('/images/icon_discord.svg');
    }
    a:nth-child(2) {
      background-image: url('/images/icon_twitter.svg');
    }
    a:nth-child(3) {
      background-image: url('/images/icon_telegram.svg');
    }
    a:nth-child(4) {
      background-image: url('/images/icon_crust.svg');
    }
    a:last-child{
      margin-right: 0;
    }

`