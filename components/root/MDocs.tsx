"use client"

import classNames from 'classnames';
import Head from "next/head";

import React from 'react';
import styled from "styled-components";
import { HeadFiles } from '../comom/HeadFiles';
import { BaseProps } from '../types';
import { docsMenus } from './menus';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/lib/usePathname';

function _MDocs({ children, className, menus = true, }: BaseProps & { menus?: boolean, children: React.ReactNode }) {
    const r = useRouter()
    const pathname = usePathname()
    return <div className={classNames(className)}>
        <Head>
            <title>{'Crust Files'}</title>
        </Head>
        <HeadFiles />
        <div className="docs_panel">
            {menus && <div className="left_menu">
                {docsMenus.map((m, index) =>
                    <div
                        key={`docs_menu_${index}`}
                        className={classNames("item", { active: m.path === pathname })}
                        onClick={() => { r.push(m.path) }}
                    >
                        {m.name}
                    </div>)}
            </div>}
            <div className="md_content">
                {children}
            </div>
        </div>

    </div>
}

export const MDocs = styled(_MDocs)`
    font-family: ---apple-system, BlinkMacSystemFont, "微软雅黑", 'Open Sans', sans-serif;

    .docs_panel {
        display: flex;
        width:  100vw;
        height: calc(100vh - 68px);
        overflow-y: auto;
    }
    
    .left_menu {
        width: 206px;
        background-color: #f7f7f7;
        border-right: 1px solid rgba(0,0,0,0.1);
        padding-top: 20px;
        color: #666666;
        font-size: 18px;
        font-family: OpenSans-SemiBold;
        .item {
            line-height: 51px;
            height: 51px;
            padding-left: 20px;
            cursor: pointer;
            color: #666666;
            &:hover {

            }
            &.active {
                color: #333333;
                border-right: solid 0.2rem var(--primary-color);
                background-color: #eeeeee;
            }
        }
    }
    .md_content {
        background-color: white;
        padding: 2.285714rem;
        flex: 1;
        height: 100%;
        overflow-y: auto;
    }
`

export default MDocs