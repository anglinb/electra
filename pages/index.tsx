import { useQuery } from '@apollo/client';
import TEST_QUERY from './test.graphql';


const Index = () => {

   const { data, loading, error } = useQuery(TEST_QUERY);

  return (
    <>
    <h1>Hello World</h1>
    <p>{ data }</p>
    </>
  );
};

export default Index;
