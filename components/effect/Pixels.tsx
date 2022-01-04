import classNames from "classnames";
import React, { CSSProperties, MouseEventHandler, useMemo } from "react";
import styled from "styled-components";
import { BaseProps } from "../types";
import _ from 'lodash'


const defWidth = 120;
export interface Props extends BaseProps {
    position?: 'left' | 'right',
    width?: number | string,
    count?: number,
    fullH?: boolean,
    color?: string,
    fillColor?: string,
    type?: 1 | 2
}



interface Pixel {
    style: CSSProperties
}

const wrapUnit = (num: number | string, isPx: boolean) => typeof num === 'string' ? num : isPx ? `${_.round(num)}px` : `${_.round(num, 4)}rem`
const isPX = (num: number | string): boolean => typeof num === 'number' || num.endsWith('px')

function _Pixel(props: Props) {
    const {
        className,
        position = 'left',
        fullH = false,
        count = 3,
        width = defWidth,
        color = '#191919',
        fillColor = '#000000',
        type = 2
    } = props
    const mCount = fullH ? count + 1 : count
    const isPx = isPX(width);
    const mWidth: number = typeof width === 'number' ? width as number : _.toNumber(width.replace('px', '').replace('rem', ''));
    const size = useMemo(() => mWidth / mCount, [width, mCount])
    const tHeight = useMemo(() => ((mCount - 1) * 2 + type) * size, [mCount, type, size])
    const pixels = useMemo(() => {
        const items: Pixel[] = []
        for (let index = 0; index < mCount; index++) {
            const isFull = index === 0 && fullH
            const h = isFull ? '100%' : tHeight - index * 2 * size;
            const wrapUnitH = wrapUnit(h, isPx)
            const top = isFull ? 0 : `calc(50% - ${wrapUnit((h as number) / 2, isPx)})`
            const style: CSSProperties = {
                position: 'absolute',
                height: wrapUnitH,
                width: wrapUnit(size, isPx),
                top,
                backgroundColor: color,
            }
            if (position === 'left') {
                style.left = wrapUnit(index * size, isPx);
            } else if (position === 'right') {
                style.right = wrapUnit(index * size, isPx);
            }
            items.push({ style })
        }
        return items
    }, [mCount, size, tHeight, fullH, position, isPx])

    const fillPixels = useMemo(() => {
        const items: Pixel[] = []
        for (let index = 0; index < mCount - 1; index++) {
            const h = tHeight - (index + 1) * 2 * size;
            const wrapUnitH = wrapUnit(h, isPx)
            const top = `calc(50% - ${wrapUnit((h as number) / 2, isPx)})`
            const style: CSSProperties = {
                position: 'absolute',
                height: wrapUnitH,
                width: wrapUnit(size, isPx),
                top,
                zIndex: 2,
                backgroundColor: fillColor
            }
            if (position === 'left') {
                style.left = wrapUnit(index * size, isPx);
            } else if (position === 'right') {
                style.right = wrapUnit(index * size, isPx);
            }
            items.push({ style })
        }
        return items
    }, [mCount, size, tHeight, fullH, position, isPx])
    return <div className={classNames(className, `Pixel_${position}`)}>
        {pixels.map((item, index) => <div key={`pixels_${index}`} style={item.style} />)}
        {fillPixels.map((item, index) => <div key={`fill_pixels_${index}`} style={item.style} />)}
    </div>
}

export const Pixel = styled(_Pixel) <Props>`
    z-index: 2;
    display: flex;
    height: 100%;
    position: relative;
    width: ${({ width = defWidth }) => typeof width === 'number' ? width + 'px' : width};
    &.Pixel_left {
        flex-direction: row;
    }
    &.Pixel_right {
        flex-direction: row-reverse;
    }
`


