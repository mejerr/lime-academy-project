// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract MarketPlace is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionIds;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    uint256 private constant TRANSACTION_FEE = 0.075 ether;

    enum ItemListingStatus {
        Active,
        Sold,
        Cancelled
    }

    struct Collection {
        uint256 collectionId;
        string name;
        string description;
        string createdOn;
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
        string createdOn;
        ItemListingStatus status;
    }

    uint256[] public collectionsIds;
    uint256[] public marketItemsIds;

    mapping(uint256 => Collection) private collections;
    mapping(uint256 => MarketItem) private marketItems;

    event CollectionCreated(
        uint256 indexed collectionId,
        string name,
        string description,
        string createdOn,
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
        string createdOn,
        ItemListingStatus status
    );

    event CancelSale(uint256 itemId, address seller);
}
