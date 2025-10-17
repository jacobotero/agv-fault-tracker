#!/usr/bin/env python3
"""MongoDB Configuration"""
import os

# MongoDB Configuration
MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://scriptUser:scriptUser@localhost:27017/?authSource=admin",
)
DB_NAME = "Battery"
COLLECTION_NAME = "AGVTracker"
