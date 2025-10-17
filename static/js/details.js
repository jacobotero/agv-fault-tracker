document.addEventListener('DOMContentLoaded', async function() {
    const reportId = sessionStorage.getItem('selectedReportId');
    
    if (!reportId) {
        document.getElementById('report-details').innerHTML = '<p>No report selected</p>';
        return;
    }
    
    const report = await getReportById(reportId);
    
    if (!report) {
        document.getElementById('report-details').innerHTML = '<p>Report not found</p>';
        return;
    }
    
    displayReportDetails(report);
    
    const resolveBtn = document.getElementById('resolve-button');
    
    if (report.resolved) {
        resolveBtn.textContent = 'Already Resolved';
        resolveBtn.disabled = true;
        resolveBtn.style.opacity = '0.5';
    } else {
        resolveBtn.addEventListener('click', async function() {
            if (confirm('Mark this report as resolved?')) {
                try {
                    await updateReport(reportId, { resolved: true });
                    alert('Report marked as resolved!');
                    
                    // Refresh the parent/opener window if it exists
                    if (window.opener && !window.opener.closed) {
                        window.opener.location.reload();
                    }
                    
                    window.close();
                } catch (error) {
                    alert('Error resolving report. Please try again.');
                    console.error('Error:', error);
                }
            }
        });
    }
});

function displayReportDetails(report) {
    const detailsContainer = document.getElementById('report-details');
    
    detailsContainer.innerHTML = `
        <div class="detail-card">
            <h2>AGV #${report.agvNumber}</h2>
            <div class="detail-row">
                <strong>Department:</strong> ${report.department}
            </div>
            <div class="detail-row">
                <strong>Location:</strong> ${report.location}
            </div>
            <div class="detail-row">
                <strong>Responsible Person:</strong> ${report.responsible}
            </div>
            <div class="detail-row">
                <strong>Issue Description:</strong> ${report.description}
            </div>
            <div class="detail-row">
                <strong>Submitted:</strong> ${report.timestamp}
            </div>
            <div class="detail-row">
                <strong>Status:</strong> 
                <span class="status-badge ${report.resolved ? 'resolved' : 'pending'}">
                    ${report.resolved ? 'Resolved' : 'Pending'}
                </span>
            </div>
        </div>
    `;
}
