import { IoMdSnow } from 'react-icons/io';
import { AiOutlineHeart } from 'react-icons/ai';

const style = {
  topBar: `bg-gray-white p-2 rounded-t-lg border-gray-200 border`,
  topBarContent: `flex items-center text-black`,
  likesCounter: `flex-1 flex items-center justify-end text-black`,
};

function NftImage({ selectedNft }) {
  return (
    <div className="">
      <div className={style.topBar}>
        <div className={style.topBarContent}>
          <IoMdSnow />
          <div className={style.likesCounter}>
            <AiOutlineHeart />
          </div>
        </div>
      </div>
      <div className="">
        <img src={selectedNft?.image} alt="" />
      </div>
    </div>
  );
}

export default NftImage;
