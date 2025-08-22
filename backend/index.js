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

let notices = [
    // (기존 데이터는 그대로 둡니다)
    // 예시를 위해 데이터를 15개로 늘립니다.
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
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true }, // 중요
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: true }, // 중요
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false },
];
let nextId = 16;

// [API 1] 공지사항 목록 가져오기 (페이지네이션 적용)
app.get('/api/notices', (req, res) => {
    // 1. 요청된 페이지 번호 확인 (없으면 1페이지)
    const page = parseInt(req.query.page || '1', 10);
    const noticesPerPage = 10; // 페이지 당 게시물 수

    // 2. 중요 공지와 일반 공지 분리
    const stickyNotices = notices.filter(n => n.isSticky).sort((a, b) => b.id - a.id);
    const normalNotices = notices.filter(n => !n.isSticky).sort((a, b) => b.id - a.id);

    // 3. 페이지네이션 계산
    const totalPages = Math.ceil(normalNotices.length / noticesPerPage);
    const startIndex = (page - 1) * noticesPerPage;
    const endIndex = startIndex + noticesPerPage;

    // 4. 현재 페이지에 해당하는 일반 공지만 잘라내기
    const paginatedNotices = normalNotices.slice(startIndex, endIndex);

    // 5. 클라이언트에 보낼 데이터 구성
    res.json({
        notices: paginatedNotices, // 현재 페이지의 일반 공지
        stickyNotices: stickyNotices, // 모든 중요 공지
        totalPages: totalPages, // 전체 페이지 수
        currentPage: page // 현재 페이지 번호
    });
});

// [API 2] 새 공지사항 등록하기 (변경 없음)
app.post('/api/notices', (req, res) => {
    // ... (기존 코드와 동일)
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});