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
    uint256 private lockedBidAmount = 0;

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

    event ItemBought(
        uint256 indexed itemId,
        address buyer,
        address owner,
        uint256 price
    );

    event BidCreated(uint256 indexed itemId, uint256 price, address bidder);
    event BidAccepted(
        uint256 indexed tokenId,
        uint256 indexed bidId,
        uint256 amount,
        address bidder
    );
    event BidCancelled(
        uint256 indexed tokenId,
        uint256 indexed bidId,
        address canceller
    );

    event ListingFeeToOwner(uint256 listingFee);
    event Deposit(uint256 price);

    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function getOwnerBalance() external view onlyOwner returns (uint256) {
        return (msg.sender).balance;
    }

    function getLockedBidAmount() external view onlyOwner returns (uint256) {
        return lockedBidAmount;
    }

    /* Transfers collected listing fees to owner */
    function transferListingFee(address nftContract)
        external
        payable
        onlyOwner
    {
        NFTMarketItem marketItem = NFTMarketItem(nftContract);

        address(this).balance - marketItem.getCollectedListingFee();
        payable(msg.sender).transfer(marketItem.getCollectedListingFee());

        emit ListingFeeToOwner(marketItem.getCollectedListingFee());

        marketItem.resetCollectedListingFee();
    }

    /* Creates a collection of future NFTs */
    function createCollection(string calldata name, string calldata description)
        external
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

    /* Gets collection array length */
    function getCollectionLength() external view returns (uint256) {
        return collectionsIds.length;
    }

    /* Transfers ownership of the item, as well as funds between parties */
    function buyMarketItem(address nftContract, uint256 tokenId)
        external
        payable
    {
        NFTMarketItem marketItem = NFTMarketItem(nftContract);
        address itemOwner = ERC721.ownerOf(tokenId);

        ERC721._isApprovedOrOwner(address(this), tokenId);
        require(itemOwner != msg.sender, "You can not buy your own item");
        require(
            marketItem.getMarketItem(tokenId).status ==
                ItemListingStatus.ForSale,
            "Item is not for sale"
        );
        require(
            msg.value == marketItem.getMarketItem(tokenId).price,
            "Please submit the asking price in order to complete the purchase"
        );

        _transfer(itemOwner, msg.sender, tokenId);

        payable(itemOwner).transfer(msg.value);
        marketItem.setPrice(tokenId, 0, ItemListingStatus.Idle);

        emit ItemBought(tokenId, msg.sender, itemOwner, msg.value);
    }

    /* Adds bid for specific market item */
    function bidMarketItem(
        uint256 itemId,
        uint256 price,
        address nftContract
    ) external payable {
        require(
            msg.value >= price,
            "You have to send enough money to bid on this item"
        );
        NFTMarketItem marketItem = NFTMarketItem(nftContract);
        require(
            marketItem.getMarketItem(itemId).itemId == itemId,
            "No such item"
        );
        require(
            marketItem.getMarketItem(itemId).status ==
                ItemListingStatus.ForSale,
            "Item is not for sale"
        );
        require(
            ERC721.ownerOf(itemId) != msg.sender,
            "You can not bid your own item"
        );

        lockedBidAmount += msg.value;
        marketItem.addBid(itemId, price, msg.sender);

        emit BidCreated(itemId, price, msg.sender);
    }

    /* Accepts bid from bidder for specific market item */
    function acceptItemBid(
        uint256 tokenId,
        uint256 bidId,
        address nftContract
    ) external payable isItemOwner(tokenId) {
        NFTMarketItem marketItem = NFTMarketItem(nftContract);

        require(
            marketItem.getItemBid(tokenId, bidId).bidId == bidId,
            "No such bid for this item"
        );

        address bidder = marketItem.getItemBid(tokenId, bidId).bidder;
        uint256 amount = marketItem.getItemBid(tokenId, bidId).amount;

        require(
            lockedBidAmount >= amount,
            "Transaction failed. Contract has not enough wei"
        );

        _transfer(msg.sender, bidder, tokenId);

        lockedBidAmount -= amount;
        address(this).balance - amount;
        payable(msg.sender).transfer(amount);

        marketItem.setPrice(tokenId, 0, ItemListingStatus.Idle);

        emit BidAccepted(tokenId, bidId, amount, bidder);

        marketItem.removeBid(tokenId, bidId);
    }

    /* Cancels bid from bidder for specific market item */
    function cancelItemBid(
        uint256 tokenId,
        uint256 bidId,
        address nftContract
    ) external payable {
        NFTMarketItem marketItem = NFTMarketItem(nftContract);

        require(
            marketItem.getMarketItem(tokenId).itemId == tokenId,
            "No such item"
        );

        require(
            marketItem.getItemBid(tokenId, bidId).bidId == bidId,
            "No such bid for this item"
        );

        address bidder = marketItem.getItemBid(tokenId, bidId).bidder;
        uint256 amount = marketItem.getItemBid(tokenId, bidId).amount;

        require(
            lockedBidAmount >= amount,
            "Transaction failed. Contract has not enough wei"
        );
        lockedBidAmount -= amount;
        address(this).balance - amount;
        payable(bidder).transfer(amount);

        marketItem.removeBid(tokenId, bidId);

        emit BidCancelled(tokenId, bidId, msg.sender);
    }

    receive() external payable {
        emit Deposit(msg.value);
    }
}
