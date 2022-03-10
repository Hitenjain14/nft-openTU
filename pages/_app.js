import '../styles/globals.css';
import Header from '../components/Header';
import Head from 'next/head';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

const supportedChainIds = [4];

const connectors = {
  injected: {},
};

function MyApp({ Component, pageProps }) {
  return (
    <div className="">
      <Head>
        <meta charSet="UTF-8" />
        <title>OpenTu</title>
        <link
          rel="icon"
          href="https://cdn-icons-png.flaticon.com/512/5264/5264949.png"
        />
      </Head>
      <ThirdwebWeb3Provider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <Component {...pageProps} />{' '}
      </ThirdwebWeb3Provider>
    </div>
  );
}

export default MyApp;
