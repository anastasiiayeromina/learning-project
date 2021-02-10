import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectCars } from "../bus/cars/selectors";
import { getItemById } from "../helpers/getItemById";

const CarComponent = (props) => {
  const {} = props;

  const router = useRouter();
  const cars = useSelector(selectCars);

  const {slug} = router.query;
  const currentCar = getItemById(cars, slug);

  return (
    <>
      <h3>Car {currentCar.id}</h3>
      <p>{currentCar.content}</p>
      <time>{currentCar.dateOfReceiving}</time>
    </>
  );
};

export default CarComponent;