import i18next from "i18next";
// import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import I18NextHttpBackend from "i18next-http-backend";
import { AppProps } from 'next/app';
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { initReactI18next } from "react-i18next";
import { Dimmer, Loader } from "semantic-ui-react";
import { AppProvider, AppType, useApp } from '../../lib/AppContext';
import { initAlert } from "../../lib/initAlert";
import { initApi } from "../../lib/initApi";
import { initLoading } from "../../lib/initLoading";
import { ContextWrapLoginUser, useLoginUser } from "../../lib/wallet/hooks";
import AlertMessage from "../AlertMessage";
import { GetNickname } from '../GetNickname';
import Layout, { siteTitle } from "../layout";
import Redirect from "../Redirect";
import { BasePropsWithChildren } from "../types";


function initI18n() {
  const [init, setInit] = useState(false)
  useEffect(() => {
    i18next.use(new I18NextHttpBackend())
      // .use(I18nextBrowserLanguageDetector)
      .use(initReactI18next)
      .init({
        backend: {
          loadPath: '/locales/{{lng}}.json'
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      }, () => {
        setInit(true)
      })
  }, [])
  return init;
}

function MAppProvider(props: BasePropsWithChildren) {
  const alert = initAlert()
  const api = initApi()
  const loading = initLoading()
  const appType = useMemo<AppType>(() => ({ alert, api, loading }), [alert, api, loading])
  return <AppProvider value={appType}>
    {props.children}
  </AppProvider>
}

function MAppLoading() {
  const { loading } = useApp()
  return <Dimmer active={loading.isLoading} inverted>
    <Loader size='large' inverted content="Loading" />
  </Dimmer>
}



function SkipLoginPage({ Component, pageProps }: AppProps) {
  return <MAppProvider >
    <Head>
      <title>{siteTitle}</title>
    </Head>
    <Layout>
      <Redirect>
        <Component {...pageProps} />
      </Redirect>
      <GetNickname />
      <MAppLoading />
    </Layout>
    <AlertMessage />
  </MAppProvider>
}

function DefAppPage({ Component, pageProps }: AppProps) {
  const wUser = useLoginUser()
  const showPage = !wUser.isLoad
  return <ContextWrapLoginUser.Provider value={wUser}>
    <MAppProvider >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout>
        {
          showPage && <Redirect>
            <Component {...pageProps} />
            <GetNickname />
          </Redirect>
        }
        <MAppLoading />
      </Layout>
      <AlertMessage />
    </MAppProvider>
  </ContextWrapLoginUser.Provider>
}

const SKIP_Login = [
  '/files/receive'
]

export default function MApp(props: AppProps) {
  const { pathname } = useRouter()
  const skipLoginPage = useMemo(() => SKIP_Login.includes(pathname), [pathname])
  const init = initI18n()
  if (!init) return <div />
  if (skipLoginPage) return <SkipLoginPage {...props} />
  return <DefAppPage {...props} />
}
