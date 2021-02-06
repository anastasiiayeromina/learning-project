import ActiveLink from './active-link';

const Menu = (props) => {
  const {} = props;
  
  return (
    <menu>
      <li>
        <ActiveLink
          href='/'>Home</ActiveLink>
      </li>
      <li>
        <ActiveLink
          href='/dashboard'>Dashboard</ActiveLink>
      </li>
      <li>
        <ActiveLink
          href='/user'>User</ActiveLink>
      </li>
    </menu>
  );
};

export default Menu;