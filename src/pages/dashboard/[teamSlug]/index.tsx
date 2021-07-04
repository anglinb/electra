import Head from 'next/head';
import { getSession, useSession } from "next-auth/client";
import { GetServerSideProps } from 'next';
import Favicon from '../../../components/Favicon';
import { withApollo } from '../../../hoc/withApollo';
import Projects from '../../../components/dashboard/Projects';
import SplashIndex from '../../../components/splash/SplashIndex';


const Index = () => {

  const [ session, loading ] = useSession()

  if (typeof window !== 'undefined' && loading) return null

  return (
    <>
    <Head>
      <Favicon />
    </Head>
    { session ?  <Projects /> : <SplashIndex /> }
   </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return {
    props: { session }
  }
}

export default withApollo(Index);

