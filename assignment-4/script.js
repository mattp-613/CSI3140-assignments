document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('admin-login-form');
    const addPatientForm = document.getElementById('add-patient-form');
    const patientList = document.getElementById('patient-list');
    const signinForm = document.getElementById('patient-signin-form');
    const waitTimeDiv = document.getElementById('wait-time');
    const loginMessageDiv = document.getElementById('login-message');
    const adminSection = document.getElementById('admin-section');
    const loginSection = document.getElementById('login-section');

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginSection.style.display = 'none';
                adminSection.style.display = 'block';
                loadPatients();
            } else {
                loginMessageDiv.innerText = 'Invalid credentials';
            }
        });
    });

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
});
