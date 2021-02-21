// Core
import path from 'path';
import fse from 'fs-extra';
import klaw from 'klaw';

const PATH = path.resolve('logs/rest');

export default function LogHandler({query}, res) {
  const {userId} = query;

  try {
    const filesData = [];
    const promises = [];

    klaw(PATH)
      .on('data', (item) => {
        const dir = item.path.indexOf(".") == -1;
          if (!dir) {
              if (item.path.toLowerCase().endsWith(".json")) {
                  const promise = new Promise((resolve, reject) => {fse.readFile(item.path, (err, data) => {
                      if (err) {
                        return console.error(err);
                      }
                      const parsedData = JSON.parse(data);

                      if (parsedData.userId === userId) {
                        filesData.push(parsedData);
                      }
                      
                      resolve('Success');
                  })});
                  promises.push(promise);
              }
          }
      })
      .on('error', (err, item) => {
        res.status(500).json({status: `File reading error: ${err.message}. Occured in file ${item.path}`});
      })
      .on('end', () => {
        Promise.all(promises).then(() => {
          if (filesData.length) {
            res.status(200).json({ name: 'GET response', filesData });
          } else {
            res.status(200).json({ name: 'GET response', message: `No users with id ${userId} found!` });
          }
        });
      });
  }
  catch (err) {
    res.status(500).json({status: 'API error'});
  }
};