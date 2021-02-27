// Core
import fs from 'fs';
import path from 'path';
import nookies from 'nookies';
import R from 'ramda';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { carsActions } from '../bus/cars/actions';
import { selectCars } from '../bus/cars/selectors';
import { selectUserType } from '../bus/user/selectors'; 
import { userActions } from '../bus/user/actions';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { changeDate } from '../helpers/changeDate';
import { getUserStatus } from '../helpers/getUserStatus';
import { serverDispatch } from '../helpers/serverDispatch';
// Components
import CarsComponent from '../components/cars-component';

const PATH = path.resolve('data');

export const getServerSideProps = async (context) => {
  const {store, stateUpdated} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let carsData = {};
  let userType = '';
  let visitCounts = null;

  try {
    carsData = getParsedFile(await promises.readFile(`${PATH}/cars.json`, 'utf-8'));

    changeDate(carsData, `${PATH}/cars.json`);

    const userData = getParsedFile(await promises.readFile(`${PATH}/users.json`, 'utf-8'));

    userType = getUserStatus(userData, userId).userType;
    visitCounts = getUserStatus(userData, userId).visitCounts;
  }
  catch (error) {
    console.error(error);
  }

  await serverDispatch(store, (dispatch) => {
    dispatch(userActions.fillUser({userId}));
    dispatch(userActions.setVisitCounts({visitCounts}));
    dispatch(userActions.setUserType({userType}));
    dispatch(carsActions.fillCars(carsData));
  });

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const currentPageReduxState = {
    cars: selectCars(store.getState()),
  };

  const initialReduxState = R.mergeDeepRight(
    stateUpdated,
    currentPageReduxState,
  );

  return {
    props: {
      initialReduxState,
    }
  }
}

const Cars = (props) => {
  const {} = props;

  return (
    <>
      <h1>Cars</h1>
      <CarsComponent/>
    </>
  );
};

export default Cars;