import React from "react";
import {WrapAlert} from "./initAlert";
import {ApiPromise} from "@polkadot/api";
import {WrapLoading} from "./initLoading";

export interface AppType {
  alert: WrapAlert
  api?: ApiPromise,
  loading: WrapLoading
}

export const AppContext = React.createContext<AppType>(null)
export const AppProvider = AppContext.Provider
