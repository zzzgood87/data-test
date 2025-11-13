# 🚀 부동산 영업 지원 플랫폼 설치 가이드

이 가이드는 프로젝트를 처음 시작하는 분들을 위한 상세 설치 및 실행 가이드입니다.

## 📋 목차
1. [사전 요구사항](#사전-요구사항)
2. [카카오맵 API 키 발급](#카카오맵-api-키-발급)
3. [백엔드 설정](#백엔드-설정)
4. [프론트엔드 설정](#프론트엔드-설정)
5. [실행하기](#실행하기)
6. [첫 사용자 등록](#첫-사용자-등록)
7. [문제 해결](#문제-해결)

## 사전 요구사항

다음 프로그램들이 설치되어 있어야 합니다:

### 1. Node.js 설치
- **버전**: 16.x 이상 권장
- **다운로드**: https://nodejs.org/
- **설치 확인**:
  ```bash
  node --version
  npm --version
  ```

### 2. Git 설치 (선택사항)
- **다운로드**: https://git-scm.com/
- **설치 확인**:
  ```bash
  git --version
  ```

## 카카오맵 API 키 발급

### 1. 카카오 개발자 계정 만들기
1. https://developers.kakao.com/ 접속
2. 우측 상단 "로그인" 클릭
3. 카카오 계정으로 로그인 (없으면 회원가입)

### 2. 애플리케이션 등록
1. 로그인 후 "내 애플리케이션" 클릭
2. "애플리케이션 추가하기" 클릭
3. 앱 이름 입력 (예: "부동산 영업 플랫폼")
4. 사업자명 입력 (개인은 이름)
5. "저장" 클릭

### 3. JavaScript 키 확인
1. 생성된 앱 클릭
2. 좌측 메뉴에서 "앱 키" 클릭
3. **"JavaScript 키"** 복사 (이 키를 나중에 사용)

### 4. 플랫폼 등록
1. 좌측 메뉴에서 "플랫폼" 클릭
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 입력:
   - 개발: `http://localhost:3000`
   - 배포 후: 실제 도메인 추가
4. "저장" 클릭

## 백엔드 설정

### 1. 프로젝트 디렉토리 이동
```bash
cd backend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 편집 (선택사항)
# JWT_SECRET을 안전한 값으로 변경하세요
```

**Windows 사용자:**
```cmd
copy .env.example .env
```

### 4. 환경 변수 설명
`.env` 파일을 열어서 다음 값들을 확인/수정:

```env
PORT=5000                    # 백엔드 서버 포트
NODE_ENV=development         # 환경 (development/production)
JWT_SECRET=변경필요!         # 보안을 위해 반드시 변경
JWT_EXPIRE=7d               # 토큰 유효기간 (7일)
DB_DIALECT=sqlite           # 데이터베이스 타입
```

## 프론트엔드 설정

### 1. 프로젝트 디렉토리 이동
```bash
cd ../frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 카카오맵 API 키 설정
`frontend/index.html` 파일을 열어서 다음 부분을 찾아 수정:

**변경 전:**
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&libraries=services,clusterer"></script>
```

**변경 후:** (YOUR_KAKAO_APP_KEY를 발급받은 JavaScript 키로 변경)
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=여기에_발급받은_키_입력&libraries=services,clusterer"></script>
```

예시:
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=abc123def456ghi789jkl012mno345pq&libraries=services,clusterer"></script>
```

## 실행하기

### 방법 1: 터미널 2개 사용 (권장)

**터미널 1 - 백엔드 실행:**
```bash
cd backend
npm run dev
```

성공하면 다음과 같이 표시됩니다:
```
╔════════════════════════════════════════════════╗
║   🏢 부동산 영업 지원 플랫폼 API 서버        ║
║                                                ║
║   포트: 5000                                   ║
║   환경: development                            ║
║   상태: 실행 중                                ║
╚════════════════════════════════════════════════╝
```

**터미널 2 - 프론트엔드 실행:**
```bash
cd frontend
npm run dev
```

성공하면 다음과 같이 표시됩니다:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 방법 2: 백그라운드 실행

**macOS/Linux:**
```bash
# 백엔드 실행
cd backend && npm run dev &

# 프론트엔드 실행
cd frontend && npm run dev
```

### 브라우저에서 접속
웹 브라우저를 열고 다음 주소로 접속:
```
http://localhost:3000
```

## 첫 사용자 등록

### 1. 회원가입
1. 브라우저에서 `http://localhost:3000` 접속
2. "회원가입" 버튼 클릭
3. 정보 입력:
   - 이름: 홍길동
   - 이메일: admin@example.com
   - 전화번호: 010-1234-5678
   - 비밀번호: 안전한 비밀번호 입력
   - 비밀번호 확인: 동일하게 입력
4. "회원가입" 버튼 클릭

### 2. 로그인
회원가입이 완료되면 자동으로 로그인되어 대시보드로 이동합니다.

### 3. 첫 건물 등록
1. 대시보드 우측 하단의 **"+"** 버튼 클릭
2. 건물 정보 입력:
   - 건물명: 예) 삼성타워
   - 주소: 예) 서울시 강남구 테헤란로 123
   - "주소 검색" 버튼 클릭 (좌표 자동 입력)
   - 건물 유형: 일반건축물
   - 총 층수: 10
   - 준공년도: 2020
3. "등록" 버튼 클릭

### 4. 유닛(층/호수) 추가
1. 등록된 건물 클릭
2. "층별 정보" 탭에서 "+ 유닛 추가" 클릭
3. 유닛 정보 입력:
   - 층수: 5
   - 호수: 501호
   - 면적: 85.5
   - 용도: 사무실
   - 현재 상태: 공실 또는 임대중
4. "등록" 버튼 클릭

### 5. 영업 활동 기록
1. 건물 상세 페이지에서 "영업 활동" 탭 클릭
2. "+ 활동 기록" 버튼 클릭
3. 활동 정보 입력:
   - 활동 유형: 방문
   - 활동 내용: 현장 방문하여 건물 상태 확인
   - 다음 조치 예정일: 원하는 날짜 선택
4. "등록" 버튼 클릭

## 문제 해결

### 백엔드 서버가 시작되지 않아요
**증상**: `Error: Cannot find module ...`

**해결방법**:
```bash
cd backend
rm -rf node_modules
npm install
```

### 프론트엔드가 백엔드에 연결되지 않아요
**증상**: 로그인 시 "Network Error"

**해결방법**:
1. 백엔드 서버가 실행 중인지 확인 (`http://localhost:5000/health`)
2. `frontend/vite.config.js` 확인:
   ```javascript
   server: {
     port: 3000,
     proxy: {
       '/api': {
         target: 'http://localhost:5000',  // 백엔드 주소
         changeOrigin: true
       }
     }
   }
   ```

### 지도가 표시되지 않아요
**증상**: 지도 영역이 빈 화면

**해결방법**:
1. 브라우저 콘솔 확인 (F12)
2. 카카오맵 API 키가 올바른지 확인
3. `frontend/index.html`의 스크립트 태그 확인
4. 카카오 개발자 사이트에서 플랫폼 등록 확인

### 주소 검색이 안돼요
**증상**: "주소 검색" 버튼 클릭 시 실패

**해결방법**:
1. 카카오맵 API 키에 `services` 라이브러리가 포함되어 있는지 확인
2. `index.html`:
   ```html
   ?appkey=YOUR_KEY&libraries=services,clusterer
   ```

### 데이터베이스 오류
**증상**: `SQLITE_ERROR: ...`

**해결방법**:
```bash
cd backend
rm database.sqlite  # 기존 데이터베이스 삭제
npm run dev         # 서버 재시작 (자동으로 재생성)
```

### 포트가 이미 사용 중이에요
**증상**: `Error: listen EADDRINUSE: address already in use :::5000`

**해결방법**:

**macOS/Linux:**
```bash
# 5000번 포트를 사용하는 프로세스 찾기
lsof -i :5000

# 프로세스 종료 (PID는 위에서 확인한 번호)
kill -9 PID
```

**Windows:**
```cmd
# 5000번 포트를 사용하는 프로세스 찾기
netstat -ano | findstr :5000

# 프로세스 종료 (PID는 위에서 확인한 번호)
taskkill /PID PID번호 /F
```

또는 `.env` 파일에서 포트 변경:
```env
PORT=5001
```

## 🎉 완료!

축하합니다! 부동산 영업 지원 플랫폼이 성공적으로 설치되고 실행되었습니다.

### 다음 단계
- 건물과 유닛을 더 추가해보세요
- 영업 활동을 기록해보세요
- 모바일에서도 접속해보세요 (같은 네트워크에서 `http://컴퓨터IP:3000`)
- 팀원을 초대하여 함께 사용해보세요

### 추가 도움이 필요하신가요?
- 프로젝트 이슈 등록: GitHub Issues
- README.md 참고
- API 문서 참고

**즐거운 부동산 영업 되세요! 🏢**
