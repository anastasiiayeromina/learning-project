import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectDiscounts } from '../bus/discounts/selectors';

const DiscountsComponent = (props) => {
  const {} = props;
  const discounts = useSelector(selectDiscounts);

  return (
    <>
      <ul>
        {discounts.map((discountsItem) => {
          return (
            <li key={discountsItem.id}>
              <h3>
                <Link href={`/discounts/${discountsItem.id}`}>
                  <a style={{color: 'blue'}}>{discountsItem.id}</a>
                </Link>
              </h3>
              <p>{discountsItem.content}</p>
              <time>{discountsItem.dateOfReceiving}</time>
            </li>
          )
        })}
      </ul>
      <hr/>
    </>
  );
}

export default DiscountsComponent;