// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

interface IERC721 {
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address, uint256);
}

contract FactoryAuction {
    mapping(address => address) public englishAuctions;
    mapping(address => address) public dutchAuctions;

    function createEnglishAuction(
        address _nft,
        uint256 _nftId,
        uint256 _startingBid
    ) external {
        EnglishAuction auc = new EnglishAuction(
            _nft,
            _nftId,
            _startingBid,
            msg.sender
        );
        englishAuctions[msg.sender] = address(auc);
    }

    function getEnglishAuction() external view returns (address) {
        return englishAuctions[msg.sender];
    }

    function createDutchCampaign(
        address _nft,
        uint256 _nftId,
        uint256 _startingPrice,
        uint256 _discountRate
    ) external {
        DutchAuction auc = new DutchAuction(
            _nft,
            _nftId,
            _startingPrice,
            _discountRate,
            msg.sender
        );
        dutchAuctions[msg.sender] = address(auc);
    }

    function getDutchAuction() external view returns (address) {
        return dutchAuctions[msg.sender];
    }
}

contract EnglishAuction {
    event Start();
    event Bid(address indexed sender, uint256 amount);
    event Withdraw(address indexed bidder, uint256 amount);
    event End(address indexed highestBidder, uint256 highestBid);

    IERC721 public immutable nft;
    uint256 public immutable nftId;

    address payable public immutable seller;
    uint32 public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint256 public highestBid;

    mapping(address => uint256) bids;

    constructor(
        address _nft,
        uint256 _nftId,
        uint256 _startingBid,
        address owner
    ) {
        nft = IERC721(_nft);
        nftId = _nftId;
        highestBid = _startingBid;
        seller = payable(owner);
    }

    modifier onlySeller() {
        require(msg.sender == seller, "only seller can start auction");
        _;
    }

    function start() external onlySeller {
        require(!started, "already started");
        started = true;
        endAt = uint32(block.timestamp + 3 days);
        nft.transferFrom(seller, address(this), nftId);
        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        uint256 val = bids[msg.sender] + msg.value;
        require(val > highestBid, "only amount greater than highest bid");
        highestBid = val;
        bids[msg.sender] = val;
        highestBidder = msg.sender;

        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender != highestBidder, "highest bidder cant withdraw");
        uint256 bal = bids[msg.sender];
        require(bal > 0, "no bid from this address");
        bids[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: bal}("");
        require(success, "transaction failed");
        emit Withdraw(msg.sender, bal);
    }

    function end() external {
        require(started, "not started");
        require(!ended, "ended");
        require(block.timestamp >= endAt, "not ended");

        ended = true;
        if (highestBidder == address(0)) {
            nft.transferFrom(address(this), seller, nftId);
        } else {
            (address royalty, uint256 royaltyFees) = nft.royaltyInfo(
                nftId,
                highestBid
            );
            uint256 val = highestBid - royaltyFees;
            nft.transferFrom(address(this), highestBidder, nftId);
            (bool done, ) = payable(royalty).call{value: royaltyFees}("");
            require(done, "transaction failed");
            (bool success, ) = seller.call{value: val}("");
            require(success, "transaction failed");
        }
        emit End(highestBidder, highestBid);
    }
}

contract DutchAuction {
    uint256 private constant DURATION = 3 days;

    IERC721 public immutable nft;
    uint256 public immutable nftId;

    address payable public immutable seller;
    uint256 public immutable startingPrice;
    uint256 public immutable startAt;
    uint256 public immutable expiresAt;
    uint256 public immutable discountRate;

    constructor(
        address _nft,
        uint256 _nftId,
        uint256 _startingPrice,
        uint256 _discountRate,
        address owner
    ) {
        require(
            _startingPrice >= _discountRate * DURATION,
            "starting price < discountRate"
        );
        nft = IERC721(_nft);
        nftId = _nftId;
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        seller = payable(owner);
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;
    }

    function getPrice() public view returns (uint256) {
        uint256 elapsedTime = block.timestamp - startAt;
        uint256 discount = discountRate * elapsedTime;
        return startingPrice - discount;
    }

    function buy() external payable {
        require(block.timestamp < expiresAt, "auction expired");
        uint256 price = getPrice();
        require(msg.value >= price, "value sent is lower");

        nft.transferFrom(seller, msg.sender, nftId);
        uint256 refund = msg.value - price;
        (bool d, ) = payable(msg.sender).call{value: refund}("");
        require(d, "transaction failed");
        (address royalty, uint256 royaltyFees) = nft.royaltyInfo(nftId, price);
        (bool done, ) = payable(royalty).call{value: royaltyFees}("");
        require(done, "transaction failed");
        selfdestruct(seller);
    }
}
