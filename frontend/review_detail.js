document.addEventListener('DOMContentLoaded', async () => {
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
        // ... (다른 텍스트 정보 표시는 동일)

        // ▼▼▼ 이미지 처리 로직이 슬라이드에 맞게 수정되었습니다 ▼▼▼
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const imagesContainer = document.getElementById('detail-images-container');
        
        sliderWrapper.innerHTML = ''; // 이미지 래퍼 초기화
        
        if (review.images && review.images.length > 0) {
            imagesContainer.style.display = 'block'; // 컨테이너를 보이게 처리
            review.images.forEach(imageUrl => {
                // Cloudinary URL을 수정하여 작은 크기의 이미지로 변환
                const parts = imageUrl.split('/upload/');
                const transformedUrl = `${parts[0]}/upload/w_400,h_300,c_fill/${parts[1]}`;

                // 슬라이드 요소를 만들고 이미지 추가
                const slideDiv = document.createElement('div');
                slideDiv.className = 'slide';
                slideDiv.innerHTML = `<img src="${transformedUrl}" alt="후기 이미지">`;
                
                sliderWrapper.appendChild(slideDiv);
            });
        } else {
            imagesContainer.style.display = 'none'; // 이미지가 없으면 컨테이너 숨김
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
        if (!response.ok) throw new Error('후기를 불러오는 데 실패했습니다.');
        const currentReview = await response.json();
        displayReview(currentReview);

        // (수정/삭제 버튼 기능은 이전과 동일)
        // ...

    } catch (error) {
        alert(error.message);
        window.location.href = 'review.html';
    }
});
