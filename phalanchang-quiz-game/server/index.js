// server/index.js
const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Reactのビルドフォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, '../client/build')));

// APIルートの設定
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the API' });
});

// その他のルートでReactアプリケーションを返す
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});