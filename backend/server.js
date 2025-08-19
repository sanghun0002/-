// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// 데이터베이스 설정
const db = new sqlite3.Database(':memory:'); // 간단한 테스트를 위해 인메모리 DB 사용

// 데이터베이스 초기화 및 샘플 데이터 추가
db.serialize(() => {
    db.run("CREATE TABLE regions (id INTEGER PRIMARY KEY, name TEXT UNIQUE)");
    db.run("CREATE TABLE cities (id INTEGER PRIMARY KEY, name TEXT, region_id INTEGER)");
    db.run("CREATE TABLE valleys (id INTEGER PRIMARY KEY, name TEXT, city_id INTEGER)");
    db.run("CREATE TABLE spots (id INTEGER PRIMARY KEY, name TEXT, valley_id INTEGER)");
    
    const regions = ['경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도'];
    regions.forEach(name => db.run(`INSERT INTO regions (name) VALUES (?)`, [name]));
    
    db.run(`INSERT INTO cities (name, region_id) VALUES (?, ?)`, ['가평군', 1]);
    db.run(`INSERT INTO valleys (name, city_id) VALUES (?, ?)`, ['용추계곡', 1]);
    db.run(`INSERT INTO spots (name, valley_id) VALUES (?, ?)`, ['A-1 (상류)', 1]);
    db.run(`INSERT INTO spots (name, valley_id) VALUES (?, ?)`, ['B-1 (중류)', 1]);
});

// === API 라우트 ===

app.get('/api/regions', (req, res) => {
    db.all("SELECT * FROM regions", [], (err, rows) => res.json(rows));
});

app.get('/api/cities', (req, res) => {
    db.all("SELECT * FROM cities WHERE region_id = ?", [req.query.region_id], (err, rows) => res.json(rows));
});

app.get('/api/valleys', (req, res) => {
    db.all("SELECT * FROM valleys WHERE city_id = ?", [req.query.city_id], (err, rows) => res.json(rows));
});

app.get('/api/spots', (req, res) => {
    db.all("SELECT * FROM spots WHERE valley_id = ?", [req.query.valley_id], (err, rows) => res.json(rows));
});


// 기본 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});