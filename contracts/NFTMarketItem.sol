// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketItem is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    uint256 private constant TRANSACTION_FEE = 0.075 ether;
    uint256 private constant NULL = 0;

    enum ItemListingStatus {
        Active,
        Sold,
        Cancelled
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

    event MarketItemListed(
        uint256 indexed itemId,
        string indexed name,
        string description,
        uint256 price,
        uint256 collectionId,
        uint256 bid,
        address owner,
        address seller,
        uint256 createdOn,
        ItemListingStatus status
    );

    constructor() ERC721("LimeBlock", "LMB") {}

    function awardItem(
        string memory tokenURI,
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 collectionId
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        uint256 createdOn = block.timestamp;

        _mint(msg.sender, newTokenId);

        marketItems[newTokenId] = MarketItem(
            newTokenId,
            name,
            description,
            price,
            collectionId,
            NULL,
            payable(msg.sender),
            createdOn,
            ItemListingStatus.Active
        );

        marketItemsIds.push(newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    function getMarketItemsLength() external view returns (uint256) {
        return marketItemsIds.length;
    }

    function getNFTMarketItem(uint256 itemId)
        public
        view
        returns (MarketItem memory)
    {
        return marketItems[itemId];
    }
}
