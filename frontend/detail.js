document.addEventListener('DOMContentLoaded', async () => {
    // URL 주소에서 id 값을 가져옵니다.
    const params = new URLSearchParams(window.location.search);
    const noticeId = params.get('id');

    if (!noticeId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'notice.html';
        return;
    }

    try {
        // 백엔드에 해당 id의 공지사항 정보를 요청합니다. (조회수가 여기서 증가됩니다)
        const response = await fetch(`https://o70albxd7n.onrender.com/api/notices/${noticeId}`);
        if (!response.ok) {
            throw new Error('공지사항을 불러오는 데 실패했습니다.');
        }
        const notice = await response.json();

        // 받아온 정보로 페이지의 내용을 채웁니다.
        document.getElementById('detail-title').textContent = notice.title;
        document.getElementById('detail-department').textContent = notice.department;
        document.getElementById('detail-date').textContent = notice.date;
        document.getElementById('detail-views').textContent = notice.views;
        document.getElementById('detail-content').innerHTML = `<p>${notice.content.replace(/\n/g, '<br>')}</p>`;

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        window.location.href = 'notice.html';
    }
});