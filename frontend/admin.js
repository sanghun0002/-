document.getElementById('notice-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const department = document.getElementById('department').value;
    const isSticky = document.getElementById('is-sticky').checked;
    const content = document.getElementById('content').value; // '내용' 값을 가져옵니다.

    try {
        const response = await fetch('https://o70albxd7n.onrender.com/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body에 content를 포함하여 전송합니다.
            body: JSON.stringify({ title, department, isSticky, content })
        });

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        alert('공지사항이 등록되었습니다.');
        window.location.href = 'notice.html';

    } catch (error) {
        console.error("등록 오류:", error);
        alert('공지사항 등록 중 오류가 발생했습니다.');
    }
});
