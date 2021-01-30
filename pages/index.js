import fs from 'fs-js'
import nookies from 'nookies'
import { getUniqueId } from '../helpers/getUniqueId'
import { getCookieIndex } from '../helpers/getCookieIndex'
import { getParsedFile } from '../helpers/getParsedFile'
import { addUser, updateUser } from '../helpers/user'

export const getServerSideProps = async (context) => {
  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || getUniqueId();
  
  if (!cookies.userId) {
    nookies.set(context, 'userId', userId);
  }

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
    
  } catch (error) {
      console.error(error);
  }

  const userData = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
  const userCookieIndex = getCookieIndex(userData, userId);
  const userVisitsCount = userData[userCookieIndex].visitCounts;

  const isGuest = userVisitsCount < 3;
  const isFriend = userVisitsCount >= 3 && userVisitsCount < 5;
  const isFamilyMember = userVisitsCount >= 5;

  return {
    props: {
      isGuest,
      isFriend,
      isFamilyMember,
    }
  }
}

const Home = (props) => {
  const {isGuest, isFriend, isFamilyMember} = props;

  const guestJSX = isGuest && (
    <h1>Приветствуем тебя, странник!</h1>
  );

  const friendJSX = isFriend && (
    <h1>Приветствуем тебя, друг!</h1>
  );

  const familyMemberJSX = isFamilyMember && (
    <h1>Добро пожаловать в семье!</h1>
  );
  return (
    <>
      {guestJSX}
      {friendJSX}
      {familyMemberJSX}
    </>
  )
}

export default Home;
