import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectNews } from '../bus/news/selectors';

const NewsComponent = (props) => {
  const {} = props;
  const news = useSelector(selectNews);

  return (
    <>
      <ul>
        {news.map((newsItem) => {
          return (
            <li key={newsItem.id}>
              <h3>
                <Link href={`/news/${newsItem.id}`}>
                  <a style={{color: 'blue'}}>{newsItem.id}</a>
                </Link>
              </h3>
              <p>{newsItem.content}</p>
              <time>{newsItem.dateOfReceiving}</time>
            </li>
          )
        })}
      </ul>
      <hr/>
    </>
  );
}

export default NewsComponent;