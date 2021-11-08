import React from "react";
import styled from "styled-components";

export interface Props {
  className?: string,
  src?: string
}

function Logo(props: Props) {
  const {src = '/images/logo_22x.png', className} = props;
  return <div className={className}>
    <img src={src}/>
  </div>
}

export default React.memo<Props>(styled(Logo)`
  display: inline-block;

  img {
    display: inline-block;
    height: 2.5rem;
    width: auto;
    object-fit: contain;
  }

  span {
    font-size: 2.45rem;
    font-weight: 400;
    line-height: 2.45rem;
    color: white;
    display: inline-block;
  }
`)

