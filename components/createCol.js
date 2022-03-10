import { useEffect, useState } from 'react';
import Header from './Header';
// @ts-ignore
import { BiImageAdd } from 'react-icons/bi';
import { FcAddImage } from 'react-icons/fc';
import { categories } from '../utils/categories';
import web3 from '../ethereum/web3';
import nftContract from '../ethereum/nftDeploy';
import { useWeb3 } from '@3rdweb/hooks';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateCol() {
  const { address } = useWeb3();
  const [bannerImg, setBannerImg] = useState(null);
  const [logo, setLogo] = useState(null);
  const [colName, setColName] = useState('');
  // @ts-ignore
  const [description, setDescription] = useState('');
  const [drop, setDrop] = useState(false);
  const [category, setCategory] = useState('');
  const [site, setSite] = useState('');
  const [insta, setInsta] = useState('');
  const [discord, setDiscord] = useState('');
  const [can, setCan] = useState(false);
  const [nftAddress, setNftAddress] = useState('');
  const [pro, setPro] = useState(false);

  const notify = (msg) => {
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

  useEffect(() => {
    if (colName && logo && bannerImg && nftAddress?.length === 42) {
      setCan(true);
    } else {
      setCan(false);
    }
    if (logo) {
      var output = document.getElementById('outputLogo');
      // @ts-ignore
      output.src = URL.createObjectURL(logo[0]);
    }
    if (bannerImg) {
      var output = document.getElementById('outputBanner');
      // @ts-ignore
      output.src = URL.createObjectURL(bannerImg[0]);
    }
  }, [colName, logo, bannerImg, nftAddress]);

  const uploadFile = () => {
    document.getElementById('selectBannerFile').click();
  };

  const uploadLogo = () => {
    document.getElementById('selectLogo').click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let logoImg;
    let banner;
    let done = false;
    setPro(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        logoImg = reader.result;
        if (banner && logoImg && !done) {
          done = true;
          uploadInfo(logoImg, banner);
        }
      };
      reader.readAsDataURL(logo[0]);

      const reader2 = new FileReader();

      reader2.onloadend = () => {
        banner = reader2.result;
        if (banner && logoImg && !done) {
          done = true;
          uploadInfo(logoImg, banner);
        }
      };
      reader2.readAsDataURL(bannerImg[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const uploadInfo = async (logo, banner) => {
    try {
      const contract = nftContract(nftAddress);
      const owner = await contract.methods.owner().call();
      if (owner !== address) {
        notify('Owner of contract not same as current address');
        return;
      }

      const r = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          logo,
          banner,
          colName,
          createdBy: address,
          description,
          contractAddress: nftAddress,
          category,
          discord: discord,
          instagram: insta,
          site,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      notify(err.message);
    }
    window.location.reload();
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden h-screen w-screen bg-white">
      <div>
        <Header />
      </div>
      <div className="flex flex-col items-center">
        <div className="max-w-[1280px] py-[24px] mx-auto min-w-[750px]">
          <header className="font-bold justify-start text-[40px] mb-4 leading-[110%] mt-4 flex flex-col">
            <h1>Create New Collection</h1>
          </header>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="mb-8 max-w-[750px] w-full "
          >
            <p className="font-medium text-base text-gray-600 my-2">
              <span className="text-red-500">*</span> Required Fields
            </p>
            <div className="flex flex-col mb-6">
              <div className="flex flex-col">
                <p className="text-lg font-semibold mb-1 after:content-['*'] after:text-red-500">
                  Upload Logo{' '}
                </p>
                <p className="font-medium text-base text-gray-500">
                  This Image will be used for navigation. 350 x 350 recommended
                </p>
              </div>
              <div
                className="h-[160px] w-[160px] relative p-2 mt-2 rounded-full flex flex-col justify-center items-center box-border cursor-pointer border-[3px] border-dashed border-gray-400"
                onClick={() => uploadLogo()}
              >
                <input
                  id="selectLogo"
                  required={true}
                  type="file"
                  autoComplete="off"
                  className="hidden"
                  // @ts-ignore
                  onChange={(e) => setLogo(e.target.files)}
                />
                {logo ? (
                  <img id="outputLogo" className="w-[120px]" />
                ) : (
                  <FcAddImage className="w-[60px] h-[60px]" />
                )}
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <div className="flex flex-col ">
                <p className="text-lg font-semibold mb-1 after:content-['*'] after:text-red-500 ">
                  Upload Banner{' '}
                </p>
                <p className="font-medium text-base text-gray-500">
                  File types supported: JPG, PNG, GIF, SVG
                </p>
              </div>
              <div
                onClick={() => uploadFile()}
                className="h-[270px] w-[550px] relative p-2 mt-1 rounded-[10px] flex flex-col justify-center items-center box-border cursor-pointer border-[3px] border-dashed border-gray-400"
              >
                <input
                  id="selectBannerFile"
                  required={true}
                  type="file"
                  autoComplete="off"
                  className="hidden"
                  // @ts-ignore
                  onChange={(e) => setBannerImg(e.target.files)}
                />
                {bannerImg ? (
                  <img
                    id="outputBanner"
                    className="max-w-[450px] max-h-[230px]"
                  />
                ) : (
                  <FcAddImage className="w-[84px] h-[84px]" />
                )}
              </div>
            </div>
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
                      placeholder="Item name"
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
            <div className="flex flex-col mb-6">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2">
                  <p className="font-semibold text-lg after:content-['*'] after:text-red-500">
                    Contract Address{' '}
                  </p>
                  <p className="font-medium text-base text-gray-500">
                    Contract Address on rinkeby chain , make sure your address
                    is same as the address of owner of the contract
                  </p>
                </div>
                <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative">
                  <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                  <input
                    type="text"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="0x805F123E5AA6131cC41A5b81342343ce2Bd5e8ef"
                    required={true}
                    value={nftAddress}
                    onChange={(e) => setNftAddress(e.target.value)}
                    className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                  />
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col mb-6 ">
              <div className="flex flex-col ">
                <div className="flex flex-col mb-2 ">
                  <p className="font-semibold text-lg ">External Link</p>
                  <p className="font-medium text-base text-gray-500 mt-1 ">
                    We will include a link to this URL on this item's detail
                    page, so that users can click to learn more about it. You
                    are welcome to link to your own webpage with more details.
                  </p>
                </div>
                <div className="">
                  <div className="bg-white rounded-[10px] border-[1px] border-solid border-gray-500 flex relative ">
                    <div className="items-center flex bg-transparent text-gray-600 pl-3"></div>
                    <input
                      type="text"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Item name"
                      required={true}
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      className="bg-transparent border-none flex-grow h-[48px] outline-none pr-3 min-w-[0px]
                      text-left focus:shadow-xl
                      "
                    />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="flex flex-col mb-6 ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2">
                  <p className="font-semibold text-lg">Description</p>
                  <p className="font-medium text-base text-gray-500 mt-1">
                    The description will be included on the item's detail page
                    underneath its image.
                  </p>
                </div>
                <textarea
                  name="description"
                  id="desc"
                  // @ts-ignore
                  rows="4"
                  placeholder="Provide a detailed description of your item"
                  className="w-full h-auto p-3 resize-y border-[1px] border-solid border-gray-500 bg-white
                  rounded-[10px] focus:drop-shadow-2xl outline-none
                  "
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col mb-3 ">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2">
                  <p className="text-lg font-semibold">Category</p>
                  <p className="font-medium text-base text-gray-500 mt-1">
                    Adding a category will help make your item more
                    discoverable.
                  </p>
                </div>
                <div className="flex items-start flex-col  ">
                  <div
                    onClick={() => setDrop(!drop)}
                    className="cursor-pointer mr-3 rounded-[10px] py-3 px-5 bg-white border-[1px] border-solid border-gray-500 font-semibold text-gray-700 hover:text-gray-900 hover:transition-all
                  hover:shadow-xl
                  "
                  >
                    {category ? category : 'Add Category'}
                  </div>
                  {drop && (
                    <div
                      className="flex flex-col justify-center items-center font-semibold
                   rounded-[10px] border-[1px] border-solid border-gray-200 mt-1 min-w-[144px] transition-all max-h-[180px] z-10 overflow-y-scroll
                  "
                    >
                      {categories.map((cat) => (
                        <div
                          // @ts-ignore

                          onClick={() => {
                            setCategory(cat.name);
                            setDrop(false);
                          }}
                          key={cat.name}
                          className="flex items-center p-2 w-full py-1 cursor-pointer border-b-[1px] border-gray-200 text-base text-gray-700 hover:bg-gray-100 hover:shadow-lg"
                        >
                          <div className="w-[24px] h-[24px]">
                            <img src={cat.icon} alt={cat.name} />
                          </div>
                          <div className="ml-1">{cat.name}</div>
                        </div>
                      ))}
                      <div
                        // @ts-ignore

                        onClick={() => {
                          setCategory(null);
                          setDrop(false);
                        }}
                        className="flex items-center p-2 w-full py-1 cursor-pointer border-b-[1px] border-gray-200 text-base text-gray-700 hover:bg-gray-100 hover:shadow-lg"
                      >
                        <div className="w-[24px] h-[24px]">
                          <div className="text-red-500 text-lg">X </div>
                        </div>
                        <div className="ml-1"> Remove</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col mb-6 mt-1 ">
              <div className="flex flex-col ">
                <div className="flex flex-col mb-2">
                  <p className="font-semibold text-lg">Links</p>
                </div>
                <div className=" flex flex-col justify-center items-start border-[1px] border-solid border-gray-400 rounded-[10px] mb-3">
                  <div className="flex p-3 w-full border-b-[1px] border-solid border-gray-400">
                    <svg
                      className="h-[24px] w-[24px] mx-3 overflow-hidden"
                      fill="#8A939B"
                      viewBox="0 0 20 16"
                    >
                      <path d="M17.569.5H2.43C1.39.5.548 1.344.548 2.375l-.01 11.25A1.89 1.89 0 002.43 15.5H17.57a1.89 1.89 0 001.892-1.875V2.375A1.89 1.89 0 0017.57.5zm-4.73 13.125H2.43v-3.75h10.408v3.75zm0-4.688H2.43v-3.75h10.408v3.75zm4.73 4.688h-3.785V5.187h3.785v8.438z"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="yoursite.io"
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      className="outline-none border-none w-full"
                    />
                  </div>
                  <div className="flex p-3 w-full border-b-[1px] border-solid border-gray-400">
                    <svg
                      className="h-[24px] w-[24px] mx-3 overflow-hidden"
                      fill="#8A939B"
                      viewBox="0 0 22 16"
                    >
                      <path d="M8.11.5c-.28.002-2.574.067-4.996 1.873 0 0-2.584 4.665-2.584 10.408 0 0 1.507 2.593 5.473 2.719 0 0 .664-.792 1.202-1.477-2.278-.685-3.14-2.108-3.14-2.108s.18.126.502.307c.018 0 .035.019.07.036.055.035.108.054.162.09.448.252.896.45 1.31.611.736.307 1.615.576 2.639.774 1.346.252 2.925.342 4.646.019a12.954 12.954 0 002.603-.774 10.118 10.118 0 002.062-1.063s-.896 1.458-3.247 2.125c.538.666 1.185 1.439 1.185 1.439 3.965-.126 5.473-2.72 5.473-2.7 0-5.746-2.584-10.409-2.584-10.409C16.32.446 13.861.5 13.861.5l-.251.288c3.05.918 4.468 2.27 4.468 2.27a14.856 14.856 0 00-5.4-1.711 15.048 15.048 0 00-3.626.036c-.107 0-.197.019-.306.035-.628.072-2.153.288-4.073 1.135-.663.288-1.059.505-1.059.505S5.088 1.635 8.317.717L8.137.5h-.028zm-.457 6.645c1.022 0 1.849.882 1.83 1.981 0 1.1-.808 1.982-1.83 1.982-1.005 0-1.83-.883-1.83-1.982s.806-1.981 1.83-1.981zm6.55 0c1.004 0 1.83.882 1.83 1.981 0 1.1-.809 1.982-1.83 1.982-1.006 0-1.83-.883-1.83-1.982s.806-1.981 1.83-1.981z"></path>
                    </svg>
                    <div className="flex items-center bg-transparent text-gray-700">
                      https://discord.gg/
                    </div>
                    <input
                      type="text"
                      placeholder="abcdef"
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      className="outline-none border-none w-full"
                    />
                  </div>
                  <div className="flex p-3 w-full ">
                    <svg
                      className="w-[24px] h-[24px] mx-3 overflow-hidden"
                      fill="#8A939B"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.75 2H8.25C4.79875 2 2 4.79875 2 8.25V15.75C2 19.2012 4.79875 22 8.25 22H15.75C19.2012 22 22 19.2012 22 15.75V8.25C22 4.79875 19.2012 2 15.75 2ZM20.125 15.75C20.125 18.1625 18.1625 20.125 15.75 20.125H8.25C5.8375 20.125 3.875 18.1625 3.875 15.75V8.25C3.875 5.8375 5.8375 3.875 8.25 3.875H15.75C18.1625 3.875 20.125 5.8375 20.125 8.25V15.75Z"></path>
                      <path d="M12 7C9.23875 7 7 9.23875 7 12C7 14.7613 9.23875 17 12 17C14.7613 17 17 14.7613 17 12C17 9.23875 14.7613 7 12 7ZM12 15.125C10.2775 15.125 8.875 13.7225 8.875 12C8.875 10.2763 10.2775 8.875 12 8.875C13.7225 8.875 15.125 10.2763 15.125 12C15.125 13.7225 13.7225 15.125 12 15.125Z"></path>
                      <path d="M17.375 7.29124C17.743 7.29124 18.0413 6.99295 18.0413 6.62499C18.0413 6.25703 17.743 5.95874 17.375 5.95874C17.0071 5.95874 16.7088 6.25703 16.7088 6.62499C16.7088 6.99295 17.0071 7.29124 17.375 7.29124Z"></path>
                    </svg>
                    <div className="flex items-center bg-transparent text-gray-700">
                      https://instagram.com/
                    </div>
                    <input
                      type="text"
                      placeholder="YourInstagramHandle"
                      value={insta}
                      onChange={(e) => setInsta(e.target.value)}
                      className="outline-none border-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {can && !pro && (
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
            {!can && (
              <button
                type="submit"
                disabled={true}
                className="px-8 py-2.5 text-center  outline-none border-none text-lg font-semibold
                opacity-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl rounded-lg"
              >
                Create
              </button>
            )}
          </form>
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
    </div>
  );
}

export default CreateCol;
