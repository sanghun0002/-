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

let notices = [
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true, content: "기상청 예보 기준, 방문 예정일의 강수 확률이 70% 이상일 경우 위약금 없이 예약을 취소할 수 있습니다. 취소는 방문 하루 전까지 가능합니다." },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: true, content: "이제 QR코드를 통해 보증금을 현장에서 즉시 인증하고 반환받을 수 있습니다. 퇴실 시 비치된 QR코드를 스캔해주세요." },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false, content: "7월에서 8월 사이 여름 성수기 기간 동안 예약이 폭주할 수 있으니 미리 예약해주시기 바랍니다. 원활한 운영을 위해 보증금 제도가 함께 시행됩니다." },
];
let nextId = 4;

app.get('/api/notices', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const noticesPerPage = 10;
    const stickyNotices = notices.filter(n => n.isSticky).sort((a, b) => b.id - a.id);
    const normalNotices = notices.filter(n => !n.isSticky).sort((a, b) => b.id - a.id);
    const normalNoticesOnFirstPage = Math.max(0, noticesPerPage - stickyNotices.length);
    const remainingNotices = normalNotices.length - normalNoticesOnFirstPage;
    const totalPages = remainingNotices > 0 ? 1 + Math.ceil(remainingNotices / noticesPerPage) : 1;
    let paginatedNotices;
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
        normalNoticesOnFirstPage: normalNoticesOnFirstPage
    });
});

// ▼▼▼ 새 공지사항 등록 API 수정 ▼▼▼
app.post('/api/notices', (req, res) => {
    // body에서 content를 추가로 받습니다.
    const { title, department, isSticky, content } = req.body;

    if (!title || !department || !content) {
         return res.status(400).json({ message: '제목, 작성부서, 내용은 필수입니다.' });
    }

    const newNotice = {
        id: nextId++,
        title,
        department,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        isSticky: isSticky || false,
        content: content // 임시 내용 대신 실제 받은 content를 저장합니다.
    };
    notices.unshift(newNotice);
    res.status(201).json(newNotice);
});
// ▲▲▲ API 수정 끝 ▲▲▲

app.get('/api/notices/:id', (req, res) => {
    const noticeId = parseInt(req.params.id, 10);
    const notice = notices.find(n => n.id === noticeId);
    if (notice) {
        notice.views++;
        res.json(notice);
    } else {
        res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});