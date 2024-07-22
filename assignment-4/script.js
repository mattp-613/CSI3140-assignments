document.addEventListener('DOMContentLoaded', () => {
    const addPatientForm = document.getElementById('add-patient-form');
    const patientList = document.getElementById('patient-list');
    const signinForm = document.getElementById('patient-signin-form');
    const waitTimeDiv = document.getElementById('wait-time');

    addPatientForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('patient-name').value;
        const code = document.getElementById('patient-code').value;
        const severity = document.getElementById('severity').value;

        fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', name, code, severity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadPatients();
                addPatientForm.reset();
            } else {
                alert('Failed to add patient');
            }
        });
    });

    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('signin-name').value;
        const code = document.getElementById('signin-code').value;

        fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'check', name, code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                waitTimeDiv.innerText = `Estimated wait time: ${data.wait_time} minutes`;
            } else {
                waitTimeDiv.innerText = 'Patient not found';
            }
        });
    });

    function loadPatients() {
        fetch('api.php?action=list')
        .then(response => response.json())
        .then(data => {
            patientList.innerHTML = '';
            data.patients.forEach(patient => {
                const li = document.createElement('li');
                li.innerText = `${patient.name} (${patient.code}) - Severity: ${patient.severity}, Time: ${patient.time} minutes`;
                patientList.appendChild(li);
            });
        });
    }

    loadPatients();
});
