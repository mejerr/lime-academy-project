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
    uint256 private listingFee = 0.025 ether;
    uint256 private constant NULL = 0;

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
        uint256 bid; // could be []/mapping of bids
        address payable owner;
        uint256 createdOn;
        ItemListingStatus status;
    }

    uint256[] public marketItemsIds;

    mapping(uint256 => MarketItem) public marketItems;
    mapping(uint256 => address) public allowance;

    event MarketItemListed(
        uint256 indexed itemId,
        string indexed name,
        string description,
        uint256 price,
        uint256 collectionId,
        uint256 bid,
        address owner,
        uint256 createdOn,
        ItemListingStatus status
    );

    event AllowanceChanged(
        address indexed _forWho,
        address indexed _fromWhom,
        uint256 tokenId
    );

    constructor() ERC721("LimeBlock", "LMB") {}

    function awardItem(
        string memory tokenURI,
        string calldata name,
        string calldata description,
        uint256 collectionId
    ) public returns (uint256) {
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
            NULL,
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
            NULL,
            payable(msg.sender),
            createdOn,
            ItemListingStatus.NotForSale
        );

        return newTokenId;
    }

    function getMarketItemsLength() external view returns (uint256) {
        return marketItemsIds.length;
    }

    function addAllowance(uint256 itemId) internal {
        allowance[itemId] = address(this);
        emit AllowanceChanged(address(this), msg.sender, itemId);
    }

    function removeAllowance(uint256 itemId) internal {
        allowance[itemId] = address(0);
        emit AllowanceChanged(address(0), msg.sender, itemId);
    }

    function getListingPrice() public view returns (uint256) {
        return listingFee;
    }

    function updateListingPrice(uint256 _listingFee) public payable onlyOwner {
        listingFee = _listingFee;
        //Event
    }

    function createMarketItemSale(uint256 itemId, uint256 _price)
        external
        payable
        onlyOwner
    {
        require(
            msg.value == listingFee,
            "Price must be equal to listing price"
        );
        require(marketItems[itemId].itemId != NULL, "No such item");
        require(
            marketItems[itemId].status != ItemListingStatus.ForSale,
            "Item is already for sale"
        );
        addAllowance(itemId);
        marketItems[itemId].price = _price;
        marketItems[itemId].status = ItemListingStatus.ForSale;
        //Event
    }

    function cancelMarketItemSale(uint256 itemId) external onlyOwner {
        require(marketItems[itemId].itemId != NULL, "No such item");
        require(
            marketItems[itemId].status != ItemListingStatus.NotForSale,
            "Item is not for sale"
        );
        removeAllowance(itemId);
        marketItems[itemId].price = 0;
        marketItems[itemId].status = ItemListingStatus.NotForSale;
        //Event
    }

    function getNFTMarketItem(uint256 itemId)
        external
        view
        returns (MarketItem memory)
    {
        return marketItems[itemId];
    }

    function changeOwner(uint256 itemId, address newOwner) external {
        marketItems[itemId].owner = payable(newOwner);
    }

    function changeItemStatus(uint256 itemId, ItemListingStatus _status)
        external
    {
        marketItems[itemId].status = _status;
    }

    function changeItemPrice(uint256 itemId, uint256 _price) external {
        marketItems[itemId].price = _price;
    }
}
