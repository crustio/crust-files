import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import ethProvider from "./ethProvider";
import { flushSync } from "react-dom";
import { setupUnitTestWatcherTimeouts } from "@elrondnetwork/erdjs/out/testutils";

export interface IWeb3AuthContext {
    web3Auth: Web3Auth | null;
    provider: IWalletProvider | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
    signMessage: (msg: string) => Promise<any>;
    getAccounts: () => Promise<any>;
    isLoading: boolean;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
    web3Auth: null,
    provider: null,
    login: async () => { },
    logout: async () => { },
    getUserInfo: async () => { },
    signMessage: async () => { },
    getAccounts: async () => { },
    isLoading: false
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
    const [provider, setProvider] = useState<IWalletProvider | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const setWalletProvider = useCallback(
        (web3authProvider: SafeEventEmitterProvider) => {
            const walletProvider = ethProvider(web3authProvider);
            console.log(`init provider`)
            setProvider(walletProvider);
            setIsLoading(true)
            console.log('provider nmb', provider)
            console.log(`isLoading::: nmb333`, isLoading)
            console.log('provider nmb2222', walletProvider)

        }, []
    );

    useEffect(() => {
        const subscribeAuthEvents = (web3auth: Web3Auth) => {
            // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
                console.log("Yeah!, you are successfully logged in", data);
                setWalletProvider(web3auth.provider!);
                console.log('web3auth.provider::::', web3auth.provider)

            });

            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                console.log("connecting");
                setWalletProvider(web3auth.provider!);
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
                const clientId = "BJhKkhmg9eMSuTidmnab8XxXpjS-lqvqpmcz-HtQAoo6Im66KN6NeEHNyUs4RUA1nvs2znvuk8vQ57FTrrtiPws";
                const web3AuthInstance = new Web3Auth({
                    chainConfig: {
                        chainNamespace: "eip155",
                        chainId: "0x1",
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
                console.log('web3AuthInstance.provider::::', web3AuthInstance.provider)
                setWalletProvider(web3AuthInstance.provider!);
            } catch (error) {
                console.error(error);
            } finally {
            }
        }
        init();
    }, []);

    const login = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        try {
            const localProvider = await web3Auth.connect()
            // setWalletProvider(localProvider!);
        } catch (error) {
            console.error("web3auth login error ", error)
        }
        // setWalletProvider(localProvider!);
    };

    const getAccounts = async () => {
        if (!provider) {
            console.log("getAccounts provider not initialized yet");
            return;
        }
        return await provider.getAccounts();
    };

    const signMessage = async (message: string) => {
        if (!provider) {
            console.log("signMessage provider not initialized yet");
            return;
        }
        return await provider.signMessage(message);
    };

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
        // setProvider(null);
        window.sessionStorage.clear();
    };

    // web3Auth.logout().then(() => console.log('haha'))

    const contextProvider = {
        web3Auth,
        provider,
        login,
        logout,
        getUserInfo,
        getAccounts,
        signMessage,
        isLoading
    };

    return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
}