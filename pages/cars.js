// Core
import fs from 'fs';
import nookies from 'nookies';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { carsActions } from '../bus/cars/actions';
import { selectCars } from '../bus/cars/selectors';
import { selectUserType } from '../bus/user/selectors'; 
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { changeDate } from '../helpers/changeDate';
// Components
import CarsComponent from '../components/cars-component';
import { userActions } from '../bus/user/actions';
import { getUserStatus } from '../helpers/getUserStatus';

export const getServerSideProps = async (context) => {
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let carsData = {};

  try {
    carsData = getParsedFile(await promises.readFile('./cars.json', 'utf-8'));

    changeDate(carsData, './cars.json');
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

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const initialReduxState = {
    cars: selectCars(store.getState()),
  };

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