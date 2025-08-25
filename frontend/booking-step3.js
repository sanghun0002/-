document.addEventListener('DOMContentLoaded', () => {
    // === 모든 계곡 데이터 정의 ===
    const allValleyData = {
        "무흘 계곡": {
            image_url: "./images/muhuel.map.jpg",
            sections: [
                { name: "제1곡 봉비암", coords: "206,12,305,10,367,100,344,142,279,161,208,129,149,114,153,52" },
                { name: "제2곡 한강대", coords: "12,185,123,178,168,228,154,260,107,266,42,238,10,215" },
                { name: "제3곡 배바위", coords: "291,178,397,169,458,255,410,299,350,294,302,233" },
                { name: "제4곡 선바위", coords: "120,335,202,300,240,337,222,382,184,394,136,368" },
                { name: "제5곡 사인암", coords: "427,344,534,321,559,380,510,432,456,419" },
                { name: "제6곡 옥류동", coords: "160,490,287,489,307,575,223,598,164,561" },
                { name: "제7곡 만월담", coords: "72,612,176,606,204,668,142,693,92,684" },
                { name: "제8곡 와룡암", coords: "395,640,517,639,531,714,449,742,398,705" },
                { name: "제9곡 용추폭포", coords: "78,758,193,755,214,812,154,845,103,828,78,799" }
            ]
        },
        "삼계리 계곡": {
            image_url: "./images/samgyeri-map.jpg", // 삼계리 계곡 이미지 경로
            sections: [
                { name: "A 구역", coords: "..." }, // 삼계리 계곡의 구역 좌표
                { name: "B 구역", coords: "..." }
            ]
        }
        // 다른 계곡도 여기에 추가
    };

    const selectedValley = localStorage.getItem('selectedValley');
    const displayElement = document.getElementById('selected-valley-display');
    const mapContainer = document.getElementById('image-map-container');
    
    // 1. 선택된 계곡 정보가 없으면 이전 페이지로 리디렉션
    if (!selectedValley || !allValleyData[selectedValley]) {
        alert('이전 단계에서 유효한 계곡을 선택해주세요.');
        window.location.href = 'booking-step2.html';
        return;
    }

    // 2. 선택된 계곡에 해당하는 데이터 불러오기
    const valley = allValleyData[selectedValley];
    displayElement.textContent = selectedValley;

    // 3. 동적으로 이미지 맵 생성 및 삽입
    const mapName = `valley-map-${selectedValley}`;
    
    mapContainer.innerHTML = `
        <img src="${valley.image_url}" alt="${selectedValley} 구역 지도" usemap="#${mapName}" id="valley-map-image" class="mx-auto rounded-lg shadow-md">
        <map name="${mapName}" id="${mapName}"></map>
    `;

    const mapElement = document.getElementById(mapName);

    valley.sections.forEach(section => {
        const areaElement = document.createElement('area');
        areaElement.className = 'section-area';
        areaElement.shape = 'poly';
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

    // 참고: 다음 버튼은 이 로직에서는 사용되지 않음.
    // 각 구역을 클릭하면 바로 이동하므로, '다음' 버튼은 필요에 따라 숨기거나 제거할 수 있습니다.
});