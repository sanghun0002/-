// 파일 위치: site/frontend/notice.js

document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('board-body');
    const paginationContainer = document.getElementById('pagination');
    let currentData = null;

    async function loadNotices(page = 1) {
        try {
            const response = await fetch(`https://o70albxd7n.onrender.com/api/notices?page=${page}`);
            if (!response.ok) throw new Error('서버에서 데이터를 가져오지 못했습니다.');

            const data = await response.json();
            currentData = data;

            renderTable();
            renderPagination();

        } catch (error) {
            console.error("로딩 오류:", error);
            boardBody.innerHTML = `<tr><td colspan="5">공지사항 로딩 중 오류가 발생했습니다.</td></tr>`;
        }
    }

    // 테이블 내용을 그리는 함수 (수정됨)
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

        // 일반 공지 표시 (게시글 번호 계산 로직 수정)
        notices.forEach((notice, index) => {
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

    loadNotices(1);
});