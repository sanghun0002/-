// admin.js (수정)
document.getElementById('notice-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const department = document.getElementById('department').value;
    const isSticky = document.getElementById('is-sticky').checked;

    const newNotice = {
        id: Date.now(),
        title: title,
        department: department,
        date: new Date().toLocaleDateString('ko-KR'),
        views: 0, // 조회수는 0으로 시작
        isSticky: isSticky
    };

    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    notices.unshift(newNotice);
    localStorage.setItem('notices', JSON.stringify(notices));

    alert('공지사항이 등록되었습니다.');
    window.location.href = 'notice.html';
});