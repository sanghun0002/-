// 파일 위치: site/backend/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'https://restinginthevalley.netlify.app',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let notices = [ /* ... 기존 데이터 생략 ... */ ];
let nextId = 16;

// [API 1] 공지사항 목록 가져오기 (페이지네이션 적용)
app.get('/api/notices', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const noticesPerPage = 10;

    const stickyNotices = notices.filter(n => n.isSticky).sort((a, b) => b.id - a.id);
    const normalNotices = notices.filter(n => !n.isSticky).sort((a, b) => b.id - a.id);

    const totalPages = Math.ceil(normalNotices.length / noticesPerPage);
    const startIndex = (page - 1) * noticesPerPage;
    const endIndex = startIndex + noticesPerPage;
    const paginatedNotices = normalNotices.slice(startIndex, endIndex);

    // 클라이언트에 보낼 데이터 구성
    res.json({
        notices: paginatedNotices,
        stickyNotices: stickyNotices,
        totalPages: totalPages,
        currentPage: page,
        totalNormalNotices: normalNotices.length // 👈 이 줄이 추가되었습니다!
    });
});

app.post('/api/notices', (req, res) => {
    const { title, department, isSticky } = req.body;
    if (!title || !department) return res.status(400).json({ message: '필수 값 누락' });
    const newNotice = {
        id: nextId++,
        title,
        department,
        date: new Date().toISOString().split('T')[0],
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