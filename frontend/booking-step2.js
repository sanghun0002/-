// 2단계: 지역 선택 (booking-step2.html)

document.addEventListener('DOMContentLoaded', () => {
    // URL에서 매개변수를 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    
    // 사용자의 선택을 저장하는 객체
    let bookingSelection = {
        date: urlParams.get('date'),
        regionId: null,
        cityId: null,
        valleyId: null,
        spotId: null
    };
    
    // 필요한 DOM 요소들을 가져옵니다.
    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');
    const nextBtn = document.getElementById('next-step-btn');
    
    // 페이지 로드 시 '다음' 버튼 비활성화
    if (nextBtn) {
        nextBtn.disabled = true;
    }
    
    // 지역 목록을 불러옵니다.
    fetch('http://localhost:3000/api/regions')
        .then(res => res.json())
        .then(regions => {
            regions.forEach(r => regionSelect.add(new Option(r.name, r.id)));
        });
    
    // 도/특별시 선택 시 시/군/구 목록 업데이트
    regionSelect.onchange = () => {
        citySelect.disabled = true;
        citySelect.innerHTML = '<option>시/군/구 선택</option>';
        if (!regionSelect.value) {
            if (nextBtn) {
                nextBtn.disabled = true;
            }
            return;
        }
    
        fetch(`http://localhost:3000/api/cities?region_id=${regionSelect.value}`)
            .then(res => res.json())
            .then(cities => {
                cities.forEach(c => citySelect.add(new Option(c.name, c.id)));
                citySelect.disabled = false;
            });
    };
    
    // 시/군/구 선택 시 '다음' 버튼 활성화
    citySelect.onchange = () => {
        if (citySelect.value) {
            bookingSelection.regionId = regionSelect.value;
            bookingSelection.cityId = citySelect.value;
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        } else {
            if (nextBtn) {
                nextBtn.disabled = true;
            }
        }
    };
    
    // '다음' 버튼 클릭 시 다음 페이지로 이동
    if (nextBtn) {
        nextBtn.onclick = () => {
            window.location.href = `booking-step3.html?date=${bookingSelection.date}&cityId=${bookingSelection.cityId}`;
        };
    }
});