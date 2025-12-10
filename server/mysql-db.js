import mysql from 'mysql2';

// Create MySQL connection (without specifying database initially)
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: ''
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    console.log('Please make sure XAMPP MySQL is running.');
    return;
  }
  console.log('Connected to MySQL server.');

  // Create database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS eduflow_mis', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database eduflow_mis created/verified.');

    // Switch to the database
    db.changeUser({ database: 'eduflow_mis' }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }
      console.log('Switched to eduflow_mis database.');

      // Create tables and insert sample data
      initializeDatabase();
    });
  });
});

// Initialize database tables and insert sample data
function initializeDatabase() {
  // Create tables
  createTables();
}

function createTables() {
  console.log('Starting table creation...');

  // Departments table
  db.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(10) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating departments table:', err.message);
      console.error('SQL:', err.sql);
    } else {
      console.log('✅ Departments table created/verified');
    }
  });

  // Teachers table
  db.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(10) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(15),
      subjects JSON,
      hours_allocated INT DEFAULT 0,
      hours_completed INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating teachers table:', err);
    else console.log('Teachers table created/verified');
  });

  // Students table
  db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token_no VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(10) NOT NULL,
      section ENUM('A', 'B') NOT NULL,
      semester INT,
      email VARCHAR(100),
      phone VARCHAR(15),
      attendance_percentage DECIMAL(5,2) DEFAULT 0,
      fee_status ENUM('paid', 'pending', 'partial') DEFAULT 'pending',
      pending_amount DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating students table:', err);
    else console.log('Students table created/verified');
  });

  // Timetable entries table
  db.query(`
    CREATE TABLE IF NOT EXISTS timetable_entries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      day VARCHAR(10) NOT NULL,
      batch VARCHAR(5) NOT NULL,
      venue VARCHAR(20) NOT NULL,
      time_slot VARCHAR(20) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      teacher_code VARCHAR(10) NOT NULL,
      teacher_name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating timetable_entries table:', err);
    else console.log('Timetable entries table created/verified');
  });

  // Class activities table
  db.query(`
    CREATE TABLE IF NOT EXISTS class_activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      time VARCHAR(50) NOT NULL,
      batch VARCHAR(50) NOT NULL,
      topic VARCHAR(200) NOT NULL,
      teacher_name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating class_activities table:', err);
    else console.log('Class activities table created/verified');
  });

  // Subject legends table
  db.query(`
    CREATE TABLE IF NOT EXISTS subject_legends (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(10) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating subject_legends table:', err);
    else console.log('Subject legends table created/verified');
  });

  // Department attendance table
  db.query(`
    CREATE TABLE IF NOT EXISTS department_attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      department_code VARCHAR(10) NOT NULL,
      department_name VARCHAR(100) NOT NULL,
      present INT DEFAULT 0,
      total INT DEFAULT 0,
      percentage DECIMAL(5,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_date_dept (date, department_code)
    )
  `, (err) => {
    if (err) console.error('Error creating department_attendance table:', err);
    else {
      console.log('Department attendance table created/verified');
      // Insert sample data after all tables are created
      setTimeout(insertSampleData, 1000);
    }
  });
}

function insertSampleData() {
  console.log('Inserting sample data...');

  // Insert departments
  const departments = [
    { code: 'CP01', name: 'Tool & Dye', description: 'Tool and Dye Making' },
    { code: 'CP04', name: 'Electronics and Embedded Systems', description: 'Electronics and Embedded Systems' },
    { code: 'CP08', name: 'Computer Engineering', description: 'Computer Engineering' },
    { code: 'CP09', name: 'IT & Data Science', description: 'Information Technology and Data Science' },
  ];

  departments.forEach(dept => {
    db.query(
      'INSERT IGNORE INTO departments (code, name, description) VALUES (?, ?, ?)',
      [dept.code, dept.name, dept.description]
    );
  });

  // Insert subject legends
  const subjectLegends = [
    { code: 'JGK', name: 'Mr. Jagadish G K' },
    { code: 'SE', name: 'Mr. Sreedhar E' },
    { code: 'BK', name: 'Mrs. Bhuvana K' },
    { code: 'VOC', name: 'Mr. Vinil O C' },
    { code: 'EK', name: 'Mr. Enos Kerketta' },
    { code: 'AMK', name: 'Ms. Amrutha K' },
    { code: 'CS', name: 'Mrs. Sarasa C' },
    { code: 'ES', name: 'Employability Skills' },
    { code: 'FSD', name: 'Full Stack Development' },
    { code: 'RP', name: 'R-Programming' },
    { code: 'ISA', name: 'Information System Analysis and System Documentation' },
    { code: 'ETW', name: 'English Technical Writing' },
    { code: 'BIT', name: 'Business IT Project' },
    { code: 'PBO', name: 'Python Based Optimization' },
  ];

  subjectLegends.forEach(legend => {
    db.query(
      'INSERT IGNORE INTO subject_legends (code, name) VALUES (?, ?)',
      [legend.code, legend.name]
    );
  });

  // Insert teachers
  const teachers = [
    { employee_id: 'T001', name: 'Mr. Jagadish G K', department: 'CP08', email: 'jagadish.gk@nec.edu', phone: '9876543210', subjects: JSON.stringify(['ISA', 'BIT']), hours_allocated: 40, hours_completed: 35 },
    { employee_id: 'T002', name: 'Mr. Sreedhar E', department: 'CP09', email: 'sreedhar.e@nec.edu', phone: '9876543211', subjects: JSON.stringify(['RP', 'FSD']), hours_allocated: 45, hours_completed: 42 },
    { employee_id: 'T003', name: 'Mrs. Bhuvana K', department: 'CP09', email: 'bhuvana.k@nec.edu', phone: '9876543212', subjects: JSON.stringify(['FSD']), hours_allocated: 35, hours_completed: 30 },
    { employee_id: 'T004', name: 'Mr. Vinil O C', department: 'CP09', email: 'vinil.oc@nec.edu', phone: '9876543213', subjects: JSON.stringify(['FSD', 'PBO']), hours_allocated: 40, hours_completed: 38 },
    { employee_id: 'T005', name: 'Mr. Enos Kerketta', department: 'CP09', email: 'enos.kerk@nec.edu', phone: '9876543214', subjects: JSON.stringify(['ES']), hours_allocated: 30, hours_completed: 28 },
    { employee_id: 'T006', name: 'Ms. Amrutha K', department: 'CP09', email: 'amrutha.k@nec.edu', phone: '9876543215', subjects: JSON.stringify(['RP', 'PBO']), hours_allocated: 42, hours_completed: 40 },
    { employee_id: 'T007', name: 'Mrs. Sarasa C', department: 'CP09', email: 'sarasa.c@nec.edu', phone: '9876543216', subjects: JSON.stringify(['ETW']), hours_allocated: 35, hours_completed: 32 },
    { employee_id: 'T008', name: 'Mr. Rajesh Kumar', department: 'CP08', email: 'rajesh.k@nec.edu', phone: '9876543217', subjects: JSON.stringify(['ISA']), hours_allocated: 38, hours_completed: 35 },
    { employee_id: 'T009', name: 'Ms. Priya Sharma', department: 'CP04', email: 'priya.s@nec.edu', phone: '9876543218', subjects: JSON.stringify(['Electronics']), hours_allocated: 40, hours_completed: 37 },
    { employee_id: 'T010', name: 'Mr. Arjun Nair', department: 'CP01', email: 'arjun.n@nec.edu', phone: '9876543219', subjects: JSON.stringify(['Tool & Dye']), hours_allocated: 45, hours_completed: 43 },
  ];

  teachers.forEach(teacher => {
    db.query(
      'INSERT IGNORE INTO teachers (employee_id, name, department, email, phone, subjects, hours_allocated, hours_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [teacher.employee_id, teacher.name, teacher.department, teacher.email, teacher.phone, teacher.subjects, teacher.hours_allocated, teacher.hours_completed]
    );
  });

  // Insert students
  const students = [
    { token_no: 'NEC0923028', name: 'Rithick Roshan', department: 'CP09', section: 'A', semester: 5, email: 'rithick@nec.edu', phone: '9876543220', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923029', name: 'Nivash M', department: 'CP09', section: 'A', semester: 5, email: 'nivash@nec.edu', phone: '9876543221', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923032', name: 'Kabila Sri D', department: 'CP09', section: 'A', semester: 5, email: 'kabila@nec.edu', phone: '9876543222', attendance_percentage: 94, fee_status: 'pending', pending_amount: 15000 },
    { token_no: 'NEC0923034', name: 'Abel Jamin E', department: 'CP09', section: 'A', semester: 5, email: 'abel@nec.edu', phone: '9876543223', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923038', name: 'Niranjan S', department: 'CP09', section: 'A', semester: 5, email: 'niranjan@nec.edu', phone: '9876543224', attendance_percentage: 82, fee_status: 'partial', pending_amount: 8000 },
    { token_no: 'NEC0923044', name: 'Vishal P', department: 'CP09', section: 'A', semester: 5, email: 'vishal@nec.edu', phone: '9876543225', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923057', name: 'Soniya R', department: 'CP09', section: 'A', semester: 5, email: 'soniya@nec.edu', phone: '9876543226', attendance_percentage: 82, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923058', name: 'Aginivesh Shaji', department: 'CP09', section: 'A', semester: 5, email: 'aginivesh@nec.edu', phone: '9876543227', attendance_percentage: 66, fee_status: 'pending', pending_amount: 25000 },
    { token_no: 'NEC0923059', name: 'Nithish T', department: 'CP09', section: 'A', semester: 5, email: 'nithish@nec.edu', phone: '9876543228', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923060', name: 'Naveen N', department: 'CP09', section: 'A', semester: 5, email: 'naveen.n@nec.edu', phone: '9876543229', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923061', name: 'Akash S', department: 'CP09', section: 'A', semester: 5, email: 'akash@nec.edu', phone: '9876543230', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923063', name: 'Rahul K', department: 'CP09', section: 'A', semester: 5, email: 'rahul@nec.edu', phone: '9876543231', attendance_percentage: 94, fee_status: 'partial', pending_amount: 5000 },
    { token_no: 'NEC0923064', name: 'Anish Kumar R', department: 'CP09', section: 'A', semester: 5, email: 'anish@nec.edu', phone: '9876543232', attendance_percentage: 66, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923068', name: 'Prashanth Kumar', department: 'CP09', section: 'A', semester: 5, email: 'prashanth@nec.edu', phone: '9876543233', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923070', name: 'Naveen Kumar KP', department: 'CP09', section: 'A', semester: 5, email: 'naveen.kp@nec.edu', phone: '9876543234', attendance_percentage: 86, fee_status: 'pending', pending_amount: 20000 },
    { token_no: 'NEC0923074', name: 'Charan V', department: 'CP09', section: 'A', semester: 5, email: 'charan@nec.edu', phone: '9876543235', attendance_percentage: 78, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923094', name: 'Keerthika Y', department: 'CP09', section: 'A', semester: 5, email: 'keerthika@nec.edu', phone: '9876543236', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923083', name: 'Anubhrah Pramod', department: 'CP09', section: 'A', semester: 5, email: 'anubhrah@nec.edu', phone: '9876543237', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923100', name: 'Deepak R', department: 'CP08', section: 'B', semester: 5, email: 'deepak@nec.edu', phone: '9876543238', attendance_percentage: 92, fee_status: 'paid', pending_amount: 0 },
    { token_no: 'NEC0923101', name: 'Meera S', department: 'CP04', section: 'A', semester: 4, email: 'meera@nec.edu', phone: '9876543239', attendance_percentage: 85, fee_status: 'paid', pending_amount: 0 },
  ];

  students.forEach(student => {
    db.query(
      'INSERT IGNORE INTO students (token_no, name, department, section, semester, email, phone, attendance_percentage, fee_status, pending_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [student.token_no, student.name, student.department, student.section, student.semester, student.email, student.phone, student.attendance_percentage, student.fee_status, student.pending_amount]
    );
  });

  // Insert timetable entries
  const timetableEntries = [
    { day: 'MON', batch: 'A', venue: 'CR1', time_slot: '9.00-10.00', subject: 'FSD', teacher_code: 'VOC', teacher_name: 'Mr. Vinil O C' },
    { day: 'MON', batch: 'A', venue: 'CR1', time_slot: '10.00-11.00', subject: 'RP LAB', teacher_code: 'SE', teacher_name: 'Mr. Sreedhar E' },
    { day: 'MON', batch: 'A', venue: 'CR1', time_slot: '11.15-12.15', subject: 'ETW', teacher_code: 'CS', teacher_name: 'Mrs. Sarasa C' },
    { day: 'MON', batch: 'A', venue: 'CR1', time_slot: '12.15-1.15', subject: 'BIT LAB', teacher_code: 'JGK', teacher_name: 'Mr. Jagadish G K' },
    { day: 'MON', batch: 'A', venue: 'CR1', time_slot: '1.45-2.45', subject: 'ISA', teacher_code: 'JGK', teacher_name: 'Mr. Jagadish G K' },
    { day: 'MON', batch: 'A', venue: 'CR1', time_slot: '2.45-3.45', subject: 'ES', teacher_code: 'EK', teacher_name: 'Mr. Enos Kerketta' },
    { day: 'MON', batch: 'B', venue: 'CL1', time_slot: '9.00-10.00', subject: 'RP', teacher_code: 'AMK', teacher_name: 'Ms. Amrutha K' },
    { day: 'MON', batch: 'B', venue: 'CL1', time_slot: '12.15-1.15', subject: 'FSD LAB', teacher_code: 'VOC', teacher_name: 'Mr. Vinil O C' },
    { day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '9.00-10.00', subject: 'PBO', teacher_code: 'AMK', teacher_name: 'Ms. Amrutha K' },
    { day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '10.00-11.00', subject: 'ETW', teacher_code: 'CS', teacher_name: 'Mrs. Sarasa C' },
    { day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '11.15-12.15', subject: 'ISA', teacher_code: 'JGK', teacher_name: 'Mr. Jagadish G K' },
    { day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '1.45-2.45', subject: 'RP LAB', teacher_code: 'SE', teacher_name: 'Mr. Sreedhar E' },
  ];

  timetableEntries.forEach(entry => {
    db.query(
      'INSERT IGNORE INTO timetable_entries (day, batch, venue, time_slot, subject, teacher_code, teacher_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [entry.day, entry.batch, entry.venue, entry.time_slot, entry.subject, entry.teacher_code, entry.teacher_name]
    );
  });

  // Insert class activities
  const classActivities = [
    { date: '2025-04-01', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacher_name: 'Sreedhar E' },
    { date: '2025-04-01', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-B', topic: 'Project', teacher_name: 'Amrutha M Kenchara' },
    { date: '2025-04-01', time: '10:15 AM - 11:45 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacher_name: 'Bhuvana K' },
    { date: '2025-04-01', time: '10:15 AM - 11:45 AM', batch: 'CP09 2023 JUN NEC-B', topic: 'Dynamic Website', teacher_name: 'Sreedhar E' },
    { date: '2025-04-01', time: '12:15 PM - 1:15 PM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacher_name: 'ENOS KERKETTA' },
    { date: '2025-04-01', time: '12:15 PM - 1:15 PM', batch: 'CP09 2024JUN NEC-A', topic: 'SQL Server Lab', teacher_name: 'C S SUNIL KUMAR' },
    { date: '2025-04-02', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Full Stack Development', teacher_name: 'Vinil O C' },
    { date: '2025-04-02', time: '10:15 AM - 11:45 AM', batch: 'CP09 2022JUN NEC-A', topic: 'React Components', teacher_name: 'Bhuvana K' },
    { date: '2025-04-02', time: '12:15 PM - 1:15 PM', batch: 'CP09 2022JUN NEC-A', topic: 'Database Design', teacher_name: 'Jagadish G K' },
    { date: '2025-04-03', time: '9:00 AM - 10:00 AM', batch: 'CP08 2022JUN NEC-A', topic: 'ISA Concepts', teacher_name: 'Jagadish G K' },
    { date: '2025-04-03', time: '10:15 AM - 11:45 AM', batch: 'CP08 2022JUN NEC-A', topic: 'System Analysis', teacher_name: 'Rajesh Kumar' },
    { date: '2025-04-04', time: '9:00 AM - 10:00 AM', batch: 'CP04 2022JUN NEC-A', topic: 'Embedded Systems', teacher_name: 'Priya Sharma' },
    { date: '2025-04-04', time: '10:15 AM - 11:45 AM', batch: 'CP01 2022JUN NEC-A', topic: 'Tool Design', teacher_name: 'Arjun Nair' },
  ];

  classActivities.forEach(activity => {
    db.query(
      'INSERT IGNORE INTO class_activities (date, time, batch, topic, teacher_name) VALUES (?, ?, ?, ?, ?)',
      [activity.date, activity.time, activity.batch, activity.topic, activity.teacher_name]
    );
  });

  // Insert department attendance
  const departmentAttendance = [
    { date: '2025-04-01', department_code: 'CP01', department_name: 'Tool & Dye', present: 42, total: 45, percentage: 94 },
    { date: '2025-04-01', department_code: 'CP04', department_name: 'Electronics and Embedded Systems', present: 29, total: 32, percentage: 91 },
    { date: '2025-04-01', department_code: 'CP08', department_name: 'Computer Engineering', present: 27, total: 28, percentage: 96 },
    { date: '2025-04-01', department_code: 'CP09', department_name: 'IT & Data Science', present: 29, total: 32, percentage: 91 },
  ];

  departmentAttendance.forEach(attendance => {
    db.query(
      'INSERT IGNORE INTO department_attendance (date, department_code, department_name, present, total, percentage) VALUES (?, ?, ?, ?, ?, ?)',
      [attendance.date, attendance.department_code, attendance.department_name, attendance.present, attendance.total, attendance.percentage]
    );
  });

  console.log('Sample data inserted successfully');
}

// Export database object with MySQL-compatible methods
const dbWrapper = {
  // Get all records from a table
  all: (query, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    // Handle different query types
    if (query.includes('SELECT')) {
      db.query(query, params, (err, results) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    } else {
      // For INSERT, UPDATE, DELETE
      db.query(query, params, (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    }
  },

  // Get single record
  get: (query, params, callback) => {
    db.query(query, params, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results[0] || null);
      }
    });
  },

  // Run query (INSERT, UPDATE, DELETE)
  run: (query, params, callback) => {
    db.query(query, params, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        // For INSERT queries, return insertId
        if (query.toUpperCase().includes('INSERT')) {
          callback.call({ lastID: result.insertId }, null);
        } else {
          callback(null, result);
        }
      }
    });
  }
};

export default dbWrapper;