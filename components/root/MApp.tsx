'use client'

// @ts-ignore
import { usePathname } from "@/lib/usePathname";
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import Head from "next/head";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { initReactI18next } from "react-i18next";
import { Dimmer, Loader } from "semantic-ui-react";
import { base } from "viem/chains";
import { AppProvider, AppType, useApp } from "../../lib/AppContext";
import { initAlert } from "../../lib/initAlert";
import { initApi } from "../../lib/initApi";
import { initAppStore } from "../../lib/initAppStore";
import { initReCaptcha } from "../../lib/initGoogleReCaptcha";
import { initLoading } from "../../lib/initLoading";
import { useLoadNickname } from "../../lib/useNickname";
import AlertMessage from "../AlertMessage";
import { ReCaptcha } from "../comom/ReCaptcha";
import Layout, { siteTitle } from "../layout";
import Redirect from "../Redirect";
import { BasePropsWithChildren } from "../types";
import { WrapLoginUserProvier } from "../WrapLoginUserProvider";

function useInitI18n() {
  const [init, setInit] = useState(false);
  useEffect(() => {
    i18next
      .use(new I18NextHttpBackend())
      // .use(I18nextBrowserLanguageDetector)
      .use(initReactI18next)
      .init(
        {
          backend: {
            loadPath: "/locales/{{lng}}.json",
          },
          lng: "en",
          fallbackLng: "en",
          interpolation: {
            escapeValue: false,
          },
        },
        () => {
          setInit(true);
        }
      );
  }, []);
  return init;
}

function MAppProvider(props: BasePropsWithChildren) {
  const alert = initAlert();
  const api = initApi();
  const loading = initLoading();
  const store = initAppStore();
  const recaptcha = initReCaptcha();
  const appType = useMemo<AppType>(() => ({ alert, api, loading, store, recaptcha }), [alert, api, loading, store, recaptcha]);
  return <AppProvider value={appType}>{props.children}</AppProvider>;
}

function MAppLoading(p: { show?: boolean; msg?: string }) {
  const { loading } = useApp();
  const active = p.show || loading.isLoading;
  const msg = p.show ? p.msg || "Loading" : loading.msg;
  return (
    <Dimmer active={active} inverted style={{ position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh" }}>
      <Loader size="large" inverted content={msg} />
    </Dimmer>
  );
}

function SkipLoginPage({ children }: PropsWithChildren) {
  return (
    <MAppProvider>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout>
        {children}
        <MAppLoading />
      </Layout>
      <AlertMessage />
    </MAppProvider>
  );
}

function LoadNickname() {
  useLoadNickname();
  return null;
}
function DefAppPage({ children }: PropsWithChildren) {
  return (
    <MiniKitProvider chain={base} apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}>
      <WrapLoginUserProvier>
        {({ user }) => <> <LoadNickname />
          <MAppProvider>
            <Head>
              <title>{siteTitle}</title>
            </Head>
            <Layout>
              {!user.isLoad && (
                <Redirect>
                  {children}
                  {/* <GetNickname /> */}
                </Redirect>
              )}
              <MAppLoading show={user.isLoad} />
              <ReCaptcha />
            </Layout>
            <AlertMessage />
          </MAppProvider></>}

      </WrapLoginUserProvier>
    </MiniKitProvider>
  );
}
const SKIP_Login = ["/share", "/invite_bonus_guide", "/rewards_history"];

export default function MApp({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const skipLoginPage = useMemo(() => SKIP_Login.includes(pathname), [pathname]);
  const init = useInitI18n();
  if (!init) return <div />;
  if (skipLoginPage) return <SkipLoginPage >{children}</SkipLoginPage>;
  return <DefAppPage>{children}</DefAppPage>;
}
