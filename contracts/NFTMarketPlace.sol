// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";
import "./NFTMarketItem.sol";
import "./INFTMarketPlace.sol";

contract NFTMarketPlace is Ownable, ReentrancyGuard, INFTMarketPlace {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionId;
    Counters.Counter private _tokenIds;
    Counters.Counter private _bidIds;

    uint256 private lockedBidAmount = 0;
    uint256 private listingFee = 0.025 ether;
    uint256 private collectedListingFee = 0;
    NFTMarketItem private immutable marketItemContract;

    mapping(uint256 => Collection) public collections;
    mapping(uint256 => MarketItem) public marketItems;
    mapping(uint256 => mapping(uint256 => Bid)) public itemBids;

    uint256[] public collectionsIds;
    uint256[] public marketItemsIds;
    uint256[] public bidsIds;

    modifier onlyItemOwner(uint256 itemId) {
        require(
            marketItemContract.ownerOf(itemId) == msg.sender,
            "Marketplace: item is not owned by you"
        );
        _;
    }

    modifier onlyItemExists(uint256 itemId) {
        require(
            marketItems[itemId].itemId == itemId,
            "Marketplace: no such item"
        );
        _;
    }

    modifier onlyBidExists(uint256 tokenId, uint256 bidId) {
        require(
            itemBids[tokenId][bidId].bidId == bidId,
            "Marketplace: no such bid"
        );
        _;
    }

    modifier onlyValueEnough() {
        require(
            msg.value == listingFee,
            "Marketplace: price must be equal to listing price"
        );
        _;
    }

    modifier onlyForSale(uint256 tokenId) {
        require(
            marketItems[tokenId].status == ItemListingStatus.ForSale,
            "Marketplace: item is not for sale"
        );
        _;
    }

    constructor(address _marketItemAddress) {
        marketItemContract = NFTMarketItem(_marketItemAddress);
    }

    function getLockedBidAmount()
        external
        view
        virtual
        override
        onlyOwner
        returns (uint256)
    {
        return lockedBidAmount;
    }

    /* Transfers collected listing fees to owner */
    function transferListingFee()
        external
        payable
        virtual
        override
        onlyOwner
        nonReentrant
    {
        uint256 fee = collectedListingFee;
        collectedListingFee = 0;
        address(this).balance - fee;
        payable(msg.sender).transfer(fee);

        emit ListingFeeToOwner(collectedListingFee);
    }

    /* Update listing fee */
    function updateListingFee(uint256 _listingFee)
        external
        payable
        virtual
        override
        onlyOwner
    {
        listingFee = _listingFee;
        emit ListingFeeUpdated(_listingFee);
    }

    /* Creates a collection of future NFTs */
    function createCollection(string calldata name, string calldata description)
        external
        virtual
        override
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

        emit CollectionCreated(collectionId, createdOn, msg.sender);
    }

    /* Gets collection array length */
    function getCollectionLength() external view override returns (uint256) {
        return collectionsIds.length;
    }

    /* Mint new NFT item */
    function mintToken(
        string memory tokenURI,
        string calldata name,
        string calldata description,
        uint256 collectionId
    ) public payable virtual override nonReentrant returns (uint256) {
        require(
            collections[collectionId].creator == msg.sender,
            "Marketplace: no collection of yours"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        uint256 createdOn = block.timestamp;

        marketItemContract.mintItem(msg.sender, newTokenId, tokenURI);

        marketItems[newTokenId] = MarketItem(
            newTokenId,
            name,
            description,
            0,
            collectionId,
            createdOn,
            ItemListingStatus.Idle
        );

        marketItemsIds.push(newTokenId);

        emit ItemMinted(newTokenId, 0, collectionId, createdOn);

        return newTokenId;
    }

    function getMarketItemsLength()
        external
        view
        virtual
        override
        returns (uint256)
    {
        return marketItemsIds.length;
    }

    /* Create market sale */
    function createSale(uint256 tokenId, uint256 _price)
        external
        payable
        virtual
        override
        onlyItemExists(tokenId)
        onlyItemOwner(tokenId)
        onlyValueEnough
        nonReentrant
    {
        marketItemContract.setApprovalForAll(_msgSender(), true);

        collectedListingFee += msg.value;
        marketItems[tokenId].price = _price;
        marketItems[tokenId].status = ItemListingStatus.ForSale;

        emit CreateMarketSale(tokenId, _price);
    }

    /* Cancel market sale */
    function cancelSale(uint256 tokenId)
        external
        override
        onlyItemExists(tokenId)
        onlyItemOwner(tokenId)
        onlyForSale(tokenId)
    {
        marketItemContract.setApprovalForAll(_msgSender(), false);

        marketItems[tokenId].price = 0;
        marketItems[tokenId].status = ItemListingStatus.Idle;

        emit CancelMarketSale(tokenId);
    }

    /* Transfers ownership of the item, as well as funds between parties */
    function buyMarketItem(uint256 tokenId)
        external
        payable
        virtual
        override
        nonReentrant
        onlyForSale(tokenId)
    {
        address itemOwner = marketItemContract.ownerOf(tokenId);

        require(
            itemOwner != msg.sender,
            "Marketplace: you can not buy your own item"
        );
        require(
            msg.value == marketItems[tokenId].price,
            "Marketplace: amount must be equal to listing price"
        );

        marketItems[tokenId].price = 0;
        marketItems[tokenId].status = ItemListingStatus.Idle;

        marketItemContract.transferFrom(itemOwner, msg.sender, tokenId);
        payable(itemOwner).transfer(msg.value);

        emit ItemBought(tokenId, msg.sender, itemOwner, msg.value);
    }

    /* Adds bid for specific market item */
    function bidMarketItem(uint256 tokenId)
        external
        payable
        virtual
        override
        onlyItemExists(tokenId)
        nonReentrant
    {
        require(msg.value > 0, "Marketplace: offer must be at least one wei");
        require(
            marketItemContract.ownerOf(tokenId) != msg.sender,
            "Marketplace: you can not bid your own item"
        );

        _bidIds.increment();
        uint256 newBidId = _bidIds.current();

        lockedBidAmount += msg.value;
        itemBids[tokenId][newBidId] = Bid(
            newBidId,
            msg.value,
            payable(msg.sender)
        );

        emit BidCreated(newBidId, msg.value, msg.sender);
    }

    function getItemBidsLength() public view override returns (uint256) {
        return bidsIds.length;
    }

    /* Accepts bid from bidder for specific market item */
    function acceptItemBid(uint256 tokenId, uint256 bidId)
        external
        payable
        virtual
        override
        onlyItemOwner(tokenId)
        onlyBidExists(tokenId, bidId)
        nonReentrant
    {
        address bidder = itemBids[tokenId][bidId].bidder;
        uint256 amount = itemBids[tokenId][bidId].amount;

        require(
            lockedBidAmount >= amount,
            "Marketplace: Transaction failed. Contract has not enough wei"
        );

        marketItems[tokenId].price = 0;
        marketItems[tokenId].status = ItemListingStatus.Idle;

        marketItemContract.transferFrom(msg.sender, bidder, tokenId);

        lockedBidAmount -= amount;
        address(this).balance - amount;
        payable(msg.sender).transfer(amount);

        delete itemBids[tokenId][bidId];

        emit BidAccepted(tokenId, bidId, amount, bidder);
    }

    /* Cancels bid from bidder for specific market item */
    function cancelItemBid(uint256 tokenId, uint256 bidId)
        external
        payable
        override
        onlyItemExists(tokenId)
        onlyBidExists(tokenId, bidId)
        nonReentrant
    {
        address bidder = itemBids[tokenId][bidId].bidder;
        uint256 amount = itemBids[tokenId][bidId].amount;

        require(
            lockedBidAmount >= amount,
            "Marketplace: Transaction failed. Contract has not enough wei"
        );

        lockedBidAmount -= amount;
        address(this).balance - amount;
        payable(bidder).transfer(amount);

        delete itemBids[tokenId][bidId];

        emit BidCancelled(tokenId, bidId, msg.sender);
    }

    receive() external payable virtual override {
        emit Deposit(msg.value);
    }
}
