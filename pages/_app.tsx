import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
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
  return <MApp Component={Component} {...props} />
}
