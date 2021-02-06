// Core
import fs from 'fs';
import nookies from 'nookies';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { userActions } from "../bus/user/actions";
// Helpers
import { getUniqueId } from '../helpers/getUniqueId';
import { getCookieIndex } from '../helpers/getCookieIndex';
import { getParsedFile } from '../helpers/getParsedFile';
import { getUserStatus } from '../helpers/getUserStatus';
import { addUser, updateUser } from '../helpers/user';
// Components
import Message from '../components/message';
import Menu from '../components/menu';
import UserInfo from '../components/user-info';
import { useDispatch } from 'react-redux';

export const getServerSideProps = async (context) => {
  console.log('getServerSideProps: Home');
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();
  
  if (!cookies.userId) {
    nookies.set(context, 'userId', userId);
  }

  try {
    const data = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
    const cookieIndex = getCookieIndex(data, userId);
    
    if (cookieIndex < 0) {
      addUser(data, userId);
  
      await promises.writeFile('./users.json', JSON.stringify(data, null, 4));
    } else if (data[cookieIndex].userId === cookies.userId) {
      updateUser(data, cookieIndex);

      await promises.writeFile('./users.json', JSON.stringify(data, null, 4));
    }
    
  } catch (error) {
      console.error(error);
  }

  const userData = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
  const {
    userType,
    visitCounts
  } = getUserStatus(userData, userId);

  store.dispatch(userActions.fillUser({userId}));
  store.dispatch(userActions.setVisitCounts({visitCounts}));
  store.dispatch(userActions.setUserType({userType}));

  const initialReduxState = store.getState();
  console.log('initialReduxState will be sent to App Home', initialReduxState);

  return {
    props: {
      initialReduxState
    }
  }
}

const Home = (props) => {
  console.log('Home');
  const {initialReduxState} = props;
  const initialUser = initialReduxState.user;
  const dispatch = useDispatch();
  dispatch(userActions.setVisitCounts({ visitCounts: initialUser.visitCounts }));

  return (
    <>
      <Menu />
      <UserInfo/>
      <Message />
    </>
  )
}

export default Home;
