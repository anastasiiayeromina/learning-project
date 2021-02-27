// Core
import fs from 'fs';
import nookies from 'nookies';
import path from 'path';
import R from 'ramda';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
//Bus
import { discountsActions } from '../bus/discounts/actions';
import { selectDiscounts } from '../bus/discounts/selectors';
import { selectUserType } from '../bus/user/selectors';
import { userActions } from '../bus/user/actions';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { changeDate } from '../helpers/changeDate';
import { getUserStatus } from '../helpers/getUserStatus';
import { serverDispatch } from '../helpers/serverDispatch';
// Components
import DiscountsComponent from '../components/discounts-component';

const PATH = path.resolve('data');

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let discountsData = {};

  try {
    discountsData = getParsedFile(await promises.readFile(`${PATH}/discounts.json`, 'utf-8'));

    changeDate(discountsData, `${PATH}/discounts.json`);
  }
  catch (error) {
    console.error(error);
  }

  const userData = getParsedFile(await promises.readFile(`${PATH}/users.json`, 'utf-8'));
  const {
    userType,
    visitCounts,
  } = getUserStatus(userData, userId);

  await serverDispatch(store, (dispatch) => {
    dispatch(userActions.fillUser({userId}));
    dispatch(userActions.setVisitCounts({visitCounts}));
    dispatch(userActions.setUserType({userType}));
    dispatch(discountsActions.fillDiscounts(discountsData));
  });

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember' && initialUserType !== 'friend') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const currentPageReduxState = {
    discounts: selectDiscounts(store.getState()),
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
}

const Discounts = (props) => {
  const {} = props;

  return (
    <>
      <h1>Discounts</h1>
      <DiscountsComponent/>
    </>
  );
};

export default Discounts;