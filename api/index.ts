import express from 'express';
import fs from 'fs';
const path = require('path');
const app = express();

// enable JSON body parser
app.use(express.json());

app.get('/getVIPList', (req, res) => {
    const filePath = './purchasedVIP.list';

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read to file' });
      }

      return res.status(200).json({ message: 'Purchased VIP list', data });
    });
});

app.post('/addVIPUser', (req, res) => {
if (req.method === 'POST') {
    const { username } = req.body;

    const filePath = path.resolve('./', 'purchasedVIP.list');

    // Append the username to the file
    fs.appendFile(filePath, `\n${username}`, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write to file' });
      }

      return res.status(200).json({ message: 'Username added to VIP list' });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});

export default app;