// Core
import fs from 'fs';
import path from 'path';
import nookies from 'nookies';
import R from 'ramda';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { userActions } from '../bus/user/actions';
import { selectUserId, selectUserType, selectVisitCounts } from '../bus/user/selectors';
// Components
import UserInfo from "../components/user-info";
import Menu from '../components/menu';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { getUniqueId } from "../helpers/getUniqueId";
import { getUserStatus } from '../helpers/getUserStatus';
import { serverDispatch } from '../helpers/serverDispatch';

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();

  const userData = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
  const {
    userType,
    visitCounts,
  } = getUserStatus(userData, userId);

  await serverDispatch(store, (dispatch) => {
    dispatch(userActions.fillUser({userId}));
    dispatch(userActions.setVisitCounts({visitCounts}));
    dispatch(userActions.setUserType({userType}));
  });

  const currentPageReduxState = {
    user: {
      userId: selectUserId(store.getState()),
      visitCounts: selectVisitCounts(store.getState()),
      userType: selectUserType(store.getState()),
    }
  };

  const initialReduxState = R.mergeDeepRight(
    stateUpdates,
    currentPageReduxState,
  );

  return {
    props: {
      initialReduxState,
    }
  }
};

const User = (props) => {
  const {initialReduxState} = props;

  return (
    <>
      <Menu />
      <h1>User page</h1>
      <UserInfo/>
    </>
  );
};

export default User;