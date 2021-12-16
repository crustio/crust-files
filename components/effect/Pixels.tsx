import classNames from "classnames";
import React, { CSSProperties, useMemo } from "react";
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
        fillColor = '#000000'
    } = props
    const mCount = fullH ? count + 1 : count
    const size = useMemo(() => Math.round(width / mCount), [width, mCount])

    const pixels = useMemo(() => {
        const items: Pixel[] = []
        for (let index = 0; index < mCount; index++) {
            const isFull = index === 0 && fullH
            const h = isFull ? '100%' : width * 2 - index * 2 * size;
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
    }, [mCount, size, width, fullH, position])

    const fillPixels = useMemo(() => {
        const items: Pixel[] = []
        for (let index = 0; index < mCount - 1; index++) {
            const h = width * 2 - (index + 1) * 2 * size;
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
    }, [mCount, size, width, fullH, position])
    return <div className={classNames(className, position)}>
        {pixels.map((item,index) => <div key={`pixels_${index}`} style={item.style} />)}
        {fillPixels.map((item,index) => <div key={`fill_pixels_${index}`} style={item.style} />)}
    </div>
}

export const Pixel = styled(_Pixel) <Props>`
    z-index: 2;
    display: flex;
    height: 100%;
    width: ${({ width = defWidth }) => width}px;
    &.left {
        flex-direction: row;
    }
    &.right {
        flex-direction: row-reverse;
    }
`


// export type BtnProps = BaseProps
// function _PixelBtn(props: BtnProps) {
//     return <div>
//         <Pixel position="right" />
//         <div />
//         <Pixel position="left" />
//     </div>
// }


