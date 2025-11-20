const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Statistic = sequelize.define('Statistic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '통계 날짜'
    },
    new_customers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '신규 고객 수'
    },
    contact_activities: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Contact 활동 수'
    },
    type: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
      allowNull: false,
      comment: '통계 유형'
    }
  }, {
    tableName: 'statistics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['date'] },
      { fields: ['type'] },
      {
        unique: true,
        fields: ['user_id', 'date', 'type']
      }
    ]
  });

  Statistic.associate = (models) => {
    Statistic.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Statistic;
};
