import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

function ColCard({ collection }) {
  const [owner, setOwner] = useState(null);
  const router = useRouter();
  const getUser = async () => {
    const opt = {
      publicAddress: collection.createdBy,
    };
    try {
      const doc = await axios.patch('/api/createUser', opt);
      setOwner(doc.data.data.doc[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (collection) {
      getUser();
    }
  }, [collection]);

  return (
    <div
      onClick={() => {
        router.push({
          pathname: `/collections/${collection.contractAddress}`,
        });
      }}
      className="mb-3 cursor-pointer max-w-[435px] max-h-[402px] hover:shadow-xl border-[2px] border-solid border-gray-300 rounded-[10px] overflow-hidden"
    >
      <div className="flex flex-col justify-center items-center">
        <div className="max-h-[200px] w-full">
          <img
            src={collection?.banner}
            className="rounded-t-[10px] h-[200px]"
            alt=""
          />
        </div>
        <div className="flex flex-col p-[10px] items-center mt-[-36px]">
          <div
            className="h-[50px] w-[50px] bg-white border-[2px] border-solid border-gray-200
          rounded-[50%]
          "
          >
            <img
              src={collection?.logo}
              className="rounded-[50%] overflow-hidden"
              alt={collection?.colName}
            />
          </div>
          <div className="flex items-center mt-2 ">
            <div className="font-semibold text-base text-center mt-2 max-w-[200px] ">
              {collection?.colName}
            </div>
          </div>
          <div className="flex  text-[14px] items-center justify-center font-medium">
            <p className="text-gray-700 mr-1">by</p>
            <div className="inline-flex justify-center items-center h-[24px] w-full">
              <div className="overflow-hidden text-blue-500">
                {owner?.username}
              </div>
              <div className="overflow-hidden text-blue-500">
                {/* <svg
                  aria-label="verified-icon"
                  className="h-5 w-5 overflow-hidden ml-1 align-top text-blue-500 bg-blue-500 rounded-full"
                  fill="none"
                  viewBox="0 0 30 30"
                >
                  <path
                    className="fill-blue-500 text-[14px] font-medium"
                    d="M13.474 2.80108C14.2729 1.85822 15.7271 1.85822 16.526 2.80108L17.4886 3.9373C17.9785 4.51548 18.753 4.76715 19.4892 4.58733L20.9358 4.23394C22.1363 3.94069 23.3128 4.79547 23.4049 6.0278L23.5158 7.51286C23.5723 8.26854 24.051 8.92742 24.7522 9.21463L26.1303 9.77906C27.2739 10.2474 27.7233 11.6305 27.0734 12.6816L26.2903 13.9482C25.8918 14.5928 25.8918 15.4072 26.2903 16.0518L27.0734 17.3184C27.7233 18.3695 27.2739 19.7526 26.1303 20.2209L24.7522 20.7854C24.051 21.0726 23.5723 21.7315 23.5158 22.4871L23.4049 23.9722C23.3128 25.2045 22.1363 26.0593 20.9358 25.7661L19.4892 25.4127C18.753 25.2328 17.9785 25.4845 17.4886 26.0627L16.526 27.1989C15.7271 28.1418 14.2729 28.1418 13.474 27.1989L12.5114 26.0627C12.0215 25.4845 11.247 25.2328 10.5108 25.4127L9.06418 25.7661C7.86371 26.0593 6.6872 25.2045 6.59513 23.9722L6.48419 22.4871C6.42773 21.7315 5.94903 21.0726 5.24777 20.7854L3.86969 20.2209C2.72612 19.7526 2.27673 18.3695 2.9266 17.3184L3.70973 16.0518C4.10824 15.4072 4.10824 14.5928 3.70973 13.9482L2.9266 12.6816C2.27673 11.6305 2.72612 10.2474 3.86969 9.77906L5.24777 9.21463C5.94903 8.92742 6.42773 8.26854 6.48419 7.51286L6.59513 6.0278C6.6872 4.79547 7.86371 3.94069 9.06418 4.23394L10.5108 4.58733C11.247 4.76715 12.0215 4.51548 12.5114 3.9373L13.474 2.80108Z"
                  ></path>
                  <path
                    d="M13.5 17.625L10.875 15L10 15.875L13.5 19.375L21 11.875L20.125 11L13.5 17.625Z"
                    fill="white"
                    stroke="white"
                  ></path>
                </svg> */}
                <img
                  src="/verified2.png"
                  className="h-5 w-5 ml-1 overflow-hidden bg-transparent"
                  alt="verified"
                />
              </div>
            </div>
          </div>
          <span
            className="max-w-[80%] mt-[20px] h-[66px] overflow-hidden text-center font-normal text-base
                text-gray-600
            "
          >
            <span>{collection?.description}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ColCard;
