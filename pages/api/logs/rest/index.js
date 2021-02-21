// Core
import path from 'path';
import fse from 'fs-extra';
import klaw from 'klaw';

const PATH = path.resolve('logs/rest');

export default async (req, res) => {
  const {query} = req;
  const {userId} = query;
  
  if (req.method === 'POST') {
    await fse.writeFile(`${PATH}/${req.body.logId}.json`, JSON.stringify(req.body), 'utf-8');

    res.status(201).json({ name: 'POST response', message: `created at ${new Date().toISOString()}` });
  } else if (req.method === 'GET') {
    try {
      console.log(query);
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
                        
                        if (userId) {
                          if (userId === parsedData.userId) {
                            filesData.push(parsedData);
                          }
                        } else {
                          filesData.push(parsedData);
                        }
                        
                        resolve('Success');
                    })});
                    promises.push(promise);
                }
            }
        })
        .on('error', (err, item) => {
          console.log(err.message);
          console.log(item.path);
          res.status(500).json({status: 'File reading error'});
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
  }
}