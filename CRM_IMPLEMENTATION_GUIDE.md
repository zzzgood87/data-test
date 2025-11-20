# 부동산 CRM 시스템 구현 가이드

## 🎉 구현 완료 사항

### Backend API (완료 ✅)

#### 1. 데이터베이스 모델
다음 모델들이 Sequelize를 사용하여 구현되었습니다:
- **User** - 사용자 정보 (admin, team_leader, user 역할 지원)
- **Customer** - 고객 정보 (코드 자동 생성: `username-YY-0001`)
- **ContactSchedule** - Contact 일정 관리 (반복 주기 설정)
- **ContactHistory** - Contact 이력 (자동 재설정 지원)
- **Todo** - 할 일 관리
- **Statistic** - 통계 데이터 (일간/주간/월간)

#### 2. API 엔드포인트

**인증 API** (`/api/auth`)
- `POST /register` - 회원가입
- `POST /login` - 로그인 (JWT 토큰 발급)
- `GET /me` - 현재 사용자 정보

**고객 관리 API** (`/api/customers`)
- `GET /` - 고객 목록 (페이지네이션, 필터링, 검색)
- `GET /:id` - 고객 상세
- `POST /` - 고객 등록
- `PUT /:id` - 고객 수정
- `DELETE /:id` - 고객 삭제
- `POST /batch-delete` - 고객 일괄 삭제

**Contact 일정 API** (`/api/contact-schedules`)
- `POST /` - Contact 일정 생성
- `GET /date/:date` - 특정 날짜 일정 조회
- `PUT /:id` - 일정 수정
- `POST /:customerId/postpone` - Contact 미루기

**Contact 이력 API** (`/api/contact-histories`)
- `GET /customer/:customerId` - 고객별 이력 조회
- `POST /` - Contact 이력 추가 (자동 통계 업데이트)
- `PUT /:id` - 이력 수정
- `DELETE /:id` - 이력 삭제

**통계 API** (`/api/statistics`)
- `GET /dashboard` - 대시보드 통계
- `GET /customers` - 고객 관리 통계
- `GET /weekly` - 주간 통계
- `GET /monthly` - 월간 통계
- `GET /yearly` - 연간 통계

**Todo API** (`/api/todos`)
- `GET /` - To-do 목록
- `POST /` - To-do 추가
- `PUT /:id` - To-do 수정
- `PATCH /:id/complete` - To-do 완료 토글
- `DELETE /:id` - To-do 삭제
- `POST /reorder` - To-do 순서 변경 (드래그 앤 드롭)

#### 3. 주요 기능

**고객 코드 자동 생성**
```javascript
// 형식: username-YY-0001
// 예시: ldhyun-24-0001, ldhyun-24-0002, ...
```

**다음 Contact 날짜 계산**
```javascript
// 지원하는 반복 주기:
// - daily: 매일
// - weekly: 매주 특정 요일
// - monthly: 매월 특정 일
// - yearly: 매년 특정 날짜
// - custom: 사용자 정의 (N일마다)
```

**자동 통계 업데이트**
- Contact 기록 시 자동으로 daily 통계 업데이트
- 신규 고객 등록 시 통계 증가

### Frontend (Redux Store & API 레이어 완료 ✅)

#### 1. Redux Toolkit 상태 관리
- **authSlice** - 인증 상태 (로그인, 회원가입, 사용자 정보)
- **customerSlice** - 고객 관리 (CRUD, 페이지네이션)
- **statisticSlice** - 통계 데이터
- **todoSlice** - 할 일 관리

#### 2. API 서비스 레이어
완전한 타입의 API 클라이언트:
- Axios 인터셉터로 자동 토큰 추가
- 401 에러 시 자동 로그아웃 처리
- 모든 백엔드 API 엔드포인트 매핑

#### 3. 패키지 설치 완료
```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "react-redux": "^9.0.0",
  "@mui/material": "^5.0.0",
  "@mui/icons-material": "^5.0.0",
  "recharts": "^2.0.0",
  "date-fns": "^2.0.0"
}
```

---

