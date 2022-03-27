// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";
import "./NFTMarketItem.sol";

contract NFTMarketPlace is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionId;
    uint256 private lockedBidAmount = 0;
    NFTMarketItem private immutable marketItemContract;

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

    modifier isItemOwner(uint256 itemId) {
        require(
            marketItemContract.ownerOf(itemId) == msg.sender,
            "Item is not owned by you"
        );
        _;
    }

    constructor(address _marketItemAddress) {
        marketItemContract = NFTMarketItem(_marketItemAddress);
    }

    function getContractBalance()
        external
        view
        virtual
        onlyOwner
        returns (uint256)
    {
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
        nonReentrant
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
    function buyMarketItem(uint256 tokenId) external payable nonReentrant {
        address itemOwner = marketItemContract.ownerOf(tokenId);

        require(itemOwner != msg.sender, "You can not buy your own item");
        require(
            marketItemContract.getMarketItem(tokenId).status ==
                marketItemContract.getItemStatuses(0),
            "Item is not for sale"
        );
        require(
            msg.value == marketItemContract.getMarketItem(tokenId).price,
            "Please submit the asking price in order to complete the purchase"
        );

        marketItemContract.transferFrom(itemOwner, msg.sender, tokenId);

        payable(itemOwner).transfer(msg.value);
        marketItemContract.setPrice(
            tokenId,
            0,
            marketItemContract.getItemStatuses(1)
        );

        emit ItemBought(tokenId, msg.sender, itemOwner, msg.value);
    }

    /* Adds bid for specific market item */
    function bidMarketItem(uint256 itemId, uint256 price)
        external
        payable
        nonReentrant
    {
        require(
            msg.value >= price,
            "You have to send enough money to bid on this item"
        );
        require(
            marketItemContract.getMarketItem(itemId).itemId == itemId,
            "No such item"
        );
        require(
            marketItemContract.getMarketItem(itemId).status ==
                marketItemContract.getItemStatuses(0),
            "Item is not for sale"
        );
        require(
            marketItemContract.ownerOf(itemId) != msg.sender,
            "You can not bid your own item"
        );

        lockedBidAmount += msg.value;
        marketItemContract.addBid(itemId, price, msg.sender);

        emit BidCreated(itemId, price, msg.sender);
    }

    /* Accepts bid from bidder for specific market item */
    function acceptItemBid(uint256 tokenId, uint256 bidId)
        external
        payable
        isItemOwner(tokenId)
        nonReentrant
    {
        require(
            marketItemContract.getItemBid(tokenId, bidId).bidId == bidId,
            "No such bid for this item"
        );

        address bidder = marketItemContract.getItemBid(tokenId, bidId).bidder;
        uint256 amount = marketItemContract.getItemBid(tokenId, bidId).amount;

        require(
            lockedBidAmount >= amount,
            "Transaction failed. Contract has not enough wei"
        );

        marketItemContract.transferFrom(msg.sender, bidder, tokenId);

        lockedBidAmount -= amount;
        address(this).balance - amount;
        payable(msg.sender).transfer(amount);

        marketItemContract.setPrice(
            tokenId,
            0,
            marketItemContract.getItemStatuses(1)
        );

        emit BidAccepted(tokenId, bidId, amount, bidder);

        marketItemContract.removeBid(tokenId, bidId);
    }

    /* Cancels bid from bidder for specific market item */
    function cancelItemBid(uint256 tokenId, uint256 bidId)
        external
        payable
        nonReentrant
    {
        require(
            marketItemContract.getMarketItem(tokenId).itemId == tokenId,
            "No such item"
        );

        require(
            marketItemContract.getItemBid(tokenId, bidId).bidId == bidId,
            "No such bid for this item"
        );

        address bidder = marketItemContract.getItemBid(tokenId, bidId).bidder;
        uint256 amount = marketItemContract.getItemBid(tokenId, bidId).amount;

        require(
            lockedBidAmount >= amount,
            "Transaction failed. Contract has not enough wei"
        );
        lockedBidAmount -= amount;
        address(this).balance - amount;
        payable(bidder).transfer(amount);

        marketItemContract.removeBid(tokenId, bidId);

        emit BidCancelled(tokenId, bidId, msg.sender);
    }

    receive() external payable {
        emit Deposit(msg.value);
    }
}
