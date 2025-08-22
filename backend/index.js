const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Netlify 주소에 대한 CORS 요청 허용 설정
const corsOptions = {
    origin: 'https://restinginthevalley.netlify.app',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// 프론트엔드 파일 경로 설정
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 임시 인메모리 데이터베이스
let notices = [
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true, content: "기상청 예보 기준, 방문 예정일의 강수 확률이 70% 이상일 경우 위약금 없이 예약을 취소할 수 있습니다. 취소는 방문 하루 전까지 가능합니다." },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: true, content: "이제 QR코드를 통해 보증금을 현장에서 즉시 인증하고 반환받을 수 있습니다. 퇴실 시 비치된 QR코드를 스캔해주세요." },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false, content: "7월에서 8월 사이 여름 성수기 기간 동안 예약이 폭주할 수 있으니 미리 예약해주시기 바랍니다. 원활한 운영을 위해 보증금 제도가 함께 시행됩니다." },
];
let nextId = 4;

// [API 1] 공지사항 목록 가져오기
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

// [API 2] 새 공지사항 등록하기
app.post('/api/notices', (req, res) => {
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
        content: content
    };
    notices.unshift(newNotice);
    res.status(201).json(newNotice);
});

// [API 3] 특정 ID의 공지사항 가져오기 (+ 조회수 증가)
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

// [API 4] 특정 ID의 공지사항 수정하기 (Update)
app.put('/api/notices/:id', (req, res) => {
    const noticeId = parseInt(req.params.id, 10);
    const { title, department, isSticky, content } = req.body;
    const noticeIndex = notices.findIndex(n => n.id === noticeId);

    if (noticeIndex !== -1) {
        notices[noticeIndex] = { ...notices[noticeIndex], title, department, isSticky, content };
        res.json(notices[noticeIndex]);
    } else {
        res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
    }
});

// [API 5] 특정 ID의 공지사항 삭제하기 (Delete)
app.delete('/api/notices/:id', (req, res) => {
    const noticeId = parseInt(req.params.id, 10);
    const noticeIndex = notices.findIndex(n => n.id === noticeId);

    if (noticeIndex !== -1) {
        notices.splice(noticeIndex, 1);
        res.status(200).json({ message: '삭제 완료' });
    } else {
        res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
    }
});

// 모든 그 외의 요청은 프론트엔드로 연결
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});