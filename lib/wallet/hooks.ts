import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import store from "store";
import { Member } from "../http/types";
import { formatToCrustAccount } from "../utils";
import { useWeb3Auth } from "../web3auth/web3auth";
import { AptosMartian } from "./AptosMartian";
import { AptosPetra } from "./AptosPetra";
import { Crust } from "./Crust";
import { Elrond } from "./Elrond";
import { FlowM } from "./Flow";
import { Metamask } from "./Metamask";
import { MetaX } from "./MetaX";
import { MWalletConnect } from "./MWalletConnect";
import { NearM } from "./Near";
import { PolkadotJs } from "./PolkadotJs";
import { SolanaM } from "./SolanaM";
import { SubWallet } from "./SubWallet";
import { Talisman } from "./Talisman";
import { BaseWallet, SaveFile } from "./types";
import { Web3AuthWallet } from "./Web3AuthWallet";

// eslint-disable-next-line
const fcl = require("@onflow/fcl");

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

type KEYS = "files:login" | "pins:login";

export class LoginUser {
  account = "";
  pubKey?: string;
  wallet:
    | "crust"
    | "polkadot-js"
    | "metamask"
    | "metax"
    | "near"
    | "flow"
    | "solana"
    | "elrond"
    | "wallet-connect"
    | "aptos-martian"
    | "aptos-petra"
    | "web3auth"
    | "subWallet"
    | "talisman";
  key?: KEYS = "files:login";
  authBasic?: string;
  authBearer?: string;
  signature?: string;
  profileImage?: string;
}

export const WalletName: { [k in LoginUser["wallet"]]: string } = {
  crust: "Crust Wallet",
  metamask: "MetaMask",
  // "metamask-Polygon": "MetaMask",
  // "metamask-Moonriver": "MetaMask",
  // "metamask-BSC": "MetaMask",
  // "metamask-HECO": "MetaMask",
  // "metamask-Cubechain": "MetaMask",
  metax: "MetaX",
  "polkadot-js": "Polkadot Extension",
  near: "Near Wallet",
  elrond: "Elrond(Maiar Wallet)",
  flow: "Flow Wallet",
  solana: "Solana(Phantom Wallet)",
  "wallet-connect": "WalletConnect",
  "aptos-martian": "Aptos Martian",
  "aptos-petra": "Aptos",
  web3auth: "Web3Auth",
  subWallet: "subWallet",
  talisman: "talisman",
};

const NEED_REMEMBER_WALLET: LoginUser["wallet"][] = ["crust", "polkadot-js"];

export function lastUser(wallet: LoginUser["wallet"], key: KEYS = "files:login"): LoginUser | undefined {
  return store.get(`${key}:${wallet}:last`) as LoginUser;
}

export function saveLastUser(wallet: LoginUser["wallet"], data: LoginUser, key: KEYS = "files:login") {
  store.set(`${key}:${wallet}:last`, data);
}

export interface WrapLoginUser extends LoginUser {
  nickName?: string;
  setNickName: Dispatch<SetStateAction<string>>;
  member?: Member;
  setMember: Dispatch<SetStateAction<Member>>;
  isLoad: boolean;
  accounts?: string[];
  setLoginUser: (u: LoginUser) => void;
  logout: () => void;
  sign?: (data: string, account?: string) => Promise<string>;
  useWallet?: BaseWallet;
  crust: Crust;
  polkadotJs: PolkadotJs;
  metamask: Metamask;
  metax: MetaX;
  near: NearM;
  flow: FlowM;
  solana: SolanaM;
  elrond: Elrond;
  subWallet: SubWallet;
  talisman: Talisman;
  walletConnect: MWalletConnect;
  aptosMartian: AptosMartian;
  aptosPetra: AptosPetra;
  web3AuthWallet: Web3AuthWallet;
  authBasic?: string;
  authBearer?: string;
  signature?: string;
  profileImage?: string;
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
  },[wUser]);
  return state;
}

const defLoginUser: LoginUser = { account: "", wallet: "crust", key: "files:login", authBasic: null, authBearer: null };

const WALLETMAP: { [k in LoginUser["wallet"]]: BaseWallet } = {
  crust: new Crust(),
  "polkadot-js": new PolkadotJs(),
  subWallet: new SubWallet(),
  talisman: new Talisman(),
  metamask: new Metamask(),
  metax: new MetaX(),
  near: new NearM(),
  flow: new FlowM(),
  solana: new SolanaM(),
  elrond: new Elrond(),
  "aptos-martian": new AptosMartian(),
  "aptos-petra": new AptosPetra(),
  "wallet-connect": new MWalletConnect(),
  web3auth: new Web3AuthWallet(),
};

