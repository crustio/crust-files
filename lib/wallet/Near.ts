// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {connect, KeyPair, keyStores, WalletConnection} from 'near-api-js';
import {NearConfig} from 'near-api-js/lib/near';

import {nearConfig} from './config';
import {BaseWallet} from './types';

export class NearM implements BaseWallet {
  isInit = false;

  wallet?: WalletConnection;
  keyPair?: KeyPair;

  async init() {
    if (this.isInit) return
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const config: NearConfig = {...nearConfig, deps: {keyStore}};
    const nearObj = await connect(config);
    const walletAccount = new WalletConnection(nearObj, null);
    this.wallet = walletAccount
    try {
      if (walletAccount.isSignedIn()) {
        this.keyPair = await keyStore.getKey(config.networkId, walletAccount.getAccountId());
      }
      this.isInit = true
    } catch (e) {
      console.error(e)
      this.isInit = true
    }
  }


  async sign(data: string): Promise<string> {
    const msg = Buffer.from(data);
    // eslint-disable-next-line
    const {signature} = this.keyPair?.sign(msg);
    return Buffer.from(signature).toString('hex');
  }

}
