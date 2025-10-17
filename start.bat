@echo off
echo ========================================
echo  AGV Fault Tracker - Quick Start
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python is installed and in PATH
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if packages are installed
python -c "import flask" 2>nul
if errorlevel 1 (
    echo Installing dependencies...
    if exist "packages\" (
        echo Installing from local packages folder (air-gapped mode)...
        pip install --no-index --find-links=packages -r requirements.txt
    ) else (
        echo Installing from internet...
        pip install -r requirements.txt
    )
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Starting AGV Tracker Server...
echo.
echo ========================================
echo  Server will start on http://localhost:5000
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py

pause
