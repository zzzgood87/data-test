const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 라우트
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const contactScheduleRoutes = require('./routes/contact-schedules');
const contactHistoryRoutes = require('./routes/contact-histories');
const statisticRoutes = require('./routes/statistics');
const todoRoutes = require('./routes/todos');

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contact-schedules', contactScheduleRoutes);
app.use('/api/contact-histories', contactHistoryRoutes);
app.use('/api/statistics', statisticRoutes);
app.use('/api/todos', todoRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '부동산 CRM 시스템 API 서버가 정상 작동 중입니다',
    timestamp: new Date().toISOString()
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 API 엔드포인트를 찾을 수 없습니다'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 내부 오류가 발생했습니다',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 데이터베이스 초기화 및 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await db.initialize();

    // 서버 시작
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🏢 부동산 CRM 시스템 API 서버');
      console.log('='.repeat(50));
      console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다`);
      console.log(`📍 API 주소: http://localhost:${PORT}/api`);
      console.log(`🏥 헬스 체크: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50));
      console.log('\n사용 가능한 API 엔드포인트:');
      console.log('  [인증]');
      console.log('    POST   /api/auth/register     - 회원가입');
      console.log('    POST   /api/auth/login        - 로그인');
      console.log('    GET    /api/auth/me           - 현재 사용자 정보');
      console.log('\n  [고객 관리]');
      console.log('    GET    /api/customers         - 고객 목록');
      console.log('    GET    /api/customers/:id     - 고객 상세');
      console.log('    POST   /api/customers         - 고객 등록');
      console.log('    PUT    /api/customers/:id     - 고객 수정');
      console.log('    DELETE /api/customers/:id     - 고객 삭제');
      console.log('    POST   /api/customers/batch-delete - 고객 일괄 삭제');
      console.log('\n  [Contact 일정]');
      console.log('    POST   /api/contact-schedules - Contact 일정 생성');
      console.log('    GET    /api/contact-schedules/date/:date - 특정 날짜 일정');
      console.log('    PUT    /api/contact-schedules/:id - 일정 수정');
      console.log('    POST   /api/contact-schedules/:customerId/postpone - 미루기');
      console.log('\n  [Contact 이력]');
      console.log('    GET    /api/contact-histories/customer/:customerId - 고객별 이력');
      console.log('    POST   /api/contact-histories - Contact 이력 추가');
      console.log('    PUT    /api/contact-histories/:id - 이력 수정');
      console.log('    DELETE /api/contact-histories/:id - 이력 삭제');
      console.log('\n  [통계]');
      console.log('    GET    /api/statistics/dashboard - 대시보드 통계');
      console.log('    GET    /api/statistics/customers - 고객 관리 통계');
      console.log('    GET    /api/statistics/weekly  - 주간 통계');
      console.log('    GET    /api/statistics/monthly - 월간 통계');
      console.log('    GET    /api/statistics/yearly  - 연간 통계');
      console.log('\n  [할 일]');
      console.log('    GET    /api/todos             - To-do 목록');
      console.log('    POST   /api/todos             - To-do 추가');
      console.log('    PUT    /api/todos/:id         - To-do 수정');
      console.log('    PATCH  /api/todos/:id/complete - To-do 완료 처리');
      console.log('    DELETE /api/todos/:id         - To-do 삭제');
      console.log('    POST   /api/todos/reorder     - To-do 순서 변경');
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
