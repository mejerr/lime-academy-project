// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";
import "./NFTMarketItem.sol";

contract NFTMarketPlace is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionId;

    struct Collection {
        uint256 collectionId;
        string name;
        string description;
        uint256 createdOn;
        address creator;
    }

    uint256[] public collectionsIds;

    mapping(uint256 => Collection) private collections;

    event CollectionCreated(
        uint256 indexed collectionId,
        string indexed name,
        string description,
        uint256 createdOn,
        address creator
    );

    event CancelSale(uint256 itemId, address seller);

    /* Creates a collection of future NFTs */
    function createCollection(string calldata name, string calldata description)
        public
        payable
    {
        _collectionId.increment();
        uint256 collectionId = _collectionId.current();
        uint256 createdOn = block.timestamp;

        collections[collectionId] = Collection(
            collectionId,
            name,
            description,
            createdOn,
            msg.sender
        );

        collectionsIds.push(collectionId);

        emit CollectionCreated(
            collectionId,
            name,
            description,
            createdOn,
            msg.sender
        );
    }

    function getCollectionLength() external view returns (uint256) {
        return collectionsIds.length;
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
        address nftContract,
        uint256 tokenId,
        address add
    ) public payable {
        NFTMarketItem marketItem = NFTMarketItem(add);
        uint256 price = marketItem.getNFTMarketItem(tokenId).price;
        uint256 itemId = marketItem.getNFTMarketItem(tokenId).itemId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        marketItem.getNFTMarketItem(tokenId).owner.transfer(msg.value);
        IERC721(nftContract).transferFrom(
            marketItem.getNFTMarketItem(tokenId).owner,
            msg.sender,
            itemId
        );
        marketItem.getNFTMarketItem(itemId).owner = payable(msg.sender);
    }
}
