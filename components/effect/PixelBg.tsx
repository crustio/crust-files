import React, { CSSProperties, useMemo } from "react";
import styled from "styled-components";
import { BaseProps } from "../types";

export type Props = BaseProps


interface Pixel {
    indexLine: number,
    indexInLine: number,
    style?: CSSProperties
}

interface Group {
    style: CSSProperties
    items: Pixel[]
}


const shows: Group[] = [
    {
        style: {
            left: '42%',
            top: 0,
            position: "absolute",
            transform: "rotate(-45deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 0 },
            { indexLine: 1, indexInLine: 1 },
            { indexLine: 2, indexInLine: 0 },
            { indexLine: 2, indexInLine: 2 },
        ]
    },
    {
        style: {
            right: 239,
            top: 84,
            position: "absolute",
            transform: "rotate(-43deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 2 },
            { indexLine: 0, indexInLine: 4 },
            { indexLine: 1, indexInLine: 1 },
            { indexLine: 1, indexInLine: 3 },
            { indexLine: 1, indexInLine: 5 },
            { indexLine: 2, indexInLine: 0 },
            { indexLine: 2, indexInLine: 2 },
            { indexLine: 2, indexInLine: 4 },
            { indexLine: 2, indexInLine: 6 },
        ]
    },
    {
        style: {
            right: 224,
            bottom: 80,
            position: "absolute",
            // transform: "rotate(-43deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 2 },
            { indexLine: 0, indexInLine: 4 },
            { indexLine: 1, indexInLine: 1 },
            { indexLine: 1, indexInLine: 3 },
            { indexLine: 1, indexInLine: 5 },
            { indexLine: 2, indexInLine: 0 },
            { indexLine: 2, indexInLine: 2 },
            { indexLine: 2, indexInLine: 4 },
            { indexLine: 2, indexInLine: 6 },
        ]
    },
    {
        style: {
            left: '50%',
            bottom: 80,
            position: "absolute",
            // transform: "rotate(-45deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 0 },
            { indexLine: 1, indexInLine: 1 },
            { indexLine: 2, indexInLine: 0 },
            { indexLine: 2, indexInLine: 2 },
        ]
    },
    {
        style: {
            left: 0,
            bottom: 128,
            position: "absolute",
            // transform: "rotate(-45deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 3 },
            { indexLine: 1, indexInLine: 2 },
            { indexLine: 2, indexInLine: 1 },
            { indexLine: 2, indexInLine: 3 },
            { indexLine: 3, indexInLine: 0 },
            { indexLine: 3, indexInLine: 2 },
        ]
    },
    {
        style: {
            left: 0,
            top: '50%',
            position: "absolute",
            // transform: "rotate(-45deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 0 },
            { indexLine: 1, indexInLine: 1 },
        ]
    },
    {
        style: {
            left: -16,
            top: '20%',
            position: "absolute",
            // transform: "rotate(-45deg)",
        },
        items: [
            { indexLine: 0, indexInLine: 2 },
            { indexLine: 1, indexInLine: 1 },
            { indexLine: 2, indexInLine: 0 },
            { indexLine: 2, indexInLine: 2 },
            { indexLine: 3, indexInLine: 1 },
            { indexLine: 5, indexInLine: 0 },
        ]
    },
]
function _PixelBg(props: Props) {
    const { className } = props
    const size = 32
    const groups: Group[] = useMemo(() => {
        return shows.map((g) => {
            g.items = g.items.map((item) => {
                item.style = {
                    position: "absolute",
                    left: item.indexInLine * size,
                    top: item.indexLine * size,
                    width: size,
                    height: size,
                    backgroundColor: '#333333'
                }
                return item
            })
            return g
        })
    }, [])
    return <div className={className}>
        {
            groups.map((g, gIndex) => <div key={`g_${gIndex}`} style={g.style}>
                {g.items.map((item, iIndex) => <span key={`item_${iIndex}`} style={item.style} />)}
            </div>)}
    </div>
}

export const PixelBg = styled(_PixelBg)`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
`