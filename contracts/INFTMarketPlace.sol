// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

interface INFTMarketPlace {
    enum ItemListingStatus {
        ForSale,
        Idle
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
        string description;
        uint256 price;
        uint256 collectionId;
        uint256 createdOn;
        ItemListingStatus status;
    }

    struct Bid {
        uint256 bidId;
        uint256 amount;
        address payable bidder;
    }

    event CollectionCreated(
        uint256 indexed collectionId,
        uint256 createdOn,
        address creator
    );

    event ItemMinted(
        uint256 indexed itemId,
        uint256 price,
        uint256 collectionId,
        uint256 createdOn
    );

    event CreateMarketSale(uint256 itemId, uint256 price);
    event CancelMarketSale(uint256 itemId);

    event ItemBought(
        uint256 indexed itemId,
        address buyer,
        address owner,
        uint256 price
    );

    event BidCreated(uint256 indexed bidId, uint256 price, address bidder);
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
    event ListingFeeUpdated(uint256 newListingFee);
    event Deposit(uint256 price);

    function getLockedBidAmount() external view returns (uint256);

    function transferListingFee() external payable;

    function updateListingFee(uint256 listingFee) external payable;

    function createCollection(string calldata name, string calldata description)
        external;

    function getCollectionLength() external view returns (uint256);

    function mintToken(
        string memory tokenURI,
        string calldata name,
        string calldata description,
        uint256 collectionId
    ) external payable returns (uint256);

    function getMarketItemsLength() external view returns (uint256);

    function createSale(uint256 itemId, uint256 _price) external payable;

    function cancelSale(uint256 itemId) external;

    function buyMarketItem(uint256 tokenId) external payable;

    function bidMarketItem(uint256 itemId) external payable;

    function getItemBidsLength() external view returns (uint256);

    function acceptItemBid(uint256 tokenId, uint256 bidId) external payable;

    function cancelItemBid(uint256 tokenId, uint256 bidId) external payable;

    receive() external payable;
}