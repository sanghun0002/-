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

// Multer-Cloudinary 스토리지 엔진 설정
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'reviews', // Cloudinary에 'reviews'라는 폴더를 만들어 저장
        format: async (req, file) => 'jpg', // 파일 포맷을 jpg로 통일
        public_id: (req, file) => Date.now().toString() + '-' + file.originalname,
    },
});

const upload = multer({ storage: storage });

// 임시 데이터베이스 역할
let reviews = [];
let nextReviewId = 1;

// GET: 모든 후기 목록 조회
app.get('/api/reviews', (req, res) => {
    const sortedReviews = [...reviews].sort((a, b) => b.id - a.id);
    res.json({ reviews: sortedReviews });
});

// POST: 새 후기 작성 (이미지 포함)
app.post('/api/reviews', upload.array('images', 5), (req, res) => {
    const { title, author, rating, content } = req.body;
    const images = req.files ? req.files.map(file => file.path) : []; // Cloudinary URL

    const newReview = {
        id: nextReviewId++,
        title, author,
        rating: parseInt(rating, 10),
        date: new Date().toISOString().split('T')[0],
        views: 0,
        content,
        images
    };
    reviews.push(newReview);
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

// (PUT, DELETE 등 나머지 API는 여기서 직접 추가하거나 이전 코드를 참고하세요)

app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});