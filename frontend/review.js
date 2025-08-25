document.addEventListener('DOMContentLoaded', function() {
    const boardBody = document.getElementById('review-board-body');
    const paginationContainer = document.getElementById('pagination');
    let currentData = null;

    async function loadReviews(page = 1) {
        try {
            // ▼▼▼ API 주소 수정 ▼▼▼
            const response = await fetch(`https://o70albxd7n.onrender.com`);
            if (!response.ok) throw new Error('서버에서 데이터를 가져오지 못했습니다.');
            const data = await response.json();
            currentData = data;
            renderTable();
            renderPagination();
        } catch (error) {
            console.error("로딩 오류:", error);
            boardBody.innerHTML = `<tr><td colspan="6">후기 로딩 중 오류가 발생했습니다.</td></tr>`;
        }
    }

    function renderTable() {
        boardBody.innerHTML = '';
        const { reviews, currentPage, totalReviews, reviewsPerPage } = currentData;
        
        reviews.forEach((review, index) => {
            const reviewNumber = totalReviews - ((currentPage - 1) * reviewsPerPage) - index;
            const row = createRow(review, reviewNumber);
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
                    loadReviews(i);
                }
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    function renderStars(rating) {
        return '⭐'.repeat(rating);
    }

    function createRow(review, number) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${number}</td>
            <td class="class-cell"><a href="review_detail.html?id=${review.id}">${review.title}</a></td>
            <td class="class-writer">${review.author}</td>
            <td class="class-rating">${renderStars(review.rating)}</td>
            <td class="class-date">${review.date}</td>
            <td class="class-views">${review.views}</td>
        `;
        return tr;
    }

    loadReviews(1);
});
