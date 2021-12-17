import { BaseProps } from "./types";
import styled from "styled-components";
import React from "react";

const defSize = 32
const defSpace = 40

export interface Props extends BaseProps {
    size?: number,
    space?: number,
}

function _Links(props: Props) {
    const { className } = props
    return <div className={className}>
        <a href="https://twitter" target="_blank" rel="noreferrer" />
        <a href="https://telegram" target="_blank" rel="noreferrer" />
        <a href="https://crust.network" target="_blank" rel="noreferrer" />
    </div>
}

export const Links = styled(_Links)`
    height: ${({ size = defSize }) => size}px;
    align-items: flex-start;
    flex-shrink: 0;
    display: flex;

    a {
      margin-right: ${({ space = defSpace }) => space}px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: ${({ size = defSize }) => size}px;
      height: ${({ size = defSize }) => size}px;
    }
    a:nth-child(1) {
      background-image: url('/images/icon_twitter.png');
    }
    a:nth-child(2) {
      background-image: url('/images/icon_telegram.png');
    }
    a:nth-child(3) {
      background-image: url('/images/icon_crust.png');
    }
    a:last-child{
      margin-right: 0;
    }
`