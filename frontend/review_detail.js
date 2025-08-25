document.addEventListener('DOMContentLoaded', async () => {
    // 실제 운영 서버 주소를 사용합니다.
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
                
                // [적용됨] Cloudinary URL을 수정하여 이미지 크기 조절
                // 원본 URL을 '/upload/' 기준으로 분리합니다.
                const parts = imageUrl.split('/upload/');
                // 중간에 원하는 크기 옵션을 추가합니다. (예: 가로 1024px로 제한)
                const transformedUrl = `${parts[0]}/upload/w_800,c_limit/${parts[1]}`;
                
                img.src = transformedUrl; // 크기가 조절된 이미지 URL을 사용합니다.

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
});
