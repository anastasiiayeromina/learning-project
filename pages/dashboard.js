import fs from 'fs'
import nookies from 'nookies'
import { getParsedFile } from '../helpers/getParsedFile'
import { getUserStatus } from '../helpers/getUserStatus'
import News from '../components/news'
import Discounts from '../components/discounts'
import Cars from '../components/cars'

export const getServerSideProps = async (context) => {
  const promises = fs.promises;
  const cookies = nookies.get(context);
  const userId = cookies.userId || null;

  const userData = getParsedFile(await promises.readFile('./users.json', 'utf-8'));
  const {
    isGuest,
    isFriend,
    isFamilyMember,
  } = getUserStatus(userData, userId);

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

  return {
    props: {
      newsData,
      discountsData,
      carsData,
      isGuest,
      isFriend,
      isFamilyMember
    }
  }
}

const Dashboard = (props) => {
  const {newsData, discountsData, carsData, isGuest, isFriend, isFamilyMember} = props;

  const newsJSX = (isGuest || isFriend || isFamilyMember) && 
    <News data={newsData}/>;
  const discountsJSX = (isFriend || isFamilyMember) &&
    <Discounts data={discountsData} />;
  const carsJSX = isFamilyMember &&
    <Cars data={carsData} />;

  return (
    <>
      <h1>Dashboard</h1>
      {newsJSX}
      {discountsJSX}
      {carsJSX}
    </>
  );
}

export default Dashboard;