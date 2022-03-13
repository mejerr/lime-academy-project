// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract NFTMarketItem is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _bidIds;

    uint256 private listingFee = 0.025 ether;
    uint256 private collectedListingFee = 0;

    enum ItemListingStatus {
        ForSale,
        NotForSale
    }

    struct MarketItem {
        uint256 itemId;
        string name;
        string description;
        uint256 price;
        uint256 collectionId;
        address payable owner;
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
    mapping(uint256 => address) public allowance;

    event MarketItemListed(
        uint256 indexed itemId,
        string indexed name,
        string description,
        uint256 price,
        uint256 collectionId,
        address owner,
        uint256 createdOn,
        ItemListingStatus status
    );

    event CreateMarketSale(uint256 itemId, uint256 price);
    event CancelMarketSale(uint256 itemId);

    event AllowanceChanged(
        address indexed _forWho,
        address indexed _fromWhom,
        uint256 tokenId
    );

    event ListingFeeUpdated(uint256 newListingFee);

    constructor() ERC721("LimeBlock", "LMB") {}

    function setOwner(uint256 itemId, address newOwner) external {
        marketItems[itemId].owner = payable(newOwner);
    }

    function setStatus(uint256 itemId, ItemListingStatus _status) external {
        marketItems[itemId].status = _status;
    }

    function setPrice(uint256 itemId, uint256 _price) external {
        marketItems[itemId].price = _price;
    }

    /* Adds allowance to contract to use token */
    function addAllowance(uint256 itemId) internal {
        allowance[itemId] = address(this);
        emit AllowanceChanged(address(this), msg.sender, itemId);
    }

    /* Removes allowance to contract to use token */
    function removeAllowance(uint256 itemId) internal {
        allowance[itemId] = address(0);
        emit AllowanceChanged(address(0), msg.sender, itemId);
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
    ) external returns (uint256) {
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
            payable(msg.sender),
            createdOn,
            ItemListingStatus.NotForSale
        );

        marketItemsIds.push(newTokenId);

        emit MarketItemListed(
            newTokenId,
            name,
            description,
            0,
            collectionId,
            payable(msg.sender),
            createdOn,
            ItemListingStatus.NotForSale
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

    /* Puts NFT token for sale */
    function createSale(uint256 itemId, uint256 _price) external payable {
        require(marketItems[itemId].itemId == itemId, "No such item");
        require(
            marketItems[itemId].owner == msg.sender,
            "Item is not owned by you"
        );
        require(
            msg.value == listingFee,
            "Price must be equal to listing price"
        );
        require(
            marketItems[itemId].status != ItemListingStatus.ForSale,
            "Item is already for sale"
        );

        addAllowance(itemId);
        collectedListingFee += msg.value;
        marketItems[itemId].price = _price;
        marketItems[itemId].status = ItemListingStatus.ForSale;

        emit CreateMarketSale(itemId, _price);
    }

    function cancelSale(uint256 itemId) external onlyOwner {
        require(marketItems[itemId].itemId != 0, "No such item");
        require(
            marketItems[itemId].status == ItemListingStatus.ForSale,
            "Item is not for sale"
        );

        removeAllowance(itemId);
        marketItems[itemId].price = 0;
        marketItems[itemId].status = ItemListingStatus.NotForSale;

        emit CancelMarketSale(itemId);
    }

    /* Adds bid from user to specific token */
    function addBid(
        uint256 itemId,
        uint256 price,
        address bidder
    ) external {
        _bidIds.increment();
        uint256 newBidId = _bidIds.current();

        itemBids[itemId][newBidId] = Bid(newBidId, price, bidder);
    }

    function removeBid(uint256 itemId, uint256 bidId) external {
        delete itemBids[itemId][bidId];
    }

    function getItemBidsLength() public view returns (uint256) {
        return bidsIds.length;
    }

    function getItemBid(uint256 itemId, uint256 bidId)
        external
        view
        returns (Bid memory)
    {
        return itemBids[itemId][bidId];
    }
}
