# MongoDB Migration Complete ✅

Your AGV Tracker app now uses MongoDB instead of SQLite!

## What Changed

### Files Modified:
1. **config.py** - MongoDB connection settings
2. **database.py** - MongoDB operations using pymongo
3. **app.py** - API routes now use MongoDB
4. **requirements.txt** - Added pymongo dependency

## Configuration

The MongoDB connection is configured in `config.py`:

```python
MONGO_URL = "mongodb://scriptUser:scriptUser@localhost:27017/?authSource=admin"
DB_NAME = "AGVTracker"
COLLECTION_NAME = "reports"
```

You can override the connection URL using an environment variable:
```bash
$env:MONGO_URL="mongodb://user:pass@your-mongo-host:27017/?authSource=admin"
```

## Quick Start

1. **Install dependencies** (if pymongo not already installed):
   ```powershell
   pip install pymongo==4.6.1
   ```

2. **Make sure MongoDB is running** on your air-gapped computer

3. **Run the app**:
   ```powershell
   python app.py
   ```

## Database Structure

Collection: `reports`

Document structure:
```json
{
  "_id": ObjectId,
  "agvNumber": "string",
  "department": "string",
  "location": "string",
  "responsible": "string",
  "description": "string",
  "timestamp": "ISO datetime",
  "resolved": boolean,
  "createdAt": "ISO datetime"
}
```

## Features Preserved

All original functionality works the same:
- Create, read, update, delete reports
- Filter by department
- Track AGV status
- Mark reports as resolved

The API endpoints remain unchanged, so your frontend will work as-is!
