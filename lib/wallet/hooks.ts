import { Web3Auth } from "@web3auth/modal";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import store from 'store';
import { Member } from '../http/types';
import { formatToCrustAccount } from "../utils";
import { useWeb3Auth } from "../web3auth/web3auth";
import { AptosMartian } from "./AptosMartian";
import { AptosPetra } from "./AptosPetra";
import { Crust } from './Crust';
import { Elrond } from "./Elrond";
import { FlowM } from './Flow';
import { Metamask } from './Metamask';
import { MetaX } from "./MetaX";
import { MWalletConnect } from "./MWalletConnect";
import { NearM } from './Near';
import { PolkadotJs } from "./PolkadotJs";
import { SolanaM } from './SolanaM';
import { SubWallet } from "./SubWallet";
import { SaveFile } from './types';
import { Web3AuthWallet } from "./Web3AuthWallet";

// eslint-disable-next-line
const fcl = require('@onflow/fcl');

export interface Files {
  files: SaveFile[],
  isLoad: boolean,
}

type KEYS_FILES = 'files' | 'pins:files'

export interface WrapFiles extends Files {
  setFiles: (files: SaveFile[]) => void,
  deleteItem: (f: SaveFile) => void,
  key: KEYS_FILES,
}

export interface UseSign {
  sign?: (data: string, password?: string) => Promise<string>
}

type KEYS = 'files:login' | 'pins:login'

export class LoginUser {
  account = '';
  pubKey?: string;
  wallet: 'crust' | 'polkadot-js' | 'metamask' | 'metamask-Moonriver' | 'metamask-Polygon' | 'metamask-BSC' | 'metamask-HECO' | 'metamask-Cubechain' | 'metax' |
    'near' | 'flow' | 'solana' | 'elrond' | 'wallet-connect' | 'aptos-martian' | 'aptos-petra' | 'web3auth' | 'subWallet';
  key?: KEYS = 'files:login';
  authBasic?: string;
  authBearer?: string;
  signature?: string;
  profileImage?: string;
}

export const WalletName: { [k in LoginUser['wallet']]: string } = {
  "crust": 'Crust Wallet',
  "metamask": 'MetaMask',
  "metamask-Polygon": "MetaMask",
  "metamask-Moonriver": "MetaMask",
  "metamask-BSC": "MetaMask",
  "metamask-HECO": "MetaMask",
  "metamask-Cubechain": "MetaMask",
  "metax": "MetaX",
  "polkadot-js": "Polkadot Extension",
  "near": "Near Wallet",
  "elrond": "Elrond(Maiar Wallet)",
  "flow": "Flow Wallet",
  "solana": "Solana(Phantom Wallet)",
  "wallet-connect": "WalletConnect",
  "aptos-martian": "Aptos Martian",
  "aptos-petra": "Aptos",
  "web3auth": "Web3Auth",
  "subWallet": "subWallet"
}


const NEED_REMEMBER_WALLET: LoginUser['wallet'][] = [
  'crust',
  'polkadot-js'
]

export function lastUser(wallet: LoginUser['wallet'], key: KEYS = 'files:login'): LoginUser | undefined {
  return store.get(`${key}:${wallet}:last`) as LoginUser
}

export function saveLastUser(wallet: LoginUser['wallet'], data: LoginUser, key: KEYS = 'files:login') {
  store.set(`${key}:${wallet}:last`, data)
}


export interface WrapLoginUser extends LoginUser {
  nickName?: string;
  setNickName: Dispatch<SetStateAction<string>>;
  member?: Member;
  setMember: Dispatch<SetStateAction<Member>>
  isLoad: boolean
  accounts?: string[]
  setLoginUser: (u: LoginUser) => void
  logout: () => void
  sign?: (data: string, account?: string) => Promise<string>
  crust: Crust,
  polkadotJs: PolkadotJs,
  metamask: Metamask,
  metax: MetaX,
  near: NearM,
  flow: FlowM,
  solana: SolanaM,
  elrond: Elrond,
  subWallet: SubWallet,
  walletConnect: MWalletConnect,
  aptosMartian: AptosMartian,
  aptosPetra: AptosPetra,
  web3AuthWallet: Web3AuthWallet,
  authBasic?: string;
  authBearer?: string;
  signature?: string;
  profileImage?: string;
}

