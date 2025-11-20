const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactSchedule = sequelize.define('ContactSchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Contact 시작일'
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Contact 종료일'
    },
    frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly', 'custom'),
      allowNull: false,
      comment: '반복 주기'
    },
    frequency_detail: {
      type: DataTypes.TEXT,
      comment: '반복 상세 설정 (JSON)',
      get() {
        const rawValue = this.getDataValue('frequency_detail');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('frequency_detail', value ? JSON.stringify(value) : null);
      }
    },
    next_contact_date: {
      type: DataTypes.DATEONLY,
      comment: '다음 Contact 예정일'
    },
    preferred_method: {
      type: DataTypes.ENUM('면대면', '유선', '문자', '카톡', '이메일', '기타'),
      comment: '선호 연락 방법'
    },
    alert_settings: {
      type: DataTypes.TEXT,
      comment: '알림 설정 (JSON)',
      get() {
        const rawValue = this.getDataValue('alert_settings');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('alert_settings', value ? JSON.stringify(value) : null);
      }
    },
    expiry_alert: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '종료일 알림'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '활성 상태'
    }
  }, {
    tableName: 'contact_schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['customer_id'] },
      { fields: ['next_contact_date'] }
    ]
  });

  ContactSchedule.associate = (models) => {
    ContactSchedule.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
  };

  return ContactSchedule;
};
