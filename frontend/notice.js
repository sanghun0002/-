// 파일 위치: site/frontend/notice.js

document.addEventListener('DOMContentLoaded', async function() {
    const boardBody = document.getElementById('board-body');

    try {
        // 백엔드 서버에 공지사항 목록을 요청
        const response = await fetch('/api/notices');
        const notices = await response.json();

        boardBody.innerHTML = ''; // 테이블 초기화

        const normalNotices = notices.filter(n => !n.isSticky);
        let noticeNumber = normalNotices.length;

        // 받아온 데이터로 테이블 행(row)을 만듦
        notices.forEach(notice => {
            const number = notice.isSticky ? '공지' : noticeNumber--;
            const tr = document.createElement('tr');
            if (notice.isSticky) {
                tr.classList.add('sticky');
            }
            tr.innerHTML = `
                <td>${number}</td>
                <td class="title-cell"><a href="#">${notice.title}</a></td>
                <td>${notice.department}</td>
                <td>${notice.date}</td>
                <td>${notice.views}</td>
            `;
            boardBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading notices:", error);
        boardBody.innerHTML = `<tr><td colspan="5">공지사항을 불러오는 중 오류가 발생했습니다.</td></tr>`;
    }
});