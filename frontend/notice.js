document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('board-body');
    const paginationContainer = document.getElementById('pagination');
    let currentData = null;

    // 특정 페이지의 공지사항을 불러오는 메인 함수
    async function loadNotices(page = 1) {
        try {
            // 실제 Render 서버의 전체 주소로 데이터를 요청
            const response = await fetch(`https://o70albxd7n.onrender.com/api/notices?page=${page}`);
            if (!response.ok) throw new Error('서버에서 데이터를 가져오지 못했습니다.');
            
            const data = await response.json();
            currentData = data;
            
            renderTable();      // 테이블 렌더링 함수 호출
            renderPagination(); // 페이지네이션 렌더링 함수 호출

        } catch (error) {
            console.error("로딩 오류:", error);
            boardBody.innerHTML = `<tr><td colspan="5">공지사항 로딩 중 오류가 발생했습니다.</td></tr>`;
        }
    }

    // 서버에서 받은 데이터로 테이블 내용을 그리는 함수
    function renderTable() {
        boardBody.innerHTML = '';
        const { notices, stickyNotices, currentPage, totalNormalNotices, normalNoticesOnFirstPage } = currentData;

        // 1페이지일 때만 중요 공지를 최상단에 표시
        if (currentPage === 1) {
            stickyNotices.forEach(notice => {
                const row = createRow(notice, '공지');
                row.classList.add('sticky');
                boardBody.appendChild(row);
            });
        }

        // 일반 공지를 순서대로 표시
        notices.forEach((notice, index) => {
            let noticeNumber;
            // 페이지별로 올바른 게시글 번호를 계산하는 로직
            if (currentPage === 1) {
                noticeNumber = totalNormalNotices - index;
            } else {
                noticeNumber = totalNormalNotices - normalNoticesOnFirstPage - ((currentPage - 2) * 10) - index;
            }
            const row = createRow(notice, noticeNumber);
            boardBody.appendChild(row);
        });
    }
    
    // 페이지 번호 버튼을 그리는 함수
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

    // 테이블의 한 줄(<tr>) HTML을 생성하는 함수
    function createRow(notice, number) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${number}</td>
            <td class="class-cell"><a href="#">${notice.title}</a></td>
            <td class="class-dept">${notice.department}</td>
            <td class="class-date">${notice.date}</td>
            <td class="class-views">${notice.views}</td>
        `;
        return tr;
    }

    // 페이지가 처음 로드될 때 1페이지의 내용을 불러옴
    loadNotices(1);
});