// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mainnet, optimism, arbitrum, base, zkSync, blast, hedera, avalanche } from "viem/chains";
import { defineChain } from "viem";

export interface WrapAlgorandConfig {
  token: string;
  chainId: number;
  applicationId: number;
  applicationAddress: string;
  algodUrl: string;
}

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
const u2uMainnet = defineChain({
  testnet: false,
  id: 39,
  name: "U2U Solaris Mainnet",
  nativeCurrency: { name: "U2U", symbol: "U2U", decimals: 18 },
  blockExplorers: {
    default: {
      name: "U2U Mainnet Scan",
      url: "https://u2uscan.xyz",
    },
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-mainnet.u2u.xyz"],
    },
  },
});

export const EVMChains = {
  mainnet,
  optimism,
  arbitrum,
  zkSync,
  blast,
  base,
  crustEvmParachainTest,
  u2uMainnet,
  hedera,
  avalanche,
};

export const EVMStorageContract: { [k: number]: string } = {
  // Ethereum
  [mainnet.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  // Optimism
  [optimism.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  // Arbitrum
  [arbitrum.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  // zkSync
  [zkSync.id]: "0x61ecfA2C8dF06A4f941A8529E4B707488B74e3bE",
  // Blast
  [blast.id]: "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860",
  // Base
  [base.id]: "0xf063a29f03d0a02fd96f270ee4f59158ef3d4860",
  // Crust Evm Parachain
  [crustEvmParachainTest.id]: "0xA40179e57280585D88899b2032E7eCF13B3B6c72",
  // U2U network
  [u2uMainnet.id]: "0xA40179e57280585D88899b2032E7eCF13B3B6c72",
  // Hedera
  [hedera.id]: "0x304568d9A54Dd913454eAdcA79681B8f7C6B3C64",
  // avalanche
  [avalanche.id]: "0x304568d9A54Dd913454eAdcA79681B8f7C6B3C64",
};

export const CHAIN_SYMBOL: { [k: number]: string } = {
  416001: "ALGO",
  // 416002: "ALGO",
  [137]: "Matic",
  56: "BNB",
  // Crust Evm Parachain
  [crustEvmParachainTest.id]: "CRU",
  [u2uMainnet.id]: "U2U",
  [hedera.id]: "HBAR",
  [avalanche.id]: "AVAX",
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
