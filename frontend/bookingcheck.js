document.addEventListener('DOMContentLoaded', () => {
    // HTML 요소 가져오기
    const qrScannerSection = document.getElementById('qr-scanner-section');
    const userInfoSection = document.getElementById('user-info-section');
    const scanStatus = document.getElementById('scan-status');
    const scannedPyeongsangId = document.getElementById('scanned-pyeongsang-id');
    const authForm = document.getElementById('auth-form');
    const nameInput = document.getElementById('name-input');
    const phoneInput = document.getElementById('phone-input');
    const resultMessage = document.getElementById('result-message');

    // --- 💻 백엔드 서버 주소를 여기에 설정 ---
    const backendUrl = '여기에_백엔드_서버_주소를_입력하세요/verify-booking';

    // QR 코드 스캔 성공 시 실행될 함수
    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR 코드 스캔 성공: ${decodedText}`);
        
        // QR 스캐너 중지 및 숨기기
        html5QrcodeScanner.clear();
        qrScannerSection.style.display = 'none';

        // 사용자 정보 입력 폼 보여주기
        scannedPyeongsangId.textContent = decodedText;
        userInfoSection.style.display = 'block';
    }

    // QR 코드 스캔 실패 시 (선택 사항)
    function onScanFailure(error) {
        // console.warn(`QR 코드 스캔 오류: ${error}`);
    }

    // QR 코드 스캐너 초기 설정 및 시작
    const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false // verbose
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    scanStatus.textContent = "QR 코드를 스캔해주세요.";

    // '확인' 버튼 클릭 시 폼 제출 이벤트 처리
    authForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // 폼의 기본 제출 동작 방지
        
        resultMessage.textContent = '예약 정보를 확인 중입니다...';

        const pyeongsangId = scannedPyeongsangId.textContent;
        const name = nameInput.value;
        const phone = phoneInput.value;

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pyeongsangId, name, phone }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                resultMessage.textContent = `✅ ${data.message}`;
                resultMessage.style.color = 'green';
                // 성공 후 입력 폼 숨기기 (선택 사항)
                userInfoSection.style.display = 'none';
            } else {
                resultMessage.textContent = `❌ ${data.message}`;
                resultMessage.style.color = 'red';
            }

        } catch (error) {
            console.error('통신 오류:', error);
            resultMessage.textContent = '🔌 서버와 통신 중 오류가 발생했습니다.';
            resultMessage.style.color = 'red';
        }
    });
});
