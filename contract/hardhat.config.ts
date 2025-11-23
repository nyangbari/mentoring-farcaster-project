import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/dummy",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64 
        ? [`0x${process.env.PRIVATE_KEY}`] 
        : []  // 빈 배열로 설정
    }
  }
};

export default config;