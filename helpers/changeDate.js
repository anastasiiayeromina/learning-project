const fs = require('fs').promises;

export const changeDate = (data, fileName) => {
  const updatedData = data.map((item) => {
    item.dateOfReceiving = `${new Date()}`;
    return item;
  });
  fs.writeFile(fileName, '');
  fs.writeFile(fileName, JSON.stringify(updatedData, null, 4));
};

