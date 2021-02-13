// Core
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
// Styles
import '../styles/globals.css'
// Other
import {useStore} from '../init/store';
import { useApollo } from '../init/apollo';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp
