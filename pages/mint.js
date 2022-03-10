import Header from '../components/Header';
import MintForm from '../components/MintForm';

function Mint() {
  return (
    <div className="overflow-x-hidden overflow-y-auto bg-white h-screen w-screen font-body">
      <div>
        <Header />
      </div>
      <MintForm />
    </div>
  );
}

export default Mint;
