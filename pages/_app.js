// Core
import { Provider } from 'react-redux';
// Styles
import '../styles/globals.css'
// Other
import {useStore} from '../init/store';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp
