import { CgArrowsExchangeV } from 'react-icons/cg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import nftDeployed from '../../ethereum/nftDeploy';
import { useRouter } from 'next/router';
import EventItem from './ItemActivity/EventItem';

const style = {
  wrapper: `w-full mt-8 border border-gray-200 rounded-xl bg-gray-100 overflow-hidden text-black font-body`,
  title: `bg-gray-100 px-6 py-4 flex items-center`,
  titleLeft: `flex-1 flex items-center text-xl font-bold`,
  titleIcon: `text-3xl mr-2`,
  titleRight: `text-xl`,
  filter: `flex items-center border border-gray-200 mx-4 my-6 px-3 py-4 rounded-xl bg-gray-100`,
  filterTitle: `flex-1`,
  tableHeader: `flex w-full bg-gray-100 border-y border-gray-200 mt-8 px-4 py-1`,
  eventItem: `flex px-4`,
  ethLogo: `h-5 mr-2`,
  accent: `text-black`,
};

function ItemActivity() {
  const [toggle, setToggle] = useState(true);
  const [dummy, setDummy] = useState([]);
  const router = useRouter();
  const getInfo = async () => {
    const { colAddress, nftId } = router.query;
    const contract = nftDeployed(colAddress);

    const results = await contract.getPastEvents('Transfer', {
      filter: {
        tokenId: nftId,
      },
      fromBlock: 0,
    });
    // console.log(results[0].returnValues);
    let d = [];
    results.map((r, i) => {
      let q = {};
      q.from = r.returnValues.from;
      q.to = r.returnValues.to;
      d.push(q);
    });
    setDummy(d);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.title} onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
          <span className={style.titleIcon}>
            <CgArrowsExchangeV />
          </span>
          Item Activity
        </div>
        <div className={style.titleRight}>
          {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {toggle && (
        <div className={style.activityTable}>
          <div className={style.filter}>
            <div className={style.filterTitle}>Filter</div>
            <div className={style.filterIcon}>
              {' '}
              <AiOutlineDown />{' '}
            </div>
          </div>
          <div className={style.tableHeader}>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Event</div>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Price</div>
            <div className={`${style.tableHeaderElement} flex-[3]`}>From</div>
            <div className={`${style.tableHeaderElement} flex-[3]`}>To</div>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Date</div>
          </div>
          {dummy?.map((event, id) => (
            <EventItem key={id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemActivity;
