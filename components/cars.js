import React from 'react';

const Cars = (props) => {
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

export default Cars;