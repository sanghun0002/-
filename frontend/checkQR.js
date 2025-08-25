// qr-scanner 라이브러리를 불러옵니다.
import QrScanner from './node_modules/qr-scanner/qr-scanner.min.js';

// --- 설정 영역 ---
// ❗️여기에 배포된 백엔드 서버의 주소를 입력하세요.
const API_ENDPOINT = 'http://localhost:3000/check-qr'; 

// HTML 요소들을 가져옵니다.
const videoElem = document.getElementById('qr-video');
const resultDiv = document.getElementById('result');

// QR 코드 스캐너 객체 생성
const qrScanner = new QrScanner(
    videoElem,
    // QR 코드가 성공적으로 스캔되었을 때 실행될 함수
    async (result) => {
        console.log('스캔된 QR 데이터:', result.data);
        
        // 스캔이 완료되면 잠시 스캐너를 멈춥니다.
        qrScanner.stop();
        resultDiv.textContent = '인증 중...';
        resultDiv.style.backgroundColor = 'lightgray';

        try {
            // 백엔드 서버로 스캔된 데이터를 POST 방식으로 전송합니다.
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrData: result.data }), // 데이터를 JSON 형태로 보냅니다.
            });

            const data = await response.json(); // 서버로부터 받은 응답을 JSON으로 변환합니다.

            // 서버 응답에 따라 결과 메시지를 화면에 표시합니다.
            if (data.success) {
                resultDiv.textContent = `✅ ${data.message}`;
                resultDiv.style.backgroundColor = 'lightgreen';
            } else {
                resultDiv.textContent = `❌ ${data.message}`;
                resultDiv.style.backgroundColor = 'salmon';
            }
        } catch (error) {
            console.error('서버 통신 오류:', error);
            resultDiv.textContent = '⚠️ 서버와 통신 중 오류가 발생했습니다.';
            resultDiv.style.backgroundColor = 'orange';
        }

        // 3초 후에 다시 스캔을 시작합니다.
        setTimeout(() => {
            resultDiv.textContent = '카메라를 QR 코드에 비춰주세요.';
            resultDiv.style.backgroundColor = 'transparent';
            qrScanner.start();
        }, 3000);
    },
    {
        /* 스캐너 옵션 */
        highlightScanRegion: true,
        highlightCodeOutline: true,
    }
);

// 페이지가 로드되면 바로 스캔을 시작합니다.
qrScanner.start().catch(err => console.error(err));
