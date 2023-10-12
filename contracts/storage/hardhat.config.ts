import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@oasisprotocol/sapphire-hardhat';

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sapphire_mainnet: {
      url: 'https://sapphire.oasis.io',
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 0x5afe
    },
    sapphire_testnet: {
      url: "https://testnet.sapphire.oasis.dev",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 0x5aff,
    },
  }
};

export default config;
