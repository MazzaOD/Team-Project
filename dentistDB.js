import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('dentists.sqlite');

// Initialize the patient table
db.serialize(() => {
    db.run('DROP TABLE IF EXISTS patients');
    db.run('CREATE TABLE patients (PatientNo INTEGER PRIMARY KEY, Email TEXT, Name TEXT, Street TEXT, Town TEXT, County TEXT, Eircode TEXT)');

    // Dentist table
    db.run('DROP TABLE IF EXISTS dentists');
    db.run('CREATE TABLE dentists (DentistNo INTEGER PRIMARY KEY, AwardingBody TEXT, Name TEXT, Speciality TEXT)');

    // Treatment table
    db.run('DROP TABLE IF EXISTS treatments');
    db.run('CREATE TABLE treatments (TreatmentNo INTEGER PRIMARY KEY, Name TEXT, Description TEXT, Cost REAL)');

    // Appointment table
    db.run('DROP TABLE IF EXISTS appointments');
    db.run(`CREATE TABLE appointments (
        AppointmentNo INTEGER PRIMARY KEY AUTOINCREMENT,
        Date TEXT,
        Time TEXT,
        TreatmentNo INTEGER,
        Attended BOOLEAN,
        PatientNo INTEGER,
        DentistNo INTEGER,
        FOREIGN KEY(TreatmentNo) REFERENCES treatments(TreatmentNo),
        FOREIGN KEY(PatientNo) REFERENCES patients(PatientNo),
        FOREIGN KEY(DentistNo) REFERENCES dentists(DentistNo)
    );`);




    // You can add initial data for patients, dentists, treatments, and appointments if needed.
});

// Function to get all patients
export function getAllPatients() {
    return new Promise((resolve, reject) => {
        db.all('SELECT PatientNo AS id, * FROM patients', (err, patients) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(patients);
        });
    });
}

// Function to get patient details by ID
export function getPatientDetails(PatientNo) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM patients WHERE PatientNo = ?', [PatientNo], (err, patient) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(patient);
        });
    });
}

// Function to create a new patient
export function createPatient(patient) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO patients VALUES (?,?,?,?,?,?,?)');
        stmt.run(
            patient.PatientNo,
            patient.Email,
            patient.Name,
            patient.Street,
            patient.Town,
            patient.County,
            patient.Eircode,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to update a patient by ID
export function editPatient(PatientNo, updatedPatient) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'UPDATE patients SET Email=?, Name=?, Street=?, Town=?, County=?, Eircode=? WHERE PatientNo=?'
        );
        stmt.run(
            updatedPatient.Email,
            updatedPatient.Name,
            updatedPatient.Street,
            updatedPatient.Town,
            updatedPatient.County,
            updatedPatient.Eircode,
            PatientNo,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to delete a patient by ID
export function deletePatient(PatientNo) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('DELETE FROM patients WHERE PatientNo=?');
        stmt.run(PatientNo, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        stmt.finalize();
    });
}

// Function to get all dentists
export function getAllDentists() {
    return new Promise((resolve, reject) => {
        db.all('SELECT DentistNo AS id, * FROM dentists', (err, dentists) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dentists);
        });
    });
}

// Function to get dentist details by ID
export function getDentistDetails(DentistNo) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM dentists WHERE DentistNo = ?', [DentistNo], (err, dentist) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dentist);
        });
    });
}

// Function to create a new dentist
export function createDentist(dentist) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO dentists VALUES (?,?,?,?)');
        stmt.run(
            dentist.DentistNo,
            dentist.AwardingBody,
            dentist.Name,
            dentist.Speciality,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to update a dentist by ID
export function updateDentist(DentistNo, updatedDentist) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'UPDATE dentists SET AwardingBody=?, Name=?, Speciality=? WHERE DentistNo=?'
        );
        stmt.run(
            updatedDentist.AwardingBody,
            updatedDentist.Name,
            updatedDentist.Speciality,
            DentistNo,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to delete a dentist by ID
export function deleteDentist(DentistNo) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('DELETE FROM dentists WHERE DentistNo=?');
        stmt.run(DentistNo, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        stmt.finalize();
    });
}

// Function to get all treatments
export function getAllTreatments() {
    return new Promise((resolve, reject) => {
        db.all('SELECT TreatmentNo AS id, * FROM treatments', (err, treatments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(treatments);
        });
    });
}

// Function to get treatment details by ID
export function getTreatmentDetails(TreatmentNo) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM treatments WHERE TreatmentNo = ?', [TreatmentNo], (err, treatment) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(treatment);
        });
    });
}

