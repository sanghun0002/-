document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://o70albxd7n.onrender.com';
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    // ... (titleInput 등 변수 선언은 동일) ...
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const contentInput = document.getElementById('content');
    const form = document.getElementById('edit-form');
    const imagesContainer = document.getElementById('existing-images-container');

    if (!reviewId) {
        alert('잘못된 접근입니다.');
        return window.location.href = 'review.html';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
        const review = await response.json();

        titleInput.value = review.title;
        authorInput.value = review.author;
        contentInput.value = review.content;
        document.querySelector(`input[name="rating"][value="${review.rating}"]`).checked = true;

        // ▼▼▼ 기존 이미지를 불러와서 화면에 표시하는 로직 추가 ▼▼▼
        if (review.images && review.images.length > 0) {
            imagesContainer.innerHTML = ''; // 컨테이너 초기화
            review.images.forEach(imageUrl => {
                const img = document.createElement('img');
                // 수정 페이지에서는 작은 썸네일로 보여주기
                const parts = imageUrl.split('/upload/');
                const thumbnailUrl = `${parts[0]}/upload/w_150,h_150,c_fill/${parts[1]}`;
                img.src = thumbnailUrl;
                imagesContainer.appendChild(img);
            });
        } else {
            imagesContainer.innerHTML = '<p>첨부된 사진이 없습니다.</p>';
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    } catch (error) {
        alert('기존 데이터를 불러오는 데 실패했습니다.');
        window.location.href = 'review.html';
    }

    // 폼 제출 이벤트는 이전과 동일
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... (폼 제출 로직은 이전 답변과 동일) ...
    });
});
