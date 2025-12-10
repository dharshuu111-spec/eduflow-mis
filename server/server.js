import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './mysql-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes

// Get all departments
app.get('/api/departments', (req, res) => {
  db.all('SELECT * FROM departments ORDER BY code', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get department by code
app.get('/api/departments/:code', (req, res) => {
  db.get('SELECT * FROM departments WHERE code = ?', [req.params.code], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Get all teachers
app.get('/api/teachers', (req, res) => {
  const { department } = req.query;
  let query = 'SELECT * FROM teachers';
  let params = [];

  if (department) {
    query += ' WHERE department = ?';
    params.push(department);
  }

  query += ' ORDER BY name';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Parse subjects JSON
    rows.forEach(row => {
      if (row.subjects) {
        try {
          row.subjects = JSON.parse(row.subjects);
        } catch (e) {
          row.subjects = [];
        }
      }
    });
    res.json(rows);
  });
});

// Add new teacher
app.post('/api/teachers', (req, res) => {
  const { employee_id, name, department, email, phone, subjects } = req.body;

  if (!employee_id || !name || !department || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const subjectsJson = JSON.stringify(subjects || []);

  db.run(
    'INSERT INTO teachers (employee_id, name, department, email, phone, subjects) VALUES (?, ?, ?, ?, ?, ?)',
    [employee_id, name, department, email, phone, subjectsJson],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Teacher added successfully' });
    }
  );
});

// Update teacher
app.put('/api/teachers/:id', (req, res) => {
  const { employee_id, name, department, email, phone, subjects } = req.body;
  const subjectsJson = JSON.stringify(subjects || []);

  db.run(
    'UPDATE teachers SET employee_id = ?, name = ?, department = ?, email = ?, phone = ?, subjects = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [employee_id, name, department, email, phone, subjectsJson, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Teacher updated successfully' });
    }
  );
});

// Delete teacher
app.delete('/api/teachers/:id', (req, res) => {
  db.run('DELETE FROM teachers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Teacher deleted successfully' });
  });
});

// Get all students
app.get('/api/students', (req, res) => {
  const { department } = req.query;
  let query = 'SELECT * FROM students';
  let params = [];

  if (department) {
    query += ' WHERE department = ?';
    params.push(department);
  }

  query += ' ORDER BY name';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new student
app.post('/api/students', (req, res) => {
  const { token_no, name, department, section, semester, email, phone, attendance_percentage, fee_status, pending_amount } = req.body;

  if (!token_no || !name || !department) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO students (token_no, name, department, section, semester, email, phone, attendance_percentage, fee_status, pending_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [token_no, name, department, section, semester, email, phone, attendance_percentage || 0, fee_status || 'pending', pending_amount || 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Student added successfully' });
    }
  );
});

// Update student
app.put('/api/students/:id', (req, res) => {
  const { token_no, name, department, section, semester, email, phone, attendance_percentage, fee_status, pending_amount } = req.body;

  db.run(
    'UPDATE students SET token_no = ?, name = ?, department = ?, section = ?, semester = ?, email = ?, phone = ?, attendance_percentage = ?, fee_status = ?, pending_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [token_no, name, department, section, semester, email, phone, attendance_percentage, fee_status, pending_amount, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Get timetable entries
app.get('/api/timetable', (req, res) => {
  db.all('SELECT * FROM timetable_entries ORDER BY day, time_slot', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get class activities
app.get('/api/class-activities', (req, res) => {
  const { startDate, endDate, department, instructor, section } = req.query;

  let query = 'SELECT * FROM class_activities WHERE 1=1';
  let params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  if (department) {
    query += ' AND batch LIKE ?';
    params.push(`%${department}%`);
  }

  if (instructor) {
    query += ' AND teacher_name LIKE ?';
    params.push(`%${instructor}%`);
  }

  if (section) {
    query += ' AND batch LIKE ?';
    params.push(`%${section}%`);
  }

  query += ' ORDER BY date DESC, time DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get subject legends
app.get('/api/subject-legends', (req, res) => {
  db.all('SELECT * FROM subject_legends ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get department attendance
app.get('/api/department-attendance', (req, res) => {
  db.all('SELECT * FROM department_attendance ORDER BY date DESC, department_code', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};

  // Get total students
  db.get('SELECT COUNT(*) as total FROM students', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalStudents = row.total;

    // Get total teachers
    db.get('SELECT COUNT(*) as total FROM teachers', [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalTeachers = row.total;

      // Get departments count
      db.get('SELECT COUNT(*) as total FROM departments', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalDepartments = row.total;

        // Get today's attendance
        db.get('SELECT SUM(present) as present, SUM(total) as total FROM department_attendance WHERE date = date("now")', [], (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.todayAttendance = {
            present: row.present || 0,
            total: row.total || 0,
            percentage: row.total ? Math.round((row.present / row.total) * 100) : 0
          };

          res.json(stats);
        });
      });
    });
  });
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database file: ${path.join(__dirname, 'eduflow.db')}`);
});