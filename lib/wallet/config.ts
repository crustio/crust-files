// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NearConfig } from "near-api-js/lib/near";

export interface WrapNearConfig extends NearConfig {
  contractName: string;
}

export const nearConfig: WrapNearConfig = {
  // test
  // networkId: 'testnet',
  // contractName: 'eericxu.testnet',
  // nodeUrl: 'https://rpc.testnet.near.org',
  // walletUrl: 'https://wallet.testnet.near.org',
  // helperUrl: 'https://helper.testnet.near.org'
  // prod
  networkId: "mainet",
  contractName: "crust.near",
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
};

/**
 * 
 * eth: 0xE391613d2056e47F74ED5eF1d443d4CDB21AAAd9
op: 0xf8e6F7bb144D3475fcf39Bd879510Fa93C775ee2
arb1: 0x9ae6c9d00fde0e0f774693ca6099d06dfe2001c6
zkSync: 0xfa866AbF8F0b8f154654DEd956B2467dFB6A4135

eth goerli: 0xDE52b55C3Ee0765d17564631570ec8E7fD3D499a
arb1 goerli: 0x9AE6C9d00Fde0e0F774693Ca6099d06dfe2001C6
op goerli: 0x06Ae21caEEA438Aa3AA4D353332a7C124f8dF3c7
zksync era testnet:  0x6C0445ec09d49214Cbc21E3DC032d3dEA25ce2Ae
 */
export const EVMStorageContract: { [k: number]: string } = {
  // Ethereum
  1: "0xE391613d2056e47F74ED5eF1d443d4CDB21AAAd9",
  5: "0xDE52b55C3Ee0765d17564631570ec8E7fD3D499a",// ethereum goerli
  // Optimism
  10: "0xf8e6F7bb144D3475fcf39Bd879510Fa93C775ee2",
  420: "0x06Ae21caEEA438Aa3AA4D353332a7C124f8dF3c7", // op goerli
  // Arbitrum
  42161: "0x9ae6c9d00fde0e0f774693ca6099d06dfe2001c6",
  421613: "0x9AE6C9d00Fde0e0F774693Ca6099d06dfe2001C6",//arb goerli
  // zkSync
  324: "0xfa866AbF8F0b8f154654DEd956B2467dFB6A4135",// zkSync
  280: "0x6C0445ec09d49214Cbc21E3DC032d3dEA25ce2Ae",// zksync era testnet
  // Polygon
  137: "",
  // Celo
  42220: "",
  // BNB Chain
  56: "",
};

export const CHAIN_SYMBOL: {[k: number]: string} = {
  137: "Matic",
  56: "BNB"
}

export const EVMStorageABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "previousAdmin", type: "address" },
      { indexed: false, internalType: "address", name: "newAdmin", type: "address" },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "beacon", type: "address" }],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "customer", type: "address" },
      { indexed: false, internalType: "address", name: "merchant", type: "address" },
      { indexed: false, internalType: "string", name: "cid", type: "string" },
      { indexed: false, internalType: "uint256", name: "size", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bool", name: "isPermanent", type: "bool" },
    ],
    name: "Order",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "implementation", type: "address" }],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "nodeAddress", type: "address" }],
    name: "addOrderNode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getNodesNumber",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "bool", name: "isPermanent", type: "bool" },
    ],
    name: "getPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "initialize", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "nodeArray",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nodes",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "cid", type: "string" },
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "bool", name: "isPermanent", type: "bool" },
    ],
    name: "placeOrder",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "cid", type: "string" },
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "address", name: "nodeAddress", type: "address" },
      { internalType: "bool", name: "isPermanent", type: "bool" },
    ],
    name: "placeOrderWithNode",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "priceOracle",
    outputs: [{ internalType: "contract IPriceOracle", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "nodeAddress", type: "address" }],
    name: "removeOrderNode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "priceOracleAddress", type: "address" }],
    name: "setPriceOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newImplementation", type: "address" }],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
