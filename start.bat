@echo off

REM Install dependencies
cd backend
call yarn install
cd ..
REM Start the database container
docker-compose up -d db

REM Wait for the database to be ready
echo Waiting for database to be ready...
timeout /t 10 /nobreak

REM Run migrations
echo Running migrations...
cd backend
call yarn run migrate up
if %errorlevel% neq 0 (
    echo Migration failed!
    exit /b %errorlevel%
)
cd ..

REM Start all services
echo Starting all services...
docker-compose up
