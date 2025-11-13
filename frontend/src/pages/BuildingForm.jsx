import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildingsAPI } from '../services/api';

const BuildingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    buildingType: '일반건축물',
    totalFloors: '',
    constructionYear: '',
    totalArea: '',
    landArea: '',
    parkingSpaces: '',
    description: '',
    status: '정상'
  });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadBuilding();
    }
  }, [id]);

  const loadBuilding = async () => {
    try {
      const response = await buildingsAPI.getById(id);
      const building = response.data.building;
      setFormData({
        name: building.name || '',
        address: building.address || '',
        latitude: building.latitude || '',
        longitude: building.longitude || '',
        buildingType: building.buildingType || '일반건축물',
        totalFloors: building.totalFloors || '',
        constructionYear: building.constructionYear || '',
        totalArea: building.totalArea || '',
        landArea: building.landArea || '',
        parkingSpaces: building.parkingSpaces || '',
        description: building.description || '',
        status: building.status || '정상'
      });
    } catch (error) {
      console.error('건물 정보 로드 실패:', error);
      alert('건물 정보를 불러올 수 없습니다.');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const searchAddress = async () => {
    if (!window.kakao || !window.kakao.maps || !formData.address) {
      alert('주소를 입력해주세요.');
      return;
    }

    setSearching(true);

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(formData.address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setFormData({
          ...formData,
          latitude: result[0].y,
          longitude: result[0].x
        });
        alert('주소로부터 좌표를 찾았습니다!');
      } else {
        alert('주소 검색에 실패했습니다. 주소를 확인해주세요.');
      }
      setSearching(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.latitude || !formData.longitude) {
        alert('주소 검색을 통해 좌표를 입력해주세요.');
        setLoading(false);
        return;
      }

      const data = {
        ...formData,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
        constructionYear: formData.constructionYear ? parseInt(formData.constructionYear) : null,
        totalArea: formData.totalArea ? parseFloat(formData.totalArea) : null,
        landArea: formData.landArea ? parseFloat(formData.landArea) : null,
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null
      };

      if (isEdit) {
        await buildingsAPI.update(id, data);
        alert('건물 정보가 수정되었습니다.');
        navigate(`/buildings/${id}`);
      } else {
        const response = await buildingsAPI.create(data);
        alert('건물이 등록되었습니다.');
        navigate(`/buildings/${response.data.building.id}`);
      }
    } catch (error) {
      console.error('건물 저장 실패:', error);
      alert('건물 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 mb-4"
            >
              ← 돌아가기
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? '건물 정보 수정' : '새 건물 등록'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                건물명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="예: 삼성타워"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field flex-1"
                  placeholder="예: 서울시 강남구 테헤란로 123"
                  required
                />
                <button
                  type="button"
                  onClick={searchAddress}
                  disabled={searching}
                  className="btn-secondary whitespace-nowrap"
                >
                  {searching ? '검색 중...' : '주소 검색'}
                </button>
              </div>
              {formData.latitude && formData.longitude && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ 좌표: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건물 유형
                </label>
                <select
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="일반건축물">일반건축물</option>
                  <option value="집합건축물">집합건축물</option>
                  <option value="토지">토지</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="정상">정상</option>
                  <option value="매물">매물</option>
                  <option value="계획">계획</option>
                  <option value="공사중">공사중</option>
                  <option value="폐쇄">폐쇄</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  총 층수
                </label>
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  준공년도
                </label>
                <input
                  type="number"
                  name="constructionYear"
                  value={formData.constructionYear}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연면적 (㎡)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 1234.56"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대지면적 (㎡)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주차대수
                </label>
                <input
                  type="number"
                  name="parkingSpaces"
                  value={formData.parkingSpaces}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="건물에 대한 추가 정보를 입력하세요..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {loading ? '저장 중...' : (isEdit ? '수정' : '등록')}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1 py-3"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildingForm;
