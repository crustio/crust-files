import { BaseWallet, LoginUser } from "./types";

export interface MetaXReqOptions {
  from?: string;
  params?: string[];
  method: string;
}

export class MetaX extends BaseWallet {
  name = "MetaX";
  icon = "/images/wallet_metax.png";

  isInit = false;
  okexchain?: {
    isOKExWallet: boolean;
    request: <T>(option: MetaXReqOptions) => Promise<T>;
    selectedAddress?: string;
    isConnected: () => boolean;
    on: (type: string, handler: (data: any) => void) => void;
  } = undefined;

  async init(old?: LoginUser): Promise<void> {
    if (this.isInit) return Promise.resolve();
    await new Promise<void>((resolve) => {
      let handled = false;
      const eWin = window as { okexchain?: MetaX["okexchain"] };
      const handleMetaX = () => {
        if (handled) return;
        handled = true;
        window.removeEventListener("okexchain#initialized", handleMetaX);
        const mWin = window as { okexchain?: MetaX["okexchain"] };
        this.okexchain = mWin.okexchain;
        console.info("okexchain::", mWin.okexchain);
        if (this.okexchain!) {
          this.setLis();
        }
        resolve();
      };

      if (eWin.okexchain) {
        handleMetaX();
      } else {
        window.addEventListener("okexchain#initialized", handleMetaX, { once: true });
        setTimeout(handleMetaX, 2000);
      }
    });
    await super.init(old)
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      const accounts = this.okexchain!.request<string[]>({ method: "eth_accounts" });
      return accounts;
    } catch (error) {
      return [];
    }
  }
  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.okexchain!) throw "MetaX not installed";
      const accounts = await this.okexchain!.request<string[]>({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length == 0) throw "MetaX error";
      this.accounts = accounts;
      if (this.okexchain!.selectedAddress && accounts.includes(this.okexchain!.selectedAddress)) {
        this.account = this.okexchain!.selectedAddress;
      } else {
        this.account = accounts[0];
      }
      this.setLis();
      this.isConnected = true;
    }
    return { account: this.account, wallet: "metax" };
  }

  private setLis() {
    this.okexchain!.on("accountsChanged", (data) => {
      console.info("okexchain:accountsChanged:", data);
      if (this.onAccountChange) {
        this.onAccountChange(data as string[]);
      }
    });
  }

  sign(data: string, account?: string): Promise<string> {
    const msg = Buffer.from(data, "utf8").toString("hex");
    // const msg = data;

    console.info("msg::", msg);
    if (!this.okexchain?.request) return Promise.reject("Error");
    return this.okexchain
      ?.request<string>({
        from: account,
        params: [msg, account!],
        method: "personal_sign",
      })
      .then((signature) => {
        console.info("signData:", signature);
        return signature;
      });
  }
}
