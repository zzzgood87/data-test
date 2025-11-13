@echo off
chcp 65001 > nul
echo.
echo ╔════════════════════════════════════════════════╗
echo ║   🏢 부동산 영업 지원 플랫폼 자동 실행        ║
echo ╚════════════════════════════════════════════════╝
echo.
echo 📌 이 프로그램은 자동으로 서버를 시작합니다.
echo 📌 브라우저가 자동으로 열립니다.
echo 📌 종료하려면 이 창을 닫으면 됩니다.
echo.
echo 🔧 서버를 시작하고 있습니다...
echo.

REM 백엔드 서버 시작
start "백엔드 서버" cmd /k "cd backend && echo 🔄 백엔드 서버를 시작합니다... && npm run dev"

REM 5초 대기 (백엔드 서버가 시작될 시간)
timeout /t 5 /nobreak > nul

REM 프론트엔드 서버 시작
start "프론트엔드 서버" cmd /k "cd frontend && echo 🔄 프론트엔드 서버를 시작합니다... && npm run dev"

REM 10초 대기 (프론트엔드 서버가 시작될 시간)
timeout /t 10 /nobreak > nul

REM 브라우저 열기
echo.
echo ✅ 서버가 시작되었습니다!
echo 🌐 브라우저를 여는 중...
echo.
start http://localhost:3000

echo.
echo ╔════════════════════════════════════════════════╗
echo ║           프로그램이 실행되었습니다!          ║
echo ║                                                ║
echo ║   브라우저 주소: http://localhost:3000        ║
echo ║                                                ║
echo ║   ⚠️  열린 검은 창들을 닫지 마세요!           ║
echo ║   (최소화는 가능합니다)                       ║
echo ║                                                ║
echo ║   종료하려면 열린 모든 창을 닫으세요          ║
echo ╚════════════════════════════════════════════════╝
echo.
pause
