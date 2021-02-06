import { useRouter } from 'next/router';

const ActiveLink = (props) => {
  const {children, href} = props;

  const router = useRouter();

  const style = {
    marginRight: 10,
    color: router.pathname === href ? 'grey' : 'black',
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink;