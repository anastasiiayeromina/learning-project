// Selectors
import { useSelector } from 'react-redux';
import { selectAsteroidsEntries } from '../bus/asteroids/selectors';

const AsteroidsComponent = (props) => {
  const {} = props;
  const asteroidsEntries = useSelector(selectAsteroidsEntries);

  const entriesJSX = asteroidsEntries && asteroidsEntries.map(({full_name}) => (
    <p key={full_name}>{full_name}</p>
  ));

  return (
    <>
      <h2>Asteroids</h2>
      {entriesJSX}
    </>
  );
};

export default AsteroidsComponent;