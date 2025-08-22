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

    function renderTable() {
        boardBody.innerHTML = '';
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
            if (currentPage === 1) {
                noticeNumber = totalNormalNotices - index;
            } else {
                noticeNumber = totalNormalNotices - normalNoticesOnFirstPage - ((currentPage - 2) * 10) - index;
            }
            const row = createRow(notice, noticeNumber);
            boardBody.appendChild(row);
        });
    }
    
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

    function createRow(notice, number) {
        const tr = document.createElement('tr');
        // ▼▼▼ 이 부분의 링크가 수정되었습니다! ▼▼▼
        tr.innerHTML = `
            <td>${number}</td>
            <td class="class-cell"><a href="detail.html?id=${notice.id}">${notice.title}</a></td>
            <td class="class-dept">${notice.department}</td>
            <td class="class-date">${notice.date}</td>
            <td class="class-views">${notice.views}</td>
        `;
        return tr;
    }

    loadNotices(1);
});