const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Units',
      key: 'id'
    }
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Buildings',
      key: 'id'
    }
  },
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  activityType: {
    type: DataTypes.ENUM('방문', '통화', '이메일', '메모', '사진촬영', '기타'),
    allowNull: false
  },
  activityDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nextAction: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '다음 조치 예정일'
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  }
}, {
  timestamps: true
});

module.exports = ActivityLog;
