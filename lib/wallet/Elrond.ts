import {BaseWallet} from "./types";
import {
  ExtensionProvider, Address,
  Balance,
  ChainID,
  GasLimit,
  GasPrice,
  Transaction,
  TransactionPayload,
  TransactionVersion
} from '@elrondnetwork/erdjs';

export class Elrond implements BaseWallet {
  isInit = false;

  provider?: ExtensionProvider

  async init() {
    if (this.isInit) return
    const provider = ExtensionProvider.getInstance()
    const initProvider = await provider.init()
    if (initProvider) {
      this.provider = provider;
    }
    this.isInit = true
  }


  sign(): Promise<string> {
    const rawTransaction = {
      receiver: Address.Zero().hex(),
      data: 'Sign message for crust files',
      value: '0.1'
    };
    const transaction = new Transaction({
      value: Balance.egld(rawTransaction.value),
      data: new TransactionPayload(rawTransaction.data),
      receiver: new Address(rawTransaction.receiver),
      gasLimit: new GasLimit(50000),
      gasPrice: new GasPrice(1000000000),
      chainID: new ChainID('D'),
      version: new TransactionVersion(1)
    });

    return this.provider.signTransaction(transaction)
      .then((e) => {
        // elrond-addr-txMsg:sig
        const signature = e.getSignature();
        const sender = e.getSender();
        const transMessage = transaction.serializeForSigning(new Address(sender));

        /* eslint-disable @typescript-eslint/restrict-template-expressions */
        return `elrond-${sender}-${transMessage.toString('hex')}:${signature.hex()}`;
      })
      .catch((err) => {
        console.error('Elrond wallet signTransaction error', err);
        return '';
      });
  }

}
