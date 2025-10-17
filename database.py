#!/usr/bin/env python3
"""MongoDB Database Operations"""
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.collection import Collection
from bson import ObjectId
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import config


class Database:
    """MongoDB Database Handler"""
    
    def __init__(self):
        self.client = MongoClient(config.MONGO_URL)
        self.db = self.client[config.DB_NAME]
        self.collection: Collection = self.db[config.COLLECTION_NAME]
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Create indexes for better query performance"""
        self.collection.create_index([("createdAt", DESCENDING)], background=True)
        self.collection.create_index([("department", ASCENDING)], background=True)
        self.collection.create_index([("agvNumber", ASCENDING)], background=True)
        self.collection.create_index([("resolved", ASCENDING)], background=True)
    
    def close(self):
        """Close MongoDB connection"""
        self.client.close()
    
    def _doc_to_dict(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to API-friendly dictionary"""
        if doc is None:
            return None
        
        doc['_id'] = str(doc['_id'])
        doc['id'] = doc['_id']  # For backward compatibility
        return doc
    
    def get_all_reports(self) -> List[Dict[str, Any]]:
        """Get all reports ordered by creation date (newest first)"""
        cursor = self.collection.find().sort([("createdAt", DESCENDING)])
        return [self._doc_to_dict(doc) for doc in cursor]
    
    def get_report_by_id(self, report_id: str) -> Optional[Dict[str, Any]]:
        """Get single report by ID"""
        try:
            doc = self.collection.find_one({"_id": ObjectId(report_id)})
            return self._doc_to_dict(doc) if doc else None
        except Exception:
            return None
    
    def get_reports_by_department(self, department: str) -> List[Dict[str, Any]]:
        """Get reports by department"""
        cursor = self.collection.find({"department": department}).sort([("createdAt", DESCENDING)])
        return [self._doc_to_dict(doc) for doc in cursor]
    
    def get_reports_by_agv(self, agv_number: str) -> List[Dict[str, Any]]:
        """Get reports by AGV number"""
        cursor = self.collection.find({"agvNumber": agv_number}).sort([("createdAt", DESCENDING)])
        return [self._doc_to_dict(doc) for doc in cursor]
    
    def get_unresolved_reports(self) -> List[Dict[str, Any]]:
        """Get all unresolved reports"""
        cursor = self.collection.find({"resolved": False}).sort([("createdAt", DESCENDING)])
        return [self._doc_to_dict(doc) for doc in cursor]
    
    def create_report(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new report"""
        # Add metadata
        report_data['resolved'] = False
        report_data['createdAt'] = datetime.now(timezone.utc).isoformat()
        
        # Insert into MongoDB
        result = self.collection.insert_one(report_data)
        
        # Return the created document
        return self.get_report_by_id(str(result.inserted_id))
    
    def update_report(self, report_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update report"""
        try:
            # Update the document
            result = self.collection.update_one(
                {"_id": ObjectId(report_id)},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                return None
            
            # Return the updated document
            return self.get_report_by_id(report_id)
        except Exception:
            return None
    
    def delete_report(self, report_id: str) -> bool:
        """Delete report"""
        try:
            result = self.collection.delete_one({"_id": ObjectId(report_id)})
            return result.deleted_count > 0
        except Exception:
            return False
