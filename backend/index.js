const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cloudinary 설정
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer-Cloudinary 스토리지 엔진 설정 (후기 이미지용)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'reviews',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => Date.now().toString() + '-' + file.originalname,
        transformation: [{ width: 1024, height: 1024, crop: "limit" }]
    },
});

const upload = multer({ storage: storage });

// ===============================================================
// ===== 데이터베이스 영역 (임시 인메모리) =====
// ===============================================================

// 공지사항 데이터
let notices = [
    { id: 3, title: "우천시 예약 취소 정책", department: "운영팀", date: "2025-08-03", views: 78, isSticky: true, content: "기상청 예보 기준..." },
    { id: 2, title: "보증금 현장 인증 시스템 도입", department: "개발팀", date: "2025-08-10", views: 120, isSticky: true, content: "이제 QR코드를 통해..." },
    { id: 1, title: "여름 성수기 예약 안내", department: "운영팀", date: "2025-08-11", views: 256, isSticky: false, content: "7월에서 8월 사이..." },
];
let nextNoticeId = 4;

// 후기 데이터 (예시 데이터 포함)
let reviews = [
    { id: 1, title: "계곡 바로 앞이라 너무 좋았어요!", author: "김철수", rating: 5, date: "2025-08-15", views: 45, content: "물놀이하고 바로 들어와서 쉴 수 있어서 최고였습니다.", images: [] },
    { id: 2, title: "가족들과 좋은 시간 보냈습니다.", author: "이영희", rating: 4, date: "2025-08-12", views: 88, content: "부모님 모시고 갔는데 다들 만족하셨어요.", images: [] },
];
let nextReviewId = 3;


// ===============================================================
// ===== 공지사항(Notice) API =====
// ===============================================================
app.get('/api/notices', (req, res) => { /* 이전과 동일 */ });
app.post('/api/notices', (req, res) => { /* 이전과 동일 */ });
app.get('/api/notices/:id', (req, res) => { /* 이전과 동일 */ });
app.put('/api/notices/:id', (req, res) => { /* 이전과 동일 */ });
app.delete('/api/notices/:id', (req, res) => { /* 이전과 동일 */ });


// ===============================================================
// ===== 후기(Review) API =====
// ===============================================================

// GET: 모든 후기 목록 조회
app.get('/api/reviews', (req, res) => {
    const sortedReviews = [...reviews].sort((a, b) => b.id - a.id);
    res.json({ reviews: sortedReviews });
});

// POST: 새 후기 작성 (이미지 포함)
app.post('/api/reviews', upload.array('newImages', 5), (req, res) => {
    const { title, author, rating, content } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const newReview = {
        id: nextReviewId++,
        title, author,
        rating: parseInt(rating, 10),
        date: new Date().toISOString().split('T')[0],
        views: 0,
        content,
        images
    };
    reviews.unshift(newReview);
    res.status(201).json(newReview);
});

// GET: 특정 ID의 후기 상세 조회
app.get('/api/reviews/:id', (req, res) => {
    const review = reviews.find(r => r.id === parseInt(req.params.id));
    if (review) {
        review.views++;
        res.json(review);
    } else {
        res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }
});

// ▼▼▼ [수정됨] 후기 수정 API (파일과 텍스트 동시 처리) ▼▼▼
app.put('/api/reviews/:id', upload.array('newImages', 5), (req, res) => {
    const reviewIndex = reviews.findIndex(r => r.id === parseInt(req.params.id));
    
    if (reviewIndex === -1) {
        return res.status(404).json({ message: '수정할 후기를 찾을 수 없습니다.' });
    }

    const { title, author, rating, content, imagesToDelete } = req.body;
    
    // 1. 기존 이미지에서 삭제할 이미지 제거
    let currentImages = reviews[reviewIndex].images;
    if (imagesToDelete) {
        const deleteList = JSON.parse(imagesToDelete);
        currentImages = currentImages.filter(url => !deleteList.includes(url));
    }

    // 2. 새로 업로드된 이미지 추가
    if (req.files) {
        const newImageUrls = req.files.map(file => file.path);
        currentImages = [...currentImages, ...newImageUrls];
    }

    // 3. 최종 데이터 업데이트
    reviews[reviewIndex] = {
        ...reviews[reviewIndex],
        title,
        author,
        rating: parseInt(rating),
        content,
        images: currentImages
    };

    res.json(reviews[reviewIndex]);
});

// DELETE: 특정 ID의 후기 삭제
app.delete('/api/reviews/:id', (req, res) => {
    const reviewIndex = reviews.findIndex(r => r.id === parseInt(req.params.id));
    if (reviewIndex !== -1) {
        reviews.splice(reviewIndex, 1);
        res.status(200).json({ message: '삭제 완료' });
    } else {
        res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }
});
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// ===============================================================
// ===== 서버 실행 =====
// ===============================================================
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
