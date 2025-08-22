// 파일 위치: site/frontend/notice.js

document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('board-body');
    const paginationContainer = document.getElementById('pagination');
    let currentData = null; // 서버에서 받은 전체 데이터 저장용

    // 특정 페이지의 공지사항을 불러오는 함수
    async function loadNotices(page = 1) {
        try {
            const response = await fetch(`https://o70albxd7n.onrender.com/api/notices?page=${page}`);
            const data = await response.json();
            currentData = data;
            
            renderTable();
            renderPagination();

        } catch (error) {
            console.error("로딩 오류:", error);
            boardBody.innerHTML = `<tr><td colspan="5">공지사항 로딩 중 오류가 발생했습니다.</td></tr>`;
        }
    }

    // 테이블 내용을 그리는 함수
    function renderTable() {
        boardBody.innerHTML = '';
        const { notices, stickyNotices, currentPage, totalNormalNotices } = currentData;

        // 1페이지일 때만 중요 공지 표시
        if (currentPage === 1) {
            stickyNotices.forEach(notice => {
                const row = createRow(notice, '공지');
                row.classList.add('sticky');
                boardBody.appendChild(row);
            });
        }

        // 일반 공지 표시
        notices.forEach((notice, index) => {
            // 게시글 번호 계산
            const noticeNumber = totalNormalNotices - ((currentPage - 1) * 10) - index;
            const row = createRow(notice, noticeNumber);
            boardBody.appendChild(row);
        });
    }
    
    // 페이지네이션 버튼을 그리는 함수
    function renderPagination() {
        paginationContainer.innerHTML = '';
        const { totalPages, currentPage } = currentData;

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (i !== currentPage) {
                    loadNotices(i);
                }
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    // 테이블의 한 줄(<tr>)을 만드는 함수
    function createRow(notice, number) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${number}</td>
            <td class="title-cell"><a href="#">${notice.title}</a></td>
            <td>${notice.department}</td>
            <td>${notice.date}</td>
            <td>${notice.views}</td>
        `;
        return tr;
    }

    // 최초 실행
    loadNotices(1);
});