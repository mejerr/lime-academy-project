// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketItem is ERC721URIStorage {
    constructor() ERC721("LimeBlock", "LMB") {}

    function mintItem(
        address owner,
        uint256 tokenId,
        string calldata tokenURI
    ) external virtual {
        _mint(owner, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function setApprovalForAll(address sender, bool approved)
        public
        virtual
        override
    {
        super._setApprovalForAll(sender, _msgSender(), approved);
    }
}
