document.addEventListener('DOMContentLoaded', function() {
    const agvNumber = sessionStorage.getItem('currentAGV');
    const agvDisplay = document.getElementById('agv-display');
    const form = document.getElementById('fault-report-form');
    const viewLogBtn = document.getElementById('view-log');
    const cancelBtn = document.getElementById('cancel-report');

    if (agvNumber) {
        agvDisplay.textContent = `AGV #${agvNumber}`;
    } else {
        // If no AGV number, redirect back to index
        window.location.href = '/';
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const department = document.getElementById('department').value;
        const location = document.getElementById('location').value;
        const responsible = document.getElementById('responsible').value;
        const description = document.getElementById('description').value;
        
        const report = {
            agvNumber: agvNumber,
            department: department,
            location: location,
            responsible: responsible,
            description: description,
            timestamp: new Date().toLocaleString(),
            resolved: false
        };
        
        try {
            // Save report to database
            await saveReport(report);
            alert('Report submitted successfully!');
            window.location.href = '/log.html';
        } catch (error) {
            alert('Error submitting report. Please try again.');
            console.error('Error:', error);
        }
    });

    viewLogBtn.addEventListener('click', function() {
        window.location.href = '/log.html';
    });

    cancelBtn.addEventListener('click', function() {
        // Clear the stored AGV number and go back to home
        sessionStorage.removeItem('currentAGV');
        window.location.href = '/';
    });
});
