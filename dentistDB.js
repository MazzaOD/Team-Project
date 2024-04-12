import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('dentists.sqlite');


// Initialize the patient table
db.serialize(() => {

    // Patient table
    db.run('DROP TABLE IF EXISTS patients');
    db.run(`CREATE TABLE patients (
    PatientNo INTEGER PRIMARY KEY,
    Email TEXT,
    Name TEXT,
    Street TEXT,
    Town TEXT,
    County TEXT,
    Eircode TEXT,
    FOREIGN KEY(PatientNo) REFERENCES appointments(PatientNo) ON DELETE CASCADE
);`);

    // Dentist table
    db.run('DROP TABLE IF EXISTS dentists');
    db.run(`CREATE TABLE dentists (
    DentistNo INTEGER PRIMARY KEY,
    AwardingBody TEXT,
    Name TEXT,
    Speciality TEXT,
    FOREIGN KEY(DentistNo) REFERENCES appointments(DentistNo) ON DELETE CASCADE
);`);

    // Treatment table
    db.run('DROP TABLE IF EXISTS treatments');
    db.run(`CREATE TABLE treatments (
    TreatmentNo INTEGER PRIMARY KEY,
    Name TEXT,
    Description TEXT,
    Cost REAL,
    FOREIGN KEY(TreatmentNo) REFERENCES appointments(TreatmentNo) ON DELETE CASCADE
);`);


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
    FOREIGN KEY(TreatmentNo) REFERENCES treatments(TreatmentNo) ON DELETE CASCADE,
    FOREIGN KEY(PatientNo) REFERENCES patients(PatientNo) ON DELETE CASCADE,
    FOREIGN KEY(DentistNo) REFERENCES dentists(DentistNo) ON DELETE CASCADE
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
export async function deletePatient(PatientNo) {
    try {
        // Get all appointments associated with the patient
        const appointments = await getAppointmentsByPatient(PatientNo);

        // Delete the patient from the patients table
        await deleteFromTable('patients', 'PatientNo', PatientNo);

        // Delete all related appointments from the appointments table
        for (const appointment of appointments) {
            await deleteAppointment(appointment.AppointmentNo);
        }

        console.log(`Patient ${PatientNo} and related appointments deleted successfully.`);
    } catch (error) {
        console.error('Error deleting patient and related appointments:', error);
        throw error;
    }
}

// // Function to delete a patient by ID
// export function deletePatient(PatientNo) {
//     return new Promise((resolve, reject) => {
//         const stmt = db.prepare('DELETE FROM patients WHERE PatientNo=?');
//         stmt.run(PatientNo, (err) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve();
//         });
//         stmt.finalize();
//     });
// }

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

// // Function to delete a dentist by ID
// export function deleteDentist(DentistNo) {
//     return new Promise((resolve, reject) => {
//         const stmt = db.prepare('DELETE FROM dentists WHERE DentistNo=?');
//         stmt.run(DentistNo, (err) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve();
//         });
//         stmt.finalize();
//     });
// }

// Function to delete a dentist by ID
export async function deleteDentist(DentistNo) {
    try {
        // Get all appointments associated with the dentist
        const appointments = await getAppointmentsByDentist(DentistNo);

        // Delete the dentist from the dentists table
        await deleteFromTable('dentists', 'DentistNo', DentistNo);

        // Delete all related appointments from the appointments table
        for (const appointment of appointments) {
            await deleteAppointment(appointment.AppointmentNo);
        }

        console.log(`Dentist ${DentistNo} and related appointments deleted successfully.`);
    } catch (error) {
        console.error('Error deleting dentist and related appointments:', error);
        throw error;
    }
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

// // Function to delete a treatment by ID
// export function deleteTreatment(TreatmentNo) {
//     return new Promise((resolve, reject) => {
//         const stmt = db.prepare('DELETE FROM treatments WHERE TreatmentNo=?');
//         stmt.run(TreatmentNo, (err) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve();
//         });
//         stmt.finalize();
//     });
// }

// Function to delete a treatment by ID
export async function deleteTreatment(TreatmentNo) {
    try {
        // Get all appointments associated with the treatment
        const appointments = await getAppointmentsByTreatment(TreatmentNo);

        // Delete the treatment from the treatments table
        await deleteFromTable('treatments', 'TreatmentNo', TreatmentNo);

        // Delete all related appointments from the appointments table
        for (const appointment of appointments) {
            await deleteAppointment(appointment.AppointmentNo);
        }

        console.log(`Treatment ${TreatmentNo} and related appointments deleted successfully.`);
    } catch (error) {
        console.error('Error deleting treatment and related appointments:', error);
        throw error;
    }
}

// Function to check if a slot is booked for the selected dentist at the specified date and time
export async function isSlotBooked(dentistId, date, time) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM appointments
            WHERE DentistNo = ? AND Date = ? AND Time = ?;
        `;
        db.get(query, [dentistId, date, time], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(!!row); // Resolve true if a row is found (slot is booked), otherwise false
        });
    });
}
// Function to calculate the next available slot for the selected dentist
export async function calculateNextAvailableSlot(dentistId) {
    // Get the last appointment for the selected dentist
    const lastAppointment = await getLastAppointment(dentistId);

    // If there are no appointments for the dentist, start from the current date and time
    let nextSlotDate = new Date();
    let nextSlotTime = '09:00'; // Start from 9:00 AM

    // If the last appointment exists, calculate the next slot
    if (lastAppointment) {
        const lastEndTime = new Date(`${lastAppointment.date} ${lastAppointment.time}`);
        lastEndTime.setMinutes(lastEndTime.getMinutes() + 30); // Add 30 minutes to the end time

        // Check if the last appointment ends after 5:00 PM
        if (lastEndTime.getHours() >= 17) {
            // Move to the next day
            nextSlotDate.setDate(nextSlotDate.getDate() + 1);
            nextSlotTime = '09:00'; // Start from 9:00 AM
        } else {
            // Set the next slot date and time
            nextSlotDate = lastEndTime;
            nextSlotTime = `${('0' + nextSlotDate.getHours()).slice(-2)}:${('0' + nextSlotDate.getMinutes()).slice(-2)}`;
        }
    }

    // Check if the next slot falls on a weekend (Saturday or Sunday)
    while (nextSlotDate.getDay() === 0 || nextSlotDate.getDay() === 6) {
        // Move to the next day
        nextSlotDate.setDate(nextSlotDate.getDate() + 1);
        nextSlotTime = '09:00'; // Start from 9:00 AM
    }

    // Check if the next slot falls before 9:00 AM
    if (nextSlotDate.getHours() < 9) {
        nextSlotTime = '09:00'; // Start from 9:00 AM
    }

    // Check if the next slot falls after 5:00 PM
    if (nextSlotDate.getHours() >= 17) {
        // Move to the next day
        nextSlotDate.setDate(nextSlotDate.getDate() + 1);
        nextSlotTime = '09:00'; // Start from 9:00 AM
    }

    // Format the date and time
    const formattedDate = `${nextSlotDate.getFullYear()}-${('0' + (nextSlotDate.getMonth() + 1)).slice(-2)}-${('0' + nextSlotDate.getDate()).slice(-2)}`;
    const formattedTime = nextSlotTime;

    return { date: formattedDate, time: formattedTime };
}

// Function to get the last appointment for the selected dentist
export async function getLastAppointment(dentistId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT Date, Time
            FROM appointments
            WHERE DentistNo = ?
            ORDER BY Date DESC, Time DESC
            LIMIT 1;
        `;
        db.get(query, [dentistId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                resolve({ date: row.Date, time: row.Time });
            } else {
                resolve(null); // No appointment found
            }
        });
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
                stmt.finalize(); // Finalize the statement after resolving the promise
            }
        );
    });
}



