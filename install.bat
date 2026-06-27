@echo off
echo Installing Tejas — AI Operating System...
where node >nul 2>nul || (
  echo Node.js not found. Installing...
  winget install OpenJS.NodeJS
)
cd /d "%~dp0"
npm install
echo.
echo Tejas installed. Run: node bin\tejas.js setup
echo Then: node bin\tejas.js "hello"
pause
