import React from 'react';

const UnitCard = ({ unit, onEdit }) => {
  const getStatusBadge = (status) => {
    const badges = {
      '공실': { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
      '임대중': { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
      '자가사용': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
      '매물': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' }
    };
    return badges[status] || badges['공실'];
  };

  const badge = getStatusBadge(unit.currentStatus);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `${Number(amount).toLocaleString()}원`;
  };

  return (
    <div className="card hover:shadow-xl cursor-pointer" onClick={() => onEdit(unit)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-lg">
            {unit.unitNumber || `${unit.floor}층`}
          </h4>
          {unit.usageType && (
            <p className="text-sm text-gray-500">{unit.usageType}</p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text} flex items-center gap-1`}>
          <span>{badge.icon}</span>
          <span>{unit.currentStatus}</span>
        </span>
      </div>

      <div className="space-y-2 text-sm">
        {unit.area && (
          <div className="flex justify-between">
            <span className="text-gray-500">면적</span>
            <span className="font-medium">{unit.area}㎡</span>
          </div>
        )}

        {unit.monthlyRent > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">월세</span>
            <span className="font-medium text-primary-600">
              {formatCurrency(unit.monthlyRent)}
            </span>
          </div>
        )}

        {unit.deposit > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">보증금</span>
            <span className="font-medium">{formatCurrency(unit.deposit)}</span>
          </div>
        )}

        {unit.owner && (
          <div className="flex justify-between">
            <span className="text-gray-500">소유자</span>
            <span className="font-medium">{unit.owner.name}</span>
          </div>
        )}

        {unit.tenantName && (
          <div className="flex justify-between">
            <span className="text-gray-500">임차인</span>
            <span className="font-medium">{unit.tenantName}</span>
          </div>
        )}

        {unit.contractEnd && (
          <div className="flex justify-between">
            <span className="text-gray-500">계약만료</span>
            <span className={`font-medium ${
              new Date(unit.contractEnd) < new Date() ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatDate(unit.contractEnd)}
            </span>
          </div>
        )}
      </div>

      {unit.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 line-clamp-2">{unit.notes}</p>
        </div>
      )}
    </div>
  );
};

export default UnitCard;
