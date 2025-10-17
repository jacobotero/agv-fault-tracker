document.addEventListener('DOMContentLoaded', async function() {
    await loadResolvedReports();
    
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

async function loadResolvedReports() {
    try {
        const reports = await getReports();
        
        // Filter only resolved reports
        const resolvedReports = reports.filter(report => report.resolved === true);
        
        // Group by department
        const departments = {
            'Maintenance': [],
            'Production': [],
            'Engineering': [],
            'Planning': [],
            'Rework': [],
            'RK2': [],
            'Other': []
        };
        
        resolvedReports.forEach(report => {
            if (departments[report.department]) {
                departments[report.department].push(report);
            }
        });
        
        // Display reports for each department
        Object.keys(departments).forEach(dept => {
            const containerId = `${dept.toLowerCase()}-reports`;
            const container = document.getElementById(containerId);
            const section = document.getElementById(`${dept.toLowerCase()}-section`);
            
            if (departments[dept].length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
                container.innerHTML = '';
                departments[dept].forEach(report => {
                    const reportCard = createResolvedReportCard(report);
                    container.appendChild(reportCard);
                });
            }
        });
        
    } catch (error) {
        console.error('Error loading resolved reports:', error);
        alert('Failed to load resolved reports. Please try again.');
    }
}

function createResolvedReportCard(report) {
    const reportDiv = document.createElement('div');
    reportDiv.className = 'report-item resolved';
    
    reportDiv.innerHTML = `
        <div class="report-summary">
            <div class="report-details" onclick="viewReportDetails('${report._id}')">
                <strong>AGV #${report.agvNumber}</strong><br>
                <small>Location: ${report.location}</small><br>
                <small>Responsible: ${report.responsible}</small><br>
                <small>Submitted: ${report.timestamp}</small>
                ${report.resolvedAt ? `<br><small>Resolved: ${report.resolvedAt}</small>` : ''}
                ${report.resolvedBy ? `<br><small>Resolved By: ${report.resolvedBy}</small>` : ''}
            </div>
            <div class="report-actions">
                <div class="report-status status-resolved">
                    ✓ Resolved
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
    
    if (confirm('Are you sure you want to delete this resolved report?')) {
        try {
            await deleteReport(reportId);
            alert('Report deleted successfully!');
            // Reload the page to show updated list
            await loadResolvedReports();
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Failed to delete report. Please try again.');
        }
    }
}
