document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('review-form');
    const imageInput = document.getElementById('images');
    const previewContainer = document.getElementById('image-preview-container');

    // 이미지 선택 시 미리보기 기능
    imageInput.addEventListener('change', () => {
        previewContainer.innerHTML = ''; // 기존 미리보기 초기화
        const files = imageInput.files;

        if (files.length > 0) {
            previewContainer.style.display = 'flex';
        } else {
            previewContainer.style.display = 'none';
        }

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('image-preview');
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // 폼 제출 이벤트
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // FormData 객체를 사용하여 텍스트와 파일을 함께 보냄
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('rating', document.querySelector('input[name="rating"]:checked').value);
        formData.append('content', document.getElementById('content').value);

        // 선택된 이미지 파일들을 FormData에 추가
        for (const file of imageInput.files) {
            formData.append('images', file);
        }

        try {
            const response = await fetch('https://o70albxd7n.onrender.com/api/reviews', {
                method: 'POST',
                // 주의: FormData를 보낼 때는 'Content-Type' 헤더를 설정하지 않습니다.
                // 브라우저가 알아서 올바른 형식(multipart/form-data)으로 설정해줍니다.
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '서버 응답 오류');
            }

            alert('후기가 등록되었습니다.');
            window.location.href = 'review.html';

        } catch (error) {
            console.error("등록 오류:", error);
            alert(`후기 등록 중 오류가 발생했습니다: ${error.message}`);
        }
    });
});
