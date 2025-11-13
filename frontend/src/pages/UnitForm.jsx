import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { unitsAPI, ownersAPI } from '../services/api';

const UnitForm = () => {
  const navigate = useNavigate();
  const { buildingId, id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    buildingId: buildingId || '',
    floor: '',
    unitNumber: '',
    area: '',
    usageType: '',
    currentStatus: '공실',
    monthlyRent: '',
    deposit: '',
    maintenanceFee: '',
    ownerId: '',
    tenantName: '',
    tenantPhone: '',
    contractStart: '',
    contractEnd: '',
    notes: ''
  });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOwners();
    if (isEdit) {
      loadUnit();
    }
  }, [id]);

  const loadOwners = async () => {
    try {
      const response = await ownersAPI.getAll();
      setOwners(response.data.owners);
    } catch (error) {
      console.error('소유자 목록 로드 실패:', error);
    }
  };

  const loadUnit = async () => {
    try {
      const response = await unitsAPI.getById(id);
      const unit = response.data.unit;
      setFormData({
        buildingId: unit.buildingId || '',
        floor: unit.floor || '',
        unitNumber: unit.unitNumber || '',
        area: unit.area || '',
        usageType: unit.usageType || '',
        currentStatus: unit.currentStatus || '공실',
        monthlyRent: unit.monthlyRent || '',
        deposit: unit.deposit || '',
        maintenanceFee: unit.maintenanceFee || '',
        ownerId: unit.ownerId || '',
        tenantName: unit.tenantName || '',
        tenantPhone: unit.tenantPhone || '',
        contractStart: unit.contractStart || '',
        contractEnd: unit.contractEnd || '',
        notes: unit.notes || ''
      });
    } catch (error) {
      console.error('유닛 정보 로드 실패:', error);
      alert('유닛 정보를 불러올 수 없습니다.');
      navigate(-1);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        buildingId: parseInt(buildingId || formData.buildingId),
        floor: parseInt(formData.floor),
        area: formData.area ? parseFloat(formData.area) : null,
        monthlyRent: formData.monthlyRent ? parseFloat(formData.monthlyRent) : null,
        deposit: formData.deposit ? parseFloat(formData.deposit) : null,
        maintenanceFee: formData.maintenanceFee ? parseFloat(formData.maintenanceFee) : null,
        ownerId: formData.ownerId || null
      };

      if (isEdit) {
        await unitsAPI.update(id, data);
        alert('유닛 정보가 수정되었습니다.');
      } else {
        await unitsAPI.create(data);
        alert('유닛이 등록되었습니다.');
      }

      navigate(`/buildings/${buildingId || formData.buildingId}`);
    } catch (error) {
      console.error('유닛 저장 실패:', error);
      alert('유닛 저장에 실패했습니다.');
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
              {isEdit ? '유닛 정보 수정' : '새 유닛 등록'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  층수 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  호수
                </label>
                <input
                  type="text"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 501호"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  면적 (㎡)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 85.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  용도
                </label>
                <input
                  type="text"
                  name="usageType"
                  value={formData.usageType}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 사무실, 상가, 주거"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 상태
                </label>
                <select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="공실">공실</option>
                  <option value="임대중">임대중</option>
                  <option value="자가사용">자가사용</option>
                  <option value="매물">매물</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소유자
                </label>
                <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">선택하세요</option>
                  {owners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월 임대료 (원)
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 3000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보증금 (원)
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 10000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관리비 (원)
                </label>
                <input
                  type="number"
                  name="maintenanceFee"
                  value={formData.maintenanceFee}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 150000"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">임차인 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    임차인명
                  </label>
                  <input
                    type="text"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="예: 주식회사 ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    임차인 연락처
                  </label>
                  <input
                    type="tel"
                    name="tenantPhone"
                    value={formData.tenantPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="예: 02-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    계약 시작일
                  </label>
                  <input
                    type="date"
                    name="contractStart"
                    value={formData.contractStart}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    계약 만료일
                  </label>
                  <input
                    type="date"
                    name="contractEnd"
                    value={formData.contractEnd}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="유닛에 대한 추가 정보를 입력하세요..."
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

export default UnitForm;