## 🚀 서버 실행 방법

### Backend 서버 시작

```bash
cd backend
npm install  # 이미 완료됨
npm start
```

서버 실행 확인:
```bash
curl http://localhost:5000/api/health
```

### 기본 관리자 계정
```
Username: admin
Password: admin1234
```

### 로그인 테스트
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'
```

---

## 📁 프로젝트 구조

```
data-test/
├── backend/                      # Backend API 서버
│   ├── src/
│   │   ├── models/              # Sequelize 모델
│   │   │   ├── User.js
│   │   │   ├── Customer.js
│   │   │   ├── ContactSchedule.js
│   │   │   ├── ContactHistory.js
│   │   │   ├── Todo.js
│   │   │   ├── Statistic.js
│   │   │   └── index.js
│   │   ├── routes/              # API 라우트
│   │   │   ├── auth.js
│   │   │   ├── customers.js
│   │   │   ├── contact-schedules.js
│   │   │   ├── contact-histories.js
│   │   │   ├── statistics.js
│   │   │   └── todos.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT 인증 미들웨어
│   │   └── server.js            # Express 서버
│   └── database.sqlite          # SQLite 데이터베이스 (자동 생성)
│
├── frontend/                     # Frontend React 앱
│   ├── src/
│   │   ├── store/               # Redux Store
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── customerSlice.js
│   │   │       ├── statisticSlice.js
│   │   │       └── todoSlice.js
│   │   ├── services/
│   │   │   └── api.js           # API 클라이언트
│   │   ├── components/          # 컴포넌트 (추가 구현 필요)
│   │   └── pages/               # 페이지 (추가 구현 필요)
│   └── package.json
│
└── database/
    └── schema.sql               # 데이터베이스 스키마 문서
```

---

## 🎯 다음 단계: Frontend UI 개발

다음 작업들이 필요합니다:

### 1. 기본 레이아웃 컴포넌트
```jsx
// src/components/common/Layout.jsx
// src/components/common/Header.jsx
// src/components/common/Sidebar.jsx
// src/components/common/Navigation.jsx
```

### 2. 페이지 컴포넌트

**로그인 페이지** (`src/pages/LoginPage.jsx`)
- Material-UI 폼 사용
- Redux authSlice와 연동
- 로그인 성공 시 대시보드로 이동

**대시보드** (`src/pages/DashboardPage.jsx`)
```jsx
// 표시할 정보:
// - 통계 카드 4개 (신규 고객, Contact 활동, 오늘 Contact 예정, 할 일)
// - 오늘 연락할 고객 리스트
// - 동기부여 메시지
```

**고객 DB** (`src/pages/CustomerListPage.jsx`)
```jsx
// Material-UI Table 사용
// - 페이지네이션
// - 정렬 (Contact 도래일, 등록일 등)
// - 필터링 (상태, Contact 관리 여부)
// - 검색 (이름, 전화번호, 코드)
// - 배지 표시 (NEW, SOON, N일 지남)
```

**고객 등록/수정** (`src/pages/CustomerFormPage.jsx`)
```jsx
// 탭 구성:
// - 기본 정보
// - 세부 정보
// - CONTACT 관리
// - CONTACT 기록
```

**통계 페이지** (`src/pages/StatisticsPage.jsx`)
```jsx
// Recharts를 사용한 차트
// - 고객 관리 통계
// - 활동 관리 통계 (주간/월간/연간)
```

**일정 관리** (`src/pages/SchedulePage.jsx`)
```jsx
// - To-do List (드래그 앤 드롭)
// - Contact 일정 캘린더
```

### 3. App.jsx 라우팅 설정

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import StatisticsPage from './pages/StatisticsPage';
import SchedulePage from './pages/SchedulePage';

const theme = createTheme({
  palette: {
    primary: { main: '#2196F3' },
    secondary: { main: '#4CAF50' },
    warning: { main: '#FF9800' },
    error: { main: '#F44336' },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
```

---

## 💡 주요 기능 구현 팁

