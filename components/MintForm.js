import { useEffect, useState } from 'react';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCopy } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

function MintForm() {
  const [colName, setColName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [baseURI, setBaseURI] = useState('');
  const [royaltyAddress, setRoyaltyAddress] = useState('');
  const [fees, setFees] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [allow, setAllow] = useState(false);
  const [pro, setPro] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const notify = (msg) => {
    toast.info(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  useEffect(() => {
    if (
      colName &&
      symbol &&
      baseURI &&
      royaltyAddress?.length === 42 &&
      fees &&
      tokens
    ) {
      setAllow(true);
    } else {
      setAllow(false);
    }
  }, [colName, symbol, baseURI, royaltyAddress, fees, tokens]);

  const createContract = async (e) => {
    e.preventDefault();
    setPro(true);
    var numb = Number(fees);
    numb = Number(numb.toFixed(2));
    numb = numb * 100;
    if (baseURI.slice(-1) !== '/') {
      notify('Base URI must end wiht /');
      setColName('');
      setSymbol('');
      setBaseURI('');
      setRoyaltyAddress('');
      setFees(null);
      setTokens(null);
      setPro(false);
      return;
    }
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw Error('Cannot connect to metamask');
      }

      await factory.methods
        .createCollection(
          colName,
          symbol,
          baseURI,
          numb,
          royaltyAddress,
          tokens
        )
        .send({ from: accounts[0] });

      const nft = await factory.eth.getCollection().call({ from: accounts[0] });
      setContractAddress(nft);
    } catch (err) {
      notify(err.message);
    }
    setColName('');
    setSymbol('');
    setBaseURI('');
    setRoyaltyAddress('');
    setFees(null);
    setTokens(null);
    setPro(false);
  };

  return (
    <div className="">
      <div className="flex flex-col items-center">
        <div className="max-w-[1280px] py-[24px] mx-auto min-w-[750px]">
          <header className="font-bold justify-start text-[40px] mb-4 leading-[110%] mt-4 flex flex-col">
            <h1>Create your own ERC721 Contract</h1>
          </header>
          <form
            className="mb-8 max-w-[750px] w-full"
            onSubmit={(e) => createContract(e)}
          >
            <p className="font-medium text-base text-gray-600 my-2">
              <span className="text-red-500">*</span> Required Fields
            </p>
            <div className="mb-6 flex flex-col ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2 ">
                  <p className='font-semibold text-lg after:content-["*"] after:text-red-500  '>
                    Name{' '}
                  </p>
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="text"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Collection name"
                      required={true}
                      value={colName}
                      onChange={(e) => setColName(e.target.value)}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex flex-col ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2 ">
                  <p className='font-semibold text-lg after:content-["*"] after:text-red-500  '>
                    Symbol{' '}
                  </p>
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="text"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Symbol"
                      required={true}
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex flex-col ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2 ">
                  <p className='font-semibold text-lg after:content-["*"] after:text-red-500  '>
                    Base URI{' '}
                  </p>
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="text"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Base URI where metadata is located, ending with a /"
                      required={true}
                      value={baseURI}
                      onChange={(e) => setBaseURI(e.target.value)}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex flex-col ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2 ">
                  <p className='font-semibold text-lg after:content-["*"] after:text-red-500  '>
                    Royalty Wallet Address{' '}
                  </p>
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="text"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Royalty wallet address where royalty will be sent on every transfer"
                      required={true}
                      value={royaltyAddress}
                      onChange={(e) => setRoyaltyAddress(e.target.value)}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex flex-col ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2 ">
                  <p className='font-semibold text-lg after:content-["*"] after:text-red-500  '>
                    Royalty Fees{' '}
                  </p>
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="number"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Royalty fees in % upto 2 decimals, max is 50%"
                      required={true}
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex flex-col ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2 ">
                  <p className='font-semibold text-lg after:content-["*"] after:text-red-500  '>
                    Nft's to Mint{' '}
                  </p>
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Nft To Mint"
                      required={true}
                      value={tokens}
                      // @ts-ignore
                      onChange={(e) => {
                        // @ts-ignore
                        setTokens(Math.floor(e.target.value));
                        if (tokens === 0) {
                          setTokens(null);
                        }
                      }}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            {!allow && (
              <button
                type="submit"
                disabled={true}
                className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold
                opacity-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
              >
                Create
              </button>
            )}
            {allow && !pro && (
              <button
                type="submit"
                className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
              >
                Create
              </button>
            )}
            {pro && (
              <button
                type="submit"
                disabled={true}
                className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </button>
            )}
          </form>
          {contractAddress && (
            <div className="flex justify-start items-center p-3">
              <div className="font-medium text-gray-800 p-1">
                Contract Address is - {contractAddress}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(contractAddress);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1500);
                }}
              >
                {copied ? <FaCheck className="text-green-500" /> : <BiCopy />}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Flip}
      />
    </div>
  );
}

export default MintForm;
