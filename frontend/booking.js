document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split("/").pop();
    const urlParams = new URLSearchParams(window.location.search);
    const nextBtn = document.getElementById('next-step-btn');

    // 사용자의 선택을 저장하는 객체
    let bookingSelection = {
        date: urlParams.get('date'),
        regionId: urlParams.get('regionId'),
        cityId: urlParams.get('cityId'),
        valleyId: urlParams.get('valleyId'),
        spotId: null
    };

// 1단계: 날짜 선택 (booking.html)
if (currentPage === 'booking.html' || currentPage === '') {
    // 1. HTML에서 날짜 입력 필드를 가져옵니다.
    const dateInput = document.getElementById('date-input');

    // 2. 페이지 로드 시 '다음' 버튼 비활성화 (기존 코드에서는 이미 활성화되어 있었음)
    if(nextBtn) {
        nextBtn.disabled = true;
    }

    // 3. 사용자가 날짜를 선택할 때마다 실행될 이벤트 리스너를 추가합니다.
    dateInput.addEventListener('change', () => {
        // 입력 필드에 값이 있는지 확인
        if (dateInput.value) {
            // 값이 있다면 bookingSelection 객체에 저장
            bookingSelection.date = dateInput.value;
            // '다음' 버튼 활성화
            if(nextBtn) {
                nextBtn.disabled = false;
            }
        } else {
            // 값이 없다면 '다음' 버튼 비활성화
            bookingSelection.date = null;
            if(nextBtn) {
                nextBtn.disabled = true;
            }
        }
    });

    // 4. '다음' 버튼 클릭 시 다음 페이지로 이동
    if(nextBtn) {
        nextBtn.onclick = () => { 
            // bookingSelection.date에 실제 선택된 날짜가 들어있습니다.
            if (bookingSelection.date) {
                window.location.href = `booking-step2.html?date=${bookingSelection.date}`;
            } else {
                alert('날짜를 먼저 선택해주세요.');
            }
        };
    }
}
});