### 1. Contact 도래일 배지 로직
```javascript
function getContactBadge(nextContactDate) {
  const today = new Date();
  const contactDate = new Date(nextContactDate);
  const diffDays = Math.floor((contactDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'NEW', color: 'error' };
  } else if (diffDays >= -3 && diffDays < 0) {
    return { label: 'SOON', color: 'warning' };
  } else if (diffDays < -3) {
    return { label: `${Math.abs(diffDays)}일 지남`, color: 'default' };
  }
  return null;
}
```

### 2. 고객 목록 정렬 우선순위
```javascript
// 1순위: active + contact_management = true
// 2순위: active + contact_management = false
// 3순위: inactive
// 각 그룹 내에서 next_contact_date 오름차순
```

### 3. 동기부여 메시지
```javascript
function getMotivationMessage(stats, userName) {
  return `${userName}님은 오늘 ${stats.today.new_customers}명의 신규 고객을 등록했어요!
이번주 누적 ${stats.weekly.new_customers}명의 신규 고객을 등록했고,
${new Date().getMonth() + 1}월 누적 총 ${stats.monthly.new_customers}명을 등록하셨네요!`;
}
```

---

## 🔒 보안 고려사항

1. **JWT 토큰 관리**
   - 토큰은 localStorage에 저장
   - 모든 API 요청에 자동으로 포함
   - 401 에러 시 자동 로그아웃

2. **비밀번호 보안**
   - bcrypt로 암호화 (saltRounds: 10)
   - 클라이언트는 평문 비밀번호만 전송

3. **환경 변수**
   - JWT_SECRET을 .env에 저장
   - 프로덕션에서는 반드시 변경 필요

---

## 📊 데이터베이스

- **개발 환경**: SQLite (backend/database.sqlite)
- **프로덕션 권장**: PostgreSQL 또는 MySQL

마이그레이션 없이 Sequelize의 `sync({ alter: true })` 사용 중.
프로덕션에서는 마이그레이션 도구 사용 권장.

---

## 🎨 UI/UX 가이드라인

### 색상 스키마
```javascript
primary: '#2196F3'      // 파란색 - 주요 액션
secondary: '#4CAF50'    // 녹색 - 성공, 활성
warning: '#FF9800'      // 주황색 - 경고, SOON
error: '#F44336'        // 빨간색 - 오류, 긴급
inactive: '#9E9E9E'     // 회색 - 비활성
```

### 반응형 브레이크포인트
- **모바일**: < 768px
- **태블릿**: 768px ~ 1919px
- **데스크톱**: >= 1920px

---

## ✅ 완료된 핵심 기능

1. ✅ 완전한 RESTful API 구조
2. ✅ JWT 기반 인증 시스템
3. ✅ 고객 코드 자동 생성
4. ✅ Contact 주기 계산 알고리즘
5. ✅ 자동 통계 업데이트
6. ✅ Redux Toolkit 상태 관리
7. ✅ 포괄적인 API 서비스 레이어
8. ✅ 에러 처리 및 인터셉터

---

## 🚧 추가 구현 필요 사항

### Frontend UI
- [ ] 로그인 페이지
- [ ] 대시보드 페이지
- [ ] 고객 목록/등록/수정 페이지
- [ ] 통계 및 차트 페이지
- [ ] 일정 관리 페이지
- [ ] 공통 컴포넌트 (Header, Sidebar, Table 등)

### 기능 개선
- [ ] 파일 업로드 (고객 사진)
- [ ] 알림 시스템
- [ ] 엑셀 내보내기/가져오기
- [ ] 고급 검색 필터
- [ ] 인쇄용 보고서

### 테스트
- [ ] 단위 테스트 (Jest)
- [ ] E2E 테스트 (Cypress)
- [ ] API 문서화 (Swagger)

---

## 📞 문의 및 지원

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

**개발 환경에서 테스트 완료**
- Backend API 서버: ✅ 정상 작동
- 데이터베이스 초기화: ✅ 완료
- 로그인 API: ✅ 테스트 완료
- 헬스 체크: ✅ 정상

---

**Made with ❤️ for Real Estate CRM**
