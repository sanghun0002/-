const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'https://restinginthevalley.netlify.app', // 👈 이 주소 확인!
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let notices = [
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: false },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false },
];
let nextId = 4;

app.get('/api/notices', (req, res) => {
    const sortedNotices = [...notices].sort((a, b) => { /* ... 정렬 로직 ... */ });
    res.json(sortedNotices);
});
app.post('/api/notices', (req, res) => {
    const { title, department, isSticky } = req.body;
    if (!title || !department) return res.status(400).json({ message: '필수 값 누락' });
    const newNotice = {
        id: nextId++,
        title,
        department,
        date: new Date().toISOString().split('T')[0], // 안정적인 날짜 형식
        views: 0,
        isSticky: isSticky || false
    };
    notices.unshift(newNotice);
    res.status(201).json(newNotice);
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});