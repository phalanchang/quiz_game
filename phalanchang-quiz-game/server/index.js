// server/index.js
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// ■ ドキュメントの話
// ドキュメントのルートを設定
app.use('/documents', express.static(path.join(__dirname, '../documents')));

// ドキュメントファイルが存在する場合はそのファイルを提供
app.get('/documents/*', (req, res) => {
  const filePath = path.join(__dirname, '../documents', req.path.replace('/documents', ''));
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).send('Document not found');
    }
  });
});

// ■ mysql接続の話
// 設定ファイルの読み込み
const configPath = path.join(__dirname, 'config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

app.use(express.json());

// MySQL接続設定
const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

// 接続確認
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

// レコード挿入エンドポイント
app.post('/api/insert', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO test (name) VALUES (?)';
  connection.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error inserting record:', err);
      res.status(500).send('Error inserting record');
      return;
    }
    res.status(200).send('Record inserted successfully');
  });
});

// ナレッジ一覧取得エンドポイント
app.get('/api/list-knowledge', (req, res) => {
  console.log("call /api/list-knowledge");
  let sql = 'SELECT * FROM knowledge';
  connection.query(sql, (err, results) => {
    console.log(results);
    console.log(err);
    if (err) throw err;
    res.send(results);
  });
});

app.post('/api/add-knowledge', (req, res) => {
  console.log("called [/api/add-knowledge]");
  const { knowledge_title, knowledge_detail, knowledge_creator, status, tags, views, rating } = req.body;
  let sql = 'INSERT INTO knowledge (knowledge_title, knowledge_detail, knowledge_creator, status, tags, views, rating) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [knowledge_title, knowledge_detail, knowledge_creator, status, tags, views, rating], (err, result) => {
    if (err) throw err;
    res.send('Knowledge added.');
  });
});

// ■ React Rootの話
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