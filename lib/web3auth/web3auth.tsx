import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import React, { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import ethProvider from "./ethProvider";
import { CHAIN_NAMESPACES } from "@web3auth/base";

export interface IWeb3AuthContext {
    web3Auth: Web3Auth | null;
    provider: IWalletProvider | null;
    login: () => Promise<IWalletProvider | null>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
    // signMessage: (msg: string) => Promise<any>;
    // getAccounts: () => Promise<any>;
    isLoading: boolean;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
    web3Auth: null,
    provider: null,
    login: async () => null,
    logout: async () => { },
    getUserInfo: async () => { },
    // signMessage: async () => { },
    // getAccounts: async () => { },
    isLoading: true
});

interface IWeb3AuthProps {
    children?: ReactNode;
    web3AuthNetwork: "mainnet";
}

interface IWeb3AuthState {
    web3AuthNetwork: "mainnet";
    children?: React.ReactNode;
}

export interface IWalletProvider {
    getAccounts: () => Promise<any>;
    // getBalance: () => Promise<any>;
    // signAndSendTransaction: () => Promise<void>;
    // signTransaction: () => Promise<void>;
    signMessage: (message: string) => Promise<any>;
}

export function useWeb3Auth(): IWeb3AuthContext {
    return useContext(Web3AuthContext);
}

export const Web3AuthProvider: FunctionComponent<IWeb3AuthState> = ({ children }: IWeb3AuthProps) => {
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
    const [provider, _] = useState<IWalletProvider | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // const setWalletProvider = useCallback(
    //     (web3authProvider: SafeEventEmitterProvider) => {
    //         const walletProvider = ethProvider(web3authProvider);
    //         console.log(`init provider`)
    //         setProvider(walletProvider);
    //     }, []
    // );

    useEffect(() => {
        const subscribeAuthEvents = (web3auth: Web3Auth) => {
            // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
                console.log("Yeah!, you are successfully logged in", data);
                // setWalletProvider(web3auth.provider!);
            });

            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                console.log("connecting");
            });

            web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                console.log("disconnected");
            });

            web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.error("some error or user has cancelled login request", error);
            });
        };

        async function init() {
            try {
                const clientId = "BJdVBLPZjv_tUQWzrTAtF8kydEGTVtAHz0BrTe8twICNMzY4aTlrw1gl2cP8PB6I5HCDCfTOJxfTV4QEbkm_2Gg";
                const web3AuthInstance = new Web3Auth({
                    chainConfig: {
                        displayName: "Ethereum Mainnet",
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: "0x1",
                        rpcTarget: `https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c`,
                        blockExplorer: "https://etherscan.io/",
                        ticker: "ETH",
                        tickerName: "Ethereum",
                    },
                    // get your client id from https://dashboard.web3auth.io
                    clientId,
                    uiConfig: {
                        defaultLanguage: "en"
                    }
                });
                const adapter = new OpenloginAdapter({ adapterSettings: { network: 'mainnet', clientId } });
                web3AuthInstance.configureAdapter(adapter);
                subscribeAuthEvents(web3AuthInstance);
                setWeb3Auth(web3AuthInstance);
                await web3AuthInstance.initModal();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        }
        init();
    }, []);

    const login = async () => {
        console.log(`login`)
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        try {
            // const localProvider = await web3Auth.connect();
            // setWalletProvider(localProvider!);
            // console.log(`Already logined:::`, ethProvider(localProvider!))
            return new Promise<IWalletProvider>((resolve, _) => {
                web3Auth.connect().then(localProvider => resolve(ethProvider(localProvider!))).catch(err => {
                    console.log(`connect error::`, err)
                    resolve(null)
                    // new Promise((resolve, _) => resolve(login()))
                })
            })
            // return ethProvider(localProvider!)
        } catch (error) {
            console.error("web3auth login error ", error)
        }
    };

    // const getAccounts = async () => {
    //     if (!provider) {
    //         console.log("getAccounts provider not initialized yet");
    //         return;
    //     }
    //     return await provider.getAccounts();
    // };

    // const signMessage = async (message: string) => {
    //     if (!provider) {
    //         console.log("signMessage provider not initialized yet");
    //         return;
    //     }
    //     return await provider.signMessage(message);
    // };

    const getUserInfo = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        return await web3Auth.getUserInfo();
    };

    const logout = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        await web3Auth.logout();
    };

    const contextProvider = {
        web3Auth,
        provider,
        login,
        logout,
        getUserInfo,
        // getAccounts,
        // signMessage,
        isLoading
    };

    return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
}