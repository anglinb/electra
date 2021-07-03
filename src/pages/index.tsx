import { GetServerSideProps } from 'next';

import { useViewer } from '../generated/page';
import { PageTestComp, ssrTest } from "../generated/page";
import { withApollo } from "../hoc/withApollo";
import Head from 'next/head';
import Favicon from '../components/Favicon';

const Index: PageTestComp = (props) => {

  const { data, loading, error } = useViewer();
  console.log('data from props',  props)
  return (
    <>
    <Head>
      <Favicon />
    </Head>
    <h1>Hello World</h1>
    <p>Test: { props.data?.test }</p>
    <h2>User</h2>
    { 
      loading ? 'Loading ...' : undefined
    }
    {
        data?.viewer ? data.viewer?.name : 'Not logged in'
    }
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  console.log('getting server side props')
  let result = await ssrTest.getServerPage({}, { req });
  console.log('result', result)
  return result;
};

export default withApollo(Index);

