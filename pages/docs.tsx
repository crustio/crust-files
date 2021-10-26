import React from "react";
import styled from "styled-components";
import SideLayout from "../components/SideLayout";
import {Segment} from "semantic-ui-react";
import User from "../components/User";

export interface Props {
  className?: string
}

function Docs(props: Props) {
  const {className} = props
  return <SideLayout path={'/docs'}>
    <Segment basic className={className}>
      <User/>

    </Segment>
  </SideLayout>
}

export default React.memo<Props>(styled(Docs)`
  padding: unset !important;
`)
