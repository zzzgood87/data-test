const { Sequelize } = require('sequelize');
const path = require('path');

// .env 파일 경로를 명시적으로 지정
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
  }
};

testConnection();

module.exports = sequelize;
