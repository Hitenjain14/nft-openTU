import Header from '../components/Header';
import Hero from '../components/Hero';
import dbConnect from '../utils/dbConnect';

export default function Home({ props }) {
  return (
    <div className="overflow-hidden h-screen w-screen font-body">
      <Header />
      <Hero />
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  return {
    props: {},
  };
}
