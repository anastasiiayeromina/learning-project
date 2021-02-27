// Core
import fs from 'fs';
import nookies from 'nookies';
import R from 'ramda';
import { END } from 'redux-saga';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { initApollo } from '../init/initApollo';
import { userActions } from "../bus/user/actions";
import { asteroidsActions } from '../bus/asteroids/actions';
import { selectVisitCounts, selectUserId, selectUserType } from '../bus/user/selectors';
import { selectAsteroidsEntries } from '../bus/asteroids/selectors';
// Helpers
import { getUniqueId } from '../helpers/getUniqueId';
import { getCookieIndex } from '../helpers/getIndex';
import { getParsedFile } from '../helpers/getParsedFile';
import { getUserStatus } from '../helpers/getUserStatus';
import { addUser, updateUser } from '../helpers/user';
import { serverDispatch } from '../helpers/serverDispatch';
import { disableSaga } from '../helpers/disableSaga';
// Components
import Message from '../components/message';
import Menu from '../components/menu';
import AsteroidsComponent from '../components/asteroids-component';
import PokemonsComponent from '../components/pokemons-component';
import CatsComponent from '../bus/cats/cats-component';
// Other
import queryPokemons from '../bus/pokemons/usePokemons/gql/queryPokemons.graphql';

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const initialApolloState = await initApollo(context, async (execute) => {
    await execute({
      query: queryPokemons,
    });
  });

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();
  
  if (!cookies.userId) {
    nookies.set(context, 'userId', userId);
  }

  try {
    const data = getParsedFile(await promises.readFile('./data/users.json', 'utf-8'));
    const cookieIndex = getCookieIndex(data, userId);
    
    if (cookieIndex < 0) {
      addUser(data, userId);
  
      await promises.writeFile('./data/users.json', JSON.stringify(data, null, 4));
    } else if (data[cookieIndex].userId === cookies.userId) {
      updateUser(data, cookieIndex);

      await promises.writeFile('./data/users.json', JSON.stringify(data, null, 4));
    }
    
  } catch (error) {
      console.error(error);
  }

  const userData = getParsedFile(await promises.readFile('./data/users.json', 'utf-8'));
  const {
    userType,
    visitCounts
  } = getUserStatus(userData, userId);

  await serverDispatch(store, (dispatch) => {
    dispatch(userActions.fillUser({userId}));
    dispatch(userActions.setVisitCounts({visitCounts}));
    dispatch(userActions.setUserType({userType}));
    dispatch(asteroidsActions.loadAsteroidsAsync());

    dispatch(END);
  });

  await disableSaga(store);

  const currentPageReduxState = {
    user: {
      userId: selectUserId(store.getState()),
      visitCounts: selectVisitCounts(store.getState()),
      userType: selectUserType(store.getState()),
    },
    asteroids: {
      entries: selectAsteroidsEntries(store.getState()),
    },
  };

  const initialReduxState = R.mergeDeepRight(
    stateUpdates,
    currentPageReduxState,
  );

  return {
    props: {
      initialReduxState,
      initialApolloState,
    }
  }
}

const Home = (props) => {
  const {initialReduxState} = props;

  return (
    <>
      <Menu />
      <Message />
      <AsteroidsComponent />
      <PokemonsComponent />
      <CatsComponent />
    </>
  )
}

export default Home;
