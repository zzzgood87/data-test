const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransactionHistory = sequelize.define('TransactionHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Units',
      key: 'id'
    }
  },
  transactionType: {
    type: DataTypes.ENUM('매매', '임대', '계약갱신', '계약만료', '공실'),
    allowNull: false
  },
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '거래가격 또는 월 임대료 (원)'
  },
  deposit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '보증금 (원)'
  },
  tenantName: {
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
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = TransactionHistory;
