// Core
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// Actions
import { catsActions } from './actions';
// Selectors
import { selectCatsEntries } from './selectors';
import { getUniqueId } from '../../helpers/getUniqueId';
import { selectUserId } from '../user/selectors';
import { environmentVerify } from '../../helpers/verifyEnvironment';
// Styles
import styles from './styles.module.scss';

const CatsComponent = () => {
  const dispatch = useDispatch();
  const entries = useSelector(selectCatsEntries);
  const userId = useSelector(selectUserId);
  const {isProduction} = environmentVerify();

  const handlePostRequest = async () => {
    const logId = getUniqueId();

    const response = await fetch('/api/logs/rest', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        logId,
        created: new Date().toISOString(),
        userId: userId,
        userAgent: window.navigator.userAgent, 
        payload: {} 
      }, null ,4),
    });
  }

  useEffect(() => {
    dispatch(catsActions.loadCatsAsync());
    
    if (isProduction) {
      handlePostRequest();
    }
  }, []);

  const entriesJSX = entries && entries.map(({ _id, text }) => (
    <p key={_id}>
      {text}
    </p>
  ));

  return (
    <section className={styles.cats}>
      <h1>Cats</h1>
      <div className={styles.list}>
        {entriesJSX}
      </div>
    </section>
  )
};

export default CatsComponent;