//Core
import fs from 'fs';
import nookies from 'nookies';
//Redux
import { initialDispatcher } from '../../init/initialDispatcher';
import { initializeStore } from '../../init/store';
import { carsActions } from '../../bus/cars/actions';
import { selectCars } from '../../bus/cars/selectors';
//Components
import BackLink from '../../components/back-link';
import CarComponent from '../../components/car-component';
//Helpers
import { getSlugIndex } from '../../helpers/getIndex';
import { getParsedFile } from '../../helpers/getParsedFile';
import { userActions } from '../../bus/user/actions';
import { getUserStatus } from '../../helpers/getUserStatus';
import { selectUserType } from '../../bus/user/selectors';

export const getServerSideProps = async (context) => {
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let carsData = {};

  try {
    carsData = getParsedFile(await promises.readFile('./cars.json', 'utf-8'));
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
  store.dispatch(carsActions.fillCars(carsData));

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

  const initialReduxState = {
    cars: initialCars,
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
      <h1>Car page</h1>
      <CarComponent/>
    </>
  );
};

export default Slug;