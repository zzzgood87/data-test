import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingsAPI, unitsAPI, activitiesAPI } from '../services/api';
import UnitCard from '../components/UnitCard';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [units, setUnits] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('units'); // units, activities
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  useEffect(() => {
    loadBuilding();
    loadActivities();
  }, [id]);

  const loadBuilding = async () => {
    try {
      setLoading(true);
      const response = await buildingsAPI.getById(id);
      setBuilding(response.data.building);
      setUnits(response.data.building.units || []);
    } catch (error) {
      console.error('건물 정보 로드 실패:', error);
      alert('건물 정보를 불러올 수 없습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await activitiesAPI.getAll({ buildingId: id });
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('활동 목록 로드 실패:', error);
    }
  };

  const handleActivitySubmit = async () => {
    setShowActivityForm(false);
    await loadActivities();
  };

  const handleUnitEdit = (unit) => {
    setEditingUnit(unit);
    navigate(`/units/${unit.id}/edit`);
  };

  const handleAddUnit = () => {
    navigate(`/buildings/${id}/units/new`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">건물을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const groupedUnits = units.reduce((acc, unit) => {
    const floor = unit.floor;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(unit);
    return acc;
  }, {});

  const sortedFloors = Object.keys(groupedUnits).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 돌아가기
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex-1">
              {building.name}
            </h1>
            <button
              onClick={() => navigate(`/buildings/${id}/edit`)}
              className="btn-secondary text-sm"
            >
              수정
            </button>
          </div>
        </div>
      </header>

      {/* 건물 기본 정보 */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">주소</p>
              <p className="font-medium">{building.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">건물 유형</p>
              <p className="font-medium">{building.buildingType}</p>
            </div>
            {building.totalFloors && (
              <div>
                <p className="text-sm text-gray-500">총 층수</p>
                <p className="font-medium">{building.totalFloors}층</p>
              </div>
            )}
            {building.constructionYear && (
              <div>
                <p className="text-sm text-gray-500">준공년도</p>
                <p className="font-medium">{building.constructionYear}년</p>
              </div>
            )}
            {building.totalArea && (
              <div>
                <p className="text-sm text-gray-500">연면적</p>
                <p className="font-medium">{building.totalArea.toLocaleString()}㎡</p>
              </div>
            )}
            {building.parkingSpaces && (
              <div>
                <p className="text-sm text-gray-500">주차대수</p>
                <p className="font-medium">{building.parkingSpaces}대</p>
              </div>
            )}
          </div>

          {building.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">설명</p>
              <p className="text-gray-700">{building.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="container-custom">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('units')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'units'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              층별 정보 ({units.length})
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'activities'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              영업 활동 ({activities.length})
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container-custom py-6">
        {activeTab === 'units' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">층별/호수별 정보</h2>
              <button
                onClick={handleAddUnit}
                className="btn-primary"
              >
                + 유닛 추가
              </button>
            </div>

            {units.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">🏢</div>
                <p className="text-gray-500">등록된 유닛이 없습니다.</p>
                <button
                  onClick={handleAddUnit}
                  className="btn-primary mt-4"
                >
                  첫 유닛 추가하기
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedFloors.map((floor) => (
                  <div key={floor}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                        {floor}층
                      </span>
                      <span className="text-sm text-gray-500">
                        ({groupedUnits[floor].length}개 유닛)
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedUnits[floor].map((unit) => (
                        <UnitCard
                          key={unit.id}
                          unit={unit}
                          onEdit={handleUnitEdit}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">영업 활동 기록</h2>
              <button
                onClick={() => setShowActivityForm(true)}
                className="btn-primary"
              >
                + 활동 기록
              </button>
            </div>

            {showActivityForm && (
              <div className="mb-6">
                <ActivityForm
                  buildingId={id}
                  onSubmit={handleActivitySubmit}
                  onCancel={() => setShowActivityForm(false)}
                />
              </div>
            )}

            <ActivityList activities={activities} onUpdate={loadActivities} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingDetail;
