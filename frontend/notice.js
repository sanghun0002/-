// notice.js (새 파일)
document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('board-body');
    // localStorage에서 'notices' 데이터를 가져옵니다. 없으면 빈 배열 '[]'을 사용합니다.
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');

    function displayNotices() {
        boardBody.innerHTML = ''; // 테이블 내용을 초기화합니다.

        // 중요 공지(sticky)와 일반 공지를 분리합니다.
        const stickyNotices = notices.filter(n => n.isSticky);
        const normalNotices = notices.filter(n => !n.isSticky);

        // 중요 공지를 먼저 테이블에 추가합니다.
        stickyNotices.forEach(notice => {
            const row = createRow(notice, '공지');
            row.classList.add('sticky'); // 중요 공지 스타일 적용을 위한 클래스 추가
            boardBody.appendChild(row);
        });
        
        // 일반 공지를 테이블에 추가합니다.
        normalNotices.forEach((notice, index) => {
            const row = createRow(notice, normalNotices.length - index); // 최신글이 높은 번호를 갖도록
            boardBody.appendChild(row);
        });
    }

    // 테이블의 한 줄(<tr>)을 만드는 함수
    function createRow(notice, number) {
        const tr = document.createElement('tr');
        // 템플릿 리터럴을 사용해 HTML 구조를 만듭니다.
        tr.innerHTML = `
            <td>${number}</td>
            <td class="title-cell"><a href="#">${notice.title}</a></td>
            <td>${notice.department}</td>
            <td>${notice.date}</td>
            <td>${notice.views}</td>
        `;
        return tr;
    }

    // 페이지가 로드되면 공지사항을 표시합니다.
    displayNotices();
});