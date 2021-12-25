import React from "react";
import { BasePropsWithChildren } from "./types";
import styled from "styled-components";
import classNames from "classnames";

function _MCard(props: BasePropsWithChildren) {
  const { className, children } = props
  return <div className={classNames(className, 'mcard')}>{children}</div>
}

export const MCard = React.memo<BasePropsWithChildren>(styled(_MCard)`
    padding: 1.71rem !important;
    box-shadow: 0 0.71rem 1.71rem 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 1.14rem !important;
    border: 0.07rem solid #EEEEEE !important;
    /* margin: 2.21rem 2.29rem 0 2.39rem !important; */
    margin-top: 2.21rem;
  
    .title {
      font-size: 1.3rem !important;
      font-weight: 600;
      color: var(--main-color);
      padding-bottom: 1.14rem;
      .cru-fo {
        margin-right: 0.8rem;
      }
    }

    .text {
      font-size: 1rem;
      color: var(--secend-color);
      line-height: 1.57rem;
    }
    .icon {
      margin-left: 1rem;
      font-size: 1.428571rem;
      position: relative;
      top: 3px;
      cursor: pointer;
    }
    .bold-text {
      color: var(--main-color);
    }
    
    a {
      text-decoration: underline;
      line-height: 1.2rem;
      cursor: pointer;
    }

    .btns {
      margin-top: 1.7rem;
      button:first-child {
        margin-right: 1rem;
      }
    }
`)