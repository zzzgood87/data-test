const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactHistory = sequelize.define('ContactHistory', {
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
    contact_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Contact 날짜'
    },
    contact_time: {
      type: DataTypes.TIME,
      comment: 'Contact 시간'
    },
    method: {
      type: DataTypes.ENUM('면대면', '통화', '문자', '카톡', '이메일', 'DM', '기타'),
      comment: 'Contact 방법'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      comment: 'Contact 내용'
    },
    is_important: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '중요 표시'
    },
    auto_reschedule: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '자동 재설정 여부'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '작성자 ID'
    }
  }, {
    tableName: 'contact_histories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['customer_id'] },
      { fields: ['contact_date'] },
      { fields: ['created_by'] }
    ]
  });

  ContactHistory.associate = (models) => {
    ContactHistory.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    ContactHistory.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return ContactHistory;
};