// Function to create a new treatment
export function createTreatment(treatment) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO treatments VALUES (?,?,?,?)');
        stmt.run(
            treatment.TreatmentNo,
            treatment.Name,
            treatment.Description,
            treatment.Cost,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to update a treatment by ID
export function updateTreatment(TreatmentNo, updatedTreatment) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'UPDATE treatments SET Description=?, Cost=? WHERE TreatmentNo=?'
        );
        stmt.run(
            updatedTreatment.Description,
            updatedTreatment.Cost,
            TreatmentNo,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to delete a treatment by ID
export function deleteTreatment(TreatmentNo) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('DELETE FROM treatments WHERE TreatmentNo=?');
        stmt.run(TreatmentNo, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        stmt.finalize();
    });
}

// Function to get all appointments
export function getAllAppointments() {
    return new Promise((resolve, reject) => {
        db.all('SELECT AppointmentNo AS id, * FROM appointments', (err, appointments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointments);
        });
    });
}

// Function to get appointment details by ID
export function getAllAppointmentWithDetails(AppointmentNo) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM appointments WHERE AppointmentNo = ?', [AppointmentNo], (err, appointment) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointment);
        });
    });
}

// Function to create a new appointment
export function createAppointment(appointment) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO appointments (Date, Time, TreatmentNo, Attended, PatientNo, DentistNo) VALUES (?,?,?,?,?,?)');
        stmt.run(
            appointment.Date,
            appointment.Time,
            appointment.TreatmentNo,
            appointment.Attended ? 1 : 0,  // Assuming Attended is a boolean field
            appointment.PatientNo,
            appointment.DentistNo,
            function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);  // Resolve with the last inserted row ID (AppointmentNo)
            }
        );
        stmt.finalize();
    });
}


// Function to update an appointment by ID
export function updateAppointment(AppointmentNo, updatedAppointment) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'UPDATE appointments SET Date=?, Time=?, TreatmentNo=?, Attended=?, PatientNo=?, DentistNo=? WHERE AppointmentNo=?'
        );
        stmt.run(
            updatedAppointment.Date,
            updatedAppointment.Time,
            updatedAppointment.TreatmentNo,
            updatedAppointment.Attended,
            updatedAppointment.PatientNo,
            updatedAppointment.DentistNo,
            AppointmentNo,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to delete an appointment by ID
export function deleteAppointment(AppointmentNo) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('DELETE FROM appointments WHERE AppointmentNo=?');
        stmt.run(AppointmentNo, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        stmt.finalize();
    });
}


// Function to insert data into a table
const insertData = async (data, createFunction) => {
    try {
        for (const item of data) {
            await createFunction(item);
        }
    } catch (err) {
        console.error(`Error inserting data: ${err}`);
    }
};

const patientData = [
    { Email: 'john.doe@example.com', Name: 'John Doe', Street: '123 Main St', Town: 'Cityville', County: 'Donegal', Eircode: 'E123AB' },
    { Email: 'jane.smith@example.com', Name: 'Jane Smith', Street: '456 Oak St', Town: 'Townsville', County: 'Dublin', Eircode: 'E456CD' },
    { Email: 'mike.jackson@example.com', Name: 'Mike Jackson', Street: '789 Elm St', Town: 'Villageton', County: 'Cork', Eircode: 'E789EF' },
    { Email: 'sarah.jones@example.com', Name: 'Sarah Jones', Street: '101 Pine St', Town: 'Hamletville', County: 'Galway', Eircode: 'E101GH' },
    { Email: 'david.wilson@example.com', Name: 'David Wilson', Street: '111 Cedar St', Town: 'Boroughburg', County: 'Kerry', Eircode: 'E111IJ' },
    { Email: 'emily.brown@example.com', Name: 'Emily Brown', Street: '222 Maple St', Town: 'Villageburg', County: 'Mayo', Eircode: 'E222KL' },
    { Email: 'olivia.taylor@example.com', Name: 'Olivia Taylor', Street: '333 Oak St', Town: 'Townford', County: 'Limerick', Eircode: 'E333MN' },
    { Email: 'ryan.anderson@example.com', Name: 'Ryan Anderson', Street: '444 Elm St', Town: 'Cityton', County: 'Sligo', Eircode: 'E444OP' },
    { Email: 'amber.white@example.com', Name: 'Amber White', Street: '555 Birch St', Town: 'Hamletford', County: 'Waterford', Eircode: 'E555QR' },
    { Email: 'daniel.thomas@example.com', Name: 'Daniel Thomas', Street: '666 Oak St', Town: 'Villageville', County: 'Wexford', Eircode: 'E666ST' }
];

