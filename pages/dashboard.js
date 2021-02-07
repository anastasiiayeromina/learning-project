// Core
import fs from 'fs';
import nookies from 'nookies';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { getUserStatus } from '../helpers/getUserStatus';
import { getCookieIndex } from '../helpers/getCookieIndex';
// Components
import News from '../components/news';
import Discounts from '../components/discounts';
import Cars from '../components/cars';
import Menu from '../components/menu';
import { userActions } from '../bus/user/actions';
import { getUniqueId } from '../helpers/getUniqueId';
import UserInfo from '../components/user-info';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../helpers/user';
import { selectUserId, selectUserType, selectVisitCounts } from '../bus/user/selectors';

export const getServerSideProps = async (context) => {
  console.log('getServerSideProps: Dashboard');
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();

  let newsData = {};
  let discountsData = {};
  let carsData = {};

  const changeDate = (data, fileName) => {
    const updatedData = data.map((item) => {
      item.dateOfReceiving = `${new Date()}`;
      return item;
    });
    promises.writeFile(fileName, '');
    promises.writeFile(fileName, JSON.stringify(updatedData, null, 4));
  };

  try {
    const data = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
    const cookieIndex = getCookieIndex(data, userId);
    
    if (cookieIndex < 0) {
      addUser(data, userId);
  
      await promises.writeFile('./users.json', JSON.stringify(data, null, 4));
    } else if (data[cookieIndex].userId === cookies.userId) {
      updateUser(data, cookieIndex);

      await promises.writeFile('./users.json', JSON.stringify(data, null, 4));
    }

    newsData = getParsedFile(await promises.readFile('./news.json', 'utf-8'));
    discountsData = getParsedFile(await promises.readFile('./discounts.json', 'utf-8'));
    carsData = getParsedFile(await promises.readFile('./cars.json', 'utf-8'));

    changeDate(newsData, './news.json');
    changeDate(discountsData, './discounts.json');
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

  const initialReduxState = {
    user: {
      userId: selectUserId(store.getState()),
      visitCounts: selectVisitCounts(store.getState()),
      userType: selectUserType(store.getState()),
    }
  };
  console.log('initialReduxState will be sent to App Dashboard', initialReduxState);

  return {
    props: {
      newsData,
      discountsData,
      carsData,
      initialReduxState,
    }
  }
}

const Dashboard = (props) => {
  console.log('Dashboard');
  const {newsData, discountsData, carsData, initialReduxState} = props;
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
  
  const {user} = useSelector((state) => state);

  const hasCars = user.userType === 'familyMember';
  const hasDiscounts = user.userType === 'friend' || hasCars;
  const hasNews = user.userType === 'guest' || hasDiscounts;

  const newsJSX = hasNews && 
    <News data={newsData}/>;
  const discountsJSX = hasDiscounts &&
    <Discounts data={discountsData} />;
  const carsJSX = hasCars &&
    <Cars data={carsData} />;

  return (
    <>
      <Menu />
      <UserInfo/>
      <h1>Dashboard</h1>
      {newsJSX}
      {discountsJSX}
      {carsJSX}
    </>
  );
}

export default Dashboard;