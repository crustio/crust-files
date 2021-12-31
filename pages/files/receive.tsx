import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import styled from "styled-components";
import { Pixel, PixelBtn } from '../../components/effect/Pixels';
import { Links } from '../../components/Links';
import { BaseProps } from "../../components/types";
import { report } from '../../lib/http/report';
import { ShareOptions } from '../../lib/types';

function _share(props: BaseProps) {
    const { className } = props
    const { query, push } = useRouter()
    const options = useMemo<ShareOptions>(() => {
        const hexStr = query.options as string
        let options: ShareOptions = {
            name: 'file',
            encrypted: false,
            isDir: false,
            gateway: 'https://gw.crustapps.net',
        }
        if (hexStr) {
            console.info('hexStr:', hexStr)
            const opt = JSON.parse(hexStr) as ShareOptions
            options = { ...options, ...opt }
        }
        return options
    }, [query])
    useEffect(() => {
        if (query.cid && options) {
            report({
                type: 3,
                walletType: options.fromWallet,
                address: options.fromAccount,
                data: {
                    cid: query.cid,
                    fileType: options.isDir ? 1 : 0,
                    strategy: options.encrypted ? 1 : 0,
                    shareType: 1
                }
            })
        }
    }, [query.cid])
    const link = useMemo(() => {
        const base = options.gateway || "https://gw.crustapps.net"
        return `${base}/ipfs/${query.cid}?filename=${options.name}`
    }, [options, query.cid])
    const _onClickDown = () => {
        window.open(link, "_blank")
    }
    const _onClickToCrustFiles = () => push('/')
    // const _onClickAboutCrustFiles = () => openDocs('/docs/CrustFiles_Welcome')
    const from = options.from ? options.from : ''

    return <div className={classNames(className)}>
        <div className="share--panel">
            <img className="logo" src="/images/logo_12x.png" />
            <div className="share--flex1" />
            <div className="share-info">
                <div className="title">
                    You are receiving a file
                    {from && <><br />from <span>{from}</span>.</>}
                </div>
                <div className='link'>{link}</div>
                <PixelBtn
                    onClick={_onClickDown}
                    height={'4.29rem'}
                    content="Open File"
                />
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
                <div className='go-to' onClick={_onClickToCrustFiles}>Go to Crust Files</div>
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
            justify-content: space-between;
            height: 4.29rem;
            margin-top: 2.86rem;
        }
        .links {
            flex-shrink: 0;
            height: 2.71rem;
            align-items: center;
        }
        .go-to {
            font-size: 2rem;
            line-height: 2.71rem;

            color: white;
            text-decoration: underline;
            cursor: pointer;
        }
    }
`)