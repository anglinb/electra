import { GetServerSideProps } from 'next';

import { withApollo } from "../hoc/withApollo";
import Head from 'next/head';
import Favicon from '../components/Favicon';

import Splash from '../components/splash/SplashIndex';
import Projects from '../components/dashboard/Projects';
import { getSession, useSession } from 'next-auth/client';

const Index = () => {

  const [ session, loading ] = useSession()

  if (typeof window !== 'undefined' && loading) return null

  return (
    <>
    <Head>
      <Favicon />
    </Head>
    { session ?  <Projects /> : <Splash /> }
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

