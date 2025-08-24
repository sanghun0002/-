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

// ===============================================================
// ===== 데이터베이스 영역 (임시 인메모리) =====
// ===============================================================

// 1. 공지사항(Notice) 데이터
let notices = [
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true, content: "기상청 예보 기준, 방문 예정일의 강수 확률이 70% 이상일 경우 위약금 없이 예약을 취소할 수 있습니다. 취소는 방문 하루 전까지 가능합니다." },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: true, content: "이제 QR코드를 통해 보증금을 현장에서 즉시 인증하고 반환받을 수 있습니다. 퇴실 시 비치된 QR코드를 스캔해주세요." },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false, content: "7월에서 8월 사이 여름 성수기 기간 동안 예약이 폭주할 수 있으니 미리 예약해주시기 바랍니다. 원활한 운영을 위해 보증금 제도가 함께 시행됩니다." },
];
let nextNoticeId = 4;

// 2. 후기(Review) 데이터
let reviews = [
    { id: 1, title: "계곡 바로 앞이라 너무 좋았어요!", author: "김철수", rating: 5, date: "2025-08-15", views: 45, content: "물놀이하고 바로 들어와서 쉴 수 있어서 최고였습니다. 시설도 깨끗하고 관리가 잘 되어있네요." },
    { id: 2, title: "가족들과 좋은 시간 보냈습니다.", author: "이영희", rating: 4, date: "2025-08-12", views: 88, content: "부모님 모시고 갔는데 다들 만족하셨어요. 다만, 주차 공간이 조금 협소해서 아쉬웠습니다." },
    { id: 3, title: "바베큐 시설이 편리해요", author: "박지성", rating: 5, date: "2025-08-10", views: 102, content: "개별 바베큐장이 있어서 프라이빗하고 좋았습니다. 숯불 피워주시는 서비스도 감사합니다!" },
];
let nextReviewId = 4;


// ===============================================================
// ===== 공지사항(Notice) API =====
// ===============================================================

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
        id: nextNoticeId++,
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

// [API 4] 특정 ID의 공지사항 수정하기
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

// [API 5] 특정 ID의 공지사항 삭제하기
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


// ===============================================================
// ===== 후기(Review) API  -  여기에 새로 추가됨! =====
// ===============================================================

// [API 1] 후기 목록 가져오기
app.get('/api/reviews', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const reviewsPerPage = 10;
    const sortedReviews = reviews.sort((a, b) => b.id - a.id);
    
    const totalReviews = sortedReviews.length;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);
    const startIndex = (page - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

    res.json({
        reviews: paginatedReviews,
        totalPages: totalPages,
        currentPage: page,
        totalReviews: totalReviews,
        reviewsPerPage: reviewsPerPage
    });
});

// [API 2] 새 후기 등록하기
app.post('/api/reviews', (req, res) => {
    const { title, author, rating, content } = req.body;
    if (!title || !author || !rating || !content) {
        return res.status(400).json({ message: '제목, 작성자, 평점, 내용은 필수입니다.' });
    }
    const newReview = {
        id: nextReviewId++,
        title,
        author,
        rating: parseInt(rating, 10),
        date: new Date().toISOString().split('T')[0],
        views: 0,
        content
    };
    reviews.unshift(newReview);
    res.status(201).json(newReview);
});

// [API 3] 특정 ID의 후기 가져오기 (+ 조회수 증가)
app.get('/api/reviews/:id', (req, res) => {
    const reviewId = parseInt(req.params.id, 10);
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
        review.views++;
        res.json(review);
    } else {
        res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }
});

// [API 4] 특정 ID의 후기 수정하기
app.put('/api/reviews/:id', (req, res) => {
    const reviewId = parseInt(req.params.id, 10);
    const { title, author, rating, content } = req.body;
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex !== -1) {
        reviews[reviewIndex] = { 
            ...reviews[reviewIndex], 
            title, 
            author, 
            rating: parseInt(rating, 10), 
            content 
        };
        res.json(reviews[reviewIndex]);
    } else {
        res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }
});

// [API 5] 특정 ID의 후기 삭제하기
app.delete('/api/reviews/:id', (req, res) => {
    const reviewId = parseInt(req.params.id, 10);
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex !== -1) {
        reviews.splice(reviewIndex, 1);
        res.status(200).json({ message: '삭제 완료' });
    } else {
        res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }
});


// ===============================================================
// ===== 서버 실행 및 기타 라우팅 =====
// ===============================================================

// 모든 그 외의 요청은 프론트엔드의 기본 페이지로 연결
// 주의: 이 코드는 항상 API 라우트들보다 아래에 위치해야 합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notice.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
