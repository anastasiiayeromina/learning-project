import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCars } from '../bus/cars/selectors';

const CarsComponent = (props) => {
  const {} = props;
  const cars = useSelector(selectCars);

  return (
    <>
      <ul>
        {cars.map((carsItem) => {
          return (
            <li key={carsItem.id}>
              <h3>
                <Link href={`/cars/${carsItem.id}`}>
                  <a style={{color: 'blue'}}>{carsItem.id}</a>
                </Link>
              </h3>
              <p>{carsItem.content}</p>
              <time>{carsItem.dateOfReceiving}</time>
            </li>
          )
        })}
      </ul>
      <hr/>
    </>
  );
}

export default CarsComponent;