// Core
import { Provider } from 'react-redux';
// Styles
import '../styles/globals.css'
// Other
import {useStore} from '../init/store';

function MyApp({ Component, pageProps }) {
  console.log('APP Render');
  const store = useStore(pageProps.initialReduxState);
  console.log('App render: store.getState()', store.getState() );

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp
