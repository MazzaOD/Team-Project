// app.mjs
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import expressHandlebars from 'express-handlebars';
import * as dentistDB from './dentistDB.js'; // Change the import to your dentist database functions

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

const hbs = expressHandlebars.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page - List dentists
app.get('/', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    res.render('index', { dentists });
  } catch (error) {
    console.error('Error fetching dentists:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Route to fetch dentists
app.get('/get-dentists', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    res.json(dentists);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route handler for /get-available-slots
app.get('/get-available-slots', async (req, res) => {
  try {
    // Extract the dentistId from the query parameters
    const { dentistId } = req.query;

    // Retrieve all appointments for the specified dentist
    const allAppointments = await dentistDB.getAllAppointments();

    // Retrieve the next available appointments for the specified dentist
    const nextAvailableAppointments = await dentistDB.getNextAvailableAppointments();

    // Construct and send the response
    res.json({
      allAppointments,
      nextAvailableAppointments
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/book-appointment', async (req, res) => {
  const { dentistId, date, time, patientId } = req.body;
  if (!dentistId || !date || !time || !patientId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create the appointment using the provided details
    const appointmentId = await createAppointment({
      Date: date,
      Time: time,
      TreatmentNo: null, // Assuming TreatmentNo is not provided during appointment creation
      Attended: false, // Assuming Attended defaults to false for new appointments
      PatientNo: patientId,
      DentistNo: dentistId
    });

    res.json({ success: true, message: 'Appointment booked successfully', appointmentId });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route for fetching appointments by dentist ID
app.get('/appointments-by-dentist', async (req, res) => {
  try {
    const dentistId = req.query.dentistId; // Retrieve dentist ID from query parameters
    const appointments = await dentistDB.getAppointmentsWithNamesByDentist(dentistId); // Ensure that this function fetches appointments with patient and dentist names
    res.json(appointments); // Send the appointments data as JSON response
  } catch (error) {
    console.error('Error fetching appointments by dentist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/appointments', async (req, res) => {
  try {
    // Fetch appointment data with patient and dentist names
    const appointments = await dentistDB.getAppointmentsWithNames();
    // Send the appointment data as JSON response
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for viewing the appointment schedule for a specific dentist
app.get('/dentist-schedule', async (req, res) => {
  try {
    const dentistId = req.query.dentistId; // Retrieve dentist ID from query parameters
    let appointments;

    // Check if a dentist ID is provided
    if (dentistId) {
      appointments = await dentistDB.getAppointmentsByDentist(dentistId); // Assuming a method to fetch appointments with patient and dentist names filtered by dentist ID
    } else {
      // Fetch all appointments with patient and dentist names
      appointments = await dentistDB.getAppointmentsWithNames();
    }

    // Fetch all dentists to populate the select dropdown
    const dentists = await dentistDB.getAllDentists();

    // Render the page with appointments (filtered or not) and all dentists
    res.render('dentistSchedule', { appointments, dentists });
  } catch (error) {
    console.error('Error fetching appointment schedule:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/filter-appointments', async (req, res) => {
  try {
    const dentistId = req.query.dentistId;
    let appointments;

    // Check if dentistId is provided and not empty
    if (dentistId) {
      // Fetch appointments for the given dentist
      appointments = await dentistDB.getAppointmentsWithNamesByDentist(dentistId);
    } else {
      // Fetch all appointments when no dentistId is provided or if it's for 'All Dentists'
      appointments = await dentistDB.getAppointmentsWithNames();
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error filtering appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



<<<<<<< HEAD



// app.post('/add-appointment', async (req, res) => {
//   try {
//     // Extract data from the form submission
//     const { DentistNo, PatientNo, TreatmentNo, Date, Time } = req.body;
=======
app.post('/add-appointment', async (req, res) => {
  try {
    // Extract data from the form submission
    const { DentistNo, PatientNo, TreatmentNo, Date, Time } = req.body;
>>>>>>> 147b79bd5f6426ee97553a314f07bec1a58e3958

//     // Perform validation or additional processing if needed

//     // Create a new appointment object based on the form data
//     const newAppointment = {
//       DentistNo: DentistNo,
//       PatientNo: PatientNo,
//       TreatmentNo: TreatmentNo,
//       Date: Date,
//       Time: Time,
//       // Add other properties as needed
//     };

//     // Call the function to create a new appointment in the database
//     await dentistDB.createAppointment(newAppointment);

//     // Redirect to a success page or the schedule page
//     res.redirect('/schedule');
//   } catch (error) {
//     console.error('Error adding new appointment:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// Route to fetch available slots for a dentist
app.get('/get-available-slots', async (req, res) => {
  const dentistId = req.query.dentistId;
  try {
    const slots = await getAvailableSlotsForDentist(dentistId);
    res.json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch patients
app.get('/get-patients', async (req, res) => {
  try {
    const patients = await dentistDB.getAllPatients();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to book an appointment
app.post('/book-appointment', async (req, res) => {
  const { dentistId, patientId, date, time } = req.body;
  try {
    await dentistDB.createAppointment(dentistId, patientId, date, time);
    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dentist details page
app.get('/dentist/:DentistNo', async (req, res) => {
  const dentistId = req.params.DentistNo;
  try {
    const dentist = await dentistDB.getDentistDetails(dentistId);
    if (!dentist) {
      res.status(404).send('Dentist not found');
      return;
    }
    res.render('dentistDetails', { dentist });
  } catch (error) {
    console.error('Error fetching dentist details:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Route for showing the form to add a new treatment
app.get('/add-treatment', (req, res) => {
  res.render('addTreatment');
});

app.post('/add-treatment', async (req, res) => {
  try {
    const { Name, Description, Cost } = req.body;
    const treatment = { Name, Description, Cost };
    await dentistDB.createTreatment(treatment);
    res.redirect('/view-treatments');
  } catch (error) {
    console.error('Error adding treatment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add this route before the existing edit-treatment route
app.get('/edit-treatment', async (req, res) => {
  try {
    const treatments = await dentistDB.getAllTreatments();
    res.render('editTreatmentList', { treatments });
  } catch (error) {
    console.error('Error fetching treatments for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/edit-treatment/:TreatmentNo', async (req, res) => {
  const treatId = req.params.TreatmentNo;
  try {
    const treatment = await dentistDB.getTreatmentDetails(treatId);
    if (!treatment) {
      res.status(404).send('Treatment not found');
      return;
    }
    res.render('editTreatment', { treatment });
  } catch (error) {
    console.error('Error fetching treatment details for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit-treatment/:TreatmentNo', async (req, res) => {
  const treatId = req.params.TreatmentNo;
  try {
    const { Name, Description, Cost } = req.body;
    const updatedTreatment = { Name, Description, Cost };
    await dentistDB.updateTreatment(treatId, updatedTreatment);
    res.redirect('/view-treatments');
  } catch (error) {
    console.error('Error updating treatment:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Define the route to view treatments
app.get('/view-treatments', async (req, res) => {
  try {
    // Fetch all treatments from the database using the correct function from dentistDB
    const treatments = await dentistDB.getAllTreatments(); // Corrected the function call
    res.render('viewTreatments', { treatments }); // Corrected the view name
  } catch (error) {
    console.error('Error fetching treatments:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Render the page with the list of treatments for deletion
app.get('/delete-treatment', async (req, res) => {
  try {
    const treatments = await dentistDB.getAllTreatments();
    res.render('deleteTreatmentList', { treatments });
  } catch (error) {
    console.error('Error fetching treatments for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display confirmation page for deleting a specific treatment
app.get('/delete-treatment/:TreatmentNo', async (req, res) => {
  const treatmentId = req.params.TreatmentNo;
  try {
    const treatment = await dentistDB.getTreatmentDetails(treatmentId);
    if (!treatment) {
      res.status(404).send('Treatment not found');
      return;
    }
    res.render('deleteTreatment', { treatment });
  } catch (error) {
    console.error('Error fetching treatment details for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting a treatment
app.post('/delete-treatment/:TreatmentNo', async (req, res) => {
  const treatmentId = req.params.TreatmentNo;
  try {
    // Perform deletion logic here
    await dentistDB.deleteTreatment(treatmentId);
    res.redirect('/view-treatments');
  } catch (error) {
    console.error('Error deleting treatment:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Render the page with the list of patients for deletion
app.get('/delete-patient', async (req, res) => {
  try {
    const patients = await dentistDB.getAllPatients();
    res.render('deletePatientList', { patients });
  } catch (error) {
    console.error('Error fetching patients for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display confirmation page for deleting a specific patient
app.get('/delete-patient/:PatientNo', async (req, res) => {
  const patientId = req.params.PatientNo;
  try {
    const patient = await dentistDB.getPatientDetails(patientId);
    if (!patient) {
      res.status(404).send('Patient not found');
      return;
    }
    res.render('deletePatient', { patient });
  } catch (error) {
    console.error('Error fetching patient details for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting a patient
app.post('/delete-patient/:PatientNo', async (req, res) => {
  const patientId = req.params.PatientNo;
  try {
    // Perform deletion logic here
    await dentistDB.deletePatient(patientId);
    res.redirect('/view-patient'); // Assuming you have a route to view all patients
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Route for showing the form to add a new appointment
app.get('/add-appointment', async (req, res) => {
  try {
    // Fetch booked appointments data from the database
    const bookedAppointments = await dentistDB.getAllAppointments();

    // Fetch next available appointments for each dentist
    const nextAvailableAppointments = await dentistDB.getNextAvailableAppointments();

    // Fetch other necessary data from the database
    const dentists = await dentistDB.getAllDentists();
    const patients = await dentistDB.getAllPatients();
    const treatments = await dentistDB.getAllTreatments();

    // Render the addAppointment view with the data
    res.render('addAppointment', { dentists, patients, treatments, bookedAppointments, nextAvailableAppointments });
  } catch (error) {
    console.error('Error fetching data for appointment form:', error);
    res.status(500).send('Internal Server Error');
  }
});



// // Route for handling the form submission to add a new appointment
// app.post('/add-appointment', async (req, res) => {
//   try {
//     // Extract data from the form submission
//     const { dentistId, patientId, treatmentId, date, time } = req.body;

//     // Perform validation or additional processing if needed

//     // Create a new appointment object based on the form data
//     const newAppointment = {
//       DentistNo: dentistId,
//       PatientNo: patientId,
//       TreatmentNo: treatmentId,
//       Date: date,
//       Time: time,
//       // Add other properties as needed
//     };

//     // Call the function to create a new appointment in the database
//     await dentistDB.createAppointment(newAppointment);

//     // Redirect to a success page or the schedule page
//     res.redirect('/schedule');
//   } catch (error) {
//     console.error('Error adding new appointment:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// Render the page with the list of appointments for deletion
app.get('/delete-appointment', async (req, res) => {
  try {
    const appointments = await dentistDB.getAppointmentsWithNames();
    res.render('deleteAppointmentList', { appointments });
  } catch (error) {
    console.error('Error fetching appointments for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display confirmation page for deleting a specific appointment
app.get('/delete-appointment/:AppointmentNo', async (req, res) => {
  const appointmentId = req.params.AppointmentNo;
  try {
    const appointment = await dentistDB.getAllAppointments(appointmentId);
    if (!appointment) {
      res.status(404).send('Appointment not found');
      return;
    }
    res.render('deleteAppointment', { appointment });
  } catch (error) {
    console.error('Error fetching appointment details for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting an appointment
app.post('/delete-appointment/:AppointmentNo', async (req, res) => {
  const appointmentId = req.params.AppointmentNo;
  try {
    // Perform deletion logic here
    await dentistDB.deleteAppointment(appointmentId);
    res.redirect('/schedule');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Route to add a new appointment
// app.post('/add-appointment', async (req, res) => {
//   try {
//     // Extract appointment data from the request body
//     const { dentistId, patientId, date, time } = req.body;
//     // Create a new appointment object with the extracted data
//     const newAppointment = {
//       DentistNo: dentistId,
//       PatientNo: patientId,
//       Date: date,
//       Time: time

//       // Add other properties as needed
//     };
//     // Call the function to add the appointment to the database
//     await dentistDB.createAppointment(newAppointment);
//     res.sendStatus(200); // Send success status code
//   } catch (error) {
//     console.error('Error adding new appointment:', error);
//     res.status(500).send('Internal Server Error'); // Send error status code
//   }
// });

// Example route to fetch the list of patients
app.get('/patients', async (req, res) => {
  try {
    // Fetch the list of patients from the database
    const patients = await dentistDB.getAllPatients(); // Implement this function to fetch patients from your database

    // Return the list of patients as JSON response
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to calculate the next available slot for a dentist
app.get('/next-available-slot', async (req, res) => {
  try {
    const dentistId = req.query.dentistId;
    // Call the function to calculate the next available slot for the selected dentist
    const nextSlot = await dentistDB.calculateNextAvailableSlot(dentistId);
    res.json(nextSlot); // Send the next available slot data as JSON response
  } catch (error) {
    console.error('Error calculating next available slot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Route for showing the form to add a new client
app.get('/add-patient', (req, res) => {
  res.render('addPatient');
});

app.post('/add-patient', async (req, res) => {
  try {
    const { Name, Email, Street, Town, County, Eircode } = req.body;
    const patient = { Email: Email, Name: Name, Street: Street, Town: Town, County: County, Eircode: Eircode };
    await dentistDB.createPatient(patient);
    res.redirect('/view-patient');
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add this route before the existing edit-patient route
app.get('/edit-patient', async (req, res) => {
  try {
    const patients = await dentistDB.getAllPatients();
    res.render('editPatientList', { patients });
  } catch (error) {
    console.error('Error fetching patients for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/edit-patient/:PatientNo', async (req, res) => {
  const patientId = req.params.PatientNo;
  try {
    const patient = await dentistDB.getPatientDetails(patientId);
    if (!patient) {
      res.status(404).send('Patient not found');
      return;
    }
    res.render('editPatient', { PatientNo: patient.PatientNo, Name: patient.Name, Email: patient.Email, Street: patient.Street, Town: patient.Town, County: patient.County, Eircode: patient.Eircode });
  } catch (error) {
    console.error('Error fetching patient details for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit-patient/:PatientNo', async (req, res) => {
  const patientId = req.params.PatientNo;
  try {
    const { Name, Email, Street, Town, County, Eircode } = req.body;
    console.log('Received form data:', req.body); // Log the received form data
    const updatedPatient = { Name, Email, Street, Town, County, Eircode };
    console.log('Updated patient data:', updatedPatient); // Log the updated patient data
    await dentistDB.editPatient(patientId, updatedPatient);
    res.redirect('/view-patient');
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Add this route for handling the form submission from the "Choose Patient to Edit" page
app.post('/edit-patient', (req, res) => {
  const selectedPatientId = req.body.PatientNo;
  res.redirect(`/edit-patient/${selectedPatientId}`);
});

// In app.mjs
app.get('/view-patient', async (req, res) => {
  try {
    const patients = await dentistDB.getAllPatients();
    res.render('viewPatient', { patients }); // Ensure the template name is correct
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Display confirmation page for deleting a specific patient
app.get('/delete-patient/:PatientNo', async (req, res) => {
  const patientId = req.params.PatientNo;
  try {
    const patient = await dentistDB.getPatientDetails(patientId);
    if (!patient) {
      res.status(404).send('Patient not found');
      return;
    }
    res.render('deletePatient', { patient });
  } catch (error) {
    console.error('Error fetching patient details for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Route for deleting a client
app.post('/delete-patient/:PatientNo', async (req, res) => {
  const clientId = req.params.PatientNo;
  try {
    await dentistDB.deletePatient(clientId);
    res.redirect('/view-patient');
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for viewing the appointment schedule
app.get('/schedule', async (req, res) => {
  try {
    const dentistId = req.query.dentistId; // Retrieve dentist ID from query parameters
    let appointments;

    // Check if a dentist ID is provided
    if (dentistId) {
      appointments = await dentistDB.getAppointmentsByDentist(dentistId); // Assuming a method to fetch appointments with patient and dentist names filtered by dentist ID
    } else {
      appointments = await dentistDB.getAppointmentsWithNames(); // Assuming a method to fetch all appointments with patient and dentist names
    }

    // Fetch all dentists to populate the select dropdown
    const dentists = await dentistDB.getAllDentists();

    // Render the page with appointments (filtered or not) and all dentists
    res.render('viewAppointments', { appointments, dentists });
  } catch (error) {
    console.error('Error fetching appointment schedule:', error);
    res.status(500).send('Internal Server Error');
  }
});



// app.post('/schedule', async (req, res) => {
//   try {
//     const { dentistId, patientId, treatmentId, date, time, Attended } = req.body;

//     // Correct the keys in the appointment object to match the SQL schema
//     const appointment = {
//       Date: date,
//       Time: time,
//       TreatmentNo: treatmentId,
//       PatientNo: patientId,
//       DentistNo: dentistId,
//       Attended: false  // Assuming a new appointment is not attended by default
//       // Add other properties as needed
//     };

//     console.log('Received form data:', req.body);
//     console.log('Appointment successfully created:', appointment);

//     await dentistDB.createAppointment(appointment);

//     // Fetch appointments after creating the new one
//     const appointments = await dentistDB.getAllAppointmentWithDetails();
//     console.log('Fetched appointments:', appointments);

//     res.render('viewAppointments', { appointments });
//   } catch (error) {
//     console.error('Error scheduling appointment:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// Define the route for checking overlapping dentist appointments
app.get('/check-overlapping-dentist', async (req, res) => {
  try {
    const { date, time, dentistId } = req.query;

    // Check if the dentist is already booked at the chosen time
    const isBooked = await isDentistBookedAtTime(dentistId, date, time);

    // Respond with a boolean indicating whether the dentist is booked or not
    res.json({ isBooked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for adding a new dentist form
app.get('/add-dentist', (req, res) => {
  res.render('add-dentist');
});

// Route for handling new dentist form submission
app.post('/add-dentist', async (req, res) => {
  try {
    const { AwardingBody, Name, Speciality } = req.body; // Corrected variable names
    const dentist = { AwardingBody, Name, Speciality }; // Corrected variable names
    await dentistDB.createDentist(dentist);
    res.redirect('/view-dentists');
  } catch (error) {
    console.error('Error adding dentist:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Add this route before the existing edit-dentist route
app.get('/edit-dentist', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    res.render('editDentistList', { dentists });
  } catch (error) {
    console.error('Error fetching dentists for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/edit-dentist/:DentistNo', async (req, res) => {
  const dentistId = req.params.DentistNo;
  try {
    const dentist = await dentistDB.getDentistDetails(dentistId);
    if (!dentist) {
      res.status(404).send('Dentist not found');
      return;
    }
    res.render('editDentist', { dentist });
  } catch (error) {
    console.error('Error fetching dentist details for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/edit-dentist/:DentistNo', async (req, res) => {
  const dentistId = req.params.DentistNo;
  try {
    const { Name, AwardingBody, Speciality } = req.body;
    const updatedDentist = { Name, AwardingBody, Speciality };
    await dentistDB.updateDentist(dentistId, updatedDentist);
    res.redirect('/view-dentists');
  } catch (error) {
    console.error('Error updating dentist:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display the list of dentists for deletion
app.get('/delete-dentist', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    res.render('deleteDentistList', { dentists });
  } catch (error) {
    console.error('Error fetching dentists for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display confirmation page for deleting a specific dentist
app.get('/delete-dentist/:DentistNo', async (req, res) => {
  const dentistId = req.params.DentistNo;
  try {
    const dentist = await dentistDB.getDentistDetails(dentistId);
    if (!dentist) {
      res.status(404).send('Dentist not found');
      return;
    }
    res.render('deleteDentist', { dentist });
  } catch (error) {
    console.error('Error fetching dentist details for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete-dentist/:DentistNo', async (req, res) => {
  const dentistId = req.params.DentistNo;
  try {
    // Perform deletion logic here
    await dentistDB.deleteDentist(dentistId);
    res.redirect('/view-dentists');
  } catch (error) {
    console.error('Error deleting dentist:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define a route handler for "/view-dentists"
app.get('/view-dentists', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    res.render('viewDentist', { dentists });
  } catch (error) {
    console.error('Error fetching dentists:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});