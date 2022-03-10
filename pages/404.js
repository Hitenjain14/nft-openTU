import Header from '../components/Header';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="bg-white w-screen h-screen overflow-hidden font-body">
      <Header />
      <div className="flex flex-col h-full flex-1">
        <div className="w-[80%] mx-auto max-w-screen-xl">
          <div className="h-[280px] mt-[44px] items-center flex flex-col">
            <div className="flex align-middle w-[420px] max-w-full ">
              <p className="font-bold text-gray-300 w-[1/3] text-[180px] ml-5 mr-5 text-right">
                4
              </p>
              <div
                className=" flex items-center max-h-full max-w-full overflow-hidden relative
              rounded-[10px]
              "
              >
                <img
                  src="https://opensea.io/static/images/404-compass-full.gif"
                  alt="0"
                  className=" transition-opacity duration-[400ms] w-[100px]"
                />
              </div>
              <p className="font-bold text-gray-300 w-[1/3] text-[180px] ml-5  mr-5 text-right">
                4
              </p>
            </div>
          </div>
          <div className="text-center px-[15%] flex justify-center items-center flex-col ">
            <h1 className="font-semibold text-[40px] text-black ">
              This page is lost
            </h1>
            <p className="text-[20px] text-gray-400 font-normal mt-2">
              We've explored deep and wide,
              <br></br>
              but we can't find the page you were looking for.
            </p>
            <Link href="/">
              <div className="mt-[10px] p-4 text-base font-medium hover:bg-blue-700 cursor-pointer text-white bg-blue-600 rounded-[10px] border-[1px] border-solid border-blue-600">
                Navigate Back Home
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
