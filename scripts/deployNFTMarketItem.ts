async function deployNFTMarketItem() {
  await hre.run('compile');

  const NFTMarketItem = await ethers.getContractFactory("NFTMarketItem");
  const marketItem = await NFTMarketItem.deploy();
  await marketItem.deployed();
  console.log("NFTMarketItem deployed to:", marketItem.address);
}

module.exports = deployNFTMarketItem;
