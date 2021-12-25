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
                    height={60}
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
    min-height: 788px;
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
            height: 35px;
            align-self: flex-start;
            margin-top: 36px;
            margin-left: 50px;
        }
        .share-info {
            width: 687px;
            padding-bottom: 10rem;
            .title {
                font-size: 60px;
                line-height: 82px;
                font-family: OpenSans-SemiBold;
                color: black;
                span {
                    color: var(--primary-color);
                }
            }
            .link {
                font-size: 28px;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 38px;
                margin-top: 24px;
                margin-bottom: 84px;
                color: var(--secend-color);
            }
            
        }
    }
    .share--pixels {
        width: 180px;
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
        padding: 86px 10px 56px 20px;
        width: 495px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;

        .text {
            font-size: 60px;
            line-height: 82px;
            font-family: OpenSans-SemiBold;
            color: #FFE2C8;
            span {
                color: white;
            }
        }
        .footer {
            display: flex;
            justify-content: space-between;
            height: 60px;
            margin-top: 40px;
        }
        .links {
            flex-shrink: 0;
            height: 38px;
            align-items: center;
        }
        .go-to {
            font-size: 28px;
            line-height: 38px;

            color: white;
            text-decoration: underline;
            cursor: pointer;
        }
    }
`)