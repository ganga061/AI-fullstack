@echo off
echo ============================================
echo  Influencer Affiliate Platform - Startup
echo ============================================
echo.
echo [1/2] Starting Backend (Node.js on port 5000)...
start "Backend Server" cmd /k "cd /d c:\Users\ASUS\OneDrive\Desktop\AI full-stack\backend && node server.js"
timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (Vite on port 5173)...
start "Frontend Dev Server" cmd /k "cd /d c:\Users\ASUS\OneDrive\Desktop\AI full-stack\frontend && npm run dev"

echo.
echo ============================================
echo  Both servers are starting!
echo  Open: http://localhost:5173
echo.
echo  Test Accounts:
echo   Admin:      admin@test.com / admin123
echo   Influencer: influencer@test.com / pass123
echo ============================================
pause
