document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    if (!reviewId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'review.html';
        return;
    }

    // 별점을 ⭐ 문자로 표시하는 함수
    function renderStars(rating) {
        return '⭐'.repeat(rating);
    }

    try {
        const response = await fetch(`https://o70albxd7n.onrender.com/api/reviews/${reviewId}`);
        if (!response.ok) {
            throw new Error('후기를 불러오는 데 실패했습니다.');
        }
        const review = await response.json();

        document.getElementById('detail-title').textContent = review.title;
        document.getElementById('detail-author').textContent = review.author;
        document.getElementById('detail-date').textContent = review.date;
        document.getElementById('detail-views').textContent = review.views;
        document.getElementById('detail-rating').textContent = `평점: ${renderStars(review.rating)}`;
        document.getElementById('detail-content').innerHTML = `<p>${review.content.replace(/\n/g, '<br>')}</p>`;

        // 수정 버튼
        const editBtn = document.getElementById('edit-btn');
        editBtn.href = `review_edit.html?id=${reviewId}`;

        // 삭제 버튼
        const deleteBtn = document.getElementById('delete-btn');
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('정말로 이 후기를 삭제하시겠습니까?')) {
                try {
                    const deleteResponse = await fetch(`https://o70albxd7n.onrender.com/api/reviews/${reviewId}`, {
                        method: 'DELETE',
                    });
                    if (!deleteResponse.ok) throw new Error('삭제에 실패했습니다.');
                    
                    alert('후기가 삭제되었습니다.');
                    window.location.href = 'review.html';
                } catch (err) {
                    alert(err.message);
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        window.location.href = 'review.html';
    }
});
