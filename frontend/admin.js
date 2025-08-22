// 파일 위치: site/frontend/admin.js

document.getElementById('notice-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // 폼 기본 동작 방지

    // 폼에서 입력된 데이터 가져오기
    const title = document.getElementById('title').value;
    const department = document.getElementById('department').value;
    const isSticky = document.getElementById('is-sticky').checked;

    try {
        // 백엔드 서버에 새 공지사항 등록을 요청
        const response = await fetch('/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, department, isSticky })
        });

        if (!response.ok) {
            throw new Error('서버 응답이 올바르지 않습니다.');
        }

        alert('공지사항이 성공적으로 등록되었습니다.');
        window.location.href = 'notice.html'; // 목록 페이지로 이동

    } catch (error) {
        console.error("Error creating notice:", error);
        alert('공지사항 등록 중 오류가 발생했습니다.');
    }
});