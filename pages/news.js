// Core
import fs from 'fs';
import path from 'path';
import nookies from 'nookies';
import R from 'ramda';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { newsActions } from '../bus/news/actions';
import { selectNews } from '../bus/news/selectors';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { changeDate } from '../helpers/changeDate';
import { serverDispatch } from '../helpers/serverDispatch';
// Components
import NewsComponent from '../components/news-component';
import { userActions } from '../bus/user/actions';
import { getUserStatus } from '../helpers/getUserStatus';
import { selectUserType } from '../bus/user/selectors';

const PATH = path.resolve('data');

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let newsData = {};
  let userType = '';
  let visitCounts = null;

  try {
    newsData = getParsedFile(await promises.readFile(`${PATH}/news.json`, 'utf-8'));

    changeDate(newsData, `${PATH}/news.json`);

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
    dispatch(newsActions.fillNews(newsData));
  });

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember' && initialUserType !== 'friend' && initialUserType !== 'guest') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }
  const currentPageReduxState = {
    news: selectNews(store.getState()),
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

const News = (props) => {
  const {} = props;

  return (
    <>
      <h1>News</h1>
      <NewsComponent/>
    </>
  );
};

export default News;