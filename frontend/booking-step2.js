document.addEventListener('DOMContentLoaded', () => {
    const mapObject = document.getElementById('korea-map');
    const selectedRegionNameSpan = document.getElementById('selected-region-name');
    const nextButton = document.getElementById('next-button');

    let selectedRegionId = null;

    // SVG 파일 로드가 완료되면 이벤트 리스너를 추가
    mapObject.addEventListener('load', () => {
        const svgDoc = mapObject.contentDocument;
        const provinces = svgDoc.querySelectorAll('path, polygon'); // 행정구역을 나타내는 모든 path 또는 polygon 태그

        provinces.forEach(province => {
            province.addEventListener('click', (event) => {
                // 이전에 선택된 지역의 'selected' 클래스 제거
                if (selectedRegionId) {
                    const prevSelected = svgDoc.getElementById(selectedRegionId);
                    if (prevSelected) {
                        prevSelected.classList.remove('selected');
                    }
                }

                // 현재 클릭된 지역을 선택
                const currentProvince = event.target;
                currentProvince.classList.add('selected');
                selectedRegionId = currentProvince.id;

                // 선택된 지역의 이름을 가져와서 화면에 표시
                const regionName = currentProvince.getAttribute('data-name') || currentProvince.getAttribute('title') || currentProvince.id;
                selectedRegionNameSpan.textContent = regionName;

                // 다음 버튼 활성화
                nextButton.disabled = false;
            });
        });
    });

    // "다음" 버튼 클릭 시
    nextButton.addEventListener('click', () => {
        if (selectedRegionId) {
            // 여기에 선택된 지역 정보를 다음 페이지로 전달하는 로직 추가
            // 예: 로컬 스토리지에 저장
            localStorage.setItem('selectedRegionId', selectedRegionId);
            
            // 다음 페이지로 이동
            alert(`${selectedRegionNameSpan.textContent}을(를) 선택했습니다. 다음 단계로 이동합니다.`);
            window.location.href = 'booking-step3.html'; // 다음 페이지 URL
        }
    });
});
