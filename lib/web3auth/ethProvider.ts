import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { IWalletProvider } from "./web3auth";

const ethProvider = (provider: SafeEventEmitterProvider): IWalletProvider => {
  const getAccounts = async () => {
    try {
      const web3 = new Web3(provider as any);
      const accounts = await web3.eth.getAccounts();
      return accounts
    } catch (error) {
      console.error("Error", error);
      return ''
    }
  };

  // const getBalance = async () => {
  //   try {
  //     const web3 = new Web3(provider as any);
  //     const accounts = await web3.eth.getAccounts();
  //     const balance = await web3.eth.getBalance(accounts[0]);
  //   } catch (error) {
  //     console.error("Error", error);
  //   }
  // };

  const signMessage = async (message: string) => {
    try {
      const pubKey = (await provider.request({ method: "eth_accounts" })) as string[];
      const web3 = new Web3(provider as any);
      // return new Promise<string>((resolve, _) => {(web3.currentProvider as any)?.send(
      //   {
      //     method: "eth_sign",
      //     params: [pubKey[0], message],
      //     from: pubKey[0],
      //   },
      //   (err: Error, result: any) => {
      //     if (err) {
      //       console.log('error', err)
      //       resolve(err.message)
      //     }
      //     console.log('result:::', result)
      //     resolve(result.result)
      //   }
      // )})
      return (web3.currentProvider as any)?.request({
        from: pubKey[0],
        params: [pubKey[0], message],
        method: 'personal_sign'
      }).then((signature) => {
        console.info('signData:', signature);
        return signature;
      });
    } catch (error) {
      console.log("error", error);
      return ''
    }
  };

  // const signAndSendTransaction = async () => {
  //   try {
  //     const web3 = new Web3(provider as any);
  //     const accounts = await web3.eth.getAccounts();
  //     const txRes = await web3.eth.sendTransaction({
  //       from: accounts[0],
  //       to: accounts[0],
  //       value: web3.utils.toWei("0.01"),
  //     });
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  
  // const signTransaction = async () => {
  //   try {
  //     const web3 = new Web3(provider as any);
  //     const accounts = await web3.eth.getAccounts();
  //     // only supported with social logins (openlogin adapter)
  //     const txRes = await web3.eth.signTransaction({
  //       from: accounts[0],
  //       to: accounts[0],
  //       value: web3.utils.toWei("0.01"),
  //     });
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  return { getAccounts, signMessage };
};

export default ethProvider;
