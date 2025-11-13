@echo off
chcp 65001 > nul
echo 🔧 .env 파일 생성 중...
echo.

cd /d "%~dp0backend"

(
echo PORT=5000
echo NODE_ENV=development
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-real-estate-2024
echo JWT_EXPIRE=7d
echo DB_NAME=real_estate_db
echo DB_USER=admin
echo DB_PASS=admin123
echo DB_HOST=localhost
echo DB_DIALECT=sqlite
) > .env

echo ✅ backend\.env 파일이 생성되었습니다!
echo.
echo 📄 파일 내용:
echo ----------------------------------------
type .env
echo ----------------------------------------
echo.
echo ✅ 완료! 이제 npm run dev 를 다시 실행하세요.
echo.
pause
