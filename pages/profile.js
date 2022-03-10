import Login from '../components/Login';
import { useWeb3 } from '@3rdweb/hooks';
import Account from '../components/Account';

function Profile() {
  const { address } = useWeb3();
  return (
    <div className="w-full h-full bg-white font-body">
      {!address ? <Login /> : <Account />}
    </div>
  );
}

export default Profile;
