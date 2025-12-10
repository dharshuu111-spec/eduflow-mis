import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database with sample data
function initializeDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      departments: [
        { id: '1', code: 'CP01', name: 'Tool & Dye', description: 'Tool and Dye Making' },
        { id: '2', code: 'CP04', name: 'Electronics and Embedded Systems', description: 'Electronics and Embedded Systems' },
        { id: '3', code: 'CP08', name: 'Computer Engineering', description: 'Computer Engineering' },
        { id: '4', code: 'CP09', name: 'IT & Data Science', description: 'Information Technology and Data Science' },
      ],
      teachers: [
        { id: '1', employee_id: 'T001', name: 'Mr. Jagadish G K', department: 'CP08', email: 'jagadish.gk@nec.edu', phone: '9876543210', subjects: ['ISA', 'BIT'], hours_allocated: 40, hours_completed: 35 },
        { id: '2', employee_id: 'T002', name: 'Mr. Sreedhar E', department: 'CP09', email: 'sreedhar.e@nec.edu', phone: '9876543211', subjects: ['RP', 'FSD'], hours_allocated: 45, hours_completed: 42 },
        { id: '3', employee_id: 'T003', name: 'Mrs. Bhuvana K', department: 'CP09', email: 'bhuvana.k@nec.edu', phone: '9876543212', subjects: ['FSD'], hours_allocated: 35, hours_completed: 30 },
        { id: '4', employee_id: 'T004', name: 'Mr. Vinil O C', department: 'CP09', email: 'vinil.oc@nec.edu', phone: '9876543213', subjects: ['FSD', 'PBO'], hours_allocated: 40, hours_completed: 38 },
        { id: '5', employee_id: 'T005', name: 'Mr. Enos Kerketta', department: 'CP09', email: 'enos.kerk@nec.edu', phone: '9876543214', subjects: ['ES'], hours_allocated: 30, hours_completed: 28 },
        { id: '6', employee_id: 'T006', name: 'Ms. Amrutha K', department: 'CP09', email: 'amrutha.k@nec.edu', phone: '9876543215', subjects: ['RP', 'PBO'], hours_allocated: 42, hours_completed: 40 },
        { id: '7', employee_id: 'T007', name: 'Mrs. Sarasa C', department: 'CP09', email: 'sarasa.c@nec.edu', phone: '9876543216', subjects: ['ETW'], hours_allocated: 35, hours_completed: 32 },
        { id: '8', employee_id: 'T008', name: 'Mr. Rajesh Kumar', department: 'CP08', email: 'rajesh.k@nec.edu', phone: '9876543217', subjects: ['ISA'], hours_allocated: 38, hours_completed: 35 },
        { id: '9', employee_id: 'T009', name: 'Ms. Priya Sharma', department: 'CP04', email: 'priya.s@nec.edu', phone: '9876543218', subjects: ['Electronics'], hours_allocated: 40, hours_completed: 37 },
        { id: '10', employee_id: 'T010', name: 'Mr. Arjun Nair', department: 'CP01', email: 'arjun.n@nec.edu', phone: '9876543219', subjects: ['Tool & Dye'], hours_allocated: 45, hours_completed: 43 },
      ],
      students: [
        { id: '1', token_no: 'NEC0923028', name: 'Rithick Roshan', department: 'CP09', section: 'A', semester: 5, email: 'rithick@nec.edu', phone: '9876543220', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
        { id: '2', token_no: 'NEC0923029', name: 'Nivash M', department: 'CP09', section: 'A', semester: 5, email: 'nivash@nec.edu', phone: '9876543221', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
        { id: '3', token_no: 'NEC0923032', name: 'Kabila Sri D', department: 'CP09', section: 'A', semester: 5, email: 'kabila@nec.edu', phone: '9876543222', attendance_percentage: 94, fee_status: 'pending', pending_amount: 15000 },
        { id: '4', token_no: 'NEC0923034', name: 'Abel Jamin E', department: 'CP09', section: 'A', semester: 5, email: 'abel@nec.edu', phone: '9876543223', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
        { id: '5', token_no: 'NEC0923038', name: 'Niranjan S', department: 'CP09', section: 'A', semester: 5, email: 'niranjan@nec.edu', phone: '9876543224', attendance_percentage: 82, fee_status: 'partial', pending_amount: 8000 },
        { id: '6', token_no: 'NEC0923044', name: 'Vishal P', department: 'CP09', section: 'A', semester: 5, email: 'vishal@nec.edu', phone: '9876543225', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
        { id: '7', token_no: 'NEC0923057', name: 'Soniya R', department: 'CP09', section: 'A', semester: 5, email: 'soniya@nec.edu', phone: '9876543226', attendance_percentage: 82, fee_status: 'paid', pending_amount: 0 },
        { id: '8', token_no: 'NEC0923058', name: 'Aginivesh Shaji', department: 'CP09', section: 'A', semester: 5, email: 'aginivesh@nec.edu', phone: '9876543227', attendance_percentage: 66, fee_status: 'pending', pending_amount: 25000 },
        { id: '9', token_no: 'NEC0923059', name: 'Nithish T', department: 'CP09', section: 'A', semester: 5, email: 'nithish@nec.edu', phone: '9876543228', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
        { id: '10', token_no: 'NEC0923060', name: 'Naveen N', department: 'CP09', section: 'A', semester: 5, email: 'naveen.n@nec.edu', phone: '9876543229', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
        { id: '11', token_no: 'NEC0923061', name: 'Akash S', department: 'CP09', section: 'A', semester: 5, email: 'akash@nec.edu', phone: '9876543230', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
        { id: '12', token_no: 'NEC0923063', name: 'Rahul K', department: 'CP09', section: 'A', semester: 5, email: 'rahul@nec.edu', phone: '9876543231', attendance_percentage: 94, fee_status: 'partial', pending_amount: 5000 },
        { id: '13', token_no: 'NEC0923064', name: 'Anish Kumar R', department: 'CP09', section: 'A', semester: 5, email: 'anish@nec.edu', phone: '9876543232', attendance_percentage: 66, fee_status: 'paid', pending_amount: 0 },
        { id: '14', token_no: 'NEC0923068', name: 'Prashanth Kumar', department: 'CP09', section: 'A', semester: 5, email: 'prashanth@nec.edu', phone: '9876543233', attendance_percentage: 94, fee_status: 'paid', pending_amount: 0 },
        { id: '15', token_no: 'NEC0923070', name: 'Naveen Kumar KP', department: 'CP09', section: 'A', semester: 5, email: 'naveen.kp@nec.edu', phone: '9876543234', attendance_percentage: 86, fee_status: 'pending', pending_amount: 20000 },
        { id: '16', token_no: 'NEC0923074', name: 'Charan V', department: 'CP09', section: 'A', semester: 5, email: 'charan@nec.edu', phone: '9876543235', attendance_percentage: 78, fee_status: 'paid', pending_amount: 0 },
        { id: '17', token_no: 'NEC0923094', name: 'Keerthika Y', department: 'CP09', section: 'A', semester: 5, email: 'keerthika@nec.edu', phone: '9876543236', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
        { id: '18', token_no: 'NEC0923083', name: 'Anubhrah Pramod', department: 'CP09', section: 'A', semester: 5, email: 'anubhrah@nec.edu', phone: '9876543237', attendance_percentage: 88, fee_status: 'paid', pending_amount: 0 },
        { id: '19', token_no: 'NEC0923100', name: 'Deepak R', department: 'CP08', section: 'B', semester: 5, email: 'deepak@nec.edu', phone: '9876543238', attendance_percentage: 92, fee_status: 'paid', pending_amount: 0 },
        { id: '20', token_no: 'NEC0923101', name: 'Meera S', department: 'CP04', section: 'A', semester: 4, email: 'meera@nec.edu', phone: '9876543239', attendance_percentage: 85, fee_status: 'paid', pending_amount: 0 },
      ],
      timetable_entries: [
        { id: '1', day: 'MON', batch: 'A', venue: 'CR1', time_slot: '9.00-10.00', subject: 'FSD', teacher_code: 'VOC', teacher_name: 'Mr. Vinil O C' },
        { id: '2', day: 'MON', batch: 'A', venue: 'CR1', time_slot: '10.00-11.00', subject: 'RP LAB', teacher_code: 'SE', teacher_name: 'Mr. Sreedhar E' },
        { id: '3', day: 'MON', batch: 'A', venue: 'CR1', time_slot: '11.15-12.15', subject: 'ETW', teacher_code: 'CS', teacher_name: 'Mrs. Sarasa C' },
        { id: '4', day: 'MON', batch: 'A', venue: 'CR1', time_slot: '12.15-1.15', subject: 'BIT LAB', teacher_code: 'JGK', teacher_name: 'Mr. Jagadish G K' },
        { id: '5', day: 'MON', batch: 'A', venue: 'CR1', time_slot: '1.45-2.45', subject: 'ISA', teacher_code: 'JGK', teacher_name: 'Mr. Jagadish G K' },
        { id: '6', day: 'MON', batch: 'A', venue: 'CR1', time_slot: '2.45-3.45', subject: 'ES', teacher_code: 'EK', teacher_name: 'Mr. Enos Kerketta' },
        { id: '7', day: 'MON', batch: 'B', venue: 'CL1', time_slot: '9.00-10.00', subject: 'RP', teacher_code: 'AMK', teacher_name: 'Ms. Amrutha K' },
        { id: '8', day: 'MON', batch: 'B', venue: 'CL1', time_slot: '12.15-1.15', subject: 'FSD LAB', teacher_code: 'VOC', teacher_name: 'Mr. Vinil O C' },
        { id: '9', day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '9.00-10.00', subject: 'PBO', teacher_code: 'AMK', teacher_name: 'Ms. Amrutha K' },
        { id: '10', day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '10.00-11.00', subject: 'ETW', teacher_code: 'CS', teacher_name: 'Mrs. Sarasa C' },
        { id: '11', day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '11.15-12.15', subject: 'ISA', teacher_code: 'JGK', teacher_name: 'Mr. Jagadish G K' },
        { id: '12', day: 'TUE', batch: 'A', venue: 'CR1', time_slot: '1.45-2.45', subject: 'RP LAB', teacher_code: 'SE', teacher_name: 'Mr. Sreedhar E' },
      ],
      class_activities: [
        { id: '1', date: '2025-04-01', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacher_name: 'Sreedhar E' },
        { id: '2', date: '2025-04-01', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-B', topic: 'Project', teacher_name: 'Amrutha M Kenchara' },
        { id: '3', date: '2025-04-01', time: '10:15 AM - 11:45 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacher_name: 'Bhuvana K' },
        { id: '4', date: '2025-04-01', time: '10:15 AM - 11:45 AM', batch: 'CP09 2023 JUN NEC-B', topic: 'Dynamic Website', teacher_name: 'Sreedhar E' },
        { id: '5', date: '2025-04-01', time: '12:15 PM - 1:15 PM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacher_name: 'ENOS KERKETTA' },
        { id: '6', date: '2025-04-01', time: '12:15 PM - 1:15 PM', batch: 'CP09 2024JUN NEC-A', topic: 'SQL Server Lab', teacher_name: 'C S SUNIL KUMAR' },
        { id: '7', date: '2025-04-02', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Full Stack Development', teacher_name: 'Vinil O C' },
        { id: '8', date: '2025-04-02', time: '10:15 AM - 11:45 AM', batch: 'CP09 2022JUN NEC-A', topic: 'React Components', teacher_name: 'Bhuvana K' },
        { id: '9', date: '2025-04-02', time: '12:15 PM - 1:15 PM', batch: 'CP09 2022JUN NEC-A', topic: 'Database Design', teacher_name: 'Jagadish G K' },
        { id: '10', date: '2025-04-03', time: '9:00 AM - 10:00 AM', batch: 'CP08 2022JUN NEC-A', topic: 'ISA Concepts', teacher_name: 'Jagadish G K' },
        { id: '11', date: '2025-04-03', time: '10:15 AM - 11:45 AM', batch: 'CP08 2022JUN NEC-A', topic: 'System Analysis', teacher_name: 'Rajesh Kumar' },
        { id: '12', date: '2025-04-04', time: '9:00 AM - 10:00 AM', batch: 'CP04 2022JUN NEC-A', topic: 'Embedded Systems', teacher_name: 'Priya Sharma' },
        { id: '13', date: '2025-04-04', time: '10:15 AM - 11:45 AM', batch: 'CP01 2022JUN NEC-A', topic: 'Tool Design', teacher_name: 'Arjun Nair' },
      ],
      subject_legends: [
        { id: '1', code: 'JGK', name: 'Mr. Jagadish G K' },
        { id: '2', code: 'SE', name: 'Mr. Sreedhar E' },
        { id: '3', code: 'BK', name: 'Mrs. Bhuvana K' },
        { id: '4', code: 'VOC', name: 'Mr. Vinil O C' },
        { id: '5', code: 'EK', name: 'Mr. Enos Kerketta' },
        { id: '6', code: 'AMK', name: 'Ms. Amrutha K' },
        { id: '7', code: 'CS', name: 'Mrs. Sarasa C' },
        { id: '8', code: 'ES', name: 'Employability Skills' },
        { id: '9', code: 'FSD', name: 'Full Stack Development' },
        { id: '10', code: 'RP', name: 'R-Programming' },
        { id: '11', code: 'ISA', name: 'Information System Analysis and System Documentation' },
        { id: '12', code: 'ETW', name: 'English Technical Writing' },
        { id: '13', code: 'BIT', name: 'Business IT Project' },
        { id: '14', code: 'PBO', name: 'Python Based Optimization' },
      ],
      department_attendance: [
        { id: '1', date: '2025-04-01', department_code: 'CP01', department_name: 'Tool & Dye', present: 42, total: 45, percentage: 94 },
        { id: '2', date: '2025-04-01', department_code: 'CP04', department_name: 'Electronics and Embedded Systems', present: 29, total: 32, percentage: 91 },
        { id: '3', date: '2025-04-01', department_code: 'CP08', department_name: 'Computer Engineering', present: 27, total: 28, percentage: 96 },
        { id: '4', date: '2025-04-01', department_code: 'CP09', department_name: 'IT & Data Science', present: 29, total: 32, percentage: 91 },
      ]
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('Database initialized with sample data');
  }
}

// Read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {};
  }
}

// Write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Database operations
const db = {
  // Get all records from a table
  all: (table, callback) => {
    const data = readDB();
    const records = data[table] || [];
    callback(null, records);
  },

  // Get single record by ID
  get: (table, id, callback) => {
    const data = readDB();
    const records = data[table] || [];
    const record = records.find(r => r.id === id);
    callback(null, record);
  },

  // Run query with conditions
  run: (query, params, callback) => {
    const data = readDB();

    if (query.includes('INSERT INTO')) {
      const table = query.match(/INSERT INTO (\w+)/)[1];
      if (!data[table]) data[table] = [];

      // Generate new ID
      const maxId = data[table].length > 0 ? Math.max(...data[table].map(r => parseInt(r.id))) : 0;
      const newRecord = { ...params[0], id: (maxId + 1).toString() };

      data[table].push(newRecord);
      writeDB(data);

      callback.call({ lastID: newRecord.id }, null);
    } else if (query.includes('UPDATE')) {
      const table = query.match(/UPDATE (\w+)/)[1];
      const id = params[params.length - 1];
      const recordIndex = data[table].findIndex(r => r.id === id);

      if (recordIndex !== -1) {
        Object.assign(data[table][recordIndex], params[0]);
        writeDB(data);
      }

      callback(null);
    } else if (query.includes('DELETE FROM')) {
      const table = query.match(/DELETE FROM (\w+)/)[1];
      const id = params[0];
      data[table] = data[table].filter(r => r.id !== id);
      writeDB(data);

      callback.call({ changes: 1 }, null);
    }
  }
};

// Initialize database
initializeDatabase();

export default db;