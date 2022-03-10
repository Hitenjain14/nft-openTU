// SPDX-License-Identifier: MIT


pragma solidity ^0.8.7;

import "./utils/IERC165.sol";

interface IERC721 is IERC165{

    event Transfer(address indexed from,address indexed to,uint indexed tokenId);

    event Approval(address indexed owner,address indexed spender,uint indexed tokenId);

    event ApprovalForAll(address indexed owner,address indexed operator,bool approved);

    function balanceOf(address owner) external view returns(uint);

    function ownerOf(uint tokenId) external view returns(address);

    function safeTransferFrom(address from,address to,uint tokenId) external;

    function transferFrom(address from,address to,uint tokenId) external;

    function approve(address to,uint tokenId) external;

    function getApproved(uint tokenId) external view returns(address);

    function setApprovalForAll(address operator,bool _approved) external;

    function isApprovedForAll(address owner,address operator) external view returns(bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

} 