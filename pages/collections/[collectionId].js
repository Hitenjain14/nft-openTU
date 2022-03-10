// @ts-ignore
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Col from '../../models/collection';
import User from '../../models/user';
import Header from '../../components/Header';
import { CgWebsite } from 'react-icons/cg';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiDiscord } from 'react-icons/si';
import { HiDotsVertical } from 'react-icons/hi';
import NFTCard from '../../components/NFTCard';
import nftContract from '../../ethereum/nftDeploy';

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

function CollectionNft({ collection, user }) {
  const router = useRouter();
  const { collectionId } = router.query;

  const [total, setTotal] = useState(0);
  const [nft, setNft] = useState([]);
  // @ts-ignore
  const [uri, setUri] = useState('');

  function fixURL(url) {
    if (url.startsWith('ipfs')) {
      return 'https://ipfs.moralis.io:2053/ipfs/' + url.split('ipfs://')[1];
    } else {
      return url;
    }
  }

  const getInfo = async () => {
    try {
      const contract = nftContract(collectionId);
      const base = await contract.methods.baseURI().call();
      setUri(base);
      const tokenCounter = await contract.methods.tokenCounter().call();
      setTotal(tokenCounter);
      const info = [];
      // @ts-ignore
      let b = fixURL(base);
      b = b + '_metadata.json';
      // for (let i = 1; i <= tokenCounter; i++) {
      //   let b = base + `${i}.json`;
      //   b = fixURL(b);
      //   fetch(b)
      //     .then((res) => res.json())
      //     .then((data) => {
      //       let x = data.image;
      //       x = fixURL(x);
      //       data.image = x;
      //       info.push(data);
      //     });
      // }
      fetch(b)
        .then((res) => res.json())
        .then((data) => {
          // setNft(data);
          data.map((d, i) => {
            let x = d.image;
            x = fixURL(x);
            d.image = x;
            info.push(d);
          });
          setNft(info);
        });

      // setNft(info);
      // console.log(nft);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (collectionId) {
      getInfo();
    }
  }, [collectionId]);

  return (
    <div className="overflow-hidden ">
      <Header />
      <div className={style.bannerImageContainer}>
        <img className={style.bannerImage} src={collection?.banner} alt="" />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img className={style.profileImg} src={collection?.logo} alt="logo" />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <SiDiscord />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.title}>{collection?.colName}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by <span className="text-[#2081e2]">{user?.username}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{total}</div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>1</div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                0.005
              </div>
              <div className={style.statName}>Floor Price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={style.statName}>Volume Traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap">
        {nft?.map((nftItem, i) => (
          <NFTCard
            key={i}
            nftItem={nftItem}
            title={collection?.colName}
            colAddress={collection?.contractAddress}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionNft;

export async function getServerSideProps(context) {
  const { collectionId } = context.query;

  let collection = await Col.find(
    { contractAddress: collectionId },
    { _id: 0 }
  );
  if (!collection || collection.length === 0) {
    return {
      notFound: true,
    };
  }
  collection = collection[0];

  let user = await User.find(
    { publicAddress: collection.createdBy },
    { _id: 0 }
  );

  user = user[0];

  return {
    props: {
      collection: JSON.parse(JSON.stringify(collection)),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}