const defFilesObj: Files = { files: [], isLoad: true };

const initPinTime = (fileObj: Files) => {
  fileObj.files.forEach((file) => {
    if (!file.PinTime) file.PinTime = new Date().getTime()
  })
}

export function useFiles(key: KEYS_FILES = 'files'): WrapFiles {
  const [filesObj, setFilesObj] = useState<Files>(defFilesObj);

  useEffect(() => {
    try {
      const f = store.get(key, defFilesObj) as Files;

      f.isLoad = false;

      if (f !== defFilesObj) {
        // init file.PinTime
        initPinTime(f)
        setFilesObj(f);
      }
    } catch (e) {
      console.error(e);
    }
  }, [key]);
  const setFiles = useCallback((nFiles: SaveFile[]) => {
    const nFilesObj = { ...filesObj, files: nFiles };
    // init file.PinTime
    initPinTime(nFilesObj)
    setFilesObj(nFilesObj);
    store.set(key, nFilesObj);
  }, [filesObj, key]);

  const deleteItem = useCallback((f: SaveFile) => {
    if (f.Hash) {
      setFiles(filesObj.files.filter(file => file.Hash !== f.Hash))
    }
  }, [filesObj, setFiles])

  return useMemo(() => ({ ...filesObj, setFiles, deleteItem, key }), [filesObj, setFiles, deleteItem, key]);
}

export function useSign(wUser: WrapLoginUser): UseSign {
  const [state, setState] = useState<UseSign>({});

  useEffect(() => {
    if (!wUser.account) return;
    if (wUser.wallet === 'near') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.near.sign(data)
        }
      }))
    }

    if (wUser.wallet === 'flow') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.flow.sign(data)
        }
      }))
    }

    if (wUser.wallet === 'solana') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.solana.sign(data)
        }
      }))
    }

    if (wUser.wallet.startsWith('metamask')) {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.metamask.sign(data, wUser.account)
        }
      }))
    }

    if (wUser.wallet === 'metax') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.metax.sign(data, wUser.account)
        }
      }))
    }

    if (wUser.wallet === 'crust') {
      setState((o) => ({
        ...o, sign: async (data, account) => {
          return wUser.crust.sign(data, account)
        }
      }))
    }
    if (wUser.wallet === 'polkadot-js') {
      setState((o) => ({
        ...o, sign: async (data, account) => {
          return wUser.polkadotJs.sign(data, account)
        }
      }))
    }
    if (wUser.wallet === 'elrond') {
      setState((o) => ({
        ...o, sign: async () => {
          return wUser.elrond.sign()
        }
      }))
    }
    if (wUser.wallet === 'wallet-connect') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.walletConnect.sign(data, wUser.account)
        }
      }))
    }
    if (wUser.wallet === 'aptos-martian') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.aptosMartian.sign(data)
        }
      }))
    }
    if (wUser.wallet === 'aptos-petra') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.aptosPetra.sign(data)
        }
      }))
    }
    if (wUser.wallet === 'web3auth') {
      setState((o) => ({
        ...o, sign: async (data) => {
          return wUser.web3AuthWallet.sign(data)
        }
      }))
    }
    if (wUser.wallet === 'subWallet') {
      setState((o) => ({
        ...o, sign: async (data, account) => {
          return wUser.subWallet.sign(data, account)
        }
      }))
    }
  }, [wUser]);

  return state;
}

const defLoginUser: LoginUser = { account: '', wallet: 'crust', key: 'files:login', authBasic: null, authBearer: null };

