// Function to fetch and display available appointment slots for a specific dentist
async function displayAvailableSlots(dentistId) {
    try {
        alert("Test slots");
        // Fetch available slots data for the selected dentist from the server
        const response = await fetch(`/get-available-slots?dentistId=${dentistId}`);
        const availableSlots = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('availableSlotsBody');

        // Clear existing table rows
        tableBody.innerHTML = '';

        // Populate the table with the fetched slots data
        availableSlots.forEach(slot => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${slot.date}</td>
        <td>${slot.time}</td>
        <td>
            <button class="select-slot-btn" data-date="${slot.date}" data-time="${slot.time}">Select</button>
        </td>
    `;
            tableBody.appendChild(row);
        });

        // Show the appointment slots container
        document.getElementById('appointmentSlots').style.display = 'block';
    } catch (error) {
        console.error('Error fetching available slots:', error);
    }
}

// Function to fetch and display patients for selection
async function displayPatients() {
    try {
        // Fetch patients data from the server
        const response = await fetch('/get-patients');
        const patients = await response.json();

        // Get the select element for patients
        const patientSelect = document.getElementById('patientSelect');

        // Clear existing options
        patientSelect.innerHTML = '';

        // Populate the select element with fetched patients
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.text = `${patient.firstName} ${patient.lastName}`;
            option.value = patient.id;
            patientSelect.appendChild(option);
        });

        // Show the patient selection container
        document.getElementById('selectPatient').style.display = 'block';
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

// Event listener for dentist selection
document.getElementById('dentistSelect').addEventListener('change', (event) => {
    const selectedDentistId = event.target.value;
    displayAvailableSlots(selectedDentistId);
});

// Event listener for slot selection
document.getElementById('availableSlotsBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('select-slot-btn')) {
        const selectedDate = event.target.dataset.date;
        const selectedTime = event.target.dataset.time;
        document.getElementById('date').value = selectedDate;
        document.getElementById('time').value = selectedTime;
        displayPatients();
    }
});

// Event listener for form submission (booking appointment)
document.getElementById('appointmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const dentistId = document.getElementById('dentistSelect').value;
    const selectedDate = document.getElementById('date').value;
    const selectedTime = document.getElementById('time').value;
    const patientId = document.getElementById('patientSelect').value;

    try {
        // Call the function to book the appointment slot
        await bookAppointment(dentistId, selectedDate, selectedTime, patientId);
        // Optionally, display a success message or update the UI
        console.log(`Appointment booked successfully for Dentist ${dentistId} on ${selectedDate} at ${selectedTime} for Patient ${patientId}.`);
    } catch (error) {
        // Handle errors, display error message, or log errors
        console.error(`Error booking appointment:`, error);
    }
});

// Call the function to fetch and display dentists when the page loads
async function init() {
    try {
        // Fetch dentists data from the server
        const response = await fetch('/get-dentists');
        const dentists = await response.json();

        // Get the select element for dentists
        const dentistSelect = document.getElementById('dentistSelect');

        // Populate the select element with fetched dentists
        dentists.forEach(dentist => {
            const option = document.createElement('option');
            option.text = dentist.name;
            option.value = dentist.id;
            dentistSelect.appendChild(option);
        });

        // Show the dentist selection container
        document.getElementById('selectDentist').style.display = 'block';
    } catch (error) {
        console.error('Error fetching dentists:', error);
    }
}

// Call the init function when the page loads
init();