document.addEventListener('DOMContentLoaded', () => {
    // === 모든 계곡 데이터 정의 ===
    const allValleyData = {
        "무흘 계곡": {
            image_url: "/images/map_muhuel.png", // 파일명이 올바른지 다시 확인하세요.
            sections: [
                // 아래 좌표들은 제공해주신 최신 사진(image_8a2abd.jpg)에 맞춰 재조정된 값입니다.
                // 형식: "x좌표, y좌표, 반지름"
                { name: "제1곡 봉비암", coords: "710,500, 20" },
                { name: "제2곡 한강대", coords: "620,400, 20" },
                { name: "제3곡 무학정", coords: "480,140, 20" },
                { name: "제4곡 임압", coords: "710,770, 20" },
                { name: "제5곡 사인암", coords: "280,480, 20" },
                { name: "제6곡 옥류동", coords: "170,520, 20" }
            ]
        },
        "삼계리 계곡": {
            image_url: "./images/samgyeri-map.jpg", 
            sections: [
                { name: "A 구역", coords: "..." },
                { name: "B 구역", coords: "..." }
            ]
        }
    };

    const selectedValley = localStorage.getItem('selectedValley');
    const displayElement = document.getElementById('selected-valley-display');
    const mapContainer = document.getElementById('image-map-container');
    
    if (!selectedValley || !allValleyData[selectedValley]) {
        alert('이전 단계에서 유효한 계곡을 선택해주세요.');
        window.location.href = 'booking-step2.html';
        return;
    }

    const valley = allValleyData[selectedValley];
    displayElement.textContent = selectedValley;

    const mapName = `valley-map-${selectedValley}`;
    
    mapContainer.innerHTML = `
        <img src="${valley.image_url}" alt="${selectedValley} 구역 지도" usemap="#${mapName}" id="valley-map-image" class="mx-auto rounded-lg shadow-md">
        <map name="${mapName}" id="${mapName}"></map>
    `;

    const mapElement = document.getElementById(mapName);

    valley.sections.forEach(section => {
        const areaElement = document.createElement('area');
        areaElement.className = 'section-area';
        // 'poly'를 'circle'로 수정
        areaElement.shape = 'circle';
        areaElement.coords = section.coords;
        areaElement.href = '#';
        areaElement.setAttribute('data-section-name', section.name);

        mapElement.appendChild(areaElement);

        areaElement.addEventListener('click', (event) => {
            event.preventDefault();
            
            const sectionName = areaElement.getAttribute('data-section-name');
            localStorage.setItem('selectedSection', sectionName);
            
            alert(`${selectedValley}의 ${sectionName}을(를) 선택했습니다. 다음 단계로 이동합니다.`);
            window.location.href = 'booking-step4.html';
        });
    });
});