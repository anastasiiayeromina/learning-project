//Core
import fs from 'fs';
import nookies from 'nookies';
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

export const getServerSideProps = async (context) => {
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let discountsData = {};

  try {
    discountsData = getParsedFile(await promises.readFile('./discounts.json', 'utf-8'));
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

  const initialReduxState = {
    discounts: initiaDiscounts,
  };

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