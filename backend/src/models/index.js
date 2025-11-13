const sequelize = require('../config/database');
const User = require('./User');
const Building = require('./Building');
const Owner = require('./Owner');
const Unit = require('./Unit');
const TransactionHistory = require('./TransactionHistory');
const ActivityLog = require('./ActivityLog');

// 관계 설정
// Building과 Unit
Building.hasMany(Unit, {
  foreignKey: 'buildingId',
  as: 'units'
});
Unit.belongsTo(Building, {
  foreignKey: 'buildingId',
  as: 'building'
});

// Owner와 Unit
Owner.hasMany(Unit, {
  foreignKey: 'ownerId',
  as: 'units'
});
Unit.belongsTo(Owner, {
  foreignKey: 'ownerId',
  as: 'owner'
});

// Unit과 TransactionHistory
Unit.hasMany(TransactionHistory, {
  foreignKey: 'unitId',
  as: 'transactions'
});
TransactionHistory.belongsTo(Unit, {
  foreignKey: 'unitId',
  as: 'unit'
});

// Unit과 ActivityLog
Unit.hasMany(ActivityLog, {
  foreignKey: 'unitId',
  as: 'activities'
});
ActivityLog.belongsTo(Unit, {
  foreignKey: 'unitId',
  as: 'unit'
});

// Building과 ActivityLog
Building.hasMany(ActivityLog, {
  foreignKey: 'buildingId',
  as: 'activities'
});
ActivityLog.belongsTo(Building, {
  foreignKey: 'buildingId',
  as: 'building'
});

// User와 관계
User.hasMany(TransactionHistory, {
  foreignKey: 'agentId',
  as: 'transactions'
});
TransactionHistory.belongsTo(User, {
  foreignKey: 'agentId',
  as: 'agent'
});

User.hasMany(ActivityLog, {
  foreignKey: 'agentId',
  as: 'activities'
});
ActivityLog.belongsTo(User, {
  foreignKey: 'agentId',
  as: 'agent'
});

User.hasMany(Building, {
  foreignKey: 'registeredBy',
  as: 'buildings'
});
Building.belongsTo(User, {
  foreignKey: 'registeredBy',
  as: 'registrant'
});

// 데이터베이스 동기화
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ 데이터베이스 동기화 완료');
  } catch (error) {
    console.error('❌ 데이터베이스 동기화 실패:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Building,
  Owner,
  Unit,
  TransactionHistory,
  ActivityLog,
  syncDatabase
};
