import { useComposeCast } from "@coinbase/onchainkit/minikit";
import styled from "styled-components";


const ShareIcon = styled.span`
    cursor: pointer;
    font-size: 2rem;
    &:hover{
        color: orange;
    }
`
export default function ShareApp() {
    const cc = useComposeCast()
    return <ShareIcon className="cru-fo-share" onClick={() => cc.composeCast({ text: 'Click to open crustfiles!', embeds: ['https://crustfiles.io'] })}></ShareIcon>
}