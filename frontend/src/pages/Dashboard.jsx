import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import BuildingList from '../components/BuildingList';
import { buildingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filters, setFilters] = useState({
    buildingType: '',
    status: ''
  });

  useEffect(() => {
    loadBuildings();
  }, [filters]);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const response = await buildingsAPI.getAll(filters);
      setBuildings(response.data.buildings);
    } catch (error) {
      console.error('건물 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  const handleBuildingDetail = (building) => {
    navigate(`/buildings/${building.id}`);
  };

  const handleAddBuilding = () => {
    navigate('/buildings/new');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-white shadow-md z-10">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              부동산 영업 지원 플랫폼
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-gray-600">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden btn-secondary"
              >
                ☰
              </button>
              <button
                onClick={logout}
                className="hidden md:block btn-secondary"
              >
                로그아웃
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {user?.name} ({user?.role})
                </p>
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full btn-secondary"
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* 지도 영역 */}
        <div className="flex-1 relative">
          <KakaoMap
            buildings={buildings}
            onBuildingClick={handleBuildingClick}
            selectedBuilding={selectedBuilding}
          />

          {/* 플로팅 버튼 - 건물 추가 */}
          <button
            onClick={handleAddBuilding}
            className="absolute bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-10"
            title="건물 추가"
          >
            +
          </button>
        </div>

        {/* 사이드바 - 건물 목록 */}
        <div className="w-full md:w-96 bg-white border-t md:border-l border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4">건물 목록</h2>

            {/* 필터 */}
            <div className="space-y-2">
              <select
                value={filters.buildingType}
                onChange={(e) => setFilters({ ...filters, buildingType: e.target.value })}
                className="input-field text-sm"
              >
                <option value="">전체 유형</option>
                <option value="일반건축물">일반건축물</option>
                <option value="집합건축물">집합건축물</option>
                <option value="토지">토지</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field text-sm"
              >
                <option value="">전체 상태</option>
                <option value="정상">정상</option>
                <option value="매물">매물</option>
                <option value="계획">계획</option>
                <option value="공사중">공사중</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <BuildingList
              buildings={buildings}
              loading={loading}
              onBuildingClick={handleBuildingDetail}
              selectedBuilding={selectedBuilding}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
