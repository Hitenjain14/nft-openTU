import Header from '../../components/Header';
import { useWeb3 } from '@3rdweb/hooks';
import Login from '../../components/Login';
import CreateCol from '../../components/createCol';

function Create() {
  const { address } = useWeb3();

  return (
    <div className="w-full h-full bg-white font-body">
      {!address ? <Login /> : <CreateCol />}
    </div>
  );
}

export default Create;
