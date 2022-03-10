import { useEffect, useState } from 'react';
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import nftDeployed from '../../ethereum/nftDeploy';
import { useWeb3 } from '@3rdweb/hooks';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';
import Link from 'next/link';

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

function Purchase({ isListed, selectedNft, colAddress }) {
  const { address } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  const getInfo = async () => {
    const contract = nftDeployed(colAddress);
    const owner = await contract.methods.ownerOf(selectedNft.edition).call();
    if (address === owner) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  };
  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });

  const failPurchase = (toastHandler = toast) =>
    toastHandler.error(`Purchase Failed`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });

  const notLogged = (toastHandler = toast) =>
    toastHandler.error(`Not Logged in or on wrong network`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    });
  const buyNft = async () => {
    setLoading(true);
    const contract = nftDeployed(colAddress);
    try {
      const v = web3.utils.toWei(selectedNft.price, 'ether');
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0 || !address) {
        notLogged();
        router.push('/profile');
      }
      await contract.methods
        .buy(selectedNft.edition)
        .send({ from: accounts[0], value: v });

      confirmPurchase();
    } catch (err) {
      failPurchase();
    }
    setLoading(false);
    // window.location.reload();
  };

  useEffect(() => {
    if (colAddress && selectedNft) {
      getInfo();
    }
  }, [address]);

  return (
    <div className="bg-gray-200 h-20 w-full flex items-center px-12 rounded-lg border border-gray-300">
      <Toaster position="top-center" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          {!loading ? (
            <div
              onClick={() => {
                buyNft();
              }}
              className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
            >
              <IoMdWallet className={style.buttonIcon} />

              <div className={style.buttonText}>Buy Now</div>
            </div>
          ) : (
            <button disabled={true} className={`${style.button} bg-[#2081e2]`}>
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
              <div className={style.buttonText}>Buy Now</div>
            </button>
          )}
          {/* <div
            onClick={() => {
              buyNft();
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div> */}
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
          {isOwner && (
            <button
              onClick={() => {
                router.push({
                  pathname: `/list/${selectedNft.edition}`,
                  query: { colAddress: colAddress },
                });
              }}
              className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
            >
              <IoMdWallet className={style.buttonIcon} />

              <div className={style.buttonText}>Edit Listing</div>
            </button>
          )}
        </>
      ) : isOwner ? (
        <button
          onClick={() => {
            router.push({
              pathname: `/list/${selectedNft.edition}`,
              query: { colAddress: colAddress },
            });
          }}
          className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
        >
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </button>
      ) : (
        <button
          disabled={true}
          className="bg-blue-500 opacity-10 mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer"
        >
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </button>
      )}
    </div>
  );
}

export default Purchase;
