document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('next-step-btn');
    const hiddenDateInput = document.getElementById('date-input');

    let bookingSelection = {
        date: null
    };

    // 오늘 날짜로부터 14일 뒤의 날짜를 계산합니다.
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    flatpickr("#calendar-area", {
        inline: true,
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: twoWeeksLater, // Date 객체를 사용하여 maxDate 설정
        locale: 'ko',

        onReady: (selectedDates, dateStr, instance) => {
            nextBtn.disabled = true;
        },
        onChange: (selectedDates, dateStr, instance) => {
            if (dateStr) {
                hiddenDateInput.value = dateStr;
                bookingSelection.date = dateStr;
                nextBtn.disabled = false;
            } else {
                bookingSelection.date = null;
                nextBtn.disabled = true;
            }
        }
    });

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