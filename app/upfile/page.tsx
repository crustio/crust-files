'use client'

import { BtnUpload } from '@/components/BtnUpload';
import { Pixel } from '@/components/effect/Pixels';
import { Links } from '@/components/Links';
import UpModal from '@/components/modal/UpModal';
import { BaseProps } from "@/components/types";
import { AuthIpfsEndpoint } from '@/lib/config';
import { useClipboard } from '@/lib/hooks/useClipboard';
import useInputFile from '@/lib/hooks/useInputFile';
import { SaveFile } from '@/lib/types';
import { shortStr } from '@/lib/utils';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import styled from "styled-components";

function _upfile(props: BaseProps) {
    const { className } = props
    const wInputFile = useInputFile()
    const [sf, setSF] = useState<SaveFile>()
    const copy = useClipboard()
    const { push } = useRouter()
    const sq = useSearchParams()
    const queryEndpoints = sq.getAll("endpoints");
    const endpoints = useMemo(() => {
        const urls = queryEndpoints;
        return urls?.map(url => ({
            value: url,
            text: url,
        }) as AuthIpfsEndpoint)
    }, [queryEndpoints])

    return <div className={classNames(className)}>
        <div className="share--panel">
            <img className="logo" src="/images/logo_12x.png" />
            <div className="share--flex1" />
            <div className="share-info">
                <input
                    onChange={wInputFile._onInputFile}
                    ref={wInputFile.inputRef as any}
                    style={{ display: 'none' }}
                    type={'file'}
                />

                <BtnUpload
                    onClickUpFile={wInputFile._onClickUpFile}
                    onClickUpFolder={wInputFile._onClickUpFolder}
                />
                {sf && <div className='cid-info'>{shortStr(sf.Hash)} <span onClick={() => copy(sf.Hash)} style={{ cursor: 'pointer' }} className="cru-fo cru-fo-copy" /></div>}
                {
                    wInputFile.file && <UpModal
                        file={wInputFile.file}
                        endpoints={endpoints}
                        onClose={() => wInputFile.setFile(undefined)}
                        onSuccess={(file) => {
                            setSF(file)
                            wInputFile.setFile(undefined)
                            const redirectUrl = sq.get('redirect')
                            if (redirectUrl) {
                                const redirect = new URL(redirectUrl as any)
                                const usp = new URLSearchParams(redirect.searchParams)
                                usp.set("cid", file.Hash)
                                redirect.search = usp.toString()
                                push(redirect.toString())
                            }
                        }}
                    />
                }
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
            </div>
            <div className='footer'>
                <Links className='links' />
            </div>
        </div>
    </div>
}

export default React.memo(styled(_upfile)`
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
        padding-left: 1em;
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

    .cid-info {
        margin-top: 1.25rem;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 1em;
        font-size: 1.5rem;
    }
`) as any