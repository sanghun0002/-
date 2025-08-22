// 파일 위치: site/backend/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');

// Express 앱 생성
const app = express();
// Render 배포 환경 또는 로컬 3000번 포트 사용
const PORT = process.env.PORT || 3000;


// ▼▼▼ CORS(Cross-Origin Resource Sharing) 설정 ▼▼▼
// Netlify 프론트엔드 주소에서의 요청을 허용하기 위한 설정입니다.
const corsOptions = {
    origin: 'https://restinginthevalley.netlify.app', // 여기에 허용할 프론트엔드 주소를 입력합니다.
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// ▲▲▲ CORS 설정 끝 ▲▲▲


// 미들웨어 설정
app.use(express.json()); // JSON 데이터 파싱 허용

// frontend 폴더를 static 파일 경로로 지정
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 서버 메모리에 임시로 저장할 데이터 (데이터베이스 역할)
let notices = [
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: false },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false },
];
let nextId = 4; // 다음 게시글 ID

// [API 1] 모든 공지사항 목록을 보내주는 API
app.get('/api/notices', (req, res) => {
    // 중요 공지를 위로, 나머지는 최신순으로 정렬
    const sortedNotices = [...notices].sort((a, b) => {
        if (a.isSticky && !b.isSticky) return -1;
        if (!a.isSticky && b.isSticky) return 1;
        return b.id - a.id;
    });
    res.json(sortedNotices);
});

// [API 2] 새 공지사항을 등록하는 API
app.post('/api/notices', (req, res) => {
    const { title, department, isSticky } = req.body;

    if (!title || !department) {
        return res.status(400).json({ message: '제목과 작성부서는 필수입니다.' });
    }
    const newNotice = {
        id: nextId++,
        title,
        department,
        date: new Date().toLocaleDateString('ko-KR'),
        views: 0,
        isSticky: isSticky || false
    };
    notices.unshift(newNotice); // 새 공지를 배열 맨 앞에 추가
    res.status(201).json(newNotice); // 성공적으로 생성되었음을 알림
});

// 위에 지정된 API 경로가 아닌 다른 모든 요청은 frontend의 notice.html을 보여줌
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});