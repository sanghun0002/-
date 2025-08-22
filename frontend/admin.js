// 파일 위치: site/frontend/admin.js

document.getElementById('notice-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const department = document.getElementById('department').value;
    const isSticky = document.getElementById('is-sticky').checked;

    try {
        // ▼▼▼ 여기에 실제 Render 서버 주소를 넣었습니다! ▼▼▼
        const response = await fetch('https://o70albxd7n.onrender.com/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, department, isSticky })
        });

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        alert('공지사항이 성공적으로 등록되었습니다!');
        window.location.href = 'notice.html';

    } catch (error) {
        console.error("등록 오류:", error);
        alert('공지사항 등록 중 오류가 발생했습니다.');
    }
});