const defColor = '#999999'
const defFillColor = '#000000'
export interface BtnProps extends BaseProps {
    height: number | string,
    color?: string,
    fillColor?: string,
    content: string | React.ReactNode,
    disabled?: boolean,
    unClick?: boolean,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

function _PixelBtn(props: BtnProps) {
    const {
        height = 60,
        className,
        color = defColor,
        fillColor = defFillColor,
        content,
        disabled,
        unClick,
        onClick
    } = props
    const isPx = isPX(height);
    const mHeight = typeof height === 'number' ? height as number : _.toNumber(height.replace('px', '').replace('rem', ''));
    const width = wrapUnit((mHeight / 5) * 3, isPx);

    return <div className={classNames(className, { disabled, unClick })} onClick={onClick}>
        <Pixel
            type={1}
            width={width}
            color={color}
            fillColor={fillColor}
            position="right"
        />
        <div className="btn_content">{content}</div>
        <Pixel
            type={1}
            width={width}
            color={color}
            fillColor={fillColor}
            position="left"
        />
    </div>
}

export const PixelBtn = styled(_PixelBtn) <BtnProps>`
    display: flex;
    user-select: none;
    align-items: center;
    width: min-content;
    height: ${({ height }) => wrapUnit(height, isPX(height))};
    cursor: pointer;
    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
    &.unClick {
        cursor: default;
    }
    .btn_content {
        height: 100%;
        line-height: ${({ height }) => wrapUnit(height, isPX(height))};
        padding: 0 20px;
        min-width: calc(130px + 7.14rem);
        font-size: 1.71rem;
        font-family: OpenSans-SemiBold;
        color: white;
        text-align: center;
        background-color: ${({ fillColor = defFillColor }) => fillColor};
    }
    &:hover {
        
    }
`

const defBtnHeight = 51
const whRatio = 0.725
const calcW = (h: number, c = 1) => Math.ceil(h * whRatio * c)
export const PixelBtn1 = styled.div<{ height?: number }>`
    color: white;
    font-family: 'OpenSans-SemiBold';
    font-size: 32px;
    line-height: ${({ height = defBtnHeight }) => height}px;
    height: ${({ height = defBtnHeight }) => height}px;
    text-align: center;
    width: 357px;
    cursor: pointer;
    transition: all ease-in-out 200ms;
    background-image: url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');
    background-position: 0 0,${({ height = defBtnHeight }) => calcW(height) - 2}px 0,right center;
    background-repeat: no-repeat;
    background-attachment: scroll;    
    background-size: 
        ${({ height = defBtnHeight }) => calcW(height)}px 100%, 
        calc(100% - ${({ height = defBtnHeight }) => calcW(height, 2) - 4}px) 100%, 
        ${({ height = defBtnHeight }) => calcW(height)}px 100%;
    &.dark {
        background-image: url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png'); 
    }
    transform-origin: center top;
    &.style_left {
        transform-origin: right top;
        background-image: url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r2.png');
        &.dark {
            background-image: url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r2.png') ; 
        }
    }

    &.style_right {
        transform-origin: left top;
        background-image: url('/images/btn/btn_bg_l2.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');
        &.dark {
            background-image: url('/images/btn/btn_dark_bg_l2.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png'); 
        }
    }

@media screen and (max-width: 1440px) {
  transform: scale(0.9);
}

@media screen and (max-width: 1296px) {
    transform: scale(0.8);
}

`


const prixlBoardAttrs = (p: { board_size: number }) => ({ board_size: p.board_size || 12 });
export const PixelBoard = styled.div.attrs(prixlBoardAttrs)`
  padding: ${(p) => p.board_size}px;
  background-repeat: no-repeat;
  background-size: 
    calc(100% - ${(p) => p.board_size * 2}px) ${(p) => p.board_size}px,
    calc(100% - ${(p) => p.board_size * 2}px) ${(p) => p.board_size}px,
    ${(p) => p.board_size}px calc(100% - ${(p) => p.board_size * 2}px),
    ${(p) => p.board_size}px calc(100% - ${(p) => p.board_size * 2}px);
  background-position: 
    ${(p) => p.board_size}px top,
    ${(p) => p.board_size}px bottom,
    left ${(p) => p.board_size}px,
    right ${(p) => p.board_size}px;
  background-image: 
    linear-gradient(0deg,black,black),
    linear-gradient(0deg,black,black),
    linear-gradient(0deg,black,black),
    linear-gradient(0deg,black,black);
`