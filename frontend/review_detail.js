document.addEventListener('DOMContentLoaded', async () => {
    // 실제 운영 서버 주소로 적용했습니다.
    const API_BASE_URL = 'https://o70albxd7n.onrender.com';

    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    if (!reviewId) {
        alert('잘못된 접근입니다.');
        return window.location.href = 'review.html';
    }
    
    function displayReview(review) {
        document.getElementById('detail-title').textContent = review.title;
        document.getElementById('detail-author').textContent = review.author;
        document.getElementById('detail-date').textContent = review.date;
        document.getElementById('detail-views').textContent = review.views;
        document.getElementById('detail-rating').textContent = `평점: ${'⭐'.repeat(review.rating)}`;
        document.getElementById('detail-content').innerHTML = `<p>${review.content.replace(/\n/g, '<br>')}</p>`;

        const imagesContainer = document.getElementById('detail-images-container');
        imagesContainer.innerHTML = '';
        if (review.images && review.images.length > 0) {
            review.images.forEach(imageUrl => {
                const img = document.createElement('img');
                // Cloudinary는 전체 URL을 반환하므로 그대로 사용합니다.
                img.src = imageUrl;
                img.classList.add('detail-image');
                imagesContainer.appendChild(img);
            });
            imagesContainer.style.display = 'flex';
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
        if (!response.ok) throw new Error('후기를 불러오는 데 실패했습니다.');
        const currentReview = await response.json();
        displayReview(currentReview);
    } catch (error) {
        alert(error.message);
        window.location.href = 'review.html';
    }
    
    // (수정/삭제 관련 로직은 이전 답변을 참고하여 추가하세요)
});