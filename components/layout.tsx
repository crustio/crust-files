import Head from "next/head";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { BasePropsWithChildren } from "./types";

export function CenterFlex(p: React.HTMLProps<HTMLDivElement> = {}) {
  const { className, children, style = {}, ...other } = p;
  return (
    <div className={className} style={{ display: "flex", ...style }} {...other}>
      <div style={{ flex: 1, height: 1, width: 1 }} />
      {children as ReactNode}
      <div style={{ flex: 1, height: 1, width: 1 }} />
    </div>
  );
}

export const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

export const siteTitle = "Crust Files";

function Layout({ children, className }: BasePropsWithChildren) {
  return (
    <div className={className}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Crust Files, the Web3.0 file storage application" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      {children}
    </div>
  );
}

export default styled(Layout)`
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;
`;
