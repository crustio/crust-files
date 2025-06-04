import _ from "lodash";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import store from "store";
import { Member } from "../http/types";
import { Algorand } from "./Algorand";
import { AptosMartian } from "./AptosMartian";
import { AptosPetra } from "./AptosPetra";
import { Crust } from "./Crust";
import { Elrond } from "./Elrond";
import { FlowM } from "./Flow";
import { MWalletConnect } from "./MWalletConnect";
import { MetaX } from "./MetaX";
import { Metamask } from "./Metamask";
import { Mimir } from "./Mimir";
import { PolkadotJs } from "./PolkadotJs";
import { SolanaM } from "./SolanaM";
import { SubWallet } from "./SubWallet";
import { Talisman } from "./Talisman";
import { TonConnect } from "./TonConnect";
import { BaseWallet, KEY_TYPE, LoginUser, SaveFile, WalletType } from "./types";
import { Coinbase } from "./Coinbase";
export interface Files {
  files: SaveFile[];
  isLoad: boolean;
}

type KEYS_FILES = "files" | "pins:files";

export interface WrapFiles extends Files {
  setFiles: (files: SaveFile[]) => void;
  deleteItem: (f: SaveFile) => void;
  key: KEYS_FILES;
}

export interface UseSign {
  sign?: (data: string, password?: string) => Promise<string>;
}

const NEED_REMEMBER_WALLET: WalletType[] = ["crust", "polkadot-js"];

export function lastUser(wallet: WalletType, key: KEY_TYPE = "files:login"): LoginUser | undefined {
  return store.get(`${key}:${wallet}:last`) as LoginUser;
}

export function saveLastUser(wallet: WalletType, data: LoginUser, key: KEY_TYPE = "files:login") {
  store.set(`${key}:${wallet}:last`, data);
}

export interface WrapLoginUser extends LoginUser {
  nickName?: string;
  setNickName: Dispatch<SetStateAction<string>>;
  isLoadingNickname?: boolean;
  setIsLoadingNickname: Dispatch<SetStateAction<boolean>>;
  member?: Member;
  setMember: Dispatch<SetStateAction<Member>>;
  isLoad: boolean;
  accounts?: string[];
  setLoginUser: (u: LoginUser) => void;
  logout: () => void;
  sign?: (data: string, account?: string) => Promise<string>;
  useWallet?: BaseWallet;
  crust: Crust;
  metamask: Metamask;
  walletConnect: MWalletConnect;
}

const defFilesObj: Files = { files: [], isLoad: true };

const initPinTime = (fileObj: Files) => {
  fileObj.files.forEach((file) => {
    if (!file.PinTime) file.PinTime = new Date().getTime();
  });
};

export function useFiles(key: KEYS_FILES = "files"): WrapFiles {
  const [filesObj, setFilesObj] = useState<Files>(defFilesObj);

  useEffect(() => {
    try {
      const f = store.get(key, defFilesObj) as Files;

      f.isLoad = false;

      if (f !== defFilesObj) {
        // init file.PinTime
        initPinTime(f);
        setFilesObj(f);
      }
    } catch (e) {
      console.error(e);
    }
  }, [key]);
  const setFiles = useCallback(
    (nFiles: SaveFile[]) => {
      const nFilesObj = { ...filesObj, files: nFiles };
      // init file.PinTime
      initPinTime(nFilesObj);
      setFilesObj(nFilesObj);
      store.set(key, nFilesObj);
    },
    [filesObj, key]
  );

  const deleteItem = useCallback(
    (f: SaveFile) => {
      if (f.Hash) {
        setFiles(filesObj.files.filter((file) => file.Hash !== f.Hash));
      }
    },
    [filesObj, setFiles]
  );

  return useMemo(() => ({ ...filesObj, setFiles, deleteItem, key }), [filesObj, setFiles, deleteItem, key]);
}

export function useSign(wUser: WrapLoginUser): UseSign {
  const [state, setState] = useState<UseSign>({});
  useEffect(() => {
    if (!wUser.account) return () => {};
    setState(() => ({
      sign: async (data) => {
        return wUser.useWallet?.sign(data, wUser.account);
      },
    }));
  }, [wUser]);
  return state;
}

