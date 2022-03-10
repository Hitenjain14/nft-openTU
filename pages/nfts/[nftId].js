import Header from '../../components/Header';
// @ts-ignore
import web3 from '../../ethereum/web3';
// @ts-ignore
import { useRouter } from 'next/router';
import Col from '../../models/collection';
import nftDeployed from '../../ethereum/nftDeploy';
import NftImage from '../../components/Nft/NftImage';
import GeneralDetails from '../../components/Nft/GeneralDetails';
import ItemActivity from '../../components/Nft/ItemActivity';
import Purchase from '../../components/Nft/Purchase';
import Auc from '../../models/auction';
import EnglishAuction from '../../components/Nft/EnglishAuction';

// @ts-ignore
const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

function Nft({ data, auction }) {
  const router = useRouter();
  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto bg-white font-body">
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NftImage selectedNft={data} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={data} />
              {!auction && (
                <Purchase
                  isListed={router.query.isListed}
                  selectedNft={data}
                  colAddress={router.query.colAddress}
                />
              )}
              {auction?.auctionType === 'English' && (
                <EnglishAuction auction={auction} />
              )}
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { nftId, colAddress, isListed } = context.query;
  try {
    const doc = await Col.find();
    if (!doc || doc.length === 0) {
      return {
        notFound: true,
      };
    }

    const contract = nftDeployed(colAddress);
    if (!contract) {
      return {
        notFound: true,
      };
    }

    const counter = await contract.methods.tokenCounter().call();
    let v = Number(nftId);
    if (v > counter || v === 0) {
      console.log(counter);
      console.log(nftId);
      return {
        notFound: true,
      };
    }
    let url = await contract.methods.baseURI().call();

    if (url.startsWith('ipfs')) {
      url = 'https://ipfs.moralis.io:2053/ipfs/' + url.split('ipfs://')[1];
    }

    url = url + `${nftId}.json`;

    let result = await fetch(url);
    result = await result.json();

    if (!result) {
      return {
        notFound: true,
      };
    }

    // @ts-ignore
    if (result.image.startsWith('ipfs')) {
      // @ts-ignore
      result.image =
        // @ts-ignore
        'https://ipfs.moralis.io:2053/ipfs/' + result.image.split('ipfs://')[1];
    }

    let p = await contract.methods.tokendIdPrice(nftId).call();
    if (p === 0 && isListed === 'true') {
      return {
        notFound: true,
      };
    }

    p = web3.utils.fromWei(p, 'ether');
    // @ts-ignore
    result.price = p;

    //@ts-ignore
    result.colName = doc[0].colName;
    // @ts-ignore
    result.createdBy = doc[0].createdBy;

    const owner = await contract.methods.ownerOf(nftId).call();
    // @ts-ignore
    result.owner = owner;

    let aucInfo = await Auc.find({ colAddress, nftId }, { _id: 0 });
    if (aucInfo.length > 0) {
      aucInfo = aucInfo[0];
      // aucInfo.expireAt = aucInfo.expireAt.getTime();
    }

    return {
      props: {
        data: result,
        auction: JSON.parse(JSON.stringify(aucInfo)),
      },
    };
  } catch (err) {
    console.log(err.message);
    return {
      notFound: true,
    };
  }
}

export default Nft;
