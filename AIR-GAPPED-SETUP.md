# AIR-GAPPED COMPUTER SETUP

## Before You Transfer (On Internet Computer)

### Step 1: Download Dependencies
```powershell
cd y:\services\agv-tracker
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Download packages for offline installation
New-Item -ItemType Directory -Force -Path packages
pip download -r requirements.txt -d packages
```

### Step 2: Copy to Air-Gapped Computer
Copy the **entire `agv-tracker` folder** to the air-gapped computer via network share (including `packages/` folder)

Example: Copy from `y:\services\agv-tracker` to `C:\AGV-Tracker\` on air-gapped computer

---

## On Air-Gapped Computer

### Simple Method (Recommended):
1. Copy the `agv-tracker` folder to the air-gapped computer (e.g., to `C:\AGV-Tracker\`)
2. Open the folder
3. **Double-click `start.bat`**
4. Done! The server will start automatically

The `start.bat` will automatically:
- Create the virtual environment
- Install all dependencies from the local `packages/` folder (no internet needed)
- Start the server on http://localhost:5000

### Manual Method (Advanced):
If you prefer to do it manually:

```powershell
cd C:\AGV-Tracker

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install from local packages (NO INTERNET NEEDED)
pip install --no-index --find-links=packages -r requirements.txt

# Run the server
python app.py
```

### Step 4: Configure for Network Access (Optional)

If you want others to access it:

1. Find your IP address:
```powershell
ipconfig
```

2. Edit `static\js\storage.js` line 4:
```javascript
const API_URL = 'http://YOUR_IP_HERE:5000/api';
```

3. Share this URL with coworkers: `http://YOUR_IP_HERE:5000`

---

## Quick Checklist for Air-Gapped Computer

Before running `start.bat`, make sure:
- [ ] Python is installed on the air-gapped computer
- [ ] The entire `agv-tracker` folder has been copied over
- [ ] The `packages/` folder contains `.whl` files
- [ ] You're in the correct directory

Then just double-click `start.bat` and you're done!

---

## Files Needed to Transfer

Entire `agv-tracker` folder including:
- `app.py`
- `requirements.txt`
- `start.bat`
- `packages/` (folder with downloaded dependencies - *.whl files)
- `templates/` folder
- `static/` folder
- `README.md`
- All other Python files (*.py)

Do NOT need to transfer:
- `venv/` from internet computer (will create fresh on air-gapped)
- `agv_tracker.db` (will be created automatically)
- `__pycache__/` folders

---

## Troubleshooting

### "Python is not recognized"
Python needs to be installed on the air-gapped computer first.
Get Python installer from: https://www.python.org/downloads/
Transfer installer via USB.

### "Cannot activate venv"
Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Dependencies won't install
Make sure you're in the right directory and `packages/` folder exists:
```powershell
dir packages  # Should show .whl files
```

---

## Keep Server Running 24/7

### Option 1: Minimize Window
Just minimize the PowerShell window - don't close it

### Option 2: Background Process
Create `start_background.bat`:
```batch
@echo off
cd /d "%~dp0"
call venv\Scripts\activate.bat
start /B pythonw app.py
```

Double-click to run in background.

### Option 3: Startup Script
1. Press `Win + R`, type `shell:startup`
2. Create shortcut to `start.bat` in that folder
3. Server starts automatically on computer boot

---

## Quick Reference

**Start Server:** `python app.py` or double-click `start.bat`  
**Stop Server:** Press `Ctrl + C`  
**Access Locally:** http://localhost:5000  
**Access from Network:** http://YOUR_IP:5000  
**Backup Database:** Copy `agv_tracker.db` file
