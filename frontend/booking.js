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
        const calendarArea = document.getElementById('calendar-area');
        calendarArea.innerHTML = '<p>여기에 달력 라이브러리를 연동하여 달력을 표시합니다.<br>우선 테스트를 위해 날짜를 임의로 선택했다고 가정합니다.</p>';
        
        // 날짜를 선택했다고 가정하고 다음 버튼 활성화
        bookingSelection.date = '2025-08-23'; 
        if(nextBtn) {
            nextBtn.disabled = false;
            nextBtn.onclick = () => { 
                window.location.href = `booking-step2.html?date=${bookingSelection.date}`; 
            };
        }
    }

    // 2단계: 지역 선택 (booking-step2.html)
    if (currentPage === 'booking-step2.html') {
        const regionSelect = document.getElementById('region-select');
        const citySelect = document.getElementById('city-select');

        fetch('http://localhost:3000/api/regions')
            .then(res => res.json())
            .then(regions => {
                regions.forEach(r => regionSelect.add(new Option(r.name, r.id)));
            });
        
        regionSelect.onchange = () => {
            citySelect.disabled = true;
            citySelect.innerHTML = '<option>시/군/구 선택</option>';
            if (!regionSelect.value) return;

            fetch(`http://localhost:3000/api/cities?region_id=${regionSelect.value}`)
                .then(res => res.json())
                .then(cities => {
                    cities.forEach(c => citySelect.add(new Option(c.name, c.id)));
                    citySelect.disabled = false;
                });
        };

        citySelect.onchange = () => {
            if (citySelect.value) {
                bookingSelection.regionId = regionSelect.value;
                bookingSelection.cityId = citySelect.value;
                if(nextBtn) nextBtn.disabled = false;
            } else {
                if(nextBtn) nextBtn.disabled = true;
            }
        };

        if(nextBtn) {
            nextBtn.onclick = () => {
                window.location.href = `booking-step3.html?date=${bookingSelection.date}&cityId=${bookingSelection.cityId}`;
            };
        }
    }

    // 3단계: 계곡 선택 (booking-step3.html)
    if (currentPage === 'booking-step3.html') {
        const valleyListDiv = document.getElementById('valley-list');
        fetch(`http://localhost:3000/api/valleys?city_id=${bookingSelection.cityId}`)
            .then(res => res.json())
            .then(valleys => {
                valleyListDiv.innerHTML = '';
                valleys.forEach(valley => {
                    const item = document.createElement('button');
                    item.className = 'item-select-btn';
                    item.textContent = valley.name;
                    item.onclick = () => {
                        bookingSelection.valleyId = valley.id;
                        // 선택된 항목 강조 (CSS로 구현)
                        document.querySelectorAll('.item-select-btn').forEach(btn => btn.classList.remove('selected'));
                        item.classList.add('selected');
                        if(nextBtn) nextBtn.disabled = false;
                    };
                    valleyListDiv.appendChild(item);
                });
            });

        if(nextBtn) {
            nextBtn.onclick = () => {
                window.location.href = `booking-step4.html?date=${bookingSelection.date}&valleyId=${bookingSelection.valleyId}`;
            };
        }
    }

    // 4단계: 평상 선택 (booking-step4.html)
    if (currentPage === 'booking-step4.html') {
        const spotMapDiv = document.getElementById('spot-map');
        const paymentBtn = document.getElementById('payment-btn');
        
        fetch(`http://localhost:3000/api/spots?valley_id=${bookingSelection.valleyId}`)
            .then(res => res.json())
            .then(spots => {
                spotMapDiv.innerHTML = '';
                spots.forEach(spot => {
                    const item = document.createElement('button');
                    item.className = 'item-select-btn';
                    item.textContent = spot.name;
                    // (실제로는 예약 가능 여부를 확인하고 비활성화 처리해야 함)
                    item.onclick = () => {
                        bookingSelection.spotId = spot.id;
                        document.querySelectorAll('.item-select-btn').forEach(btn => btn.classList.remove('selected'));
                        item.classList.add('selected');
                        if(paymentBtn) paymentBtn.disabled = false;
                    };
                    spotMapDiv.appendChild(item);
                });
            });

        if(paymentBtn) {
            paymentBtn.onclick = () => {
                alert(`최종 예약 정보:\n날짜: ${bookingSelection.date}\n평상: ${bookingSelection.spotId}\n이제 결제 시스템을 연동합니다.`);
                // window.location.href = `payment.html?spotId=${bookingSelection.spotId}`;
            };
        }
    }
});