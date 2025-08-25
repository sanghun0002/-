document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const noticeId = params.get('id');

    const titleInput = document.getElementById('title');
    const departmentInput = document.getElementById('department');
    const contentInput = document.getElementById('content');
    const isStickyCheckbox = document.getElementById('is-sticky');
    const form = document.getElementById('edit-form');

    if (!noticeId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'notice.html';
        return;
    }

    // 1. 수정할 기존 데이터를 불러와서 폼에 채워넣기
    try {
        const response = await fetch(`https://o70albxd7n.onrender.com/api/notices/${noticeId}`);
        const notice = await response.json();

        titleInput.value = notice.title;
        departmentInput.value = notice.department;
        contentInput.value = notice.content;
        isStickyCheckbox.checked = notice.isSticky;
    } catch (error) {
        alert('기존 데이터를 불러오는 데 실패했습니다.');
        window.location.href = 'notice.html';
    }

    // 2. 폼 제출(수정 완료) 이벤트 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
            title: titleInput.value,
            department: departmentInput.value,
            content: contentInput.value,
            isSticky: isStickyCheckbox.checked
        };

        try {
            const response = await fetch(`https://o70albxd7n.onrender.com/api/notices/${noticeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('수정에 실패했습니다.');

            alert('공지사항이 수정되었습니다.');
            // ▼▼▼ 링크가 notice_detail.html로 수정되었습니다 ▼▼▼
            window.location.href = `notice_detail.html?id=${noticeId}`;
        } catch (error) {
            alert(error.message);
        }
    });
});