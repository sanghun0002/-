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
    { id: 15, title: "시스템 정기 점검 안내 (25일 02:00)", department: "개발팀", date: "2025-08-23", views: 10, isSticky: false },
    { id: 14, title: "주차장 이용 정책 변경 안내", department: "시설팀", date: "2025-08-22", views: 55, isSticky: false },
    { id: 13, title: "분실물 센터 위치 안내", department: "운영팀", date: "2025-08-21", views: 32, isSticky: false },
    { id: 12, title: "셔틀버스 운행 시간표 변경", department: "운영팀", date: "2025-08-20", views: 150, isSticky: false },
    { id: 11, title: "반려동물 동반 규정 안내", department: "운영팀", date: "2025-08-19", views: 210, isSticky: false },
    { id: 10, title: "추석 연휴 운영 안내", department: "운영팀", date: "2025-08-18", views: 300, isSticky: false },
    { id: 9, title: "여름 성수기 요금 안내", department: "예약팀", date: "2025-08-17", views: 450, isSticky: false },
    { id: 8, title: "개인정보처리방침 개정 안내", department: "법무팀", date: "2025-08-16", views: 120, isSticky: false },
    { id: 7, title: "새로운 포토존 오픈!", department: "마케팅팀", date: "2025-08-15", views: 600, isSticky: false },
    { id: 6, title: "제휴 할인 혜택 안내", department: "마케팅팀", date: "2025-08-14", views: 350, isSticky: false },
    { id: 5, title: "직원 채용 공고", department: "인사팀", date: "2025-08-13", views: 280, isSticky: false },
    { id: 4, title: "안전 수칙 안내", department: "안전팀", date: "2025-08-12", views: 180, isSticky: false },
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: true },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false },
];
let nextId = 16;

// [API] 공지사항 목록 가져오기 (페이지네이션, 중요공지 포함 10개 로직 적용)
app.get('/api/notices', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const noticesPerPage = 10;

    const stickyNotices = notices.filter(n => n.isSticky).sort((a, b) => b.id - a.id);
    const normalNotices = notices.filter(n => !n.isSticky).sort((a, b) => b.id - a.id);

    const totalPages = Math.ceil(normalNotices.length / noticesPerPage);
    let paginatedNotices;
    
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
        normalNoticesOnFirstPage: normalNoticesOnFirstPage
    });
});

// [API] 새 공지사항 등록하기
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

// 모든 그 외의 요청은 프론트엔드로 연결
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});