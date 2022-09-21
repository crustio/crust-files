import React from "react";
import styled from "styled-components";
import { CenterFlex, ColFlex } from "./layout";
import SideLayout, { Props as SideProps } from "./SideLayout";
import { BasePropsWithChildren } from "./types";
import User from "./User";

export interface Props extends BasePropsWithChildren {
    path: SideProps['path']
}

function _PageUserSideLayout(props: Props) {
    const { path, className, children } = props
    return <SideLayout path={path} className={className}>
        <ColFlex className="full">
            <User />
            <CenterFlex className="pusl_center_flex">
                <ColFlex className="pusl_center_flex_content">
                    {children}
                </ColFlex>
            </CenterFlex>
        </ColFlex>
    </SideLayout>
}

export default React.memo<Props>(styled(_PageUserSideLayout)`
    .pusl_center_flex {
        width: 100%;
        overflow: auto;
        flex: 1;
        position: relative;
    }
    .pusl_center_flex_content {
        flex-shrink: 0;
        max-width: 90rem;
        width: 100%;
        min-width: 70rem;
        padding: 2.29rem;
        height: max-content;
    }
`)