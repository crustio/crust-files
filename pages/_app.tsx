import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from "next/head";
import React from "react";
import MApp from '../components/root/MApp';
import MDocs from '../components/root/MDocs';
import '@decooio/crust-fonts/style.css';
import 'semantic-ui-css/semantic.min.css';
import '../styles/global.css';


export default function App({ Component, ...props }: AppProps) {
  const r = useRouter()
  if (r.pathname.startsWith('/docs')) {
    return <MDocs Component={Component} {...props} />
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CommunityCrust" />
        <meta name="twitter:creator" content="@CommunityCrust" />
        <meta name="twitter:title" content="Crust Files" />
        <meta name="twitter:description" content="Your first personal Web3.0 storage in Metaverse, now with $50,000,000 User Rewards!" />
        <meta name="twitter:image" content="https://gw.crustapps.net/ipfs/QmXFmy9kbfHJbac5bqGL5paEdXcwFuvHzzFQb1Lem7ZLCD?filename=Crust%20Files.png" />
      </Head>
      <MApp Component={Component} {...props} />
    </>
  )
}
