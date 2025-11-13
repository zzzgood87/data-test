import React, { useEffect, useRef, useState } from 'react';

const KakaoMap = ({ buildings, onBuildingClick, selectedBuilding }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 지도 초기화
  useEffect(() => {
    // 카카오맵 스크립트 로드 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error('카카오맵 스크립트가 로드되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // 카카오맵 SDK 로드
    window.kakao.maps.load(() => {
      try {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
          level: 5
        };

        const newMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(newMap);

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        newMap.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        newMap.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        setIsLoading(false);
        console.log('✅ 카카오맵 로드 완료');
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setIsLoading(false);
      }
    });
  }, []);

  // 마커 표시
  useEffect(() => {
    if (!map || !buildings) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));

    // 새 마커 생성
    const newMarkers = buildings.map(building => {
      const position = new window.kakao.maps.LatLng(
        parseFloat(building.latitude),
        parseFloat(building.longitude)
      );

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: building.name
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onBuildingClick(building);

        // 인포윈도우 생성
        const infoContent = `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
              ${building.name}
            </h3>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              ${building.address}
            </p>
            <p style="margin: 4px 0; font-size: 12px;">
              <span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px;">
                ${building.buildingType}
              </span>
              ${building.totalFloors ? `<span style="margin-left: 8px;">${building.totalFloors}층</span>` : ''}
            </p>
          </div>
        `;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: infoContent
        });

        // 기존 인포윈도우 닫기
        markers.forEach(m => {
          if (m.infowindow) {
            m.infowindow.close();
          }
        });

        infowindow.open(map, marker);
        marker.infowindow = infowindow;
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 첫 번째 건물로 지도 이동
    if (buildings.length > 0) {
      const firstBuilding = buildings[0];
      const moveLatLon = new window.kakao.maps.LatLng(
        parseFloat(firstBuilding.latitude),
        parseFloat(firstBuilding.longitude)
      );
      map.setCenter(moveLatLon);
    }
  }, [map, buildings]);

  // 선택된 건물로 이동
  useEffect(() => {
    if (!map || !selectedBuilding) return;

    const position = new window.kakao.maps.LatLng(
      parseFloat(selectedBuilding.latitude),
      parseFloat(selectedBuilding.longitude)
    );

    map.panTo(position);
  }, [map, selectedBuilding]);

  // 로딩 중 또는 에러 처리
  if (isLoading && !map) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="text-gray-500 mb-2">🗺️</div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!window.kakao || !window.kakao.maps) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ minHeight: '400px' }}>
        <div className="text-center p-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">카카오맵을 불러올 수 없습니다</h3>
          <p className="text-gray-600 text-sm mb-4">
            카카오맵 API 키가 올바르지 않거나 네트워크 문제가 있습니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-sm"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default KakaoMap;
