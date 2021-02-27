//Core
import fs from 'fs';
import path from 'path';
import nookies from 'nookies';
import R from 'ramda';
//Redux
import { initialDispatcher } from '../../init/initialDispatcher';
import { initializeStore } from '../../init/store';
//Bus
import { newsActions } from '../../bus/news/actions';
import { selectNews } from '../../bus/news/selectors';
//Components
import BackLink from '../../components/back-link';
import ArticleComponent from '../../components/article-component';
//Helpers
import { getParsedFile } from '../../helpers/getParsedFile';
import { getSlugIndex } from '../../helpers/getIndex';
import { userActions } from '../../bus/user/actions';
import { getUserStatus } from '../../helpers/getUserStatus';
import { selectUserType } from '../../bus/user/selectors';
import { serverDispatch } from '../../helpers/serverDispatch';

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

  const initialNews = selectNews(store.getState());
  const slug = context.query.slug;
  const slugIndexInNews = getSlugIndex(initialNews, slug);

  if (slugIndexInNews < 0) {
    return {
      redirect: {
        destination: '/404',
      }
    }
  }

  const initialUserType = selectUserType(store.getState());

  if (initialUserType !== 'familyMember' && initialUserType !== 'friend' && initialUserType !== 'guest') {
    return {
      redirect: {
        destination: '/',
      }
    }
  }

  const currentPageReduxState = {
    news: initialNews,
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
      <h1>Article page</h1>
      <ArticleComponent/>
    </>
  );
};

export default Slug;