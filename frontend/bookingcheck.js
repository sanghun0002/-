document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const uploadButton = document.getElementById('uploadButton');
    const resultDiv = document.getElementById('result');

    // 사진을 선택하면 미리보기를 보여주는 기능
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
        }
    });

    uploadButton.addEventListener('click', async () => {
        const file = imageInput.files?.[0];
        if (!file) {
            alert('사진을 먼저 촬영해주세요!');
            return;
        }

        resultDiv.textContent = '분석 중...';

        const formData = new FormData();
        formData.append('file', file);

        // --- 백엔드 서버 주소를 여기에 설정 ---
        const backendUrl = 'http://본인_PC_IP_주소:5000/predict';

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 결과에 따라 메시지 표시
            if (data.status === 'CLEAN') {
                resultDiv.textContent = '✅ 반납 되었습니다. 이용해 주셔서 감사합니다.';
            } else if (data.status === 'DIRTY') {
                resultDiv.textContent = '❌ 다시 청소한 후 인증 부탁드립니다.';
            } else if (data.status === 'NO_PYEONGSANG') {
                resultDiv.textContent = '⚠️ 평상이 인식되지 않았습니다. 평상이 보이도록 다시 촬영해주세요.';
            } else {
                resultDiv.textContent = '오류가 발생했습니다: ' + (data.error || '알 수 없는 오류');
            }

        } catch (error) {
            console.error('Error:', error);
            resultDiv.textContent = '서버와 통신 중 오류가 발생했습니다.';
        }
    });
});
