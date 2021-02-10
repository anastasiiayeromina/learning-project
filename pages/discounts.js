// Core
import fs from 'fs';
import nookies from 'nookies';
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
// Components
import DiscountsComponent from '../components/discounts-component';

export const getServerSideProps = async (context) => {
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let discountsData = {};

  try {
    discountsData = getParsedFile(await promises.readFile('./discounts.json', 'utf-8'));

    changeDate(discountsData, './discounts.json');
  }
  catch (error) {
    console.error(error);
  }

  const userData = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
  const {
    userType,
    visitCounts,
  } = getUserStatus(userData, userId);

  store.dispatch(userActions.fillUser({userId}));
  store.dispatch(userActions.setVisitCounts({visitCounts}));
  store.dispatch(userActions.setUserType({userType}));
  store.dispatch(discountsActions.fillDiscounts(discountsData));

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember' && initialUserType !== 'friend') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const initialReduxState = {
    discounts: selectDiscounts(store.getState()),
  };

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