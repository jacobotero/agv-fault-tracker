from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
from database import Database

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Initialize MongoDB Database
db = Database()
print('[OK] MongoDB connection initialized successfully')

# Routes for serving HTML pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/report.html')
def report():
    return render_template('report.html')

@app.route('/log.html')
def log():
    return render_template('log.html')

@app.route('/resolved.html')
def resolved():
    return render_template('resolved.html')

@app.route('/details.html')
def details():
    return render_template('details.html')

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'AGV Tracker API is running',
        'database': 'MongoDB',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/reports', methods=['GET'])
def get_all_reports():
    """Get all reports"""
    try:
        reports = db.get_all_reports()
        return jsonify(reports)
    except Exception as e:
        return jsonify({'message': 'Error fetching reports', 'error': str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get single report by ID"""
    try:
        report = db.get_report_by_id(report_id)
        
        if not report:
            return jsonify({'message': 'Report not found'}), 404
        
        return jsonify(report)
    except Exception as e:
        return jsonify({'message': 'Error fetching report', 'error': str(e)}), 500

@app.route('/api/reports/department/<department>', methods=['GET'])
def get_reports_by_department(department):
    """Get reports by department"""
    try:
        reports = db.get_reports_by_department(department)
        return jsonify(reports)
    except Exception as e:
        return jsonify({'message': 'Error fetching reports', 'error': str(e)}), 500

@app.route('/api/reports', methods=['POST'])
def create_report():
    """Create new report"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['agvNumber', 'department', 'location', 'responsible', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'Missing required field: {field}'}), 400
        
        # Validate department
        valid_departments = ['Maintenance', 'Production', 'Engineering', 'Planning', 'Rework', 'RK2', 'Other']
        if data['department'] not in valid_departments:
            return jsonify({'message': 'Invalid department'}), 400
        
        new_report = db.create_report(data)
        return jsonify(new_report), 201
    except Exception as e:
        return jsonify({'message': 'Error creating report', 'error': str(e)}), 400

@app.route('/api/reports/<report_id>', methods=['PUT'])
def update_report(report_id):
    """Update report (mark as resolved)"""
    try:
        data = request.get_json()
        
        updated_report = db.update_report(report_id, data)
        
        if not updated_report:
            return jsonify({'message': 'Report not found'}), 404
        
        return jsonify(updated_report)
    except Exception as e:
        return jsonify({'message': 'Error updating report', 'error': str(e)}), 400

@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """Delete report"""
    try:
        success = db.delete_report(report_id)
        
        if not success:
            return jsonify({'message': 'Report not found'}), 404
        
        return jsonify({'message': 'Report deleted successfully'})
    except Exception as e:
        return jsonify({'message': 'Error deleting report', 'error': str(e)}), 500

if __name__ == '__main__':
    print('Starting AGV Tracker Server...')
    print('API available at http://localhost:5000/api')
    print('Using MongoDB database')
    print('\nOpen your browser to http://localhost:5000\n')
    app.run(host='0.0.0.0', port=5000, debug=True)
