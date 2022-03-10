import web3 from './web3';

const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_base',
        type: 'string',
      },
      {
        internalType: 'uint96',
        name: '_royaltyFeesInBips',
        type: 'uint96',
      },
      {
        internalType: 'address',
        name: '_royaltyAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'toMint',
        type: 'uint256',
      },
    ],
    name: 'createCollection',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollection',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'nftCollection',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const instance = new web3.eth.Contract(
  abi,
  '0x13e6f420903469A79aC089Cd5e4Afcc410FF3de1'
);

export default instance;