export function useLoginUser(key: KEYS = "files:login"): WrapLoginUser {
  const { logout: logoutWeb3Auth } = useWeb3Auth();

  const [account, setAccount] = useState<LoginUser>(defLoginUser);
  const [accounts, setAccounts] = useState<WrapLoginUser["accounts"]>();
  const [nickName, setNickName] = useState("");
  const [member, setMember] = useState<Member>();

  const [isLoad, setIsLoad] = useState(true);
  const r = useRouter();

  const setLoginUser = useCallback(
    (loginUser: LoginUser) => {
      const nAccount = { ...loginUser, key };
      console.info('nAccount:', nAccount)
      setAccount((old) => {
        if (old.wallet === "near") {
          // eslint-disable-next-line
          (WALLETMAP["near"] as NearM).wallet?.signOut();
        }
        return nAccount;
      });
      store.set(key, nAccount);
      if (NEED_REMEMBER_WALLET.includes(nAccount.wallet) && nAccount.account) {
        saveLastUser(nAccount.wallet, nAccount);
      }
    },
    [key]
  );

  useEffect(() => {
    const metamask = WALLETMAP["metamask"] as Metamask;
    metamask.onAccountChange = (data) => {
      console.info("accountsChange::", data, account);
      if (!account.wallet.startsWith("metamask")) return;
      setLoginUser(defLoginUser);
    };
    metamask.onChainChange = (chainId) => {
      if (!account.wallet.startsWith("metamask")) return;
      setLoginUser({ ...account });
    };
  }, [account]);

  useEffect(() => {
    const metax = WALLETMAP["metax"] as MetaX;
    metax.onAccountChange = (data) => {
      console.info("accountsChange::", data, account);
      if (account.wallet !== "metax") return;
      const accounts = data;
      if (accounts.length !== 0) {
        setLoginUser({
          account: accounts[0],
          wallet: account.wallet,
        });
      } else {
        setLoginUser(defLoginUser);
      }
    };
  }, [setLoginUser, account]);

  useEffect(() => {
    const walletConnect = WALLETMAP["wallet-connect"] as MWalletConnect;
    walletConnect.onAccountChanged = (data) => {
      if (account.wallet !== "wallet-connect") return;
      if (data.length) {
        console.info("wallet-connet:changed:", data);
        setLoginUser({
          account: data[0],
          wallet: account.wallet,
        });
      } else {
        setLoginUser(defLoginUser);
      }
    };
    walletConnect.onDisconnect = () => {
      if (account.wallet !== "wallet-connect") return;
      setLoginUser(defLoginUser);
    };
  }, [setLoginUser, account]);

  useEffect(() => {
    try {
      const f = store.get(key, defLoginUser) as LoginUser;

      setAccounts(undefined);

      if (f === defLoginUser || f.account === "" || !f.authBasic) {
        setIsLoad(false);
        return;
      }
      const w = WALLETMAP[f.wallet];
      if (f.wallet === "crust") {
        const crust = w as Crust;
        f.account = formatToCrustAccount(f.account);
        crust
          .init()
          .then(() => crust.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts);
              setAccount(f);
            }
          })
          .then(() => setIsLoad(false));
      } else if (f.wallet === "polkadot-js") {
        const polkadotJs = w as PolkadotJs;
        polkadotJs
          .init()
          .then(() => polkadotJs.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts);
              setAccount(f);
            }
          })
          .then(() => setIsLoad(false));
      } else if (f.wallet === "subWallet") {
        const subWallet = w as SubWallet;
        subWallet
          .init()
          .then(() => subWallet.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts);
              setAccount(f);
            }
          })
          .then(() => setIsLoad(false));
      } else if (f.wallet.startsWith("metamask")) {
        const metamask = w as Metamask;
        metamask
          .init()
          .then(() => {
            console.info("doInit::", metamask);
            if (metamask.isAllowed && metamask.accounts.length) {
              setAccount({
                account: metamask.accounts[0],
                wallet: 'metamask',
                authBasic: f.authBasic,
                authBearer: f.authBearer,
              });
            }
          })
          .then(() => setIsLoad(false));
      } else if (f.wallet === "metax") {
        const metax = w as MetaX;
        metax
          .init()
          .then(() => {
            console.info("doInit::", metax);
            if (metax.isAllowed && metax.accounts.length) {
              setAccount({
                account: metax.accounts[0],
                wallet: f.wallet,
                authBasic: f.authBasic,
                authBearer: f.authBearer,
              });
            }
          })
          .then(() => setIsLoad(false));
      } else if (f.wallet === "near") {
        const near = w as NearM;
        near
          .init()
          .then(() => {
            if (near.wallet && near.wallet.isSignedIn() && near.keyPair) {
              setAccount(f);
            }
          })
          .then(() => setIsLoad(false));
      } else if (f.wallet === "talisman") {
        const talisman = w as Talisman;
        talisman
          .init()
          .then(() => talisman.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts);
              setAccount(f);
            }
          })
          .then(() => setIsLoad(false));
      } else if (
        ["solana", "flow", "elrond", "wallet-connect", "aptos-martian", "aptos-petra", "web3auth", "talisman"].includes(
          f.wallet
        )
      ) {
        w.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false));
      } else {
        setIsLoad(false);
      }
    } catch (e) {
      setIsLoad(false);
      console.error(e);
    }
  }, [key, r]);

  const logout = useCallback(async () => {
    if (account.wallet === "flow") {
      // eslint-disable-next-line
      const flowUser = await fcl.currentUser().snapshot();
      // eslint-disable-next-line
      if (flowUser.loggedIn) {
        // eslint-disable-next-line
        await fcl.unauthenticate();
      }
    } else if (account.wallet === "solana") {
      const solana = WALLETMAP["solana"] as SolanaM;
      if (solana.solana && solana.solana?.isConnected) {
        solana.solana.disconnect();
      }
    } else if (account.wallet === "wallet-connect") {
      const walletConnect = WALLETMAP["wallet-connect"] as MWalletConnect;
      await walletConnect.connect?.killSession();
    } else if (account.wallet === "aptos-martian") {
      const aptosMartian = WALLETMAP["aptos-martian"] as AptosMartian;
      if (aptosMartian.provider) {
        aptosMartian.provider
          .disconnect()
          .then()
          .catch();
      }
    } else if (account.wallet === "aptos-petra") {
      const aptosPetra = WALLETMAP["aptos-petra"] as AptosPetra;
      if (aptosPetra.provider) {
        aptosPetra.provider
          .disconnect()
          .then()
          .catch();
      }
    } else if (account.wallet === "web3auth") {
      logoutWeb3Auth()
        .then()
        .catch();
    }

    setLoginUser({ ...defLoginUser });
  }, [setLoginUser, account]);

  const wUser: WrapLoginUser = useMemo(() => {
    const wrapLoginUser: WrapLoginUser = {
      ...account,
      accounts,
      key,
      isLoad,
      setLoginUser,
      logout,
      useWallet: WALLETMAP[account.wallet],
      crust: WALLETMAP['crust'] as any,
      polkadotJs: WALLETMAP['polkadot-js'] as any,
      subWallet: WALLETMAP['subWallet'] as any,
      metamask: WALLETMAP['metamask'] as any,
      metax: WALLETMAP['metax'] as any,
      near: WALLETMAP['near'] as any,
      flow: WALLETMAP['flow'] as any,
      solana: WALLETMAP['solana'] as any,
      elrond: WALLETMAP['elrond'] as any,
      aptosMartian: WALLETMAP['aptos-martian'] as any,
      aptosPetra: WALLETMAP['aptos-petra'] as any,
      web3AuthWallet: WALLETMAP['web3auth'] as any,
      walletConnect: WALLETMAP['wallet-connect'] as any,
      talisman: WALLETMAP['talisman'] as any,
      nickName,
      setNickName,
      setMember,
      member,
    };
    return wrapLoginUser;
  }, [account, accounts, isLoad, setLoginUser, logout, nickName, member, key]);
  const uSign = useSign(wUser);
  wUser.sign = uSign.sign;
  return wUser;
}

export const ContextWrapLoginUser = React.createContext<WrapLoginUser>(null);

export function useContextWrapLoginUser(): WrapLoginUser {
  return useContext(ContextWrapLoginUser);
}

export const getPerfix = (user: LoginUser): string => {
  if (
    user.wallet.startsWith("metamask") ||
    user.wallet === "metax" ||
    user.wallet === "wallet-connect" ||
    user.wallet === "web3auth"
  ) {
    return "eth";
  }

  if (user.wallet === "near") {
    return "near";
  }

  if (user.wallet === "flow") {
    return "flow";
  }

  if (user.wallet === "solana") {
    return "sol";
  }

  if (user.wallet === "elrond") {
    return "elrond";
  }

  if (user.wallet == "aptos-martian") {
    return "aptos";
  }

  if (user.wallet == "aptos-petra") {
    return "aptos";
  }

  return "substrate";
};
