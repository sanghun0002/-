document.addEventListener('DOMContentLoaded', async function() {
    const boardBody = document.getElementById('board-body');
    try {
        const response = await fetch('https://o70albxd7n.onrender.com'); // 👈 이 주소 확인!
        const notices = await response.json();
        boardBody.innerHTML = '';
        const normalNotices = notices.filter(n => !n.isSticky);
        let noticeNumber = normalNotices.length;
        notices.forEach(notice => {
            const number = notice.isSticky ? '공지' : noticeNumber--;
            const tr = document.createElement('tr');
            if (notice.isSticky) tr.classList.add('sticky');
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
        console.error("로딩 오류:", error);
        boardBody.innerHTML = `<tr><td colspan="5">공지사항 로딩 중 오류 발생</td></tr>`;
    }
});