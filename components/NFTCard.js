import { useEffect, useState } from 'react';
import { BiHeart } from 'react-icons/bi';
import nftContract from '../ethereum/nftDeploy';
import web3 from '../ethereum/web3';
import { useRouter } from 'next/router';

const style = {
  wrapper: `bg-[#303339] flex-auto w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
};

function NFTCard({ nftItem, title, colAddress }) {
  function fixURL(url) {
    if (url.startsWith('ipfs')) {
      return 'https://ipfs.moralis.io:2053/ipfs/' + url.split('ipfs://')[1];
    } else {
      return url;
    }
  }
  const router = useRouter();
  const [price, setPrice] = useState('0');
  const [listed, setListed] = useState(false);
  const getInfo = async () => {
    const contract = nftContract(colAddress);
    let p = await contract.methods.tokendIdPrice(nftItem.edition).call();
    // console.log(p);
    setPrice(p);
    if (p !== '0') {
      setListed(true);
    }
  };

  useEffect(() => {
    if (nftItem) {
      // nftItem.image = fixURL(nftItem.image);
      getInfo();
    }
  }, []);

  return (
    <div
      className={style.wrapper}
      onClick={() => {
        router.push({
          pathname: `/nfts/${nftItem.edition}`,
          query: { isListed: listed, colAddress: colAddress },
        });
      }}
    >
      <div className={style.imgContainer}>
        <img loading="lazy" src={nftItem.image} alt={nftItem.name} />
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.collectionName}>{title}</div>
            <div className={style.assetName}>{nftItem.name}</div>
          </div>
          {listed && (
            <div className={style.infoRight}>
              <div className={style.priceTag}>Price</div>
              <div className={style.priceValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {web3.utils.fromWei(price, 'ether')}
              </div>
            </div>
          )}
        </div>
        <div className={style.likes}>
          <span className={style.likeIcon}>
            <BiHeart />
          </span>{' '}
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
