import React, { useEffect } from 'react';
import { useState } from 'react';
import web3 from '../../ethereum/web3';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import nftDeployed from '../../ethereum/nftDeploy';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';

function ToBuy() {
  const [price, setPrice] = useState('');
  const [pro, setPro] = useState(false);
  const [allow, setAllow] = useState(false);
  const [pro2, setPro2] = useState(false);
  const { address, chainId } = useWeb3();
  const router = useRouter();
  const [listed, setListed] = useState(false);

  useEffect(() => {
    const { listId, colAddress } = router.query;
    const getListed = async () => {
      const contract = nftDeployed(colAddress);
      try {
        const p = await contract.methods.tokendIdPrice(listId).call();
        if (p && Number(p) > 0) {
          setListed(true);
        } else {
          setListed(false);
        }
      } catch (err) {}
    };
    if (listId && colAddress) {
      getListed();
    }
  }, []);

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
    if (price && Number(price) > 0) {
      setAllow(true);
    } else {
      setAllow(false);
    }
  }, [price]);

  const setNoBuy = async () => {
    setPro2(true);
    const { listId, colAddress } = router.query;

    const contract = nftDeployed(colAddress);
    try {
      if (!address) {
        notify('Not logged in or not on rinkeby network');
        setPro2(false);
        return;
      }
      await contract.methods.disallowBuy(listId).send({ from: address });
    } catch (err) {}
    setPro2(false);
    window.location.reload();
  };

  const getBuy = async (e) => {
    e.preventDefault();
    setPro(true);
    const p = web3.utils.toWei(price, 'ether');
    if (!address) {
      notify('Not logged in or not on rinkeby');
      setPro(false);
      return;
    }
    const { listId, colAddress } = router.query;
    try {
      const contract = nftDeployed(colAddress);
      await contract.methods.allowBuy(p, listId).send({ from: address });
    } catch (err) {
      notify(err.message);
    }
    setPrice('');
    setPro(false);
  };

  return (
    <div className="">
      <form className="mb-6 max-w-[750px] w-full" onSubmit={(e) => getBuy(e)}>
        <p className="font-medium text-base text-gray-600 my-2">
          Only One Auction can run at a time
        </p>
        <div className="mb-6 flex flex-col ">
          <div className="flex flex-col">
            <div className="flex flex-col mb-2 ">
              <p className="font-semibold ">Set Price </p>
              <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                <input
                  type="number"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="Set sale price(in ether)"
                  required={true}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
            Set Price
          </button>
        )}
        {allow && !pro && (
          <button
            type="submit"
            disabled={pro2}
            className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
          >
            Set Price
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
      <div className="">
        {!listed && (
          <button
            type="submit"
            disabled={true}
            className="px-4 py-2.5 text-center  outline-none border-none text-lg font-semibold
                opacity-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
          >
            Disallow Buy
          </button>
        )}
        {listed && !pro2 && (
          <button
            type="submit"
            onClick={() => setNoBuy()}
            disabled={pro}
            className="px-4 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
          >
            Disallow Buy
          </button>
        )}
        {pro2 && (
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

export default ToBuy;