export function useLoginUser(key: KEYS = 'files:login'): WrapLoginUser {
  const { logout: logoutWeb3Auth } = useWeb3Auth();

  const [account, setAccount] = useState<LoginUser>(defLoginUser);
  const [accounts, setAccounts] = useState<WrapLoginUser['accounts']>()
  const [nickName, setNickName] = useState('')
  const [member, setMember] = useState<Member>()

  const [isLoad, setIsLoad] = useState(true);
  const crust = useMemo(() => new Crust(), [])
  const polkadotJs = useMemo(() => new PolkadotJs(), [])
  const subWallet = useMemo(() => new SubWallet(), [])
  const metamask = useMemo(() => new Metamask(), []);
  const metax = useMemo(() => new MetaX(), []);
  const near = useMemo(() => new NearM(), []);
  const flow = useMemo(() => new FlowM(), []);
  const solana = useMemo(() => new SolanaM(), []);
  const elrond = useMemo(() => new Elrond(), []);
  const aptosMartian = useMemo(() => new AptosMartian(), []);
  const aptosPetra = useMemo(() => new AptosPetra(), []);
  const walletConnect = useMemo(() => new MWalletConnect(), []);
  const web3AuthWallet = useMemo(() => new Web3AuthWallet(), [])
  const r = useRouter()

  const setLoginUser = useCallback((loginUser: LoginUser) => {
    const nAccount = { ...loginUser, key };
    setAccount((old) => {
      if (old.wallet === 'near') {
        // eslint-disable-next-line
        near.wallet?.signOut();
      }

      return nAccount;
    });
    store.set(key, nAccount);
    if (NEED_REMEMBER_WALLET.includes(nAccount.wallet) && nAccount.account) {
      saveLastUser(nAccount.wallet, nAccount)
    }
  }, [near, key]);

  useEffect(() => {
    metamask.onAccountChange = (data) => {
      console.info('accountsChange::', data, account)
      if (!account.wallet.startsWith('metamask')) return
      const accounts = data
      if (accounts.length !== 0) {
        setLoginUser({
          account: accounts[0],
          wallet: account.wallet
        })
      } else {
        setLoginUser(defLoginUser)
      }
    }
  }, [metamask, setLoginUser, account])

  useEffect(() => {
    metax.onAccountChange = (data) => {
      console.info('accountsChange::', data, account)
      if (account.wallet !== 'metax') return
      const accounts = data
      if (accounts.length !== 0) {
        setLoginUser({
          account: accounts[0],
          wallet: account.wallet
        })
      } else {
        setLoginUser(defLoginUser)
      }
    }
  }, [metax, setLoginUser, account])

  useEffect(() => {
    walletConnect.onAccountChanged = (data) => {
      if (account.wallet !== 'wallet-connect') return
      if (data.length) {
        console.info('wallet-connet:changed:', data)
        setLoginUser({
          account: data[0],
          wallet: account.wallet
        })
      } else {
        setLoginUser(defLoginUser)
      }

    }
    walletConnect.onDisconnect = () => {
      if (account.wallet !== 'wallet-connect') return
      setLoginUser(defLoginUser)
    }
  }, [walletConnect, setLoginUser, account])

  useEffect(() => {
    try {
      const f = store.get(key, defLoginUser) as LoginUser;
      setAccounts(undefined)
      if (f === defLoginUser || f.account === '' || !f.authBasic) {
        setIsLoad(false)
        return;
      }
      if (f.wallet === 'crust') {
        f.account = formatToCrustAccount(f.account)
        crust.init().then(() => crust.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts)
              setAccount(f)
            }
          })
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'polkadot-js') {
        polkadotJs.init().then(() => polkadotJs.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts)
              setAccount(f)
            }
          })
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'subWallet') {
        subWallet.init().then(() => subWallet.getAccounts())
          .then((accounts) => {
            if (accounts.includes(f.account)) {
              setAccounts(accounts)
              setAccount(f)
            }
          })
          .then(() => setIsLoad(false))
      } else if (f.wallet.startsWith('metamask')) {
        metamask.init()
          .then(() => {
            console.info('doInit::', metamask)
            if (metamask.isAllowed && metamask.accounts.length) {
              setAccount({
                account: metamask.accounts[0],
                wallet: f.wallet,
                authBasic: f.authBasic,
                authBearer: f.authBearer
              });
            }
          })
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'metax') {
        metax.init()
          .then(() => {
            console.info('doInit::', metax)
            if (metax.isAllowed && metax.accounts.length) {
              setAccount({
                account: metax.accounts[0],
                wallet: f.wallet,
                authBasic: f.authBasic,
                authBearer: f.authBearer
              });
            }
          })
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'near') {
        near.init()
          .then(() => {
            if (near.wallet && near.wallet.isSignedIn() && near.keyPair) {
              setAccount(f)
            }
          })
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'solana') {
        solana.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'flow') {
        flow.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'elrond') {
        elrond.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'wallet-connect') {
        walletConnect.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'aptos-martian') {
        aptosMartian.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'aptos-petra') {
        aptosPetra.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else if (f.wallet === 'web3auth') {
        web3AuthWallet.init()
          .then(() => setAccount(f))
          .then(() => setIsLoad(false))
      } else {
        setIsLoad(false)
      }
    } catch (e) {
      setIsLoad(false);
      console.error(e);
    }
  }, [key, r]);

  const logout = useCallback(async () => {
    if (account.wallet === 'flow') {
      // eslint-disable-next-line
      const flowUser = await fcl.currentUser().snapshot();
      // eslint-disable-next-line
      if (flowUser.loggedIn) {
        // eslint-disable-next-line
        await fcl.unauthenticate();
      }
    } else if (account.wallet === 'solana') {
      if (solana.solana && solana.solana?.isConnected) {
        solana.solana.disconnect();
      }
    } else if (account.wallet === 'wallet-connect') {
      await walletConnect.connect?.killSession()
    } else if (account.wallet === 'aptos-martian') {
      if (aptosMartian.provider) {
        aptosMartian.provider.disconnect().then().catch()
      }
    } else if (account.wallet === 'aptos-petra') {
      if (aptosPetra.provider) {
        aptosPetra.provider.disconnect().then().catch()
      } 
    } else if (account.wallet === 'web3auth') {
      logoutWeb3Auth().then().catch()
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
      crust,
      polkadotJs,
      subWallet,
      metamask,
      metax,
      near,
      flow,
      solana,
      elrond,
      aptosMartian,
      aptosPetra,
      web3AuthWallet,
      walletConnect,
      nickName,
      setNickName,
      setMember,
      member,
    };
    return wrapLoginUser;
  }, [
    account, accounts, isLoad, setLoginUser, logout,
    crust, polkadotJs, metamask, metax, near, flow, solana,
    walletConnect, nickName, member, key, aptosMartian, aptosPetra, web3AuthWallet
  ]);
  const uSign = useSign(wUser);
  wUser.sign = uSign.sign;
  return wUser;
}

export const ContextWrapLoginUser = React.createContext<WrapLoginUser>(null)

export function useContextWrapLoginUser(): WrapLoginUser {
  return useContext(ContextWrapLoginUser)
}

export const getPerfix = (user: LoginUser): string => {
  if (user.wallet.startsWith('metamask') || user.wallet === 'metax' || user.wallet === 'wallet-connect' || user.wallet === 'web3auth') {
    return 'eth';
  }

  if (user.wallet === 'near') {
    return 'near';
  }

  if (user.wallet === 'flow') {
    return 'flow';
  }

  if (user.wallet === 'solana') {
    return 'sol';
  }

  if (user.wallet === 'elrond') {
    return 'elrond';
  }
  
  if (user.wallet == 'aptos-martian') {
    return 'aptos';
  }

  if (user.wallet == 'aptos-petra') {
    return 'aptos';
  }
 
  return 'substrate';
};
