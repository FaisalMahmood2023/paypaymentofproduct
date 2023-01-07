const hre = require("hardhat");
async function getBalances(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter} balance:`, await getBalances(address));
    counter++;
  }
}

async function consoleMemoes(memoes) {
  for (const memo of memoes) {
    const name = memo.name;
    const message = memo.message;
    const timestamp = memo.timestamp;
    const from = memo.from;
    console.log(
      `name ${name}, message ${message}, at ${timestamp}, address ${from}`
    );
  }
}

async function main() {
  const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  const buy = await hre.ethers.getContractFactory("Buy");
  const contract = await buy.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);

  const addresses = [
    owner.address,
    from1.address,
    from2.address,
    from3.address,
  ];

  console.log("Before buying product");
  await consoleBalances(addresses);

  const amount = { value: hre.ethers.utils.parseEther("1") };
  await contract
    .connect(from1)
    .buyProduct("Faisal", "Beautiful Product", amount);
  await contract.connect(from2).buyProduct("Asif", "Awsome Product", amount);
  await contract.connect(from3).buyProduct("Ali", "Very nice Product", amount);

  console.log("After buying product");
  await consoleBalances(addresses);

  const memoes = await contract.getMemoes();
  consoleMemoes(memoes);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
