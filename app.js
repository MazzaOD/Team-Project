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

// Route for showing the form to schedule an appointment
app.get('/schedule/:AppointmentNo', async (req, res) => {
  const dentistId = req.params.AppointmentNo;
  try {
    const dentist = await dentistDB.getDentistDetails(dentistId);
    if (!dentist) {
      res.status(404).send('Dentist not found');
      return;
    }
    res.render('scheduleAppointment', { dentist });
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
    res.redirect('/');
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
    const { name, description } = req.body;
    const updatedTreatment = { name, description };
    await dentistDB.updateTreatment(treatId, updatedTreatment);
    res.redirect('/');
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
    const treatments = await dentistDB.getAllTreatments(); // Replace with your method to fetch all treatments
    res.render('deleteTreatmentList', { treatments });
  } catch (error) {
    console.error('Error fetching treatments:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting a treatment
app.post('/delete-treatment/:TreatmentNo', async (req, res) => {
  const treatId = req.params.TreatmentNo;
  try {
    await dentistDB.deleteTreatment(treatId);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting treatment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for showing the form to add a new appointment
app.get('/add-appointment', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    const clients = await dentistDB.getAllPatients();
    const treatments = await dentistDB.getAllTreatments();
    res.render('addAppointment', { dentists, clients, treatments });
  } catch (error) {
    console.error('Error fetching data for appointment form:', error);
    res.status(500).send('Internal Server Error');
  }
});

// // Example code for checking overlapping appointments
// app.post('/add-appointment', async (req, res) => {
//   try {
//     const { dentistId, clientId, treatmentId, date, time } = req.body;

//     // Check for overlapping appointments
//     const isOverlapping = await dentistDB.isAppointmentOverlapping(dentistId, date, time);

//     if (isOverlapping) {
//       return res.status(400).send('Overlapping appointments are not allowed.');
//     }

//     // Continue with creating the appointment if not overlapping
//     const appointment = { dentistId, clientId, treatmentId, date, time };
//     await dentistDB.createAppointment(appointment);
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error adding appointment:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// Route for showing the form to add a new appointment
app.get('/add-appointment', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    const clients = await dentistDB.getAllPatients();
    const treatments = await dentistDB.getAllTreatments();
    res.render('addAppointment', { dentists, clients, treatments });
  } catch (error) {
    console.error('Error fetching data for appointment form:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for updating an appointment form
app.get('/edit-appointment/:AppointmentNo', async (req, res) => {
  const appointId = req.params.AppointmentNo;
  try {
    const appointment = await dentistDB.getAppointmentDetails(appointId);
    if (!appointment) {
      res.status(404).send('Appointment not found');
      return;
    }
    res.render('editAppointment', { appointment });
  } catch (error) {
    console.error('Error fetching appointment details for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit-appointment/:AppointmentNo', async (req, res) => {
  const appointId = req.params.AppointmentNo;
  try {
    const { dentistId, clientId, treatmentId, date, time } = req.body;
    const updatedAppointment = { dentistId, clientId, treatmentId, date, time };
    await dentistDB.updateAppointment(appointId, updatedAppointment);
    res.redirect('/');
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add this route in your app.mjs file
app.get('/delete-appointment', async (req, res) => {
  try {
    const appointments = await dentistDB.getAllAppointments();
    res.render('deleteAppointmentList', { appointments });
  } catch (error) {
    console.error('Error fetching appointments for deletion:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Route for deleting an appointment
app.post('/delete-appointment/:AppointmentNo', async (req, res) => {
  const appointId = req.params.AppointmentNo;
  try {
    await dentistDB.deleteAppointment(appointId);
    res.redirect('/');  // Redirect to the home page after successful deletion
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).send('Internal Server Error');
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
    res.redirect('/');
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Route for updating a client form
app.get('/edit-patient/:PatientNo', async (req, res) => {
  const clientId = req.params.PatientNo;
  try {
    const client = await dentistDB.getPatientDetails(clientId);
    if (!client) {
      res.status(404).send('Patient not found');
      return;
    }
    res.render('editPatient', { client });
  } catch (error) {
    console.error('Error fetching client details for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit-patient/:PatientNo', async (req, res) => {
  const clientId = req.params.PatientNo;
  try {
    const { Name, Email, Street, Town, County, Eircode } = req.body;
    const updatedClient = { Name, Email, Street, Town, County, Eircode };
    await dentistDB.updatePatient(clientId, updatedClient);
    res.redirect('/');
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).send('Internal Server Error');
  }
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

// Route for deleting a client
app.post('/delete-patient/:PatientNo', async (req, res) => {
  const clientId = req.params.PatientNo;
  try {
    await dentistDB.deletePatient(clientId);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for viewing the appointment schedule
app.get('/schedule', async (req, res) => {
  try {
    const appointments = await dentistDB.getAllAppointmentsWithDetails();
    res.render('appointmentSchedule', { appointments });
  } catch (error) {
    console.error('Error fetching appointment schedule:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for scheduling an appointment
app.get('/schedule-appointment', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    const clients = await dentistDB.getAllPatients();
    const treatments = await dentistDB.getAllTreatments();
    res.render('scheduleAppointment', { dentists, clients, treatments });
  } catch (error) {
    console.error('Error fetching data for appointment form:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/schedule-appointment', async (req, res) => {
  try {
    const { dentistId, clientId, treatmentId, date, time } = req.body;
    const appointment = { dentistId, clientId, treatmentId, date, time };
    await dentistDB.createAppointment(appointment);
    res.redirect('/');
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).send('Internal Server Error');
  }
});

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
    const { AwardingBody, Name, Speciality} = req.body; // Corrected variable names
    const dentist = { AwardingBody, Name, Speciality }; // Corrected variable names
    await dentistDB.createDentist(dentist);
    res.redirect('/');
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
    const { name, specialty, image } = req.body;
    const updatedDentist = { name, specialty, image };
    await dentistDB.updateDentist(dentistId, updatedDentist);
    res.redirect('/');
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
    res.redirect('/');
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