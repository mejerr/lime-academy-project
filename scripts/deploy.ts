// tslint:disable-next-line: no-var-requires
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: " + deployer.address);

  const NFTMarketItem = await ethers.getContractFactory("NFTMarketItem");
  const marketItem = await NFTMarketItem.deploy();
  await marketItem.deployed();
  console.log("NFTMarketItem deployed to:", marketItem.address);

  const NFTMarketPlace = await ethers.getContractFactory("NFTMarketPlace");
  const marketPlace = await NFTMarketPlace.deploy(marketItem.address);
  await marketPlace.deployed();
  console.log("NFTMarketPlace deployed to:", marketPlace.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
