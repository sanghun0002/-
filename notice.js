// notice.js

// 페이지의 모든 HTML 요소가 로드된 후 이 코드를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {
    
    // HTML에서 id가 'write-button'인 요소를 찾습니다.
    const writeButton = document.getElementById('write-button');

    // '작성하기' 버튼에 클릭 이벤트 리스너를 추가합니다.
    writeButton.addEventListener('click', () => {
        
        // 사용자에게 비밀번호를 묻는 창을 띄웁니다.
        const password = prompt('관리자 비밀번호를 입력하세요.');

        // 사용자가 비밀번호를 입력하고 확인을 눌렀을 경우
        if (password !== null) {
            // 입력된 비밀번호가 '1234'와 일치하는지 확인합니다.
            if (password === '1234') { // (주의: 실제 사이트에서는 절대 사용하면 안되는 임시 비밀번호)
                // 비밀번호가 맞으면 admin.html 페이지로 이동합니다.
                window.location.href = 'admin.html';
            } else {
                // 비밀번호가 틀리면 경고창을 띄웁니다.
                alert('비밀번호가 틀렸습니다.');
            }
        }
    });
});