import hre from "hardhat";

async function main() {
  console.log("\n=== 🚀 MyToken 배포 시작 ===\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("배포 계정:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("계정 잔액:", hre.ethers.formatEther(balance), "ETH");

  console.log("\n배포 중...");
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  
  console.log("\n=== ✅ 배포 완료 ===\n");
  console.log("컨트랙트 주소:", tokenAddress);
  console.log("Owner:", await token.owner());
  console.log("Token Name:", await token.name());
  console.log("Token Symbol:", await token.symbol());
  console.log("Total Supply:", hre.ethers.formatEther(await token.totalSupply()), "MTR");
  
  console.log("\n=== 📝 Backend .env에 추가 ===\n");
  console.log(`TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`PRIVATE_KEY=${process.env.PRIVATE_KEY}`);
  
  console.log("\n=== 🔍 Etherscan에서 확인 ===\n");
  console.log(`https://sepolia.etherscan.io/address/${tokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});