document.addEventListener('DOMContentLoaded', function() {
    displayReportsByDepartment();
    
    // Add search functionality
    const searchInput = document.getElementById('search-agv');
    if (searchInput) {
        searchInput.addEventListener('input', filterReportsByAGV);
    }
});

function filterReportsByAGV() {
    const searchValue = document.getElementById('search-agv').value.trim().toLowerCase();
    const reportItems = document.querySelectorAll('.report-item');
    
    reportItems.forEach(item => {
        const agvText = item.textContent.toLowerCase();
        if (searchValue === '' || agvText.includes('agv #' + searchValue) || agvText.includes('agv#' + searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function clearSearch() {
    document.getElementById('search-agv').value = '';
    filterReportsByAGV();
}

async function displayReportsByDepartment() {
    const reports = await getReports();
    
    // Filter only unresolved reports (active issues)
    const unresolvedReports = reports.filter(report => report.resolved !== true);
    
    const departments = ['Maintenance', 'Production', 'Engineering', 'Planning', 'Rework', 'RK2', 'Other'];
    
    departments.forEach(department => {
        const departmentReports = unresolvedReports.filter(report => report.department === department);
        const container = document.getElementById(`${department.toLowerCase()}-reports`);
        
        if (departmentReports.length === 0) {
            container.innerHTML = '<p style="color: #90a4ae; font-style: italic;">No reports for this department</p>';
        } else {
            container.innerHTML = '';
            departmentReports.forEach(report => {
                const reportElement = createReportElement(report);
                container.appendChild(reportElement);
            });
        }
    });
}

function createReportElement(report) {
    const reportDiv = document.createElement('div');
    reportDiv.className = `report-item ${report.resolved ? 'resolved' : ''}`;
    
    reportDiv.innerHTML = `
        <div class="report-summary">
            <div class="report-details" onclick="viewReportDetails('${report._id}')">
                <strong>AGV #${report.agvNumber}</strong><br>
                <small>Location: ${report.location}</small><br>
                <small>Responsible: ${report.responsible}</small><br>
                <small>Submitted: ${report.timestamp}</small>
            </div>
            <div class="report-actions">
                <div class="report-status ${report.resolved ? 'status-resolved' : 'status-pending'}">
                    ${report.resolved ? 'Resolved' : 'Pending'}
                </div>
                <button class="delete-btn" onclick="handleDeleteReport('${report._id}', event)">Delete</button>
            </div>
        </div>
    `;
    
    return reportDiv;
}

function viewReportDetails(reportId) {
    sessionStorage.setItem('selectedReportId', reportId);
    window.open('/details.html', '_blank');
}

async function handleDeleteReport(reportId, event) {
    // Stop the click event from bubbling up to the parent div
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
        try {
            // Delete from database
            await deleteReport(reportId);
            alert('Report deleted successfully!');
            // Refresh the display
            await displayReportsByDepartment();
        } catch (error) {
            alert('Error deleting report. Please try again.');
            console.error('Error:', error);
        }
    }
}
