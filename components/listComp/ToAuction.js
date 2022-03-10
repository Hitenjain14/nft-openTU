import web3 from '../../ethereum/web3';
import nftDeployed from '../../ethereum/nftDeploy';
import auctionFactory from '../../ethereum/auctionFactory';
import englishDeployed from '../../ethereum/englishDeploy';
import dutchDeployed from '../../ethereum/dutchDeploy';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';
import axios from 'axios';

function ToAuction() {
  const [bid, setBid] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const { address } = useWeb3();
  const [allow, setAllow] = useState(true);
  const [pro, setPro] = useState(false);
  const [pro2, setPro2] = useState(false);
  const router = useRouter();
  const { listId, colAddress } = router.query;
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
      try {
        const aucAddress = await auctionFactory.methods
          .englishAuctions(address)
          .call();

        // console.log(aucAddress);
        let flag = false;
        if (aucAddress === '0x0000000000000000000000000000000000000000') {
          flag = true;
        } else {
          // console.log(aucAddress);
          const aucDeployed = englishDeployed(aucAddress);
          const start = await aucDeployed.methods.started().call();
          const end = await aucDeployed.methods.ended().call();
          // console.log(start, end);
          if (
            (start === true || start === 'true') &&
            (end === false || end === 'false')
          ) {
            setAllow(false);
          } else {
            flag = true;
          }
        }
        if (flag) {
          const dutchAddress = await auctionFactory.methods
            .dutchAuctions(address)
            .call();

          if (dutchAddress === '0x0000000000000000000000000000000000000000') {
            flag = true;
          } else {
            const ducDeployed = dutchDeployed(dutchAddress);
            const startAt = await ducDeployed.methods.startAt().call();
            const expiresAt = await ducDeployed.methods.expiresAt().call();
            const x = Date.now();
            if (startAt === 0 || startAt === '0') {
              flag = true;
            } else if (x > Number(expiresAt)) {
              flag = true;
            } else {
              flag = false;
            }
          }
        }
        setAllow(flag);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (address) {
      getInfo();
    }
  }, [address]);

  const getEnglish = async (e) => {
    e.preventDefault();
    try {
      if (!address) {
        notify('Not logged in or not on rinkeby network');
        return;
      }
      setPro(true);
      await auctionFactory.methods
        .createEnglishAuction(
          colAddress,
          listId,
          web3.utils.toWei(bid, 'ether')
        )
        .send({ from: address });
      const addr = await auctionFactory.methods.englishAuctions(address).call();
      if (addr === '0x0000000000000000000000000000000000000000') {
        notify('Something went wrong , we will solve it soon');
      } else {
        const deployEng = englishDeployed(addr);
        const contract = nftDeployed(colAddress);
        await contract.methods.approve(addr, listId).send({ from: address });
        await deployEng.start().send({ from: address });
        console.log(address);
        let t = new Date();
        t.setDate(t.getDate() + 3);

        const opt = {
          contractAddress: addr,
          expireAt: t,
          auctionType: 'English',
          nftId: listId,
          colAddress: colAddress,
        };
        const doc = await axios.post('/api/createAuction', opt);
        console.log(doc);
        notify('Auction started');
      }
    } catch (err) {
      notify(err.message);
    }
    setPro(false);
    window.location.reload();
  };

  const startDutch = async (e) => {
    e.preventDefault();
    try {
      if (!address) {
        notify('Not logged in or not on rinkeby network');
        return;
      }
      setPro2(true);
      const s = discount.slice(0, discount.length - 2);
      const contract = nftDeployed(colAddress);

      await auctionFactory.methods
        .createDutchCampaign(
          colAddress,
          listId,
          web3.utils.toWei(startPrice, 'ether'),
          s
        )
        .send({ from: address });
      const addr = await auctionFactory.methods.dutchAuctions(address).call();
      if (addr === '0x0000000000000000000000000000000000000000') {
        notify('Something went wrong , we will solve it soon');
      } else {
        await contract.methods.approve(addr, listId).send({ from: address });
        let t = new Date();
        t.setDate(t.getDate() + 3);

        const opt = {
          contractAddress: addr,
          expireAt: t,
          auctionType: 'English',
          nftId: listId,
          colAddress: colAddress,
        };
        const doc = await axios.post('/api/createAuction', opt);

        notify('Dutch Auction started');
      }
    } catch (err) {}
    setPro2(false);
    window.location.reload();
  };

  return (
    <div>
      {allow ? (
        <form
          onSubmit={(e) => getEnglish(e)}
          className="mb-6 max-w-[750px] w-full mt-6"
        >
          <p className="font-semibold text-2xl text-black mb-2">
            English Auction(3 days)
          </p>
          <div className="mb-6 flex flex-col ">
            <div className="flex flex-col">
              <div className="flex flex-col mb-2 ">
                <p className="font-semibold text-lg   ">Starting Bid </p>
                <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                  <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                  <input
                    type="number"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Bid at which auction will start"
                    required={true}
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
                    className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                  />
                </div>
              </div>
            </div>
          </div>
          {(!bid || Number(bid) === 0) && (
            <button
              type="submit"
              disabled={true}
              className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold
                opacity-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
            >
              Start Auction
            </button>
          )}
          {bid && Number(bid) > 0 && !pro && (
            <button
              disabled={pro2}
              type="submit"
              className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
            >
              Start Auction
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
      ) : (
        <div className="font-semibold text-black text-2xl mt-6">
          An Auction is already going on
        </div>
      )}
      {allow && (
        <form
          onSubmit={(e) => startDutch(e)}
          className="mb-6 max-w-[750px] w-full"
        >
          <p className="font-semibold text-2xl text-black mb-2">
            Dutch Auction(3 days)
          </p>
          <div className="mb-6 flex flex-col ">
            <div className="flex flex-col">
              <div className="flex flex-col mb-2 ">
                <p className="font-semibold text-lg   ">
                  Starting Price(ether){' '}
                </p>
                <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                  <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                  <input
                    type="number"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Price at which auction will start"
                    required={true}
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
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
                <p className="font-semibold text-lg   ">
                  Discount rate(wei/s){' '}
                </p>
                <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                  <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                  <input
                    type="number"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Price at which auction will start"
                    required={true}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                  />
                </div>
              </div>
            </div>
          </div>
          {(!startPrice || Number(startPrice) === 0 || !discount) && (
            <button
              type="submit"
              disabled={true}
              className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold
                opacity-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
            >
              Start Auction
            </button>
          )}
          {startPrice && Number(startPrice) > 0 && discount && !pro2 && (
            <button
              disabled={pro}
              type="submit"
              className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
            >
              Start Auction
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
        </form>
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

export default ToAuction;
