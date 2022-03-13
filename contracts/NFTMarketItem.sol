// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract NFTMarketItem is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _bidIds;

    uint256 private listingFee = 0.025 ether;
    uint256 private collectedListingFee = 0;

    enum ItemListingStatus {
        ForSale,
        Idle
    }

    struct MarketItem {
        uint256 itemId;
        string name;
        string description;
        uint256 price;
        uint256 collectionId;
        uint256 createdOn;
        ItemListingStatus status;
    }

    struct Bid {
        uint256 bidId;
        uint256 amount;
        address bidder;
    }

    uint256[] public marketItemsIds;
    uint256[] public bidsIds;

    mapping(uint256 => MarketItem) public marketItems;
    mapping(uint256 => mapping(uint256 => Bid)) public itemBids;

    event MarketItemListed(
        uint256 indexed itemId,
        string indexed name,
        string description,
        uint256 price,
        uint256 collectionId,
        uint256 createdOn,
        ItemListingStatus status
    );

    event CreateMarketSale(uint256 itemId, uint256 price);
    event CancelMarketSale(uint256 itemId);

    event ListingFeeUpdated(uint256 newListingFee);

    modifier itemExists(uint256 itemId) {
        require(marketItems[itemId].itemId == itemId, "No such item");
        _;
    }

    modifier isForSale(uint256 itemId) {
        require(
            marketItems[itemId].status != ItemListingStatus.ForSale,
            "Item is already for sale"
        );
        _;
    }

    modifier isValueEnough() {
        require(
            msg.value == listingFee,
            "Price must be equal to listing price"
        );
        _;
    }

    modifier isItemOwner(uint256 itemId) {
        require(
            ERC721.ownerOf(itemId) == msg.sender,
            "Item is not owned by you"
        );
        _;
    }

    constructor() ERC721("LimeBlock", "LMB") {}

    function setPrice(
        uint256 itemId,
        uint256 _price,
        ItemListingStatus _status
    ) external {
        marketItems[itemId].price = _price;
        marketItems[itemId].status = _status;
    }

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    function updateListingFee(uint256 _listingFee) external payable onlyOwner {
        listingFee = _listingFee;
        emit ListingFeeUpdated(_listingFee);
    }

    function getCollectedListingFee()
        external
        view
        onlyOwner
        returns (uint256)
    {
        return collectedListingFee;
    }

    function resetCollectedListingFee() external {
        collectedListingFee = 0;
    }

    /* Mints an unique NFT token */
    function mintItem(
        string memory tokenURI,
        string calldata name,
        string calldata description,
        uint256 collectionId
    ) external nonReentrant returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        uint256 createdOn = block.timestamp;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

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

        emit MarketItemListed(
            newTokenId,
            name,
            description,
            0,
            collectionId,
            createdOn,
            ItemListingStatus.Idle
        );

        return newTokenId;
    }

    function getMarketItemsLength() external view returns (uint256) {
        return marketItemsIds.length;
    }

    function getMarketItem(uint256 itemId)
        external
        view
        returns (MarketItem memory)
    {
        return marketItems[itemId];
    }

    function createSale(uint256 itemId, uint256 _price)
        external
        payable
        itemExists(itemId)
        isItemOwner(itemId)
        isValueEnough
        nonReentrant
    {
        approve(address(this), itemId);
        collectedListingFee += msg.value;
        marketItems[itemId].price = _price;
        marketItems[itemId].status = ItemListingStatus.ForSale;

        emit CreateMarketSale(itemId, _price);
    }

    function cancelSale(uint256 itemId)
        external
        itemExists(itemId)
        isItemOwner(itemId)
    {
        require(
            marketItems[itemId].status == ItemListingStatus.ForSale,
            "Item is not for sale"
        );

        approve(address(0), itemId);
        marketItems[itemId].price = 0;
        marketItems[itemId].status = ItemListingStatus.Idle;

        emit CancelMarketSale(itemId);
    }

    function addBid(
        uint256 itemId,
        uint256 price,
        address bidder
    ) external itemExists(itemId) {
        _bidIds.increment();
        uint256 newBidId = _bidIds.current();

        itemBids[itemId][newBidId] = Bid(newBidId, price, bidder);
    }

    function removeBid(uint256 itemId, uint256 bidId)
        external
        itemExists(itemId)
    {
        delete itemBids[itemId][bidId];
    }

    function getItemBidsLength() public view returns (uint256) {
        return bidsIds.length;
    }

    function getItemBid(uint256 itemId, uint256 bidId)
        external
        view
        itemExists(itemId)
        returns (Bid memory)
    {
        return itemBids[itemId][bidId];
    }
}
