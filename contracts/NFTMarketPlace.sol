// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";
import "./NFTMarketItem.sol";

contract NFTMarketPlace is NFTMarketItem {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionId;
    uint256 private constant TRANSACTION_FEE = 0.075 ether;

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

    /* Transfers ownership of the item, as well as funds between parties */
    function buyMarketItem(address nftContract, uint256 tokenId)
        public
        payable
    {
        NFTMarketItem marketItem = NFTMarketItem(nftContract);
        require(
            marketItem.getNFTMarketItem(tokenId).owner != msg.sender,
            "You can not buy your own item"
        );
        require(
            marketItem.allowance(tokenId) == address(this),
            "Marketplace is not allowed to sell this item"
        );
        require(
            marketItem.getNFTMarketItem(tokenId).status ==
                ItemListingStatus.ForSale,
            "Item is not for sale"
        );

        uint256 price = marketItem.getNFTMarketItem(tokenId).price;
        uint256 itemId = marketItem.getNFTMarketItem(tokenId).itemId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        _transfer(
            marketItem.getNFTMarketItem(tokenId).owner,
            msg.sender,
            itemId
        );

        marketItem.getNFTMarketItem(tokenId).owner.transfer(msg.value);
        marketItem.changeOwner(itemId, msg.sender);
        marketItem.changeItemStatus(itemId, ItemListingStatus.NotForSale);
        marketItem.changeItemPrice(itemId, 0);
    }
}
