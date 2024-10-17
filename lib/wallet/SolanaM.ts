import { BaseWallet, LoginUser } from "./types";
import { sleep } from "./tools";

export class SolanaM extends BaseWallet {
  name = "Solana";
  icon = "/images/wallet_solana.png";

  solana?: {
    isPhantom: boolean;
    isConnected: boolean;
    publicKey: any;
    disconnect: () => void;
    connect: () => Promise<{ publicKey: any }>;
    on: (event: string, call: () => void) => void;
    once: (event: string, call: () => void) => void;
    signMessage: (msg: Uint8Array, encode: "utf8") => Promise<any>;
  };

  async init(old?: LoginUser) {
    if (this.isInit) return;
    this.solana = (window as { solana?: SolanaM["solana"] }).solana;
    if (!this.solana) {
      await sleep(2000);
      this.solana = (window as { solana?: SolanaM["solana"] }).solana;
    }
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      if (this.solana?.publicKey) return [this.solana?.publicKey.toBase58()];
    } catch (error) {
      console.info(error)
    }
    return [];
  }

  public async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.solana) throw "Solana (Phantom Wallet) not installed";
      const res = await this.solana.connect();
      this.account = res.publicKey.toBase58();
      this.isConnected = true;
      this.solana.once("disconnect", () => {
        this.onAccountChange?.([]);
      });
    }
    return { account: this.account, wallet: "solana" };
  }

  sign(data: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(data);
    return (
      this.solana
        ?.signMessage(encodedMessage, "utf8")
        // eslint-disable-next-line
        .then((sig: any) => Buffer.from(sig.signature).toString("hex"))
    );
  }

  disconnect(): void {
    super.disconnect();
    this.solana?.disconnect();
  }
}
