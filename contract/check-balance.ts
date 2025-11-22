import { ethers } from "hardhat";

async function main() {
  const address = "0x8b4f81F0391A2c977d78A3156390DA001D3baB2";
  const balance = await ethers.provider.getBalance(address);
  
  console.log("\n=== 💰 잔액 확인 ===\n");
  console.log("지갑 주소:", address);
  console.log("잔액:", ethers.formatEther(balance), "ETH");
  
  if (parseFloat(ethers.formatEther(balance)) < 0.01) {
    console.log("\n⚠️  ETH가 부족합니다. Faucet에서 더 받으세요.");
  } else {
    console.log("\n✅ 배포 가능합니다!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// https://sepolia.etherscan.io/address/0x6b4f81F0391A2c977d78A3156390DA001D3baBa7