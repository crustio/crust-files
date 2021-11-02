import React from "react";
import styled from "styled-components";
import BgAnim from "../../components/effect/BgAnim";

export interface Props {
  className?: string
}

function Index(props: Props) {
  const {className} = props
  return <div className={className}>
    <BgAnim/>
    <div className={'flex1'}/>
    <img className={'tipIcon'} src={'/images/crust_box2x.png'}/>
    <div className={'tips'}>
      Crust Files is currently not available on mobile devices. Please visit on PC/Desktop devices. Thank you!
    </div>
    <div className={'flex1'}/>
  </div>
}


export default React.memo<Props>(styled(Index)`
  color: white;
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  .flex1 {
    flex: 1;
  }

  .tipIcon {
    width: 15.7rem;
    height: auto;
    flex-shrink: 0;
  }

  .tips {
    margin-top: 2.3rem;
    max-width: 22.3rem;
    font-size: 1.7rem;
    line-height: 2.36rem;
  }
`)
