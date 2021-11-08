import 'semantic-ui-css/semantic.min.css'
import '../styles/global.css'
import '@decooio/crust-fonts/style.css'
import {AppProps} from 'next/app'
import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import React, {useEffect, useMemo, useState} from "react";
import {Container, Dimmer, Loader} from "semantic-ui-react";
import {ContextWrapLoginUser, useLoginUser} from "../lib/wallet/hooks";
import Redirect from "../components/Redirect";
import {AppProvider, AppType} from '../lib/AppContext'
import AlertMessage from "../components/AlertMessage";
import {initAlert} from "../lib/initAlert"
import {initApi} from "../lib/initApi";
import Head from "next/head";
import Layout, {siteTitle} from "../components/layout";
import {initLoading} from "../lib/initLoading";

function initI18n() {
  const [init, setInit] = useState(false)
  useEffect(() => {
    i18next.use(new I18NextHttpBackend())
      .use(I18nextBrowserLanguageDetector)
      .use(initReactI18next)
      .init({
        backend: {
          loadPath: '/locales/{{lng}}.json'
        },
        fallbackLng: 'zh-CN',
        interpolation: {
          escapeValue: false
        }
      }, () => {
        setInit(true)
      })
  }, [])
  return init;
}

export default function App({Component, pageProps}: AppProps) {
  const wUser = useLoginUser()
  const init = initI18n()
  const alert = initAlert()
  const api = initApi()
  const loading = initLoading()
  const appType = useMemo<AppType>(() => ({alert, api, loading}), [alert, api, loading])
  if (!init || wUser.isLoad) return <Container className="hFull">
    <Dimmer active inverted>
      <Loader size='large' inverted content="Loading"/>
    </Dimmer>
  </Container>
  return <ContextWrapLoginUser.Provider value={wUser}>
    <AppProvider value={appType}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Redirect>
        <Layout>
          <Component {...pageProps} />
          <Dimmer active={loading.isLoading} inverted>
            <Loader size='large' inverted content="Loading"/>
          </Dimmer>
        </Layout>
      </Redirect>
      <AlertMessage/>
    </AppProvider>

  </ContextWrapLoginUser.Provider>


}
