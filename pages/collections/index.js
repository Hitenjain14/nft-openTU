import Header from '../../components/Header';
import { IoAdd } from 'react-icons/io5';
import Link from 'next/link';
import Colec from '../../models/collection';
import ColCard from '../../components/ColCard';
import Error from 'next/error';

function Col({ collections }) {
  return (
    <div className="w-full h-full bg-white font-body">
      <div className="overflow-y-auto overflow-x-hidden h-screen w-screen bg-white">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="rounded-full flex items-center mt-2 pr-1 bg-opacity-50 hover:bg-opacity-100 hover:cursor-pointer bg-gray-200 mb-1">
            <div className="p-1">
              <IoAdd className="w-[60px] h-[60px] rounded-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />
            </div>
            <Link href="/collections/create">
              <div className="text-black text-lg font-semibold p-1">
                List Your Collection
              </div>
            </Link>
          </div>
          <div className="font-bold text-4xl text-black mt-4 ">
            Explore Collections
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2 ml-14">
          {collections?.map((col, i) => (
            <ColCard collection={col} key={i} />
          ))}
          {collections?.map((col, i) => (
            <ColCard collection={col} key={i} />
          ))}
          {collections?.map((col, i) => (
            <ColCard collection={col} key={i} />
          ))}
          {collections?.map((col, i) => (
            <ColCard collection={col} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ res }) {
  try {
    const doc = await Colec.find({}, { _id: 0 });

    return {
      props: { collections: JSON.parse(JSON.stringify(doc)) },
    };
  } catch (err) {
    res.statusCode = 404;
    return {
      notFound: true,
    };
  }
}

export default Col;
