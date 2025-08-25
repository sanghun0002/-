document.addEventListener('DOMContentLoaded', () => {
    // URL에서 평상 ID ('?id=...') 값을 읽어옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const pyeongsangId = urlParams.get('id');

    const pyeongsangIdElement = document.getElementById('pyeongsang-id');
    const checkInBtn = document.getElementById('check-in-btn');
    const returnBtn = document.getElementById('return-btn');

    if (pyeongsangId) {
        // ID가 있으면 화면에 표시하고 각 버튼의 링크를 설정합니다.
        pyeongsangIdElement.textContent = pyeongsangId;
        checkInBtn.href = `checkQR.html?id=${pyeongsangId}`;
        
        returnBtn.href = `cleancheck.html?id=${pyeongsangId}`; 
    } else {
        // URL에 ID가 없으면 에러 메시지를 표시합니다.
        pyeongsangIdElement.textContent = '유효하지 않은 QR 코드입니다.';
        pyeongsangIdElement.style.color = 'red';
    }
});
