# 🏢 부동산 영업 지원 플랫폼

부동산 영업 사원들이 현장에서 파악한 정보를 실시간으로 관리할 수 있는 종합 플랫폼입니다.

## 📋 주요 기능

### 🗺️ 지도 기반 부동산 관리
- **카카오맵 통합**: 지도에서 건물 위치 확인 및 클릭으로 상세정보 조회
- **마커 클러스터링**: 많은 건물을 효율적으로 표시
- **실시간 필터링**: 건물 유형, 상태별 필터링

### 🏗️ 건물 정보 관리
- **건물 등록/수정**: 일반건축물, 집합건축물, 토지 구분 관리
- **주소 자동 검색**: 카카오맵 API를 통한 주소 → 좌표 변환
- **상세 정보**: 연면적, 준공년도, 주차대수 등 관리

### 🏢 층별/호수별 관리
- **유닛 단위 관리**: 각 층, 각 호수별 독립적인 데이터 관리
- **임대 현황**: 공실/임대중/자가사용/매물 상태 관리
- **계약 정보**: 임대료, 보증금, 계약기간 추적
- **소유자 정보**: 소유자별 연락처 및 이력 관리

### 📝 영업 활동 기록
- **현장 활동 기록**: 방문, 통화, 이메일 등 영업 활동 즉시 기록
- **타임라인 뷰**: 시간순으로 정리된 활동 이력
- **후속 조치 관리**: 다음 예정 일정 설정 및 알림

### 📊 거래 히스토리
- **거래 내역 추적**: 매매, 임대, 계약갱신 이력 관리
- **가격 변동**: 시간에 따른 가격 변화 추적
- **임차인 이력**: 과거 임차인 정보 보관

### 📱 반응형 디자인
- **모바일 최적화**: 현장에서 스마트폰으로 편리하게 사용
- **태블릿 지원**: 다양한 화면 크기에 최적화
- **터치 인터페이스**: 모바일 친화적인 UI/UX

## 🛠️ 기술 스택

### Backend
- **Node.js** + **Express**: RESTful API 서버
- **Sequelize ORM**: 데이터베이스 관리
- **SQLite**: 개발용 데이터베이스 (프로덕션에서는 PostgreSQL 권장)
- **JWT**: 인증 및 권한 관리
- **bcryptjs**: 비밀번호 암호화

### Frontend
- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구
- **React Router v6**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Kakao Maps API**: 지도 서비스

## 🚀 시작하기

### 사전 요구사항
- Node.js 16.x 이상
- npm 또는 yarn
- 카카오 개발자 계정 (지도 API 키)

### 설치 방법

#### 1. 저장소 클론
```bash
git clone <repository-url>
cd data-test
```

#### 2. Backend 설정
```bash
cd backend
npm install

# .env 파일 수정 (필요시)
# JWT_SECRET을 변경하세요
```

#### 3. Frontend 설정
```bash
cd ../frontend
npm install
```

#### 4. 카카오맵 API 키 설정
1. [카카오 개발자 사이트](https://developers.kakao.com/)에서 앱 생성
2. 웹 플랫폼 추가 및 JavaScript 키 발급
3. `frontend/index.html` 파일에서 `YOUR_KAKAO_APP_KEY`를 발급받은 키로 변경

```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은_키&libraries=services,clusterer"></script>
```

### 실행 방법

#### Backend 서버 실행
```bash
cd backend
npm run dev
# 또는
npm start
```
서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

#### Frontend 개발 서버 실행
```bash
cd frontend
npm run dev
```
프론트엔드는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드
```bash
cd frontend
npm run build
```
빌드된 파일은 `frontend/dist` 폴더에 생성됩니다.

## 📚 API 문서

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 건물 API
- `GET /api/buildings` - 건물 목록 조회
- `GET /api/buildings/:id` - 건물 상세 조회
- `POST /api/buildings` - 건물 등록
- `PUT /api/buildings/:id` - 건물 수정
- `DELETE /api/buildings/:id` - 건물 삭제

### 유닛 API
- `GET /api/units/building/:buildingId` - 특정 건물의 유닛 목록
- `GET /api/units/:id` - 유닛 상세 조회
- `POST /api/units` - 유닛 등록
- `PUT /api/units/:id` - 유닛 수정
- `DELETE /api/units/:id` - 유닛 삭제

### 영업 활동 API
- `GET /api/activities` - 활동 목록 조회
- `POST /api/activities` - 활동 등록
- `PUT /api/activities/:id` - 활동 수정
- `DELETE /api/activities/:id` - 활동 삭제

### 거래 히스토리 API
- `GET /api/transactions` - 거래 목록 조회
- `POST /api/transactions` - 거래 등록
- `PUT /api/transactions/:id` - 거래 수정
- `DELETE /api/transactions/:id` - 거래 삭제

### 소유자 API
- `GET /api/owners` - 소유자 목록 조회
- `GET /api/owners/:id` - 소유자 상세 조회
- `POST /api/owners` - 소유자 등록
- `PUT /api/owners/:id` - 소유자 수정
- `DELETE /api/owners/:id` - 소유자 삭제

## 📁 프로젝트 구조

```
data-test/
├── backend/                 # Backend API 서버
│   ├── src/
│   │   ├── config/         # 데이터베이스 설정
│   │   ├── models/         # Sequelize 모델
│   │   ├── routes/         # API 라우트
│   │   ├── middleware/     # 인증 미들웨어
│   │   └── server.js       # 서버 엔트리 포인트
│   ├── package.json
│   └── .env                # 환경 변수
│
├── frontend/               # Frontend React 앱
│   ├── public/
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── contexts/      # React Context (인증 등)
│   │   ├── services/      # API 서비스
│   │   ├── App.jsx        # 메인 앱 컴포넌트
│   │   └── main.jsx       # 엔트리 포인트
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔐 보안

- **JWT 토큰 기반 인증**: 안전한 세션 관리
- **비밀번호 암호화**: bcryptjs를 사용한 해싱
- **역할 기반 접근 제어**: admin, agent, viewer 역할 구분
- **환경 변수 관리**: 민감한 정보는 .env 파일에 보관

## 🎨 주요 화면

### 로그인 화면
- 이메일/비밀번호 기반 로그인
- 회원가입 페이지 연결

### 대시보드
- 좌측: 카카오맵 기반 지도 뷰
- 우측: 건물 목록 사이드바
- 필터링 옵션 (건물 유형, 상태)

### 건물 상세 페이지
- 건물 기본 정보
- 탭 1: 층별/호수별 유닛 목록
- 탭 2: 영업 활동 기록

### 건물/유닛 등록 폼
- 반응형 폼 레이아웃
- 주소 검색 기능
- 유효성 검사

## 💡 향후 개발 계획

### Phase 1 완료 ✅
- [x] 지도 기반 건물 검색
- [x] 기본 정보 등록/조회
- [x] 소유자 정보 관리
- [x] 영업 활동 기록

### Phase 2 (예정)
- [ ] 사진 업로드 기능
- [ ] 공공 데이터 API 연동 (실거래가, 건축물대장)
- [ ] 알림 시스템
- [ ] 보고서 자동 생성

### Phase 3 (예정)
- [ ] 모바일 앱 (React Native)
- [ ] 음성 메모 기능
- [ ] AI 기반 매물 추천
- [ ] 팀 협업 기능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ for Real Estate Agents**
