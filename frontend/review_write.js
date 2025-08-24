document.getElementById('review-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const content = document.getElementById('content').value;

    try {
        const response = await fetch('https://o70albxd7n.onrender.com/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, rating, content })
        });

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        alert('후기가 등록되었습니다.');
        window.location.href = 'review.html';

    } catch (error) {
        console.error("등록 오류:", error);
        alert('후기 등록 중 오류가 발생했습니다.');
    }
});
