# AGV Fault Tracker

A full-stack web application for tracking and managing AGV (Automated Guided Vehicle) faults in a manufacturing environment. Built with Python Flask backend, MongoDB database, and vanilla JavaScript frontend.

## Features

- Submit and track fault reports for AGVs
- Organize reports by department (Maintenance, Production, Engineering, etc.)
- Mark reports as resolved with automatic status updates
- Search and filter reports by AGV number
- Duplicate detection prevents multiple open reports for the same AGV
- Responsive UI with real-time updates
- Air-gapped deployment support for offline/isolated environments

## Tech Stack

- **Backend:** Python 3.7+, Flask, Flask-CORS
- **Database:** MongoDB (local or MongoDB Atlas)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Deployment:** Supports standard and air-gapped environments

## Quick Start

### Prerequisites
- Python 3.7+
- MongoDB (Docker, local installation, or MongoDB Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd agv-tracker
```

2. **Set up MongoDB** (choose one option)
```bash
# Option 1: Docker (recommended)
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Option 2: MongoDB Atlas - get connection string from atlas.mongodb.com
# Option 3: Local installation - download from mongodb.com
```

3. **Install dependencies**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app.py
```

5. **Open in browser:** http://localhost:5000

### Quick Start (Windows)
Simply double-click `start.bat` to automatically set up and run the application.

## Project Structure

```
agv-tracker/
├── app.py                 # Flask application and API routes
├── database.py            # MongoDB database operations
├── config.py              # Configuration management
├── requirements.txt       # Python dependencies
├── start.bat             # Windows quick start script
├── templates/            # HTML templates
│   ├── index.html        # Home page (AGV number input)
│   ├── report.html       # Report submission form
│   ├── log.html          # Active reports view
│   ├── resolved.html     # Resolved reports view
│   └── details.html      # Report details popup
└── static/               # CSS and JavaScript
    ├── css/styles.css
    └── js/
        ├── storage.js    # API client
        ├── app.js        # Home page logic
        ├── report.js     # Report form logic
        ├── log.js        # Active reports logic
        ├── resolved.js   # Resolved reports logic
        └── details.js    # Details popup logic
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and database status |
| GET | `/api/reports` | Get all reports |
| GET | `/api/reports/:id` | Get specific report by ID |
| POST | `/api/reports` | Create new report |
| PUT | `/api/reports/:id` | Update report (mark as resolved) |
| DELETE | `/api/reports/:id` | Delete report |

## Air-Gapped Deployment

For deployment in isolated/offline environments:

1. Download dependencies on internet-connected machine:
```bash
pip download -r requirements.txt -d packages
```

2. Transfer entire project folder to target machine

3. Install from local packages:
```bash
pip install --no-index --find-links=packages -r requirements.txt
```

See [AIR-GAPPED-SETUP.md](AIR-GAPPED-SETUP.md) for detailed instructions.

## Network Deployment

To share with other users on the same network:

1. Find your IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `static/js/storage.js` with your IP
3. Share URL: `http://YOUR_IP:5000`
4. Allow through firewall if prompted

## Configuration

Create `.env` file to customize settings:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=AGVTracker
FLASK_DEBUG=False
PORT=5000
```
