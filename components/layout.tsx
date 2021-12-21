import Head from 'next/head'
import React from "react";
import styled from "styled-components";

export const siteTitle = 'Crust Files'

function Layout({
  children,
  className,
}: {
  children: React.ReactNode,
  className?: string,
}) {
  return (
    <div className={className}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Crust Files, the Web3.0 file storage application"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      {children}
    </div>
  )
}

export default React.memo(styled(Layout)`
  width: 100%;
  min-height: 100vh;
`)
