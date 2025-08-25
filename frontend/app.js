document.addEventListener('DOMContentLoaded', async () => {
    
    // ===================================
    // ===== 공지사항 미리보기 위젯 기능 =====
    // ===================================
    const API_BASE_URL = 'https://o70albxd7n.onrender.com';
    const noticeListWidget = document.getElementById('notice-list-widget');

    if (noticeListWidget) { // notice-list-widget ID가 있는 페이지에서만 이 코드를 실행합니다.
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

    // ===================================
    // ===== 히어로 섹션 슬라이더 기능 =====
    // ===================================
    const sliderWrapper = document.querySelector('.slider-wrapper');

    if (sliderWrapper) { // slider-wrapper 클래스가 있는 페이지에서만 이 코드를 실행합니다.
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        let currentIndex = 0;
        const slideCount = slides.length;

        // 슬라이드를 이동시키는 함수
        function goToSlide(index) {
            if (index < 0) {
                index = slideCount - 1; // 마지막 슬라이드로 이동
            } else if (index >= slideCount) {
                index = 0; // 첫 슬라이드로 이동
            }
            sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        }

        // 다음 버튼 클릭 이벤트
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });

        // 이전 버튼 클릭 이벤트
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });

        // 5초마다 자동으로 다음 슬라이드로 넘어가게 설정
        setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }
});
