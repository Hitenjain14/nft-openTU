import React from 'react';
import web3 from '../../ethereum/web3';
import dutchDeployed from '../../ethereum/dutchDeploy';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWeb3 } from '@3rdweb/hooks';
import { useEffect, useState } from 'react';
import axios from 'axios';

function DutchAuction({ auction }) {
  const { address } = useWeb3();
  const [currPirce, setCurrPrice] = useState('');
  const [pro, setPro] = useState(false);
  const getInfo = async () => {
    const contract = dutchDeployed(auction.contractAddress);
    const p = await contract.methods.getPrice().call();
    setCurrPrice(web3.utils.fromWei(p, 'ether'));
  };
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
    getInfo();
  }, []);

  const toBuy = async () => {
    if (!address) {
      notify('Not logged in or not on rinkeby chain');
      return;
    }
    const contract = dutchDeployed(auction.contractAddress);
    setPro(true);
    try {
      const p = await contract.methods.getPrice().call();
      await contract.methods.buy().send({ from: address, value: p });
      const opt = {
        auction: auction,
      };
      notify('Nft Bought');
      await axios.patch('/api/createAuction', opt);
    } catch (err) {
      notify(err.message);
    }
    setPro(false);
    window.location.reload();
  };

  return (
    <div className="bg-gray-200 h-20 w-full flex items-center px-12 rounded-lg border border-gray-300">
      <button
        onClick={() => {
          getInfo();
        }}
        className="ml-6 mr-1 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
      >
        Get Current Price
      </button>
      <div className="ml-4 mr-2 font-medium text-base text-black">
        {currPirce}
      </div>
      {!pro && (
        <button
          onClick={() => {
            toBuy();
          }}
          className="ml-6 px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
        >
          Buy
        </button>
      )}
      {pro && (
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

export default DutchAuction;
