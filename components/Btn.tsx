import React from "react";
import {Button, ButtonProps} from "semantic-ui-react";
import styled from "styled-components";

export type Props = ButtonProps

function Btn(props: Props) {
  return <Button {...props}/>
}

export default React.memo<Props>(styled(Btn)`
  background: unset !important;
  border: 1px solid var(--primary-color) !important;
  color: var(--primary-color) !important;
  font-weight: normal !important;
  border-radius: 10px !important;
  &:disabled{
    cursor: not-allowed !important;
  }
  &:hover {
    background: var(--primary-color) !important;
    color: white !important;
  }
`)
