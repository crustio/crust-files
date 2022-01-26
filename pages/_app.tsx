import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import Head from "next/head";
import React from "react";
import MApp from '../components/root/MApp';
import MDocs from '../components/root/MDocs';
import '@decooio/crust-fonts/style.css';
import 'semantic-ui-css/semantic.min.css';
import '../styles/global.css';


export default function App({ Component, ...props }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-NPZMBPN' });
  }, []);

  const r = useRouter()
  if (r.pathname.startsWith('/docs')) {
    return <MDocs Component={Component} {...props} />
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrustNetwork" />
        <meta name="twitter:creator" content="@CrustNetwork" />
        <meta name="twitter:title" content="Crust Files" />
        <meta name="twitter:description" content="Click to see what I am sharing on Crust Files - the personal Web3.0 storage application." />
        <meta name="twitter:image" content="https://gw.crustapps.net/ipfs/QmfPTVDtSGuCp2mftrZdQE4Mf5FeYT1gYTiL9xTXoSEgqz?filename=Crust%20Files.png" />

        {/* Global site tag (gtag.js) - Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=UA-216468629-1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-216468629-1');
          `}
        </Script>
      </Head>
      <MApp Component={Component} {...props} />
    </>
  )
}
