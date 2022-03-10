import Header from './Header';
import Image from 'next/image';
import { useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import web3 from '../ethereum/web3';
import axios from 'axios';

function Login() {
  const [isDisabled, setDisabled] = useState(false);
  const { address, connectWallet } = useWeb3();
  const notify = () => {
    toast.info('Please switch to rinkeby testnet', {
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

  const notifyError = (msg) => {
    toast.error(msg, {
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

  const getLogin = async () => {
    setDisabled(true);
    const chain = await web3.eth.getChainId();
    if (chain !== 4) {
      notify();
    } else {
      try {
        await connectWallet('injected');
        const accounts = await web3.eth.getAccounts();

        const opt = {
          publicAddress: accounts[0],
        };
        const data = await axios.post('/api/createUser', opt);
      } catch (err) {
        notifyError(err.message);
      }
    }

    setDisabled(false);
  };

  return (
    <div className="overflow-hidden h-screen w-screen bg-white">
      <div>
        <Header />
      </div>
      <div className="flex justify-center items-center bg-white mt-[30px]">
        <div className="">
          <div className="text-4xl text-black font-semibold py-2">
            Connect Your Wallet
          </div>
          <div className="mt-1 text-gray-500 font-medium">
            Connect with one of our available wallet providers or create a new
            one.
          </div>
          <div className="mt-4  border-[2px] border-solid border-gray-500 p-2 border-opacity-50 hover:shadow-xl hover:bg-gray-200 rounded-md">
            <button
              disabled={isDisabled}
              onClick={() => {
                getLogin();
              }}
              className="flex justify-start items-center w-full h-full"
            >
              <div className="">
                <Image src="/metamask.png" height={35} width={35} />
              </div>
              <div className="text-gray-600 text-lg font-semibold ml-2">
                Connect with Metamask
              </div>
            </button>
          </div>
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

export default Login;
