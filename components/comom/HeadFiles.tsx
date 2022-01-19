import styled from "styled-components";
import React from "react";
import classNames from "classnames";
import { BaseProps } from "../types";

function _HeadFiles(props: BaseProps) {
    const { className } = props
    return <div className={classNames(className, "files_head")}>
        <img className="logo" src="/images/logo_22x.png" />
    </div>
}

export const HeadFiles = styled(_HeadFiles)`
    &.files_head {
        width: 100%;
        height: 68px;
        background-color: black;
        .logo {
            display: inline-block;
            height: 26px;
            width: auto;
            margin-top: 21px;
            margin-left: 28px;
        }
    }
`