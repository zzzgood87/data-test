import React, { useState } from 'react';
import { activitiesAPI } from '../services/api';

const ActivityForm = ({ buildingId, unitId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    activityType: '방문',
    summary: '',
    nextAction: ''
  });
  const [loading, setLoading] = useState(false);

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
        buildingId,
        unitId,
        activityDate: new Date().toISOString(),
        nextAction: formData.nextAction || null
      };

      await activitiesAPI.create(data);
      onSubmit();
    } catch (error) {
      console.error('활동 기록 등록 실패:', error);
      alert('활동 기록 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">영업 활동 기록</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            활동 유형
          </label>
          <select
            name="activityType"
            value={formData.activityType}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="방문">방문</option>
            <option value="통화">통화</option>
            <option value="이메일">이메일</option>
            <option value="메모">메모</option>
            <option value="사진촬영">사진촬영</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            활동 내용
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="input-field"
            rows="4"
            placeholder="현장에서 파악한 정보, 고객 반응 등을 자유롭게 작성하세요..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            다음 조치 예정일 (선택)
          </label>
          <input
            type="date"
            name="nextAction"
            value={formData.nextAction}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? '등록 중...' : '등록'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
