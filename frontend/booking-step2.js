// 2단계: 지역 선택 (booking-step2.html)

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    let bookingSelection = {
        date: urlParams.get('date'),
        regionId: null,
        cityId: null,
        valleyId: null,
        spotId: null
    };

    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');
    const nextBtn = document.getElementById('next-step-btn');

if (currentPage === 'booking-step2.html') {
    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');

        if (nextBtn) {
        nextBtn.disabled = true;
    }

    fetch('http://localhost:3000/api/regions')
        .then(res => res.json())
        .then(regions => {
            regions.forEach(r => regionSelect.add(new Option(r.name, r.id)));
        });
    
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
}});