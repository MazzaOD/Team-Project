document.getElementById('filterAppointmentsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const dentistId = document.getElementById('dentistId').value;
    try {
        const response = await fetch(`/appointments-by-dentist?dentistId=${dentistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }
        const appointments = await response.json();
        renderAppointments(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
});

function renderAppointments(appointments) {
    const appointmentsBody = document.getElementById('appointmentsBody');
    appointmentsBody.innerHTML = ''; // Clear previous data
    if (appointments.length === 0) {
        appointmentsBody.innerHTML = '<tr><td colspan="5">No appointments found</td></tr>';
        return;
    }
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.appointment_id}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>${appointment.patient_name}</td>
            <td>${appointment.dentist_name}</td>
        `;
        appointmentsBody.appendChild(row);
    });
}
