import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectNews } from "../bus/news/selectors";
import { getItemById } from "../helpers/getItemById";

const ArticleComponent = (props) => {
  const {} = props;

  const router = useRouter();
  const news = useSelector(selectNews);
  
  const {slug} = router.query;
  const currentNewsItem = getItemById(news, slug);

  return (
    <>
      <h3>Article {currentNewsItem.id}</h3>
      <p>{currentNewsItem.content}</p>
      <time>{currentNewsItem.dateOfReceiving}</time>
    </>
  );
};

export default ArticleComponent;