import React from 'react';

const Discounts = (props) => {
  const {data} = props;

  return (
    <>
      <ul>
        {data.map((dataItem) => {
          return (
            <li key={dataItem.id}>
              <h3>{dataItem.id}</h3>
              <p>{dataItem.content}</p>
              <time>{dataItem.dateOfReceiving}</time>
            </li>
          )
        })}
      </ul>
      <hr/>
    </>
  );
}

export default Discounts;