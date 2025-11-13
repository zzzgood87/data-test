const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

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
