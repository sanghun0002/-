// 관리자 비밀번호 (실제 사이트에서는 절대 이렇게 사용하면 안 됩니다)
const ADMIN_PASSWORD = '1234';

// 페이지의 모든 HTML 요소가 로드된 후 이 코드를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {
    const writeButton = document.getElementById('write-button');
    const noticeList = document.getElementById('notice-list');

    // '작성하기' 버튼 클릭 이벤트
    writeButton.addEventListener('click', () => {
        const password = prompt('관리자 비밀번호를 입력하세요.');
        if (password === ADMIN_PASSWORD) {
            window.location.href = 'admin.html';
        } else if (password !== null) {
            alert('비밀번호가 틀렸습니다.');
        }
    });

    // 공지사항 목록을 불러와서 화면에 표시하는 함수
    function loadNotices() {
        // localStorage에서 'notices' 데이터를 가져옵니다. 없으면 빈 배열 '[]'을 사용합니다.
        const notices = JSON.parse(localStorage.getItem('notices') || '[]');
        noticeList.innerHTML = ''; // 기존 목록을 초기화합니다.

        // 공지사항이 없으면 메시지를 표시합니다.
        if (notices.length === 0) {
            noticeList.innerHTML = '<li>작성된 공지사항이 없습니다.</li>';
            return;
        }
        
        // 최신 글이 위로 오도록 배열을 뒤집어서 순회합니다.
        notices.slice().reverse().forEach((notice, index) => {
            const originalIndex = notices.length - 1 - index; // 실제 배열에서의 인덱스
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="notice-item-header">
                    <h4>${notice.title}</h4>
                    <span class="notice-date">${notice.date}</span>
                </div>
                <p>${notice.content}</p>
                <button class="delete-btn" data-index="${originalIndex}">삭제</button>
            `;
            noticeList.appendChild(li);
        });
    }

    // 삭제 버튼 클릭 이벤트 (이벤트 위임 사용)
    noticeList.addEventListener('click', (event) => {
        // 클릭된 요소가 'delete-btn' 클래스를 가지고 있는지 확인
        if (event.target.classList.contains('delete-btn')) {
            const password = prompt('삭제하려면 관리자 비밀번호를 입력하세요.');
            if (password === ADMIN_PASSWORD) {
                // 버튼에 저장된 data-index 값을 가져옵니다.
                const indexToDelete = parseInt(event.target.getAttribute('data-index'), 10);
                
                // 저장된 공지사항 목록을 다시 불러옵니다.
                let notices = JSON.parse(localStorage.getItem('notices') || '[]');
                
                // 해당 인덱스의 공지사항을 배열에서 제거합니다.
                notices.splice(indexToDelete, 1);
                
                // 변경된 배열을 다시 localStorage에 저장합니다.
                localStorage.setItem('notices', JSON.stringify(notices));
                
                // 화면을 새로고침하여 변경사항을 반영합니다.
                loadNotices();
                alert('삭제되었습니다.');
            } else if (password !== null) {
                alert('비밀번호가 틀렸습니다.');
            }
        }
    });

    // 페이지가 처음 로드될 때 공지사항 목록을 불러옵니다.
    loadNotices();
});