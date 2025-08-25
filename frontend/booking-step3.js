document.addEventListener('DOMContentLoaded', () => {
    // === 모든 계곡 데이터 정의 ===
    const allValleyData = {
        "무흘 계곡": {
            image_url: "/images/map_muhuel.png",
            sections: [
                // width/height: 클릭 영역의 크기
                { name: "제1곡 봉비암", top: "52%", left: "70%", width: "5%", height: "5%" },
                { name: "제2곡 한강대", top: "38%", left: "60%", width: "5%", height: "5%" },
                { name: "제3곡 무학정", top: "12%", left: "46%", width: "5%", height: "5%" },
                { name: "제4곡 임압", top: "75%", left: "70%", width: "5%", height: "5%" },
                { name: "제5곡 사인암", top: "45%", left: "26%", width: "5%", height: "5%" },
                { name: "제6곡 옥류동", top: "50%", left: "15%", width: "5%", height: "5%" }
            ]
        },
        "삼계리 계곡": {
            image_url: "./images/samgyeri-map.jpg", 
            sections: [
                { name: "A 구역", top: "...", left: "...", width: "...", height: "..." },
                { name: "B 구역", top: "...", left: "...", width: "...", height: "..." }
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

    // 1. 이미지를 먼저 동적으로 삽입
    mapContainer.innerHTML = `
        <img src="${valley.image_url}" alt="${selectedValley} 구역 지도" id="valley-map-image">
    `;

    const imageElement = document.getElementById('valley-map-image');

    // 2. 이미지가 로드된 후 클릭 영역을 생성 (이미지 크기를 알아야 하므로)
    imageElement.onload = () => {
        // 기존의 로딩 메시지 제거
        document.getElementById('loading-message').style.display = 'none';

        // 3. 각 구역별로 클릭 가능한 투명한 div를 생성
        valley.sections.forEach(section => {
            const clickableArea = document.createElement('div');
            clickableArea.className = 'section-clickable-area';
            
            // CSS를 직접 적용하여 위치와 크기 설정
            clickableArea.style.position = 'absolute';
            clickableArea.style.top = section.top;
            clickableArea.style.left = section.left;
            clickableArea.style.width = section.width;
            clickableArea.style.height = section.height;

            // 클릭 이벤트 리스너 추가
            clickableArea.addEventListener('click', (event) => {
                event.preventDefault();
                
                const sectionName = section.name;
                localStorage.setItem('selectedSection', sectionName);
                
                alert(`${selectedValley}의 ${sectionName}을(를) 선택했습니다. 다음 단계로 이동합니다.`);
                window.location.href = 'booking-step4.html';
            });
            
            mapContainer.appendChild(clickableArea);
        });
    };
});