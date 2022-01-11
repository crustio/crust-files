import { HeadFiles } from "../components/comom/HeadFiles";
import { CenterFlex, ColFlex, RowFlex } from "../components/layout";
import { StyleText } from "../components/texts/texts";
import React from "react";
import { ColorSpan } from "../components/texts/spans";
import styled from "styled-components";
import { TextLink } from "../components/texts/links";
import { CrustGetCRU, CrustWalletDownUrl } from "../lib/config";

const TitleOne = styled(ColorSpan)`
    font-size: 6rem;
    font-style: italic;
`

const Arrow1 = styled.img.attrs({ src: '/images/guide/arrow_down.png' })`
    width: 50%;
    height: 7rem;
    object-fit: contain;
`

export default function page() {
    return <ColFlex>
        <HeadFiles />
        <CenterFlex style={{ width: '100%' }}>
            <ColFlex style={{ width: '100%', maxWidth: '90rem', paddingBottom: '8rem' }}>
                <StyleText style={{ marginTop: '2.1429rem' }} className="style1" children="A Guide to" />
                <StyleText className="style2" children="Invite Bonus" style={{ marginBottom: '5rem' }} />
                <StyleText className="style3" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <TitleOne children="1" /> Log in with a Crust Wallet and become a Premium User
                </StyleText>
                <StyleText className="style5">
                    <StyleText>Links you may need to get started:</StyleText>
                    <ul>
                        <li>Download <ColorSpan children="Crust Wallet (Chrome Extension)" /> <TextLink className="link2" href={CrustWalletDownUrl} children="here" /></li>
                        <li>Exchange a small amount of <ColorSpan children="CRU" /> <TextLink className="link2" href={CrustGetCRU} children="here" /></li>
                        <li>Register as a Crust Files’ <ColorSpan children="Premium User" /> <TextLink className="link2" href={`${window.location.origin}/user`} children="here" /></li>
                    </ul>
                </StyleText>
                <StyleText className="style4" style={{ marginBottom: '5rem' }}>
                    *Note: To earn CRU in our share-and-earn rewards programs, a <strong>Crust Wallet is required</strong>. When you log in to Crust Files for the first time, you will be asked to set a Nickname. It is highly recommended to become a Premium User, so that you can enjoy the full Crust Files experience and get exciting rewards in our Share-and-Earn program. As a Trail user you are allowed to invite your friends as long as you have a nickname, but rewards can only be claimed once you become a Premium User.
                </StyleText>

                <StyleText className="style3" style={{ marginTop: '2rem' }}>
                    <TitleOne children="2" /> Invite friends to register as a Premium User
                </StyleText>
                <img src="/images/guide/invite_2.png" style={{ width: '100%', height: 'auto', margin: '2.6rem 0' }} />
                <StyleText className="style5" style={{ marginBottom: '5rem' }}>
                    Just make sure that your friend has input your <strong>Nickname</strong> (as invitation code) correctly when he or she is registering as a Premium User.<br />
                    That is the only thing you need to do before you can earn CRU from your invitations! Your Nickname is the invitation code. We don’t have an ‘invitation link’ or something like that.
                </StyleText>
                <StyleText className="style3" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    Learn about <TitleOne children="3" /> ways to let your friends know your Nickname
                </StyleText>
                <StyleText className="style5">
                    1. Create a <ColorSpan>share link</ColorSpan> and send the link to your friends so that they can receive your shared files and know your Nickname.
                </StyleText>
                <img src="/images/guide/share_2.png" style={{ width: '100%', height: 'auto', margin: '2.6rem 0' }} />
                <Arrow1 />
                <RowFlex>
                    <img src="/images/guide/receive.png" style={{ width: '50%', height: 'auto', margin: '2.6rem 0' }} />
                    <StyleText className="style4" style={{ width: '50%', fontStyle: 'normal', padding: '2rem', position: 'relative', top: '-6rem' }}>
                        Press the ‘<strong>Share</strong>’ button to create a share link which contains your Nickname.
                    </StyleText>
                </RowFlex>
                <StyleText className="style5">
                    2. Or you can start a <ColorSpan color="--primary-color3">quick Tweet</ColorSpan> to share to the public. It’s super-duper efficient!
                </StyleText>
                <img src="/images/guide/share_1.png" style={{ width: '100%', height: 'auto', margin: '2.6rem 0' }} />
                <Arrow1 />
                <RowFlex>
                    <img src="/images/guide/tweet.png" style={{ width: '50%', height: 'auto', margin: '2.6rem 0' }} />
                    <StyleText className="style4" style={{ width: '50%', fontStyle: 'normal', padding: '2rem', position: 'relative', top: '-6rem' }}>
                        Press the ‘<strong>Twitter</strong>’ logo to start a quick Tweet whick contains your Nickname in the text.
                    </StyleText>
                </RowFlex>
                <StyleText className="style5" style={{ marginTop: '2.6rem' }}>
                    3. Or you can just tell your friends and invite them to use Crust Files and register as Premium User!
                </StyleText>
            </ColFlex>
        </CenterFlex>
    </ColFlex>
}