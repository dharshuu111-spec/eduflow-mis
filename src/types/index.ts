export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface Student {
  id: string;
  tokenNo: string;
  name: string;
  department: string;
  section: 'A' | 'B';
  semester: number;
  email?: string;
  phone?: string;
  attendancePercentage: number;
  feeStatus: 'paid' | 'pending' | 'partial';
  pendingAmount?: number;
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  email: string;
  phone?: string;
  subjects: string[];
  hoursAllocated: number;
  hoursCompleted: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
  subject: string;
  hour: number;
}

export interface TimetableEntry {
  id: string;
  day: string;
  batch: 'A' | 'B';
  venue: string;
  timeSlot: string;
  subject: string;
  teacherCode: string;
  teacherName: string;
}

export interface DepartmentAttendance {
  departmentCode: string;
  departmentName: string;
  present: number;
  total: number;
  percentage: number;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  instructor?: string;
  section?: string;
}

export interface ClassActivity {
  id: string;
  date: string;
  time: string;
  batch: string;
  topic: string;
  teacherName: string;
}
