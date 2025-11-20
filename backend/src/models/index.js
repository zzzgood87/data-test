const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// 데이터베이스 연결 설정
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true
  }
});

const db = {};

// 모델 파일들을 동적으로 로드
const modelFiles = [
  'User.js',
  'Customer.js',
  'ContactSchedule.js',
  'ContactHistory.js',
  'Todo.js',
  'Statistic.js'
];

modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize);
  db[model.name] = model;
});

// 연관관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 데이터베이스 초기화 함수
db.initialize = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');

    // 테이블 동기화 (개발 환경에서만 force: true 사용 주의)
    await sequelize.sync({ alter: true });
    console.log('✅ 데이터베이스 테이블 동기화 완료');

    // 기본 관리자 계정 생성
    await createDefaultAdmin();

    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
};

// 기본 관리자 계정 생성
async function createDefaultAdmin() {
  const bcrypt = require('bcryptjs');

  try {
    const adminExists = await db.User.findOne({ where: { username: 'admin' } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin1234', 10);
      await db.User.create({
        username: 'admin',
        password: hashedPassword,
        name: '관리자',
        email: 'admin@example.com',
        role: 'admin'
      });
      console.log('✅ 기본 관리자 계정 생성 완료 (admin/admin1234)');
    }
  } catch (error) {
    console.error('❌ 기본 관리자 계정 생성 실패:', error);
  }
}

module.exports = db;
