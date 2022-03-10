import React from 'react';
import Header from '../../components/Header';
import ToBuy from '../../components/listComp/ToBuy';
import nftDeployed from '../../ethereum/nftDeploy';
import ToAuction from '../../components/listComp/ToAuction';

function List(props) {
  return (
    <div className="bg-white overflow-x-hidden overflow-y-auto h-screen w-screen font-body">
      <Header />
      <div className="flex flex-col  items-center ">
        <div className="max-w-[1280px] py-[24px] mx-auto min-w-[750px]">
          <header className="font-bold justify-start text-[40px] mb-4 leading-[110%] mt-4 flex flex-col">
            <h1>Listing</h1>
          </header>
          <ToBuy />
          <ToAuction />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { listId, colAddress } = context.query;

  const contract = nftDeployed(colAddress);
  if (!contract) {
    return {
      notFound: true,
    };
  }
  try {
    const counter = await contract.methods.tokenCounter().call();
    let v = Number(listId);
    if (v > counter || v === 0) {
      return {
        notFound: true,
      };
    }
    return {
      props: {},
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default List;
