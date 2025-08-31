require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const OWNER = 'catdevdesigns';
const REPO = 'schedule';
const FILE_PATH = 'licenses.json';

app.get('/license', async (req, res) => {
  const authKey = req.query.key;

  if (authKey !== process.env.ACCESS_KEY) {
    console.warn('[WARN] Invalid access key attempt');
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const githubResponse = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'Roblox-License-Proxy'
        }
      }
    );

    const base64Content = githubResponse.data.content;
    const decoded = Buffer.from(base64Content, 'base64').toString('utf-8');

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(decoded);
  } catch (err) {
    console.error('[ERROR] Failed to fetch license file:', err.response?.data || err.message);
    res.status(500).json({ error: 'Unable to fetch license data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ License proxy running on port ${PORT}`);
});
