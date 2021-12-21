import classNames from "classnames";
import React, { CSSProperties, MouseEventHandler, useMemo } from "react";
import styled from "styled-components";
import { BaseProps } from "../types";


const defWidth = 120;
export interface Props extends BaseProps {
    position?: 'left' | 'right',
    width?: number,
    count?: number,
    fullH?: boolean,
    color?: string,
    fillColor?: string,
    type?: 1 | 2
}



interface Pixel {
    style: CSSProperties
}

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
    const size = useMemo(() => Math.round(width / mCount), [width, mCount])
    const tHeight = useMemo(() => ((mCount - 1) * 2 + type) * size, [mCount, type, size])
    const pixels = useMemo(() => {
        const items: Pixel[] = []
        for (let index = 0; index < mCount; index++) {
            const isFull = index === 0 && fullH
            const h = isFull ? '100%' : tHeight - index * 2 * size;
            const top = isFull ? 0 : `calc(50% - ${Math.round((h as number) / 2)}px)`
            const style: CSSProperties = {
                position: 'absolute',
                height: h,
                width: size,
                top,
                backgroundColor: color,
            }
            if (position === 'left') {
                style.left = index * size;
            } else if (position === 'right') {
                style.right = index * size;
            }
            items.push({ style })
        }
        return items
    }, [mCount, size, tHeight, fullH, position])

    const fillPixels = useMemo(() => {
        const items: Pixel[] = []
        for (let index = 0; index < mCount - 1; index++) {
            const h = tHeight - (index + 1) * 2 * size;
            const top = `calc(50% - ${Math.round((h as number) / 2)}px)`
            const style: CSSProperties = {
                position: 'absolute',
                height: h,
                width: size,
                top,
                zIndex: 2,
                backgroundColor: fillColor
            }
            if (position === 'left') {
                style.left = index * size;
            } else if (position === 'right') {
                style.right = index * size;
            }
            items.push({ style })
        }
        return items
    }, [mCount, size, tHeight, fullH, position])
    return <div className={classNames(className, position)}>
        {pixels.map((item, index) => <div key={`pixels_${index}`} style={item.style} />)}
        {fillPixels.map((item, index) => <div key={`fill_pixels_${index}`} style={item.style} />)}
    </div>
}

export const Pixel = styled(_Pixel) <Props>`
    z-index: 2;
    display: flex;
    height: 100%;
    position: relative;
    width: ${({ width = defWidth }) => width}px;
    &.left {
        flex-direction: row;
    }
    &.right {
        flex-direction: row-reverse;
    }
`


const defColor = '#999999'
const defFillColor = '#000000'
export interface BtnProps extends BaseProps {
    height: number,
    color?: string,
    fillColor?: string,
    content: string | React.ReactNode,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

function _PixelBtn(props: BtnProps) {
    const {
        height = 60,
        className,
        color = defColor,
        fillColor = defFillColor,
        content,
        onClick
    } = props
    const width = Math.round((height / 5) * 3);

    return <div className={className} onClick={onClick}>
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
    align-items: center;
    width: min-content;
    height: ${({ height }) => height}px;
    cursor: pointer;
    .btn_content {
        height: 100%;
        line-height: ${({ height }) => height}px;
        padding: 0 20px;
        min-width: 230px;
        font-size: 24px;
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
const calcW = (h: number, c = 1) => Math.round(h * whRatio * c)
export const PixelBtn1 = styled.div<{ height?: number }>`
    color: white;
    font-family: 'OpenSans-SemiBold';
    font-size: 32px;
    line-height: ${({ height = defBtnHeight }) => height}px;
    height: ${({ height = defBtnHeight }) => height}px;
    text-align: center;
    width: 357px;
    cursor: pointer;
    background-image: url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');
    background-position: 0 0,${({ height = defBtnHeight }) => calcW(height)}px 0,right center;
    background-repeat: no-repeat;
    background-attachment: scroll;    
    background-size: 
        ${({ height = defBtnHeight }) => calcW(height)}px 100%, 
        calc(100% - ${({ height = defBtnHeight }) => calcW(height, 2)}px) 100%, 
        ${({ height = defBtnHeight }) => calcW(height)}px 100%;
    &.dark {
        background-image: url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png'); 
    }

    &.style_left {
        background-image: url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r2.png');
        &.dark {
            background-image: url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r2.png') ; 
        }
    }

    &.style_right {
        background-image: url('/images/btn/btn_bg_l2.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');
        &.dark {
            background-image: url('/images/btn/btn_dark_bg_l2.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png'); 
        }
    }
`