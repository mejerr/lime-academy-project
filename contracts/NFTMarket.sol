// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract MarketPlace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionId;
    Counters.Counter private _tokenId;
    Counters.Counter private _itemsSold;

    uint256 private constant TRANSACTION_FEE = 0.075 ether;
    uint256 private constant NULL = 0;

    enum ItemListingStatus {
        Active,
        Sold,
        Cancelled
    }

    struct Collection {
        uint256 collectionId;
        string name;
        string description;
        uint256 createdOn;
        address creator;
    }

    struct MarketItem {
        uint256 itemId;
        string name;
        string decription;
        uint256 price;
        uint256 collectionId;
        uint256 bid; // could be []/mapping of bids
        address payable owner;
        address payable seller;
        bool isSold;
        uint256 createdOn;
        ItemListingStatus status;
    }

    uint256[] public collectionsIds;
    uint256[] public marketItemsIds;

    mapping(uint256 => Collection) private collections;
    mapping(uint256 => MarketItem) private marketItems;

    event CollectionCreated(
        uint256 indexed collectionId,
        string indexed name,
        string description,
        uint256 createdOn,
        address creator
    );

    event MarketItemListed(
        uint256 indexed itemId,
        string indexed name,
        string decription,
        uint256 price,
        uint256 collectionId,
        uint256 bid,
        address owner,
        address seller,
        bool isSold,
        uint256 createdOn,
        ItemListingStatus status
    );

    event CancelSale(uint256 itemId, address seller);

    constructor() ERC721("LimeBlock", "LMB") {}

    /* Creates a collection of future NFTs */
    function createCollection(string calldata name, string calldata description)
        public
        payable
    {
        _collectionId.increment();
        uint256 collectionId = _collectionId.current();
        uint256 createdOn = block.timestamp;

        console.log(123, createdOn);

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

    /* Mints a token and lists it in the marketplace */
    function createToken(
        string memory tokenURI,
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 collectionId
    ) public payable returns (uint256) {
        _tokenId.increment();
        uint256 newTokenId = _tokenId.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, name, description, price, collectionId);

        return newTokenId;
    }

    /* Creates a new of NFT MarketItem */
    function createMarketItem(
        uint256 tokenId,
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 collectionId
    ) private {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == TRANSACTION_FEE,
            "Price must be equal to listing price"
        );
        uint256 createdOn = block.timestamp;

        marketItems[tokenId] = MarketItem(
            tokenId,
            name,
            description,
            price,
            collectionId,
            NULL,
            payable(msg.sender),
            payable(address(this)),
            false,
            createdOn,
            ItemListingStatus.Active
        );

        marketItemsIds.push(tokenId);

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemListed(
            tokenId,
            name,
            description,
            price,
            collectionId,
            NULL,
            msg.sender,
            address(this),
            false,
            createdOn,
            ItemListingStatus.Active
        );
    }

    function getMarketItemsLength() external view returns (uint256) {
        return marketItemsIds.length;
    }
}
