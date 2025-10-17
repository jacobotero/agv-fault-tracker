document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-agv');
    const agvNumberInput = document.getElementById('agv-number');
    const viewLogBtn = document.getElementById('view-log');

    submitBtn.addEventListener('click', async function() {
        const agvNumber = agvNumberInput.value.trim();
        
        if (agvNumber === '') {
            alert('Please enter an AGV number');
            return;
        }
        
        // Check if AGV already has an open (unresolved) report
        try {
            const reports = await getReports();
            const existingReport = reports.find(report => 
                report.agvNumber === agvNumber && report.resolved !== true
            );
            
            if (existingReport) {
                alert('Error: AGV #' + agvNumber + ' already has an open report in the system');
                return;
            }
            
            // Store AGV number in sessionStorage to pass to next page
            sessionStorage.setItem('currentAGV', agvNumber);
            
            // Redirect to report page
            window.location.href = '/report.html';
        } catch (error) {
            console.error('Error checking AGV:', error);
            alert('Error checking AGV status. Please try again.');
        }
    });

    // View Log button functionality
    viewLogBtn.addEventListener('click', function() {
        window.location.href = '/log.html';
    });

    // Also allow Enter key to submit
    agvNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});
