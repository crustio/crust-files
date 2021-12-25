import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import styled from "styled-components";
import { PixelBg } from '../../components/effect/PixelBg';
import { Pixel, PixelBtn } from '../../components/effect/Pixels';
import { Links } from '../../components/Links';
import { BaseProps } from "../../components/types";
import { useClipboard } from '../../lib/hooks/useClipboard';
import { useGet } from '../../lib/hooks/useGet';
import { getShareEarnConfig } from '../../lib/http/share_earn';
import { ShareOptions } from '../../lib/types';
import { formatCRU } from '../../lib/utils';

function _share(props: BaseProps) {
    const { className } = props
    const { query } = useRouter()
    const cid = query.cid;
    const options = useMemo<ShareOptions | null>(() => {
        const optJson = query.options as string
        console.info('options:', optJson)
        if (optJson) {
            return JSON.parse(optJson) as ShareOptions
        }
        return null
    }, [query])

    const link = useMemo(() => {
        if (options)
            return `${window.location.origin}/files/receive?cid=${cid}&options=${encodeURI(JSON.stringify(options))}`
        return `${window.location.origin}/files/receive?cid=${cid}`
    }, [options])

    const copy = useClipboard()
    const _onClickCopy = () => copy(link)
    const [config] = useGet(() => getShareEarnConfig())
    const eachReward = useMemo(() => formatCRU(config && config.shareAndEarnPerUserReward), [config])
    const from = (options && options.from) ? options.from : ''

    return <div className={classNames(className)}>
        <div className="share--panel">
            <img className="logo" src="/images/logo_12x.png" />
            <div className="share--flex1" />
            <div className="share-info">
                <div className="title">
                    {from && <><span>{from}</span>,<br /></>}
                    You have successfully created a sharelink!
                </div>
                <div className='link'>{link}</div>
                <PixelBtn
                    onClick={_onClickCopy}
                    height={60}
                    content="Copy Link"
                    color='#E46A11'
                    fillColor='#FF8D00'
                />
            </div>
            <div className="share--flex1" />
        </div>
        <div className='share--pixels'>
            <Pixel className="pixel_right" position="right" fullH={true} />
        </div>
        <div className="share--activity">
            <PixelBg type={2} />
            <div className='text'>
                <span>Share</span> fun<br />
                and <span>invite</span><br />
                your friends<br />
                to Crust Files,<br />
                Win <span>{eachReward} CRU</span><br />
                for each <br />
                invitation!
            </div>
            <Links className='links' />
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
        background: black;
        padding: 86px 10px 56px 55px;
        width: 495px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        position: relative;

        .text {
            z-index: 2;
            font-size: 60px;
            line-height: 82px;
            font-family: OpenSans-SemiBold;
            color: white;
            span {
                color: var(--primary-color);
            }
        }
        .links {
            z-index: 2;
            margin-top: 40px;
            flex-shrink: 0;
            height: 60px;
        }
    }
`)