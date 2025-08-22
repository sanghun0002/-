// 파일 위치: site/frontend/notice.js

document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('board-body');
    const paginationContainer = document.getElementById('pagination');
    let currentData = null;

    async function loadNotices(page = 1) {
        try {
            const response = await fetch(`https://o70albxd7n.onrender.com/api/notices?page=${page}`);
            if (!response.ok) throw new Error('서버 응답 오류');
            const data = await response.json();
            currentData = data;
            renderTable();
            renderPagination();
        } catch (error) {
            console.error("로딩 오류:", error);
            boardBody.innerHTML = `<tr><td colspan="5">공지사항 로딩 중 오류 발생</td></tr>`;
        }
    }

    // 테이블 내용을 그리는 함수 (수정됨)
    function renderTable() {
        boardBody.innerHTML = '';
        // 백엔드가 새로 보내주는 normalNoticesOnFirstPage 값을 받음
        const { notices, stickyNotices, currentPage, totalNormalNotices, normalNoticesOnFirstPage } = currentData;

        if (currentPage === 1) {
            stickyNotices.forEach(notice => {
                const row = createRow(notice, '공지');
                row.classList.add('sticky');
                boardBody.appendChild(row);
            });
        }

        notices.forEach((notice, index) => {
            let noticeNumber;
            // ▼▼▼ 페이지별로 번호 계산 로직을 다르게 적용 ▼▼▼
            if (currentPage === 1) {
                // 1페이지: 전체 개수에서 순서대로 차감
                noticeNumber = totalNormalNotices - index;
            } else {
                // 2페이지 이상: 1페이지의 게시물 수와 이전 페이지들을 고려하여 계산
                noticeNumber = totalNormalNotices - normalNoticesOnFirstPage - ((currentPage - 2) * 10) - index;
            }
            const row = createRow(notice, noticeNumber);
            boardBody.appendChild(row);
        });
    }

    function renderPagination() { /* ... 기존 코드와 동일 ... */ }
    function createRow(notice, number) { /* ... 기존 코드와 동일 ... */ }

    loadNotices(1);
});