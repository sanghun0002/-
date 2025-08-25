document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    const editForm = document.getElementById('edit-form');

    if (!reviewId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'review.html';
        return;
    }
    
    let currentReview = null;

    function renderStars(rating) {
        return '⭐'.repeat(rating);
    }
    
    function displayReview(review) {
        document.getElementById('detail-title').textContent = review.title;
        document.getElementById('detail-author').textContent = review.author;
        document.getElementById('detail-date').textContent = review.date;
        document.getElementById('detail-views').textContent = review.views;
        document.getElementById('detail-rating').textContent = `평점: ${renderStars(review.rating)}`;
        document.getElementById('detail-content').innerHTML = `<p>${review.content.replace(/\n/g, '<br>')}</p>`;

        const imagesContainer = document.getElementById('detail-images-container');
        imagesContainer.innerHTML = '';

        if (review.images && review.images.length > 0) {
            review.images.forEach(imageUrl => {
                const img = document.createElement('img');
                // ▼▼▼ 이미지 주소를 로컬 서버 기준으로 변경! ▼▼▼
                img.src = `http://localhost:3000${imageUrl}`;
                img.classList.add('detail-image');
                imagesContainer.appendChild(img);
            });
            imagesContainer.style.display = 'flex';
        } else {
            imagesContainer.style.display = 'none';
        }
    }

    try {
        // ▼▼▼ API 주소를 로컬 서버로 변경! ▼▼▼
        const response = await fetch(`https://o70albxd7n.onrender.com`);
        if (!response.ok) throw new Error('후기를 불러오는 데 실패했습니다.');
        
        currentReview = await response.json();
        displayReview(currentReview);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        window.location.href = 'review.html';
    }

    const editBtn = document.getElementById('edit-btn');
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        viewMode.style.display = 'none';
        editMode.style.display = 'block';

        document.getElementById('edit-title').value = currentReview.title;
        document.getElementById('edit-author').value = currentReview.author;
        document.getElementById('edit-content').value = currentReview.content;
        document.querySelector(`#edit-mode input[name="rating"][value="${currentReview.rating}"]`).checked = true;
    });
    
    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', () => {
        editMode.style.display = 'none';
        viewMode.style.display = 'block';
    });
    
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            title: document.getElementById('edit-title').value,
            author: document.getElementById('edit-author').value,
            content: document.getElementById('edit-content').value,
            rating: document.querySelector('#edit-mode input[name="rating"]:checked').value
        };

        try {
            // ▼▼▼ API 주소를 로컬 서버로 변경! ▼▼▼
            const response = await fetch(`https://o70albxd7n.onrender.com`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('수정에 실패했습니다.');

            const updatedReview = await response.json();
            currentReview = updatedReview;

            alert('후기가 수정되었습니다.');
            displayReview(currentReview);
            cancelBtn.click();

        } catch (error) {
            alert(error.message);
        }
    });

    const deleteBtn = document.getElementById('delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('정말로 이 후기를 삭제하시겠습니까?')) {
            try {
                // ▼▼▼ API 주소를 로컬 서버로 변경! ▼▼▼
                const deleteResponse = await fetch(`https://o70albxd7n.onrender.com`, { method: 'DELETE' });
                if (!deleteResponse.ok) throw new Error('삭제에 실패했습니다.');
                
                alert('후기가 삭제되었습니다.');
                window.location.href = 'review.html';
            } catch (err) {
                alert(err.message);
            }
        }
    });
});
