// Core
import fs from 'fs';
import nookies from 'nookies';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { userActions } from '../bus/user/actions';
// Components
import UserInfo from "../components/user-info";
import Menu from '../components/menu';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { getUniqueId } from "../helpers/getUniqueId";
import { getUserStatus } from '../helpers/getUserStatus';
import { useDispatch } from 'react-redux';
import { selectUserId, selectUserType, selectVisitCounts } from '../bus/user/selectors';

export const getServerSideProps = async (context) => {
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();

  const userData = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
  const {
    userType,
    visitCounts,
  } = getUserStatus(userData, userId);

  store.dispatch(userActions.fillUser({userId}));
  store.dispatch(userActions.setVisitCounts({visitCounts}));
  // store.dispatch(userActions.setUserType({userType}));

  const initialReduxState = {
    user: {
      userId: selectUserId(store.getState()),
      visitCounts: selectVisitCounts(store.getState()),
      // userType: selectUserType(store.getState()),
    }
  };

  return {
    props: {
      initialReduxState,
    }
  }
};

const User = (props) => {
  const {initialReduxState} = props;
  // const initialUserVisitCounts = initialReduxState.visitCounts;

  // let userType = '';
  // if (initialUserVisitCounts < 3) {
  //   userType = 'guest';
  // }
  // else if (initialUserVisitCounts >= 3 && initialUserVisitCounts < 5) {
  //   userType = 'friend';
  // } else if (initialUserVisitCounts >= 5) {
  //   userType = 'familyMember';
  // }

  // const dispatch = useDispatch();
  // dispatch(userActions.setUserType({ userType: userType }));

  return (
    <>
      <Menu />
      <h1>User page</h1>
      <UserInfo/>
    </>
  );
};

export default User;