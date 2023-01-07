const hre = require("hardhat");

async function main() {
  const buy = await hre.ethers.getContractFactory("Buy");
  const contract = await buy.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
