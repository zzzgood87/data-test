const { Sequelize } = require('sequelize');
const path = require('path');

// .env 파일 로드 (작업 디렉토리 기준)
const dotenvPath = path.resolve(process.cwd(), '.env');
require('dotenv').config({ path: dotenvPath });

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
