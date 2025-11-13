import React from 'react';

const BuildingList = ({ buildings, loading, onBuildingClick, selectedBuilding }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4">
        <div className="text-gray-400 text-5xl mb-4">🏢</div>
        <p className="text-gray-500 text-center">
          등록된 건물이 없습니다.
        </p>
        <p className="text-gray-400 text-sm text-center mt-2">
          우측 하단의 + 버튼을 눌러 건물을 추가하세요.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      '정상': 'bg-green-100 text-green-800',
      '매물': 'bg-blue-100 text-blue-800',
      '계획': 'bg-yellow-100 text-yellow-800',
      '공사중': 'bg-orange-100 text-orange-800',
      '폐쇄': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getVacancyInfo = (building) => {
    if (!building.units || building.units.length === 0) {
      return { total: 0, vacant: 0 };
    }

    const total = building.units.length;
    const vacant = building.units.filter(u => u.currentStatus === '공실').length;
    return { total, vacant };
  };

  return (
    <div className="divide-y divide-gray-200">
      {buildings.map((building) => {
        const { total, vacant } = getVacancyInfo(building);
        const isSelected = selectedBuilding?.id === building.id;

        return (
          <div
            key={building.id}
            onClick={() => onBuildingClick(building)}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              isSelected ? 'bg-primary-50 border-l-4 border-primary-600' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                {building.name}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(building.status)}`}>
                {building.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {building.address}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="font-medium">{building.buildingType}</span>
              </span>

              {building.totalFloors && (
                <span className="flex items-center gap-1">
                  <span>🏢</span>
                  <span>{building.totalFloors}층</span>
                </span>
              )}

              {total > 0 && (
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  <span>
                    공실 {vacant}/{total}
                  </span>
                </span>
              )}

              {building.constructionYear && (
                <span className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{building.constructionYear}년</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BuildingList;
