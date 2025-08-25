document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://o70albxd7n.onrender.com';
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const contentInput = document.getElementById('content');
    const form = document.getElementById('edit-form');

    if (!reviewId) {
        alert('잘못된 접근입니다.');
        return window.location.href = 'review.html';
    }

    // 1. 수정할 기존 데이터를 불러와서 폼에 채워넣기
    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
        const review = await response.json();

        titleInput.value = review.title;
        authorInput.value = review.author;
        contentInput.value = review.content;
        // 불러온 평점 값에 해당하는 라디오 버튼을 체크합니다.
        document.querySelector(`input[name="rating"][value="${review.rating}"]`).checked = true;

    } catch (error) {
        alert('기존 데이터를 불러오는 데 실패했습니다.');
        window.location.href = 'review.html';
    }

    // 2. 폼 제출(수정 완료) 이벤트 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
            title: titleInput.value,
            author: authorInput.value,
            content: contentInput.value,
            rating: document.querySelector('input[name="rating"]:checked').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('수정에 실패했습니다.');

            alert('후기가 수정되었습니다.');
            window.location.href = `review_detail.html?id=${reviewId}`;
        } catch (error) {
            alert(error.message);
        }
    });
});
