const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// .env 파일 로드 (작업 디렉토리 = backend)
// Windows와 Linux/Mac 모두에서 작동하도록 절대 경로 사용
const dotenvPath = path.resolve(process.cwd(), '.env');

console.log('📂 .env 파일 경로:', dotenvPath);
console.log('📂 작업 디렉토리:', process.cwd());

// .env 파일이 없으면 자동으로 생성
if (!fs.existsSync(dotenvPath)) {
  console.log('⚠️  .env 파일이 없습니다. 자동으로 생성합니다...');

  const defaultEnvContent = `PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-real-estate-2024
JWT_EXPIRE=7d
DB_NAME=real_estate_db
DB_USER=admin
DB_PASS=admin123
DB_HOST=localhost
DB_DIALECT=sqlite
`;

  try {
    fs.writeFileSync(dotenvPath, defaultEnvContent, 'utf8');
    console.log('✅ .env 파일이 생성되었습니다!');
  } catch (error) {
    console.error('❌ .env 파일 생성 실패:', error.message);
    console.error('💡 수동으로 생성해주세요: backend\\.env');
    process.exit(1);
  }
}

// .env 파일 로드
require('dotenv').config({ path: dotenvPath });

// 환경 변수 확인
if (!process.env.JWT_SECRET) {
  console.error('\n❌ 오류: JWT_SECRET 환경 변수가 설정되지 않았습니다!');
  console.error('💡 해결 방법:');
  console.error('   1. .env 파일 내용을 확인하세요:', dotenvPath);
  console.error('   2. 서버를 재시작하세요 (Ctrl+C 후 npm run dev)');
  process.exit(1);
}

console.log('✅ 환경 변수 로드 완료');
console.log(`   - PORT: ${process.env.PORT || 5000}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? '설정됨 ✓' : '미설정 ✗'}`);
console.log('');

const { syncDatabase } = require('./models');

const authRoutes = require('./routes/auth');
const buildingRoutes = require('./routes/buildings');
const unitRoutes = require('./routes/units');
const activityRoutes = require('./routes/activities');
const transactionRoutes = require('./routes/transactions');
const ownerRoutes = require('./routes/owners');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/owners', ownerRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '부동산 영업 지원 플랫폼 API 서버' });
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({ error: '요청한 경로를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 동기화
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║   🏢 부동산 영업 지원 플랫폼 API 서버        ║
║                                                ║
║   포트: ${PORT}                                ║
║   환경: ${process.env.NODE_ENV || 'development'}                      ║
║   상태: 실행 중                                ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
