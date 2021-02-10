import Link from 'next/link';
import { useRouter } from 'next/router';

const BackLink = (props) => {
  const {} = props;

  const router = useRouter();

  return (
    <a onClick={(e) => {
      e.preventDefault();
      router.back();
    }}
    style={{cursor: 'pointer'}}>Назад</a>
  );
};

export default BackLink;