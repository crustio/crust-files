import React, { useContext } from "react";
import { WrapAlert } from "./initAlert";
import { ApiPromise } from "@polkadot/api";
import { WrapLoading } from "./initLoading";
import { WrapAppStore } from "./initAppStore";
import { WrapReCaptcha } from "./initGoogleReCaptcha";

export interface AppType {
  alert: WrapAlert
  api?: ApiPromise,
  loading: WrapLoading,
  store: WrapAppStore,
  recaptcha: WrapReCaptcha,
}

export const AppContext = React.createContext<AppType>(null)
export const AppProvider = AppContext.Provider

export function useApp(): AppType {
  return useContext(AppContext)
}