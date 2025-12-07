@echo off
echo Installing Supabase client...
cd /d "%~dp0"
call npm install @supabase/supabase-js
echo.
echo Installation complete!
pause
