document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('next-step-btn');
    const hiddenDateInput = document.getElementById('date-input');

    let bookingSelection = { // 사용자의 선택을 저장하는 객체
        date: null
    };

    flatpickr("#calendar-area", {
        inline: true, // 캘린더를 항상 보이도록 설정
        dateFormat: "Y-m-d", minDate: "today", locale: 'ko',
        // 캘린더가 렌더링될 때마다 실행되는 콜백 함수
        onReady: (selectedDates, dateStr, instance) => {
            // 초기 '다음' 버튼 비활성화
            nextBtn.disabled = true;
        },
        // 날짜를 선택할 때마다 실행되는 콜백 함수
        onChange: (selectedDates, dateStr, instance) => {
            if (dateStr) {
                hiddenDateInput.value = dateStr;
                bookingSelection.date = dateStr;
                nextBtn.disabled = false; }// '다음' 버튼 활성화
            else {
                bookingSelection.date = null;
                nextBtn.disabled = true; }// 날짜 선택이 취소되면 비활성화
        }
    });

    // '다음' 버튼 클릭 시 다음 페이지로 이동
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (bookingSelection.date) {
                window.location.href = `booking-step2.html?date=${bookingSelection.date}`;
            } else {
                alert('날짜를 먼저 선택해주세요.');
            }
        };
    }
});
