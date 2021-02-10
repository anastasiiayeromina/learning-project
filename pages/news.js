// Core
import fs from 'fs';
import nookies from 'nookies';
// Reducer
import { initialDispatcher } from "../init/initialDispatcher";
import { initializeStore } from "../init/store";
import { newsActions } from '../bus/news/actions';
import { selectNews } from '../bus/news/selectors';
// Helpers
import { getParsedFile } from '../helpers/getParsedFile';
import { changeDate } from '../helpers/changeDate';
// Components
import NewsComponent from '../components/news-component';
import { userActions } from '../bus/user/actions';
import { getUserStatus } from '../helpers/getUserStatus';
import { selectUserType } from '../bus/user/selectors';

export const getServerSideProps = async (context) => {
  const store = await initialDispatcher(context, initializeStore());

  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  let newsData = {};

  try {
    newsData = getParsedFile(await promises.readFile('./news.json', 'utf-8'));

    changeDate(newsData, './news.json');
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
  store.dispatch(newsActions.fillNews(newsData));

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember' && initialUserType !== 'friend' && initialUserType !== 'guest') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const initialReduxState = {
    news: selectNews(store.getState()),
  };

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