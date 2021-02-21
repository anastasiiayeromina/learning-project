// Core
import fetch from 'node-fetch';

export default async (req, res) => {
  try {
    const response = await fetch('https://cat-fact.herokuapp.com/facts');
    const data = await response.json();

    if (response.status === 200 && Array.isArray(data) && data.length > 0) {
      const responseData = data.map(({_id, text}) => ({_id, text}));

      res.status(200).json(responseData);
    } else {
      res.status(500).json({status: 'API error'});
    }
  } catch (err) {
    res.status(500).json({status: 'API error'});
  }
}