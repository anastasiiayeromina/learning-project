import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectDiscounts } from "../bus/discounts/selectors";
import { getItemById } from "../helpers/getItemById";

const DiscountComponent = (props) => {
  const {} = props;

  const router = useRouter();
  const discounts = useSelector(selectDiscounts);

  const {slug} = router.query;
  const currentDiscount = getItemById(discounts, slug);

  return (
    <>
      <h3>Discount {currentDiscount.id}</h3>
      <p>{currentDiscount.content}</p>
      <time>{currentDiscount.dateOfReceiving}</time>
    </>
  );
};

export default DiscountComponent;