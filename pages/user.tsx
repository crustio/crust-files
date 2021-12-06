import React from "react";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";
import SideLayout from "../components/SideLayout";
import User from "../components/User";

export interface Props {
  className?: string
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void


function Index(props: Props) {
  const { className } = props
  // const { t } = useTranslation()
  // const uc = useUserCrypto()
  // const user = useContextWrapLoginUser()

  return <SideLayout path={'/user'}>
    <Segment basic className={className}>
      <User />

      <Segment basic className="mcontent">
      </Segment>
    </Segment>
  </SideLayout>
}

export default React.memo<Props>(styled(Index)`
  padding: unset !important;
  .mcontent {
    margin: unset !important;
    padding: 0 0 3rem 0 !important;
    overflow: auto;
  }
  
`)
