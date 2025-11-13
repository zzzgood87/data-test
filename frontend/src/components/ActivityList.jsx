import React from 'react';

const ActivityList = ({ activities, onUpdate }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <div className="text-gray-400 text-5xl mb-4">📝</div>
        <p className="text-gray-500">영업 활동 기록이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">
          위의 '+ 활동 기록' 버튼을 눌러 첫 활동을 기록하세요.
        </p>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    const icons = {
      '방문': '🚶',
      '통화': '📞',
      '이메일': '📧',
      '메모': '📝',
      '사진촬영': '📷',
      '기타': '📌'
    };
    return icons[type] || '📌';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getActivityIcon(activity.activityType)}</span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {activity.activityType}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDateTime(activity.activityDate)}
                </p>
              </div>
            </div>
            {activity.agent && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {activity.agent.name}
              </span>
            )}
          </div>

          <div className="mb-3">
            <p className="text-gray-700 whitespace-pre-line">
              {activity.summary}
            </p>
          </div>

          {activity.nextAction && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">다음 조치:</span>
                <span className="font-medium text-primary-600">
                  {formatDate(activity.nextAction)}
                </span>
              </div>
            </div>
          )}

          {activity.unit && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                관련 유닛: {activity.unit.floor}층 {activity.unit.unitNumber}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
