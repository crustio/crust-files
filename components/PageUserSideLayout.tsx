import React, { useState } from "react";
import styled from "styled-components";
import { CenterFlex, ColFlex } from "./layout";
import SideLayout, { Props as SideProps } from "./SideLayout";
import { BasePropsWithChildren } from "./types";
import Header from "./Header";
import { useIsMobile } from "../lib/hooks/useIsMobile";
import useOnClickOutside from "../lib/hooks/useOnClickOut";
import { ScreenMobile } from "../lib/config";

export interface Props extends BasePropsWithChildren {
    path: SideProps['path']
}

function _PageUserSideLayout(props: Props) {
    const isMobile = useIsMobile()
    const [mobileShow, setShow] = useState(false)
    const show = isMobile ? mobileShow : true;
    const { path, className, children } = props
    const ref = useOnClickOutside(() => show && setShow(false))
    return <SideLayout refSider={ref} show={show} path={path} className={className}>
        <ColFlex className="full">
            <Header onClickMenu={() => setShow(!mobileShow)} />
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

    ${ScreenMobile} {
        .pusl_center_flex_content{
            max-width: unset !important;
            min-width: unset !important;
        }
    }

` as any)