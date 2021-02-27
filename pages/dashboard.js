// Core
import fs from 'fs';
import path from 'path';
import nookies from 'nookies';
import R from 'ramda';
import Link from 'next/link';
import { useSelector } from 'react-redux';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { userActions } from '../bus/user/actions';
import { selectUserId, selectUserType, selectVisitCounts } from '../bus/user/selectors';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { getUserStatus } from '../helpers/getUserStatus';
import { getCookieIndex } from '../helpers/getIndex';
import { changeDate } from '../helpers/changeDate';
import { getUniqueId } from '../helpers/getUniqueId';
import { addUser, updateUser } from '../helpers/user';
import { serverDispatch } from '../helpers/serverDispatch';
// Components
import Menu from '../components/menu';
import { newsActions } from '../bus/news/actions';
import { discountsActions } from '../bus/discounts/actions';
import { carsActions } from '../bus/cars/actions';
import { selectNews } from '../bus/news/selectors';
import { selectDiscounts } from '../bus/discounts/selectors';
import { selectCars } from '../bus/cars/selectors';

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();

  let newsData = {};
  let discountsData = {};
  let carsData = {};

  try {
    const data = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
    const cookieIndex = getCookieIndex(data, userId);
    
    if (cookieIndex < 0) {
      addUser(data, userId);
  
      await promises.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(data, null, 4));
    } else if (data[cookieIndex].userId === cookies.userId) {
      updateUser(data, cookieIndex);

      await promises.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(data, null, 4));
    }

    newsData = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'news.json'), 'utf-8'));
    discountsData = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'discounts.json'), 'utf-8'));
    carsData = getParsedFile(await promises.readFile(path.join(__dirname, 'data', 'cars.json'), 'utf-8'));

    changeDate(newsData, path.join(__dirname, 'data', 'news.json'));
    changeDate(discountsData, path.join(__dirname, 'data', 'discounts.json'));
    changeDate(carsData, path.join(__dirname, 'data', 'cars.json'));
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
    dispatch(newsActions.fillNews(newsData));
    dispatch(discountsActions.fillDiscounts(discountsData));
    dispatch(carsActions.fillCars(carsData));
  });

  const currentPageReduxState = {
    user: {
      userId: selectUserId(store.getState()),
      visitCounts: selectVisitCounts(store.getState()),
      userType: selectUserType(store.getState()),
    },
    news: selectNews(store.getState()),
    discounts: selectDiscounts(store.getState()),
    cars: selectCars(store.getState()),
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

const Dashboard = (props) => {
  const {initialReduxState} = props;
  const news = useSelector(selectNews);
  const discounts = useSelector(selectDiscounts);
  const cars = useSelector(selectCars);

  const newsListJSX = news && (
    <ul>
      {news.map((item) => {
        return (
          <li key={item.id}>
            <Link href={`/news/${item.id}`}>
              <a>{item.id}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const discountsListJSX = discounts && (
    <ul>
      {discounts.map((item) => {
        return (
          <li key={item.id}>
            <Link href={`/discounts/${item.id}`}>
              <a>{item.id}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const carsListJSX = cars && (
    <ul>
      {cars.map((item) => {
        return (
          <li key={item.id}>
            <Link href={`/cars/${item.id}`}>
              <a>{item.id}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <Menu />
      <h1>Dashboard</h1>
      <ol>
        <li>
          <Link href='/news'>
            <a>News</a>
          </Link>
          {newsListJSX}
        </li>
        <li>
          <Link href='/discounts'>
            <a>Discounts</a>
          </Link>
          {discountsListJSX}
        </li>
        <li>
          <Link href='/cars'>
            <a>Cars</a>
          </Link>
          {carsListJSX}
        </li>
      </ol>
    </>
  );
}

export default Dashboard;