const dentistData = [
    { AwardingBody: 'Dental Association', Name: 'Dr. Smith', Speciality: 'General Dentistry' },
    { AwardingBody: 'Dental Board', Name: 'Dr. Johnson', Speciality: 'Orthodontics' },
    { AwardingBody: 'Dentistry Institute', Name: 'Dr. Williams', Speciality: 'Pediatric Dentistry' },
    { AwardingBody: 'Oral Health Foundation', Name: 'Dr. Brown', Speciality: 'Endodontics' },
    { AwardingBody: 'Dental College', Name: 'Dr. Lee', Speciality: 'Periodontics' },
    { AwardingBody: 'National Dental Association', Name: 'Dr. Garcia', Speciality: 'Prosthodontics' },
];

const treatmentData = [
    { Name: 'Check Up', Description: 'Dental Checkup', Cost: 100.0 },
    { Name: 'Dental Cleaning', Description: 'Teeth Cleaning', Cost: 75.0 },
    { Name: 'Fillings', Description: 'Tooth Fillings', Cost: 150.0 },
    { Name: 'Extraction', Description: 'Tooth Extraction', Cost: 200.0 },
    { Name: 'Root Canal', Description: 'Root Canal Treatment', Cost: 300.0 },
    { Name: 'Crowns', Description: 'Dental Crowns', Cost: 400.0 },
    { Name: 'Bridges', Description: 'Dental Bridges', Cost: 500.0 },
    { Name: 'Dentures', Description: 'Dental Dentures', Cost: 600.0 },
    { Name: 'Implants', Description: 'Dental Implants', Cost: 700.0 },
    { Name: 'Braces', Description: 'Orthodontic Braces', Cost: 800.0 }
];

const appointmentData = [
    { Date: '2024-03-01', Time: '09:00 AM', TreatmentNo: 1, Attended: 0, PatientNo: 1, DentistNo: 1 },
    { Date: '2024-03-02', Time: '02:30 PM', TreatmentNo: 2, Attended: 1, PatientNo: 2, DentistNo: 2 },
    { Date: '2024-03-03', Time: '11:00 AM', TreatmentNo: 3, Attended: 0, PatientNo: 3, DentistNo: 3 },
    { Date: '2024-03-04', Time: '10:00 AM', TreatmentNo: 4, Attended: 1, PatientNo: 4, DentistNo: 4 },
    { Date: '2024-03-05', Time: '01:00 PM', TreatmentNo: 5, Attended: 0, PatientNo: 5, DentistNo: 5 },
    { Date: '2024-03-06', Time: '03:30 PM', TreatmentNo: 6, Attended: 1, PatientNo: 6, DentistNo: 6 },
    { Date: '2024-03-07', Time: '02:00 PM', TreatmentNo: 7, Attended: 0, PatientNo: 7, DentistNo: 7 },
    { Date: '2024-03-08', Time: '09:30 AM', TreatmentNo: 8, Attended: 1, PatientNo: 8, DentistNo: 8 },
    { Date: '2024-03-09', Time: '10:30 AM', TreatmentNo: 9, Attended: 0, PatientNo: 9, DentistNo: 9 },
    { Date: '2024-03-10', Time: '11:30 AM', TreatmentNo: 10, Attended: 1, PatientNo: 10, DentistNo: 10 }
];



// Call the function to insert data into each table
await Promise.all([
    insertData(patientData, createPatient),
    insertData(dentistData, createDentist),
    insertData(treatmentData, createTreatment),
    insertData(appointmentData, createAppointment),
]);






// Function to get overlapping appointments for a given appointment
async function getOverlappingAppointments(appointment) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM appointments WHERE DentistNo = ? AND date = ? AND time = ?',
            [appointment.DentistNo, appointment.Date, appointment.Time],
            (err, appointments) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(appointments);
            }
        );
    });
}

// Function to check if the time is within working hours (9 AM to 5 PM, excluding Sundays)
function isValidTime(time) {
    // Parse the time string to extract hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Check if it's Sunday (dayOfWeek 0 represents Sunday)
    const isSunday = new Date().getDay() === 0;

    // Check if the time is within working hours (9 AM to 5 PM) and not on Sunday
    return (
        !isSunday &&
        hours >= 9 &&
        hours < 17 &&
        minutes >= 0 &&
        minutes < 60
    );
}


// Function to check if a date is in the past
function isPastDate(date) {
    const currentDate = new Date();
    const appointmentDate = new Date(date);

    return appointmentDate < currentDate;
}



// Function to close the database connection
export function closeDB() {
    return new Promise((resolve) => {
        db.close(() => {
            resolve();
        });
    });
}

// Function to get appointments by dentist ID
export function getAppointmentsByDentist(dentistId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM appointments WHERE DentistNo = ?', [dentistId], (err, appointments) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(appointments);
      });
    });
  }
