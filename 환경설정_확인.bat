@echo off
chcp 65001 > nul
echo.
echo ════════════════════════════════════════════════
echo    🔧 환경 설정 확인 도구
echo ════════════════════════════════════════════════
echo.

REM .env 파일 확인
if exist backend\.env (
    echo ✅ backend\.env 파일이 존재합니다.
    echo.
    echo 📄 .env 파일 내용:
    echo ----------------------------------------
    type backend\.env
    echo ----------------------------------------
    echo.
    echo ✅ 설정이 완료되었습니다!
    echo    이제 "실행하기.bat" 파일을 실행하세요.
) else (
    echo ❌ backend\.env 파일이 없습니다!
    echo.
    echo 💡 해결 방법:
    echo    1. backend\.env.example 파일을 복사하여 backend\.env 파일을 만드세요
    echo    2. 아래 명령어를 실행하세요:
    echo.
    echo       copy backend\.env.example backend\.env
    echo.
    if exist backend\.env.example (
        echo 🤖 자동으로 생성하시겠습니까? (Y/N^)
        set /p answer=
        if /i "%answer%"=="Y" (
            copy backend\.env.example backend\.env
            echo.
            echo ✅ backend\.env 파일이 생성되었습니다!
            echo    이제 "실행하기.bat" 파일을 실행하세요.
        ) else (
            echo 수동으로 생성해주세요.
        )
    )
)

echo.
pause
