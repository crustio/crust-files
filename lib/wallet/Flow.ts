// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {BaseWallet} from './types';
import _ from 'lodash'

// eslint-disable-next-line
const fcl = require('@onflow/fcl');

export class FlowM implements BaseWallet {
  isInit = false;

  fcl?: {
    currentUser: () => any
    authenticate(): Promise<void>;
  }

  async init(): Promise<void> {
    if (this.isInit) return
    fcl.config()
      .put('accessNode.api', 'https://flow-access-mainnet.portto.io')
      .put('challenge.handshake', 'https://flow-wallet.blocto.app/authn');
    this.fcl = fcl;
    this.isInit = true;
    return Promise.resolve(undefined);
  }


  sign(data: string): Promise<string> {
    const msg = Buffer.from(data);

    // eslint-disable-next-line
    return fcl.currentUser().signUserMessage(msg.toString('hex'))
      .then((res: any) => {
        if (!res) {
          throw new Error('Signature failed');
        }

        if (_.includes(res, 'Declined: User rejected signature')) {
          throw new Error('User rejected signature');
        }

        return window.btoa(JSON.stringify(res));
      });
  }

}
