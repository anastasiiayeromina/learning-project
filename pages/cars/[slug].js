//Core
import fs from 'fs';
import nookies from 'nookies';
import R from 'ramda';
//Redux
import { initialDispatcher } from '../../init/initialDispatcher';
import { initializeStore } from '../../init/store';
import { carsActions } from '../../bus/cars/actions';
import { selectCars } from '../../bus/cars/selectors';
import { selectUserType } from '../../bus/user/selectors';
import { userActions } from '../../bus/user/actions';
//Components
import BackLink from '../../components/back-link';
import CarComponent from '../../components/car-component';
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

  let carsData = {};

  try {
    carsData = getParsedFile(await promises.readFile('./data/cars.json', 'utf-8'));
  }
  catch (error) {
    console.error(error);
  }

  const userData = getParsedFile(await promises.readFile('./data/users.json', 'utf-8'));
  const {
    userType,
    visitCounts,
  } = getUserStatus(userData, userId);

  await serverDispatch(store, (dispatch) => {
    dispatch(userActions.fillUser({userId}));
    dispatch(userActions.setVisitCounts({visitCounts}));
    dispatch(userActions.setUserType({userType}));
    dispatch(carsActions.fillCars(carsData));
  });

  const initialCars = selectCars(store.getState());
  const slug = context.query.slug;
  const slugIndexInCars = getSlugIndex(initialCars, slug);

  if (slugIndexInCars < 0) {
    return {
      redirect: {
        destination: '/404',
      }
    }
  }
  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const currentPageReduxState = {
    cars: initialCars,
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
      <h1>Car page</h1>
      <CarComponent/>
    </>
  );
};

export default Slug;