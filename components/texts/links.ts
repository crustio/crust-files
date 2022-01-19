import styled from "styled-components";

export const TextLink = styled.a.attrs({ target: '_blank' })`
    cursor: pointer;
    text-decoration: underline;

    &.link1 {
        color: var(--primary-color);
        text-decoration-color: var(--primary-color);
    }
    &.link2 {
        color: var(--primary-color3);
        text-decoration-color: var(--primary-color3);
    }
`

const subscanAttrs = (p: { account: string }) => ({ target: '_blank', href: `https://crust.subscan.io/account/${p.account}` })
export const SubscanAddress = styled.a.attrs(subscanAttrs) <{ account: string }>`
    cursor: pointer;
    color: inherit !important;
`

const subscanBlockAttrs = (p: { block: number | string }) => ({ target: '_blank', href: `https://crust.subscan.io/block/${p.block}` })
export const SubscanBlock = styled.a.attrs(subscanBlockAttrs) <{ block: number | string }>`
    cursor: pointer;
    color: inherit !important;
    text-decoration: underline;
`

const subscanHashAttrs = (p: { hash: string }) => ({ target: '_blank', href: `https://crust.subscan.io/extrinsic/${p.hash}` })
export const SubscanHash = styled.a.attrs(subscanHashAttrs) <{ hash: string }>`
    cursor: pointer;
    color: inherit !important;
`