// 파일 위치: site/backend/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = { /* ... CORS 설정 생략 ... */ };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let notices = [ /* ... 데이터 생략 ... */ ];
let nextId = 16;

app.get('/api/notices', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const noticesPerPage = 10;

    const stickyNotices = notices.filter(n => n.isSticky).sort((a, b) => b.id - a.id);
    const normalNotices = notices.filter(n => !n.isSticky).sort((a, b) => b.id - a.id);

    const totalPages = Math.ceil(normalNotices.length / noticesPerPage);
    let paginatedNotices;

    // 1페이지에 표시될 일반 공지 개수 계산
    const normalNoticesOnFirstPage = Math.max(0, noticesPerPage - stickyNotices.length);

    if (page === 1) {
        paginatedNotices = normalNotices.slice(0, normalNoticesOnFirstPage);
    } else {
        const startIndex = normalNoticesOnFirstPage + (page - 2) * noticesPerPage;
        const endIndex = startIndex + noticesPerPage;
        paginatedNotices = normalNotices.slice(startIndex, endIndex);
    }

    res.json({
        notices: paginatedNotices,
        stickyNotices: stickyNotices,
        totalPages: totalPages,
        currentPage: page,
        totalNormalNotices: normalNotices.length,
        normalNoticesOnFirstPage: normalNoticesOnFirstPage // 👈 이 줄이 추가되었습니다!
    });
});

app.post('/api/notices', (req, res) => { /* ... 기존 코드와 동일 ... */ });
app.get('*', (req, res) => { /* ... 기존 코드와 동일 ... */ });
app.listen(PORT, () => { /* ... 기존 코드와 동일 ... */ });