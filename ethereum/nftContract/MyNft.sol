// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./ERC721.sol";

contract NftFactory {
    mapping(address => address) public nftCollection;

    function createCollection(
        string memory name_,
        string memory symbol_,
        string memory _base,
        uint96 _royaltyFeesInBips,
        address _royaltyAddress,
        uint256 toMint
    ) public {
        MyNft nft = new MyNft(
            name_,
            symbol_,
            msg.sender,
            _base,
            _royaltyFeesInBips,
            _royaltyAddress,
            toMint
        );
        nftCollection[msg.sender] = address(nft);
    }

    function getCollection() public view returns (address) {
        return nftCollection[msg.sender];
    }
}

contract MyNft is ERC721 {
    string public baseURI;
    address public immutable owner;
    uint256 public tokenCounter = 0;
    mapping(uint256 => uint256) public tokendIdPrice;
    uint96 public royaltyFeesInBips;
    address public royaltyAddress;

    constructor(
        string memory name_,
        string memory symbol_,
        address _owner,
        string memory _base,
        uint96 _royaltyFeesInBips,
        address _royaltyAddress,
        uint256 toMint
    ) ERC721(name_, symbol_) {
        owner = _owner;
        baseURI = _base;
        royaltyFeesInBips = _royaltyFeesInBips;
        royaltyAddress = _royaltyAddress;
        for (uint256 i = 0; i < toMint; i++) {
            tokenCounter++;
            _safeMint(_owner, tokenCounter);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function allowBuy(uint256 _price, uint256 tokenId) external {
        require(
            ERC721._isApprovedOrOwner(msg.sender, tokenId),
            "Not the owner or approved"
        );
        require(_price > 0, "price cant be 0");
        tokendIdPrice[tokenId] = _price;
    }

    function disallowBuy(uint256 tokenId) external {
        require(
            ERC721._isApprovedOrOwner(msg.sender, tokenId),
            "not approved or owner"
        );
        tokendIdPrice[tokenId] = 0;
    }

    function buy(uint256 tokenId) external payable {
        uint256 price = tokendIdPrice[tokenId];
        require(price > 0, "Price 0");
        require(msg.value == price, "price does not match");
        address seller = ERC721.ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        tokendIdPrice[tokenId] = 0;
        uint256 val = calculateRoyalty(price);
        (bool success, ) = payable(royaltyAddress).call{value: val}("");
        require(success, "transaction failed");
        uint256 left = price - val;
        (bool done, ) = payable(seller).call{value: left}("");
        require(done);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public onlyOwner {
        tokenCounter++;
        _safeMint(to, tokenCounter);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address, uint256)
    {
        return (royaltyAddress, calculateRoyalty(_salePrice));
    }

    function setRoyaltyInfo(address _royaltyAddress, uint96 _royaltyFeesInBips)
        external
        onlyOwner
    {
        royaltyAddress = _royaltyAddress;
        royaltyFeesInBips = _royaltyFeesInBips;
    }

    function calculateRoyalty(uint256 _salePrice)
        public
        view
        returns (uint256)
    {
        return (_salePrice / 10000) * royaltyFeesInBips;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return
            interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }
}
