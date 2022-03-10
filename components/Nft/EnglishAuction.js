import { useWeb3 } from '@3rdweb/hooks';
import { useEffect, useState } from 'react';
import englishDeploy from '../../ethereum/englishDeploy';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import web3 from '../../ethereum/web3';

function EnglishAuction({ auction }) {
  const { address } = useWeb3();
  const [show, setShow] = useState(false);
  const [ended, setEnded] = useState(false);
  const [bid, setBid] = useState('');
  const [pro, setPro] = useState(false);
  const [pro2, setPro2] = useState(false);
  const [pro3, setPro3] = useState(false);
  const [highest, setHighest] = useState('');

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
    const getInfo = async () => {
      const contract = englishDeploy(auction.contractAddress);
      const b = await contract.methods.ended().call();
      // console.log(b);
      if (b === true || b === 'true') {
        setEnded(true);
      } else {
        const c = await contract.methods.highestBid().call();
        setHighest(web3.utils.fromWei(c, 'ether'));
      }
    };

    if (auction) {
      let t = new Date();

      if (new Date(auction.expireAt) > t) {
        setShow(true);
      }
      getInfo();
    }
  }, []);

  const toBuy = async (e) => {
    e.preventDefault();

    if (!address) {
      notify('Wallet not connected or not on rinkeby chain');
      return;
    }
    if (!auction) {
      notify('Something went wrong');
      return;
    }
    setPro(true);
    try {
      const contract = englishDeploy(auction.contractAddress);
      await contract.methods
        .bid()
        .send({ from: address, value: web3.utils.toWei(bid, 'ether') });

      notify('Bid Placed');
    } catch (err) {}
    setBid('');
    setPro(false);
  };

  const toWithdraw = async () => {
    if (!address) {
      notify('Wallet not connected or not on rinkeby chain');
      return;
    }
    if (!auction) {
      notify('Something went wrong');
      return;
    }
    setPro2(true);
    try {
      const contract = englishDeploy(auction.contractAddress);
      await contract.methods.withdraw().send({ from: address });
      notify('Bid Withdrawn');
    } catch (err) {
      console.log(err.message);
    }
    setPro2(false);
  };

  const toEnd = async () => {
    if (!address) {
      notify('Wallet not connected or not on rinkeby chain');
      return;
    }
    if (!auction) {
      notify('Something went wrong');
      return;
    }
    setPro3(true);
    try {
      const contract = englishDeploy(auction.contractAddress);
      await contract.methods.end().send({ from: address });
      notify('Auction Ended');
    } catch (err) {
      console.log(err.message);
    }
    setPro3(false);
  };

  return (
    <div className="bg-gray-200 h-20 w-full flex items-center px-12 rounded-lg border border-gray-300">
      <div className="mx-4 font-medium text-black flex">
        Highest Bid - {highest}
        <span>
          <img
            src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
            alt="eth"
            className="h-5 mr-2 ml-1"
          />
        </span>
      </div>
      {show && (
        <form onSubmit={(e) => toBuy(e)} className="flex items-center m-2 ">
          <div className="bg-white rounded-[10px]  border-[1px] border-solid border-gray-500 flex relative">
            <input
              type="number"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder="Amount to Bid"
              required={true}
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              className="p-2 w-[180px] bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl text-black
                      "
            />
          </div>
          {(!bid || Number(bid) === 0) && (
            <button
              type="submit"
              disabled={true}
              className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold
                opacity-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
            >
              Bid
            </button>
          )}
          {bid && Number(bid) > 0 && !pro && (
            <button
              type="submit"
              className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
            >
              Bid
            </button>
          )}
          {pro && (
            <button
              type="submit"
              disabled={true}
              className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
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
      )}
      {!pro2 && (
        <button
          onClick={() => {
            toWithdraw();
          }}
          className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
        >
          Withdraw
        </button>
      )}
      {pro2 && (
        <button
          disabled={true}
          className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
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
      {!ended && !pro3 && (
        <button
          onClick={() => {
            toEnd();
          }}
          className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
        >
          End
        </button>
      )}
      {!ended && pro3 && (
        <button
          disabled={true}
          className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
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

export default EnglishAuction;
