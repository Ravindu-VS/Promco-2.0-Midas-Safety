@echo off
echo Starting Promco 2.0 Application...

REM Open a new terminal window for the backend
start cmd /k "cd backend && dotnet run"

REM Wait for the backend to start
timeout /t 5 /nobreak

REM Open a new terminal window for the frontend
start cmd /k "cd frontend && npm start"

echo Both backend and frontend are starting up...
echo Backend:  http://localhost:5000  (Swagger: http://localhost:5000/swagger)
echo Frontend: http://localhost:3000
