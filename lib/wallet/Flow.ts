// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseWallet, LoginUser } from "./types";
import _ from "lodash";

import * as fcl from "@onflow/fcl";

export class FlowM extends BaseWallet {
  name = "Flow";
  icon = "/images/wallet_flow.png";

  fcl?: {
    currentUser: () => any;
    authenticate(): Promise<void>;
  };
  user?: any;
  async init(old?: LoginUser): Promise<void> {
    if (this.isInit) return;
    fcl
      .config()
      .put("accessNode.api", "https://flow-access-mainnet.portto.io")
      .put("challenge.handshake", "https://flow-wallet.blocto.app/authn");
    this.fcl = fcl;
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      const user = await fcl.currentUser.snapshot();
      return [user.addr!];
    } catch (error) {
      console.error(error);
    }
    return [];
  }
  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      let user = await fcl.currentUser.snapshot();
      if (!user.loggedIn) {
        await fcl.authenticate();
      }
      user = await fcl.currentUser.snapshot();
      this.user = user;
      this.isConnected = true;
    }
    return { account: this.user.addr, wallet: "flow" };
  }

  async sign(data: string): Promise<string> {
    const msg = Buffer.from(data);
    return fcl.currentUser.signUserMessage(msg.toString("hex")).then((res: any) => {
      if (!res) {
        throw new Error("Signature failed");
      }

      if (_.includes(res, "Declined: User rejected signature")) {
        throw new Error("User rejected signature");
      }

      return window.btoa(JSON.stringify(res));
    });
  }

  disconnect() {
    super.disconnect();
    fcl.unauthenticate();
  }
}
