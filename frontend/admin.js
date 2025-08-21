document.addEventListener('DOMContentLoaded', () => {
    const noticeForm = document.getElementById('notice-form');
    const noticeTitle = document.getElementById('notice-title');
    const noticeContent = document.getElementById('notice-content');

    noticeForm.addEventListener('submit', (event) => {
        // 폼의 기본 제출 동작(페이지 새로고침)을 막습니다.
        event.preventDefault(); 

        // 현재 날짜를 YYYY-MM-DD 형식으로 만듭니다.
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // 새 공지사항 객체를 만듭니다.
        const newNotice = {
            title: noticeTitle.value,
            content: noticeContent.value,
            date: formattedDate
        };

        // 기존에 저장된 공지사항을 불러옵니다. 없으면 빈 배열로 시작합니다.
        const notices = JSON.parse(localStorage.getItem('notices') || '[]');
        
        // 새 공지사항을 배열에 추가합니다.
        notices.push(newNotice);

        // 업데이트된 배열을 다시 localStorage에 저장합니다.
        localStorage.setItem('notices', JSON.stringify(notices));

        // 저장이 완료되면 공지사항 목록 페이지로 돌아갑니다.
        alert('공지사항이 저장되었습니다.');
        window.location.href = 'notice.html';
    });
});