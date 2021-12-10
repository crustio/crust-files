import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import styled from "styled-components";
import { BaseProps } from "../../components/types";
import { ShareOptions } from '../../lib/types';
import { openDocs } from '../../lib/utils';

function _share(props: BaseProps) {
    const { className } = props
    const { query, push } = useRouter()
    const options = useMemo<ShareOptions>(() => {
        const hexStr = query.options as string
        let options: ShareOptions = {
            name: 'file',
            encrypted: false,
            gateway: 'https://gw.crustapps.net',
        }
        if (hexStr) {
            console.info('hexStr:', hexStr)
            options = JSON.parse(hexStr) as ShareOptions
        }
        return options
    }, [query])
    const link = useMemo(() => {
        const base = options.gateway || "https://gw.crustapps.net"
        return `${base}/ipfs/${query.cid}?filename=${options.name}`
    }, [options, query.cid])
    const _onClickDown = () => {
        window.open(link, "_blank")
    }
    const title = useMemo(() => {
        if (options.from)
            return `${options.from}‘s is sharing you an file from Crust Files.`
        return `You are receiving a shared file from Crust Files.`
    }, [options])
    const _onClickToCrustFiles = () => push('/')
    const _onClickAboutCrustFiles = () => openDocs('/docs/CrustFiles_Welcome')

    return <div className={classNames(className)}>
        <div className="share--flex1" />
        <div className="share--panel">
            <div className="share--flex1" />
            <img className="share-logo" src="/images/share_logo.png" />
            <div className="share-info">
                <img className="logo" src="/images/logo_12x.png" />
                <div className="title">{title}</div>
                <div className="link-btn">
                    <span className="link">{link}</span>
                    <span className="btn" onClick={_onClickDown}>Open File</span>
                </div>
            </div>
            <div className="share--flex1" />
        </div>
        <div className="share--flex1" />
        <div className="share--activity">
            <div className="share--flex1" />
            <div className="texts">
                <div className="title">
                    Enjoy your first <span>Web3.0</span> File Storage in the Metaverse. Now <span>Free</span>.
                </div>
                <div className="text">
                    100% Data Privacy
                </div>
                <div className="text2">
                    End-2-end encrypted, tamper-proof and censorship-resistant.
                </div>
                <div className="text">
                    200% Sharing Pleasure
                </div>
                <div className="text2">
                    Easily share files with your friends. Get double joy.
                </div>
            </div>
            <div>
                <div className="btn-share-earn" onClick={_onClickToCrustFiles}>Go to Crust Files</div>
                <div className="btn-share-earn" onClick={_onClickAboutCrustFiles}>Learn more about Crust Files</div>
            </div>
            <div className="share--flex1" />
        </div>
    </div>
}

export default React.memo(styled(_share)`
    width: 100%;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;

    .share--flex1 {
        flex: 1;
    }
    .share--panel {
        display: flex;
        .share-logo {
            height: 22.857143rem;
            margin-right: 4.285714rem;
        }

        .share-info {
            padding-top: 2.857143rem;
            .logo {
                height: 35px;
            }
            .title {
                font-size: 2.285714rem;
                line-height: 3.142857rem;
                font-weight: 600;
                margin-top: 1.714286rem;
                margin-bottom: 2.285714rem;
            }
            .link-btn {
                display: inline-block;
                font-size: 1.142857rem;
                height: 4.285714rem;
                line-height: 4.285714rem;
                border-radius: .857143rem;
                border: 1px solid var(--main-color);
                overflow: hidden;
                .link {
                    display: inline-block;
                    max-width: 28.9rem;
                    width: 28.9rem;
                    color: var(--secend-color);
                    padding-left: 1.142857rem;
                    padding-right: 3.142857rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .btn{
                    min-width: 18.285714rem;
                    text-align: center;
                    vertical-align: top;
                    display: inline-block;
                    background: var(--main-color);
                    cursor: pointer;
                    color: white;
                    font-weight: 600;
                    padding: 0 1.428571rem;
                    
                }
            }
        }
    }
    .share--activity {
        background: var(--main-color);
        padding: 1.142857rem 0;
        flex-shrink: 0;
        font-size: 1rem;
        color: white;
        text-align: center;
        display: flex;
        align-items: center;
        .texts {
            text-align: start;
            margin-right: 22.857143rem;
            .title {
                color: white;
                font-size: 1.142857rem;
                
        
                span {
                    color: var(--primary-color);
                }
            }
            .text {
                margin-top: 8px;
                line-height: 1.357143rem;
                color: white;
                font-weight: 500;
            }
            .text2 {
                margin-top: 2px;
                font-size: 10px;
                line-height: 14px;
                color: #CCCCCC;
            }
        }
        .btn-share-earn {
            border: 1px solid #FFFFFF;
            min-width: 18.285714rem;
            border-radius: 12px;
            padding: 1rem 0;
            text-align: center;
            color: white;
            cursor: pointer;
            font-size: 1.14rem;
            font-weight: 600;
            &:first-child{
                margin-bottom: 8px;
            }
        }
        
    }
`)