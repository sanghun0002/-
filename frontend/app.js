document.addEventListener('DOMContentLoaded', async () => {
    // 실제 운영 서버 주소를 사용합니다.
    const API_BASE_URL = 'https://o70albxd7n.onrender.com';
    const noticeListWidget = document.getElementById('notice-list-widget');

    if (noticeListWidget) { // notice-list-widget이 있는 페이지에서만 실행
        try {
            const response = await fetch(`${API_BASE_URL}/api/notices`);
            if (!response.ok) throw new Error('데이터 로딩 실패');
            
            const data = await response.json();
            
            // 중요 공지와 일반 공지를 합쳐서 최신 5개만 선택
            const allNotices = [...data.stickyNotices, ...data.notices];
            const latestNotices = allNotices.slice(0, 5);
            
            noticeListWidget.innerHTML = '';
            
            if (latestNotices.length === 0) {
                noticeListWidget.innerHTML = '<li>등록된 공지사항이 없습니다.</li>';
                return;
            }

            latestNotices.forEach(notice => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="notice_detail.html?id=${notice.id}">${notice.title}</a>
                    <span class="date">${notice.date}</span>
                `;
                noticeListWidget.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching notices:', error);
            noticeListWidget.innerHTML = '<li>공지사항을 불러올 수 없습니다.</li>';
        }
    }
});
