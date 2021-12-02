import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import styled from "styled-components";
import { BaseProps } from "../../components/types";
import { useClipboard } from '../../lib/hooks/useClipboard';
import { ShareOptions } from '../../lib/types';
import { strToHex } from '../../lib/utils';
import { useContextWrapLoginUser } from '../../lib/wallet/hooks';

function _share(props: BaseProps) {
    const { className } = props
    const { query } = useRouter()
    const cid = query.cid;
    const wUser = useContextWrapLoginUser()

    const options = useMemo<ShareOptions>(() => {
        const hexStr = query.options as string
        console.info('options:', hexStr)
        let options: ShareOptions = {
            name: 'share.file',
            encrypted: false,
            gateway: 'https://gw.crustapps.net',
        }
        if (hexStr) {
            options = JSON.parse(hexStr) as ShareOptions
        }
        if (wUser.nickName) {
            options.from = wUser.nickName
        }
        return options
    }, [query, wUser])

    const link = useMemo(() => {
        return `${window.location.origin}/files/receive?cid=${cid}&options=${strToHex(JSON.stringify(options))}`
    }, [options])

    const copy = useClipboard()
    const _onClickCopy = () => copy(link)
    const isCrustWallet = wUser.wallet === 'crust'
    const title = useMemo(() => {
        if (wUser.nickName)
            return `${wUser.nickName}‘s Sharing Link is Successfully Created. `
        return `Yours Sharing Link is Successfully Created. `
    }, [wUser])

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
                    <span className="btn" onClick={_onClickCopy}>Copy Link</span>
                </div>
            </div>
            <div className="share--flex1" />
        </div>
        <div className="share--flex1" />
        <div className="share--activity">
            <div className="share--flex1" />
            <div className="texts">
                <div className="title">
                    Share files to your friends and invite them to use <span>Crust Files</span>. Enjoy and Earn <span>$CRU</span> !!!
                </div>
                {
                    isCrustWallet ?
                        <div className="text">
                            1. Share files to your friends and invite them to use Crust Files.<br />
                            2. For every effective invitation (as your friend becomes a Premium User), you get 0.5 $CRU reward.
                        </div> :
                        <div className="text">
                            1. Log in to Crust Files with Crust Wallet.<br />
                            2. Share files to your friends and invite them to use Crust Files.<br />
                            3. For every effective invitation (as your friend becomes a Premium User), you get 0.5 $CRU reward.
                        </div>
                }
            </div>
            <div className="btn-share-earn">Learn more about Share-and-Earn</div>
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
            margin-right: 60px;
            .title {
                color: white;
                font-size: 1.142857rem;
                margin-bottom: 8px;
        
                span {
                    color: var(--primary-color);
                }
            }
            .text {
                line-height: 1.357143rem;
                color: #cccccc;
            }
        }
        .btn-share-earn {
            border: 1px solid #FFFFFF;
            border-radius: 12px;
            padding: 1rem 2.285714rem;
            color: white;
            cursor: pointer;
            font-size: 1.14rem;
            font-weight: 600;
        }
        
    }
`)