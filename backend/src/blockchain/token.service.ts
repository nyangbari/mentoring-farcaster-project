import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import abiJson from './erc20_abi.json';

const ABI = (abiJson as any).abi ?? abiJson;

@Injectable()
export class TokenService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL!;
    const pk = process.env.REWARD_PRIVATE_KEY!;
    const tokenAddress = process.env.TOKEN_ADDRESS!;

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(pk, this.provider);
    this.contract = new ethers.Contract(tokenAddress, ABI, this.wallet);
  }

  // 리뷰 보상 지급 (mint)
  async rewardReview(userAddress: string, amountMtr: string) {
    const amount = ethers.parseUnits(amountMtr, 18);
    const tx = await this.contract.mint(userAddress, amount);
    return await tx.wait();
  }
}
