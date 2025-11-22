import { ethers } from "hardhat";

async function main() {
  const wallet = ethers.Wallet.createRandom();

  console.log("\n=== 🔐 서버 지갑 생성 완료 ===\n");
  console.log("지갑 주소:", wallet.address);
  console.log("Private Key (0x 제외):", wallet.privateKey.slice(2));
  
  console.log("\n=== 📝 .env 파일에 추가 ===\n");
  console.log(`PRIVATE_KEY=${wallet.privateKey.slice(2)}`);
  
  console.log("\n=== ⚠️  중요 ===");
  console.log("1. 위 Private Key를 hardhat/.env 파일에 저장하세요");
  console.log("2. 이 지갑 주소로 Sepolia ETH를 받아야 합니다");
  console.log("3. Faucet: https://sepoliafaucet.com");
  console.log("4. 지갑 주소:", wallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});