// Core
import fs from 'fs';
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

export const getServerSideProps = async (context) => {
  const {store, stateUpdates} = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let newsData = {};

  try {
    newsData = getParsedFile(await promises.readFile('./data/news.json', 'utf-8'));

    changeDate(newsData, './data/news.json');
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