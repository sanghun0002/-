// admin.js (수정)
document.getElementById('notice-form').addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 제출 시 새로고침 방지

    // 입력된 값 가져오기
    const title = document.getElementById('title').value;
    const department = document.getElementById('department').value;
    const isSticky = document.getElementById('is-sticky').checked;

    // 새 공지사항 객체 생성
    const newNotice = {
        id: Date.now(), // 고유 ID
        title: title,
        department: department,
        date: new Date().toLocaleDateString('ko-KR'), // YYYY. M. D. 형식
        views: Math.floor(Math.random() * 100), // 0~99 사이의 임시 조회수
        isSticky: isSticky
    };

    // 기존 localStorage 데이터 불러오기
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    
    // 새 데이터를 배열의 맨 앞에 추가 (최신글이 위로 오도록)
    notices.unshift(newNotice);

    // 다시 localStorage에 저장
    localStorage.setItem('notices', JSON.stringify(notices));

    // 저장 후 목록 페이지로 이동
    alert('공지사항이 등록되었습니다.');
    window.location.href = 'notice.html'; // 이동할 페이지 이름 확인
});