import styled from "styled-components";

export type Colors =
    '--primary-color' |
    '--primary-color2' |
    '--primary-color3' |
    '--primary-color4'

export const ColorSpan = styled.span.attrs((p: { color?: Colors }) => ({ color: p.color || '--primary-color' }))`
    color: var(${prop => prop.color});
    &.btn {
        cursor: pointer;
        &:disabled{
            cursor: not-allowed;
        }
    }
`
