//Core
import fs from 'fs';
import path from 'path';
import nookies from 'nookies';
import R from 'ramda';
//Redux
import { initialDispatcher } from '../../init/initialDispatcher';
import { initializeStore } from '../../init/store';
//Bus
import { discountsActions } from '../../bus/discounts/actions';
import { selectDiscounts } from '../../bus/discounts/selectors';
import { userActions } from '../../bus/user/actions';
import { selectUserType } from '../../bus/user/selectors';
//Components
import BackLink from '../../components/back-link';
import DiscountComponent from '../../components/discount-component';
//Helpers
import { getSlugIndex } from '../../helpers/getIndex';
import { getParsedFile } from '../../helpers/getParsedFile';
import { getUserStatus } from '../../helpers/getUserStatus';
import { serverDispatch } from '../../helpers/serverDispatch';

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let discountsData = {};

  try {
    discountsData = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'discounts.json'), 'utf-8'));
  }
  catch (error) {
    console.error(error);
  }

  const userData = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
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

  const initiaDiscounts = selectDiscounts(store.getState());
  const slug = context.query.slug;
  const slugIndexInDiscounts = getSlugIndex(initiaDiscounts, slug);

  if (slugIndexInDiscounts < 0) {
    return {
      redirect: {
        destination: '/404',
      }
    }
  }

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember' && initialUserType !== 'friend') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const currentPageReduxState = {
    discounts: initiaDiscounts,
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

const Slug = (props) => {
  const {} = props;

  return (
    <>
      <BackLink/>
      <h1>Discount page</h1>
      <DiscountComponent />
    </>
  );
};

export default Slug;