import "@decooio/crust-fonts/style.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import MApp from "../components/root/MApp";
import MDocs from "../components/root/MDocs";
import "../styles/global.css";
import { useConfigDomain } from "../lib/hooks/useConfigDomain";

import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
function isDocs(pathname: string) {
  return pathname.startsWith('/docs') || ['/terms-of-service', '/privacy-policy'].includes(pathname)
}
export default function App({ Component, ...props }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useConfigDomain();
  const r = useRouter();
  // useGaPageView()
  if (!isClient) {
    return null;
  }
  if (r.pathname.startsWith('/docs')) {
    return <MDocs Component={Component} {...props} />;
  }
  if (['/terms-of-service', '/privacy-policy'].includes(r.pathname)) {
    return <MDocs Component={Component} {...props} menus={false} />;
  }
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrustNetwork" />
        <meta name="twitter:creator" content="@CrustNetwork" />
        <meta name="twitter:title" content="Crust Files" />
        <meta name="twitter:description" content="Click to see what I am sharing on Crust Files - the personal Web3.0 storage application." />
        <meta name="twitter:image" content="https://gw.crustfiles.net/ipfs/QmfPTVDtSGuCp2mftrZdQE4Mf5FeYT1gYTiL9xTXoSEgqz?filename=Crust%20Files.png" />
      </Head>
      <MApp Component={Component} {...props} />
    </ErrorBoundary>
  );
}
