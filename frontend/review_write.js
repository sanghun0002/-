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

        // 파일 개수 5개로 제한
        if (files.length > 5) {
            alert('사진은 최대 5장까지 첨부할 수 있습니다.');
            imageInput.value = ''; // 선택된 파일 초기화
            previewContainer.innerHTML = '';
            previewContainer.style.display = 'none';
            return;
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

        const ratingInput = document.querySelector('input[name="rating"]:checked');
        if (!ratingInput) {
            alert('평점을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        // ▼▼▼ 여기서 'author'라는 이름으로 FormData에 추가합니다. (HTML id와 일치) ▼▼▼
        formData.append('author', document.getElementById('author').value);
        formData.append('rating', ratingInput.value);
        formData.append('content', document.getElementById('content').value);

        for (const file of imageInput.files) {
            formData.append('images', file);
        }

        try {
            const response = await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
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
