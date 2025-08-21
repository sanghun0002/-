// notice.js (수정)
document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('board-body');
    const paginationContainer = document.querySelector('.pagination');
    
    // 전체 공지사항 목록을 불러옵니다.
    let allNotices = JSON.parse(localStorage.getItem('notices') || '[]');

    let currentPage = 1;
    const itemsPerPage = 10; // 페이지당 10개의 게시물

    function displayPage(page) {
        currentPage = page;
        boardBody.innerHTML = ''; // 테이블 내용을 초기화합니다.
        paginationContainer.innerHTML = ''; // 페이지네이션 초기화

        // 중요 공지(sticky)와 일반 공지를 분리합니다.
        const stickyNotices = allNotices.filter(n => n.isSticky);
        const normalNotices = allNotices.filter(n => !n.isSticky);

        // 1. 중요 공지는 항상 모든 페이지 상단에 표시합니다.
        stickyNotices.forEach(notice => {
            const row = createRow(notice, '공지');
            row.classList.add('sticky');
            boardBody.appendChild(row);
        });
        
        // 2. 현재 페이지에 해당하는 일반 공지만 잘라서 표시합니다.
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pagedNotices = normalNotices.slice(startIndex, endIndex);

        pagedNotices.forEach((notice, index) => {
            // 전체 일반 공지 기준의 번호를 계산합니다.
            const noticeNumber = normalNotices.length - startIndex - index;
            const row = createRow(notice, noticeNumber);
            boardBody.appendChild(row);
        });

        // 3. 페이지네이션 버튼을 생성합니다.
        renderPagination(normalNotices.length);
    }

    // 테이블의 한 줄(<tr>)을 만드는 함수
    function createRow(notice, number) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${number}</td>
            <td class="title-cell">
                <a href="#" data-id="${notice.id}">${notice.title}</a>
            </td>
            <td>${notice.department}</td>
            <td>${notice.date}</td>
            <td>${notice.views}</td>
        `;
        return tr;
    }

    // 페이지네이션 버튼을 렌더링하는 함수
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) return; // 페이지가 1개 이하면 버튼을 만들지 않음

        // 이전 페이지 그룹 버튼
        paginationContainer.innerHTML += `<a href="#">&laquo;</a>`;

        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationContainer.innerHTML += `<a href="#" class="active">${i}</a>`;
            } else {
                paginationContainer.innerHTML += `<a href="#">${i}</a>`;
            }
        }
        // 다음 페이지 그룹 버튼
        paginationContainer.innerHTML += `<a href="#">&raquo;</a>`;
    }

    // 제목 클릭 시 조회수 증가 이벤트 (이벤트 위임)
    boardBody.addEventListener('click', function(e) {
        // 클릭된 요소가 제목 링크(<a>)가 아니면 무시
        if (e.target.tagName !== 'A' || !e.target.dataset.id) return;
        
        e.preventDefault(); // 링크의 기본 동작(페이지 상단으로 이동) 방지
        
        const noticeId = parseInt(e.target.dataset.id);

        // allNotices 배열에서 클릭된 공지사항을 찾습니다.
        const noticeToUpdate = allNotices.find(n => n.id === noticeId);
        
        if (noticeToUpdate) {
            noticeToUpdate.views++; // 조회수 1 증가
            
            // 변경된 전체 목록을 다시 localStorage에 저장
            localStorage.setItem('notices', JSON.stringify(allNotices));
            
            // 화면을 다시 렌더링하여 조회수 업데이트를 반영
            displayPage(currentPage);

            // 실제 페이지에서는 여기서 상세 페이지로 이동합니다.
            alert(`'${noticeToUpdate.title}' 게시글을 엽니다. (현재는 조회수만 증가)`);
        }
    });

    // 페이지네이션 버튼 클릭 이벤트
    paginationContainer.addEventListener('click', function(e) {
        e.preventDefault();
        const clickedText = e.target.textContent;

        if (!isNaN(clickedText)) { // 클릭된 것이 숫자인 경우
            const pageNumber = parseInt(clickedText);
            if (pageNumber !== currentPage) {
                displayPage(pageNumber);
            }
        }
    });

    // 페이지가 처음 로드될 때 첫 페이지를 표시합니다.
    displayPage(1);
});