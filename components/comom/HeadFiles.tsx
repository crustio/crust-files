import styled from "styled-components";
import React from "react";
import classNames from "classnames";
import { BaseProps } from "../types";
import Link from "next/link";

function _HeadFiles(props: BaseProps) {
    const { className } = props
    return <div className={classNames(className, "files_head")}>
        <Link href="/"><img className="logo" src="/images/logo_22x.png" /></Link>
    </div>
}

export const HeadFiles = styled(_HeadFiles)`
    &.files_head {
        width: 100%;
        height: 68px;
        background-color: black;
        .logo {
            display: inline-block;
            cursor: pointer;
            height: 26px;
            width: auto;
            margin-top: 21px;
            margin-left: 28px;
        }
    }
`