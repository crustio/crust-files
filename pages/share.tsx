import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import styled from "styled-components";
import { Pixel, PixelBtn } from '../components/effect/Pixels';
import { RowFlex } from '../components/layout';
import { Links } from '../components/Links';
import { BaseProps } from "../components/types";
import { useApp } from '../lib/AppContext';
import { useClipboard } from '../lib/hooks/useClipboard';
import { useSafeState } from '../lib/hooks/useSafeState';
import { report } from '../lib/http/report';
import { getShortInfo } from '../lib/http/share_earn';
import { ShareOptions } from '../lib/types';
import { getErrorMsg } from '../lib/utils';

function _share(props: BaseProps) {
    const { className } = props
    const { query, push } = useRouter()
    const { alert, loading } = useApp()
    const [uiData, setUiData] = useSafeState<{ options: ShareOptions, cid: string }>()
    const { options, cid } = uiData || {}
    useEffect(() => {
        if (query.cid) {
            const hexStr = query.options as string
            const opt = JSON.parse(hexStr) as ShareOptions
            setUiData({ options: opt, cid: query.cid as string })
        }
        if (query.code) {
            loading.show()
            getShortInfo(query.code as string)
                .then(v => setUiData({ ...v }))
                .catch(e => alert.error(getErrorMsg(e)))
                .then(loading.hide)
        }
    }, [query])
    useEffect(() => {
        if (cid && options) {
            report({
                type: 3,
                walletType: options.fromWallet,
                address: options.fromAccount,
                data: {
                    cid: cid,
                    fileType: options.isDir ? 1 : 0,
                    strategy: options.encrypted ? 1 : 0,
                    shareType: 1
                }
            })
        }
    }, [cid, options])
    const link = useMemo(() => {
        if (!options || !cid) return ''
        const base = options.gateway || "https://gw.crustapps.net"
        return `${base}/ipfs/${cid}?filename=${options.name}`
    }, [options, cid])
    const _onClickDown = () => {
        window.open(link, "_blank")
    }
    const copy = useClipboard()
    const _onClickCopy = () => { copy(window.location.href) }
    const _onClickToCrustFiles = () => push('/')
    // const _onClickAboutCrustFiles = () => openDocs('/docs/CrustFiles_Welcome')
    const { from } = options || {}

    return <div className={classNames(className)}>
        <div className="share--panel">
            <img className="logo" src="/images/logo_12x.png" />
            <div className="share--flex1" />
            <div className="share-info">
                {
                    uiData && <>
                        <div className="title">
                            {from && <><span>{from}</span><br /></>}
                            is sharing something<br />
                            from Crust Files.
                        </div>
                        <div className='link'>{`File CID: ${cid}`}</div>
                        <RowFlex>
                            <PixelBtn
                                onClick={_onClickDown}
                                height={'4.29rem'}
                                content="Open File"
                            />
                            <div style={{ width: '2.2857rem' }} />
                            <PixelBtn
                                onClick={_onClickCopy}
                                color='#E46A11'
                                fillColor='#FF8D00'
                                height={'4.29rem'}
                                content="Copy Link"
                            />
                        </RowFlex>
                    </>
                }
                <div className='go-to' onClick={_onClickToCrustFiles}>Go to Crust Files</div>
            </div>
            <div className="share--flex1" />
        </div>
        <div className='share--pixels'>
            <Pixel
                className="pixel_right"
                position="right"
                fullH={true}
                color='#E46A11'
                fillColor='#FF8D00' />
        </div>

        <div className="share--activity">
            <div className='text'>
                Your<br />
                first personal<br />
                Web3.0 storage<br />
                in the Metaverse.<br />
                <br />
                now with<br />
                <span>$50,000,000</span> <br />
                User Rewards
            </div>
            <div className='footer'>
                <Links className='links' />
            </div>
        </div>
    </div>
}

export default React.memo(styled(_share)`
    width: 100%;
    height: 100vh;
    min-height: 70rem;
    background: white;
    display: flex;

    .share--flex1 {
        flex: 1;
    }
    .share--panel {
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;
        flex: 1;
        align-items: center;
        .logo {
            height: 2.5rem;
            align-self: flex-start;
            margin-top: 2.57rem;
            margin-left: 3.57rem;
        }
        .share-info {
            width: 49.07rem;
            padding-bottom: 10rem;
            .title {
                font-size: 4.29rem;
                line-height: 5.86rem;
                font-family: OpenSans-SemiBold;
                color: black;
                span {
                    color: var(--primary-color);
                }
            }
            .link {
                font-size: 2rem;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 2.71rem;
                margin-top: 1.71rem;
                margin-bottom: 6rem;
                color: var(--secend-color);
            }
            .go-to {
                font-size: 2rem;
                margin-top: 5.4286rem;
                line-height: 2.71rem;
                color: black;
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
    .share--pixels {
        width: 12.86rem;
        position: relative;
        flex-shrink: 0;
        .pixel_right {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .share--activity {
        background: var(--primary-color);
        padding: 6.14rem .71rem 4rem 1.43rem;
        width: 35.36rem;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;

        .text {
            font-size: 4.29rem;
            line-height: 5.86rem;
            font-family: OpenSans-SemiBold;
            color: #FFE2C8;
            span {
                color: white;
            }
        }
        .footer {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-top: 2rem;
        }
        .links {
            margin-top: 1rem;
            flex-shrink: 0;
            height: 2.71rem;
            align-items: center;
        }

    }
`)