
// tslint:disable-next-line: no-var-requires
const hre = require("hardhat");
const { ethers } = hre;

async function deployNFTMarketPlace() {
  await hre.run('compile');

  const NFTMarketPlace = await ethers.getContractFactory("NFTMarketPlace");
  const marketPlace = await NFTMarketPlace.deploy();
  await marketPlace.deployed();
  console.log("NFTMarketPlace deployed to:", marketPlace.address);
}
deployNFTMarketPlace()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
