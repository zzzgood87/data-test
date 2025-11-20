const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Buildings',
      key: 'id'
    }
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '층수'
  },
  unitNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '호수 (예: 501호)'
  },
  area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '전용면적 (㎡)'
  },
  usageType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '용도 (사무실, 상가, 주거 등)'
  },
  currentStatus: {
    type: DataTypes.ENUM('공실', '임대중', '자가사용', '매물'),
    defaultValue: '공실'
  },
  monthlyRent: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '월 임대료 (원)'
  },
  deposit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '보증금 (원)'
  },
  maintenanceFee: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '관리비 (원)'
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Owners',
      key: 'id'
    }
  },
  tenantName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '현재 임차인'
  },
  tenantPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contractStart: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  contractEnd: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Unit;
