#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║   🏢 부동산 영업 지원 플랫폼 자동 실행        ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "📌 이 프로그램은 자동으로 서버를 시작합니다."
echo "📌 브라우저가 자동으로 열립니다."
echo "📌 종료하려면 터미널에서 Ctrl+C를 누르세요."
echo ""
echo "🔧 서버를 시작하고 있습니다..."
echo ""

# 백엔드 서버 시작
echo "🔄 백엔드 서버를 시작합니다..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# 5초 대기
sleep 5

# 프론트엔드 서버 시작
echo ""
echo "🔄 프론트엔드 서버를 시작합니다..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 10초 대기
sleep 10

# 브라우저 열기
echo ""
echo "✅ 서버가 시작되었습니다!"
echo "🌐 브라우저를 여는 중..."
echo ""

# Mac에서 기본 브라우저 열기
open http://localhost:3000

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║           프로그램이 실행되었습니다!          ║"
echo "║                                                ║"
echo "║   브라우저 주소: http://localhost:3000        ║"
echo "║                                                ║"
echo "║   종료하려면 이 터미널에서 Ctrl+C를 누르세요  ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# 사용자가 Ctrl+C로 종료할 때까지 대기
trap "echo ''; echo '🛑 서버를 종료합니다...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
