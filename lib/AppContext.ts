import React from "react";
import {WrapAlert} from "./initAlert";
import {ApiPromise} from "@polkadot/api";

export interface AppType {
  alert: WrapAlert
  api?: ApiPromise
}

export const AppContext = React.createContext<AppType>(null)
export const AppProvider = AppContext.Provider
