// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NearConfig } from "near-api-js/lib/near";
import { mainnet, optimism, arbitrum, base, zkSync, blast } from "viem/chains";
import { defineChain } from "viem";
export interface WrapNearConfig extends NearConfig {
  contractName: string;
}

export interface WrapAlgorandConfig {
  token: string;
  chainId: number;
  applicationId: number;
  applicationAddress: string;
  algodUrl: string;
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

export const algorandConfig: WrapAlgorandConfig = {
  token: "a".repeat(64),
  // test
  // chainId: 416002,
  // applicationId: 507867511,
  // applicationAddress: '3QRYDF6T2JR5SM2O7TVZMBGX25IPSCWC2TL4KFJV6OKC4QAKLI5EWTXZYI',
  // algodUrl: 'https://testnet-api.algonode.cloud',
  // prod
  chainId: 416001,
  applicationId: 1275319623,
  applicationAddress: "SLNGOJJFB3ERUUZUAAOVW6DWH3NKKQMGZWH26IBIU34EHM3AU24Y5VIH3E",
  algodUrl: "https://mainnet-api.algonode.cloud",
};

const crustEvmParachainTest = defineChain({
  testnet: true,
  id: 366666,
  name: "Crust EVM Parachain Test",
  nativeCurrency: { name: "CRU", symbol: "CRU", decimals: 18 },
  blockExplorers: {
    default: {
      name: "Crust EVM Parachain Test",
      url: " https://evmexplorer.tanssi-chains.network",
    },
  },
  rpcUrls: {
    default: {
      http: ["https://fraa-flashbox-2952-rpc.a.stagenet.tanssi.network"],
    },
  },
});

export const SupportEVMChains = [mainnet, optimism, arbitrum, zkSync, blast, base, crustEvmParachainTest];

export const EVMChains = {
  mainnet,
  optimism,
  arbitrum,
  zkSync,
  blast,
  base,
  crustEvmParachainTest,
};

export const EVMStorageContract: { [k: number]: string } = {
  // Ethereum
  [mainnet.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  5: "0xDE52b55C3Ee0765d17564631570ec8E7fD3D499a", // ethereum goerli
  // Optimism
  [optimism.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  420: "0x06Ae21caEEA438Aa3AA4D353332a7C124f8dF3c7", // op goerli
  // Arbitrum
  [arbitrum.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  421613: "0x9AE6C9d00Fde0e0F774693Ca6099d06dfe2001C6", //arb goerli
  // zkSync
  [zkSync.id]: "0x61ecfA2C8dF06A4f941A8529E4B707488B74e3bE", // zkSync
  280: "0x6C0445ec09d49214Cbc21E3DC032d3dEA25ce2Ae", // zksync era testnet
  // Polygon
  137: "",
  // Celo
  42220: "",
  // BNB Chain
  56: "",

  // Blast
  [blast.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  // Base
  [base.id]: "0xf063a29f03d0a02fd96f270ee4f59158ef3d4860",

  // Crust Evm Parachain
  [crustEvmParachainTest.id]: "0xA40179e57280585D88899b2032E7eCF13B3B6c72",
};

export const CHAIN_SYMBOL: { [k: number]: string } = {
  416001: "ALGO",
  // 416002: "ALGO",
  137: "Matic",
  56: "BNB",
  // Crust Evm Parachain
  [crustEvmParachainTest.id]: "CRU",
};

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
