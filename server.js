require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Your GitHub repo info
const OWNER = 'catdevdesigns';       // CHANGE THIS
const REPO = 'schedule';      // CHANGE THIS
const FILE_PATH = 'licenses.json';          // File path inside repo

// Proxy endpoint for Roblox
app.get('/license', async (req, res) => {
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
		console.error('[ERROR] Failed to fetch license file:', err.message);
		res.status(500).json({ error: 'Unable to fetch license data' });
	}
});

app.listen(PORT, () => {
	console.log(`✅ License proxy running on port ${PORT}`);
});