// Function to get available slots for a dentist
export function getAvailableSlotsForDentist(dentistId) {
    return new Promise((resolve, reject) => {
        // Query the appointments table to find available slots for the given dentist
        db.all(
            `SELECT Date, Time FROM appointments WHERE DentistNo = ? AND PatientNo IS NULL`,
            [dentistId],
            (err, slots) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(slots);
            }
        );
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

// Function to delete records from a table based on a condition
async function deleteFromTable(table, column, value) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`DELETE FROM ${table} WHERE ${column}=?`);
        stmt.run(value, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        stmt.finalize();
    });
}

// Function to get the furthest appointment for each dentist
export async function getFurthestAppointments() {
    const query = `
        SELECT DentistNo, MAX(Date || ' ' || Time) AS FurthestAppointment
        FROM appointments
        GROUP BY DentistNo
    `;

    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

// Function to get the next available appointment for each dentist
export async function getNextAvailableAppointments() {
    const now = new Date().toISOString(); // Get current date and time in ISO format
    const query = `
        SELECT DentistNo, MIN(Date || ' ' || Time) AS NextAppointment
        FROM appointments
        WHERE Date || ' ' || Time > ?
        GROUP BY DentistNo
    `;

    return new Promise((resolve, reject) => {
        db.all(query, [now], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

// Function to get appointments with patient and dentist names by dentist ID
export function getAppointmentsWithNamesByDentist(dentistId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                appointments.AppointmentNo AS appointment_id,
                appointments.Date AS date,
                appointments.Time AS time,
                patient_names.Name AS patient_name,
                dentist_names.Name AS dentist_name
            FROM 
                appointments
            LEFT JOIN 
                patients AS patient_names ON appointments.PatientNo = patient_names.PatientNo
            LEFT JOIN 
                dentists AS dentist_names ON appointments.DentistNo = dentist_names.DentistNo
            WHERE 
                appointments.DentistNo = ?;
        `;
        db.all(query, [dentistId], (err, appointments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointments);
        });
    });
}


// Function to fetch appointments with patient and dentist names
export async function getAppointmentsWithNames() {
    return new Promise((resolve, reject) => {


        // SQL query to fetch appointments with patient and dentist names
        const query = `
        SELECT 
        appointments.AppointmentNo AS appointment_id,
        appointments.Date AS date,
        appointments.Time AS time,
        patient_names.Name AS patient_name,
        dentist_names.Name AS dentist_name
    FROM 
        appointments
    LEFT JOIN 
        patients AS patient_names ON appointments.PatientNo = patient_names.PatientNo
    LEFT JOIN 
        dentists AS dentist_names ON appointments.DentistNo = dentist_names.DentistNo;
        `;

        // Execute the query
        db.all(query, [], (err, rows) => {



            if (err) {
                reject(err);
            } else {
                // Resolve with the fetched appointments data
                resolve(rows);
            }
        });
    });
}

// Call the function to get the furthest appointments
getFurthestAppointments()
    .then((appointments) => {
        console.log("Furthest appointments:", appointments);
        // Handle the appointments data as needed, such as displaying it on the page for booking
    })
    .catch((error) => {
        console.error("Error retrieving furthest appointments:", error);
    });


// Function to book the furthest appointment slot as a 30-minute slot
export async function bookFurthestAppointmentSlot() {
    try {
        // Get the furthest appointments for each dentist
        const furthestAppointments = await getFurthestAppointments();

        // Loop through each furthest appointment
        for (const appointment of furthestAppointments) {
            const { DentistNo, FurthestAppointment } = appointment;
            const [date, time] = FurthestAppointment.split(' ');
            const startTime = new Date(`${date} ${time}`);
            const endTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes

            // Insert the new appointment into the database
            const newAppointmentId = await createAppointment({
                Date: date,
                Time: time,
                TreatmentNo: 1, // Replace with the appropriate treatment number
                Attended: 0,
                PatientNo: 1, // Replace with the appropriate patient number
                DentistNo: DentistNo
            });

            console.log(`Appointment ${newAppointmentId} booked for Dentist ${DentistNo} from ${time} to ${endTime.toLocaleTimeString()}`);
        }
    } catch (error) {
        console.error('Error booking furthest appointment slots:', error);
    }
}

// Call the function to book the furthest appointment slots
bookFurthestAppointmentSlot();


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

function generateRealTimeDateTime() {
    const now = new Date();
    let currentDate = now;
    const currentDay = now.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    // Find the next Monday
    if (currentDay !== 1) {
        currentDate = new Date(now.getTime() + ((8 - currentDay) % 7) * 24 * 60 * 60 * 1000);
    }

    // Calculate the number of days to add (0 to 4) for a random weekday (Monday to Friday)
    const daysToAdd = Math.floor(Math.random() * 5);

    // Add the random number of days to the current date
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    // Set time to 9:00 AM and calculate the total number of half-hour slots available (8 hours = 16 half-hour slots)
    currentDate.setHours(9, 0, 0, 0);
    const startTime = currentDate.getTime();
    const endTime = startTime + (8 * 60 * 60 * 1000); // 8 hours in milliseconds

    // Generate a random offset in half-hour increments within the 8-hour window
    const randomOffset = Math.floor(Math.random() * (8 * 2)); // Random number between 0 and 15 (inclusive)

    // Calculate the time based on the random offset (each offset represents half-hour slot)
    const appointmentTime = new Date(startTime + (randomOffset * 30 * 60 * 1000));

    // Format date without seconds
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = appointmentTime.toLocaleDateString('en-US', options);

    // Format time with leading zeros if necessary
    const formattedHours = String(appointmentTime.getHours()).padStart(2, '0');
    const formattedMinutes = String(appointmentTime.getMinutes()).padStart(2, '0');

    const time = `${formattedHours}:${formattedMinutes}`;

    return [date, time];
}





// Function to insert dynamically generated appointments into the appointments table
async function generateAppointments(numAppointments) {
    try {
        for (let i = 0; i < numAppointments; i++) {
            const [date, time] = generateRealTimeDateTime();
            // Replace the hardcoded values with dynamic ones
            await createAppointment({
                Date: date,
                Time: time,
                TreatmentNo: Math.floor(Math.random() * 10) + 1, // Random treatment number between 1 and 10
                Attended: Math.random() < 0.5 ? 0 : 1, // Randomly assign attendance
                PatientNo: Math.floor(Math.random() * 10) + 1, // Random patient number between 1 and 10
                DentistNo: Math.floor(Math.random() * 6) + 1 // Random dentist number between 1 and 6
            });
        }
        console.log(`${numAppointments} appointments created successfully.`);
    } catch (error) {
        console.error('Error generating appointments:', error);
    }
}

// Call the function to generate appointments dynamically
generateAppointments(20); // Generate 10 appointments





// Call the function to insert data into each table
await Promise.all([
    insertData(patientData, createPatient),
    insertData(dentistData, createDentist),
    insertData(treatmentData, createTreatment),

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

// Function to get appointments by treatment ID
export function getAppointmentsByTreatment(treatmentId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM appointments WHERE TreatmentNo = ?', [treatmentId], (err, appointments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointments);
        });
    });
}

// Function to get appointments by patient ID
export function getAppointmentsByPatient(patientId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM appointments WHERE PatientNo = ?', [patientId], (err, appointments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointments);
        });
    });
}