const defLoginUser: LoginUser = { account: "", wallet: "crust", key: "files:login", authBasic: null, authBearer: null };

export const WALLETMAP: { [k in WalletType]: BaseWallet } = {
  crust: new Crust(),
  "polkadot-js": new PolkadotJs(),
  subWallet: new SubWallet(),
  talisman: new Talisman(),
  metamask: new Metamask(),
  coinbase: new Coinbase(),
  metax: new MetaX(),
  flow: new FlowM(),
  solana: new SolanaM(),
  algorand: new Algorand(),
  elrond: new Elrond(),
  "aptos-martian": new AptosMartian(),
  "aptos-petra": new AptosPetra(),
  "wallet-connect": new MWalletConnect(),
  oasis: new Metamask(),
  mimir: new Mimir(),
  "ton-connect": new TonConnect(),
};

export function useLoginUser(key: KEY_TYPE = "files:login"): WrapLoginUser {
  const [account, setAccount] = useState<LoginUser>(defLoginUser);
  const [accounts, setAccounts] = useState<WrapLoginUser["accounts"]>();
  const [nickName, setNickName] = useState("");
  const [member, setMember] = useState<Member>();

  const [isLoad, setIsLoad] = useState(true);
  const r = useRouter();

  const setLoginUser = useCallback(
    (loginUser: LoginUser) => {
      const nAccount = { ...loginUser, key };
      console.info("nAccount:", nAccount);
      setAccount(nAccount);
      store.set(key, nAccount);
      if (NEED_REMEMBER_WALLET.includes(nAccount.wallet) && nAccount.account) {
        saveLastUser(nAccount.wallet, nAccount);
      }
    },
    [key]
  );

  useEffect(() => {
    const wallet = WALLETMAP[account.wallet];
    wallet.onAccountChange = (data) => {
      console.info("accountsChange::", data, account);
      if (_.isEmpty(data) || !data.find(item => item == account.account)) setLoginUser(defLoginUser);
    };
    wallet.onChainChange = (chainId) => {
      setLoginUser({ ...account });
    };
  }, [account]);

  useEffect(() => {
    const initialize = async () => {
      const f = store.get(key, defLoginUser) as LoginUser;
      setAccounts(undefined);
      const mimir = WALLETMAP.mimir as Mimir;
      await mimir.init();
      if (mimir.provider) {
        const [accounts, account] = await mimir.login(f);
        setAccounts(accounts);
        setAccount(account);
        store.set(key, account);
        setIsLoad(false);
        return;
      }
      if (f === defLoginUser || f.account === "" || !f.authBasic) {
        setIsLoad(false);
        return;
      }
      const w = WALLETMAP[f.wallet];
      w.init(f)
        .then(() => {
          w.account && setAccount(f);
          setAccounts(w.accounts);
        })
        .then(() => setIsLoad(false));
    };
    initialize().catch((e) => {
      console.error(e);
      setIsLoad(false);
    });
  }, [key, r.pathname]);

  const logout = useCallback(async () => {
    WALLETMAP[account.wallet].disconnect();
    setLoginUser({ ...defLoginUser });
  }, [setLoginUser, account]);
  const [isLoadingNickname, setIsLoadingNickname] = useState();
  const wUser: WrapLoginUser = useMemo(() => {
    const wrapLoginUser: WrapLoginUser = {
      ...account,
      accounts,
      key,
      isLoad,
      setLoginUser,
      logout,
      useWallet: WALLETMAP[account.wallet],
      crust: WALLETMAP["crust"] as any,
      metamask: WALLETMAP["metamask"] as any,
      walletConnect: WALLETMAP["wallet-connect"] as any,
      nickName,
      setNickName,
      setMember,
      member,
      setIsLoadingNickname,
      isLoadingNickname,
    };
    return wrapLoginUser;
  }, [account, accounts, isLoad, setLoginUser, logout, nickName, member, key, isLoadingNickname]);
  const uSign = useSign(wUser);
  wUser.sign = uSign.sign;
  return wUser;
}

export const ContextWrapLoginUser = React.createContext<WrapLoginUser>(null);

export function useContextWrapLoginUser(): WrapLoginUser {
  return useContext(ContextWrapLoginUser);
}
