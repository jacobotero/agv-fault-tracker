// API client for AGV Fault Tracker
// Connects to Flask backend server

const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`; 

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Save a new report
async function saveReport(reportData) {
    return await apiCall('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
    });
}

// Get all reports
async function getReports() {
    return await apiCall('/reports');
}

// Get report by ID
async function getReportById(reportId) {
    return await apiCall(`/reports/${reportId}`);
}

// Get reports by department
async function getReportsByDepartment(department) {
    return await apiCall(`/reports/department/${department}`);
}

// Update a report (e.g., mark as resolved)
async function updateReport(reportId, updateData) {
    return await apiCall(`/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    });
}

// Delete a report
async function deleteReport(reportId) {
    return await apiCall(`/reports/${reportId}`, {
        method: 'DELETE'
    });
}

// Get report count
async function getReportCount() {
    const reports = await getReports();
    return {
        total: reports.length,
        pending: reports.filter(r => !r.resolved).length,
        resolved: reports.filter(r => r.resolved).length
    };
}

// Check server health
async function checkServerHealth() {
    try {
        return await apiCall('/health');
    } catch (error) {
        return { status: 'ERROR', message: error.message };
    }
}
