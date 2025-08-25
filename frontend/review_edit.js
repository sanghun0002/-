document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://o70albxd7n.onrender.com';
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    const form = document.getElementById('edit-form');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const contentInput = document.getElementById('content');
    const newImagesInput = document.getElementById('new-images');
    const imagesContainer = document.getElementById('existing-images-container');
    let existingImageUrls = []; // 기존 이미지 URL들을 저장할 배열

    if (!reviewId) {
        alert('잘못된 접근입니다.');
        return window.location.href = 'review.html';
    }

    // 1. 기존 데이터 및 이미지 불러오기
    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
        const review = await response.json();

        titleInput.value = review.title;
        authorInput.value = review.author;
        contentInput.value = review.content;
        document.querySelector(`input[name="rating"][value="${review.rating}"]`).checked = true;
        
        existingImageUrls = review.images || [];
        
        if (existingImageUrls.length > 0) {
            imagesContainer.innerHTML = '';
            existingImageUrls.forEach((imageUrl, index) => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'image-preview-wrapper';
                
                const parts = imageUrl.split('/upload/');
                const thumbnailUrl = `${parts[0]}/upload/w_150,h_150,c_fill/${parts[1]}`;

                imgWrapper.innerHTML = `
                    <img src="${thumbnailUrl}" alt="기존 이미지 ${index + 1}">
                    <div class="delete-overlay">
                        <label>
                            <input type="checkbox" class="delete-image-cb" value="${imageUrl}"> 삭제
                        </label>
                    </div>
                `;
                imagesContainer.appendChild(imgWrapper);
            });
        } else {
            imagesContainer.innerHTML = '<p>첨부된 사진이 없습니다.</p>';
        }

    } catch (error) {
        alert('기존 데이터를 불러오는 데 실패했습니다.');
        window.location.href = 'review.html';
    }

    // 2. 폼 제출 (수정 완료) 이벤트
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 삭제하기로 선택된 이미지 URL들을 가져옴
        const imagesToDelete = Array.from(document.querySelectorAll('.delete-image-cb:checked'))
                                     .map(cb => cb.value);

        // FormData 객체 생성
        const formData = new FormData();
        formData.append('title', titleInput.value);
        formData.append('author', authorInput.value);
        formData.append('content', contentInput.value);
        formData.append('rating', document.querySelector('input[name="rating"]:checked').value);
        
        // 삭제할 이미지 목록을 JSON 문자열 형태로 추가
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        
        // 새로 추가할 이미지들을 추가
        for (const file of newImagesInput.files) {
            formData.append('newImages', file);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
                method: 'PUT',
                body: formData // FormData는 Content-Type을 자동으로 설정하므로 headers 불필요
            });

            if (!response.ok) throw new Error('수정에 실패했습니다.');

            alert('후기가 수정되었습니다.');
            window.location.href = `review_detail.html?id=${reviewId}`;
        } catch (error) {
            alert(error.message);
        }
    });
});ㄴ
