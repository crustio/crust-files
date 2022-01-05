import React from "react";
import { BaseProps } from "./types";
import styled from 'styled-components'
import { Dropdown } from "semantic-ui-react";
import classNames from "classnames";

export interface Props extends BaseProps {
  onClickUpFile: () => void,
  onClickUpFolder?: () => void,
  disabled?: boolean
}
function btnUpload(props: Props) {
  const {
    className,
    onClickUpFile,
    onClickUpFolder,
    disabled,
  } = props
  if (!onClickUpFolder) {
    return <div className={classNames("btn-upload", { disabled }, className)} onClick={onClickUpFile}>Upload</div>
  }
  return <Dropdown
    className={classNames(className, { disabled })}
    pointing={"top"}
    icon={null}
    basic
    text={"Upload"}>
    <Dropdown.Menu>
      <Dropdown.Item text={'File'} icon={<span className="icon cru-fo-file" />} onClick={onClickUpFile} />
      <Dropdown.Item text={'Folder'} icon={<span className="icon cru-fo-folder" />} onClick={onClickUpFolder} />
    </Dropdown.Menu>
  </Dropdown>
}
export const BtnUpload = React.memo<Props>(styled(btnUpload)`
 &.btn-upload, &.ui.dropdown>.text.divider {
    padding: 0 4.285714rem;
    font-family: OpenSans-Medium;
    font-size: 2.571429rem;
    line-height: 6.428571rem;
    cursor: pointer;
    border: 2px solid #000000;
    box-sizing: border-box;
    border-radius: 1.714286rem;
 }
 &.disabled {
    background: #EEEEEE;
    border: unset !important;
    color: #AAAAAA;
    cursor: not-allowed;
 }
 &.ui.dropdown {
    .cru-fo {
      font-size: 1.3rem;
      margin-left: 1.1rem;
    }

    /* .text.divider {
        padding: 0 4.285714rem;
        font-family: OpenSans-Medium;
        font-size: 2.571429rem;
        line-height: 6.428571rem;
        cursor: pointer;
        border: 2px solid #000000;
        box-sizing: border-box;
        border-radius: 1.714286rem;
    } */

    .menu::after {
      display: none;
    }

    .menu {
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0 0.57rem 1.43rem 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #EEEEEE;
      border-radius: 0.86rem;
      padding: 0.57rem;
      .icon {
          margin-left: 1.144286rem;
          margin-right: 1.714286rem;
      }
      .item {
        padding: 0.78rem 0.57rem !important;
        border-radius: 0.57rem;
        font-size: 1.285714rem;
        
        &:active {
          background-color: #EEEEEE;
        }
      }
    }
  }
`)