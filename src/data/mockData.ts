import { Department, Student, Teacher, DepartmentAttendance, TimetableEntry, ClassActivity } from '@/types';

export const departments: Department[] = [
  { id: '1', code: 'CP01', name: 'Tool & Dye', description: 'Tool and Dye Making' },
  { id: '2', code: 'CP04', name: 'Electronics and Embedded Systems', description: 'Electronics and Embedded Systems' },
  { id: '3', code: 'CP08', name: 'Computer Engineering', description: 'Computer Engineering' },
  { id: '4', code: 'CP09', name: 'IT & Data Science', description: 'Information Technology and Data Science' },
];

export const departmentAttendance: DepartmentAttendance[] = [
  { departmentCode: 'CP01', departmentName: 'Tool & Dye', present: 42, total: 45, percentage: 94 },
  { departmentCode: 'CP04', departmentName: 'Electronics and Embedded Systems', present: 29, total: 32, percentage: 91 },
  { departmentCode: 'CP08', departmentName: 'Computer Engineering', present: 27, total: 28, percentage: 96 },
  { departmentCode: 'CP09', departmentName: 'IT & Data Science', present: 29, total: 32, percentage: 91 },
];

export const students: Student[] = [
  { id: '1', tokenNo: 'NEC0923028', name: 'Rithick Roshan', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 88, feeStatus: 'paid' },
  { id: '2', tokenNo: 'NEC0923029', name: 'Nivash M', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 88, feeStatus: 'paid' },
  { id: '3', tokenNo: 'NEC0923032', name: 'Kabila Sri D', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 94, feeStatus: 'pending', pendingAmount: 15000 },
  { id: '4', tokenNo: 'NEC0923034', name: 'Abel Jamin E', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 94, feeStatus: 'paid' },
  { id: '5', tokenNo: 'NEC0923038', name: 'Niranjan S', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 82, feeStatus: 'partial', pendingAmount: 8000 },
  { id: '6', tokenNo: 'NEC0923044', name: 'Vishal P', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 94, feeStatus: 'paid' },
  { id: '7', tokenNo: 'NEC0923057', name: 'Soniya R', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 82, feeStatus: 'paid' },
  { id: '8', tokenNo: 'NEC0923058', name: 'Aginivesh Shaji', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 66, feeStatus: 'pending', pendingAmount: 25000 },
  { id: '9', tokenNo: 'NEC0923059', name: 'Nithish T', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 88, feeStatus: 'paid' },
  { id: '10', tokenNo: 'NEC0923060', name: 'Naveen N', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 88, feeStatus: 'paid' },
  { id: '11', tokenNo: 'NEC0923061', name: 'Akash S', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 94, feeStatus: 'paid' },
  { id: '12', tokenNo: 'NEC0923063', name: 'Rahul K', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 94, feeStatus: 'partial', pendingAmount: 5000 },
  { id: '13', tokenNo: 'NEC0923064', name: 'Anish Kumar R', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 66, feeStatus: 'paid' },
  { id: '14', tokenNo: 'NEC0923068', name: 'Prashanth Kumar', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 94, feeStatus: 'paid' },
  { id: '15', tokenNo: 'NEC0923070', name: 'Naveen Kumar KP', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 86, feeStatus: 'pending', pendingAmount: 20000 },
  { id: '16', tokenNo: 'NEC0923074', name: 'Charan V', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 78, feeStatus: 'paid' },
  { id: '17', tokenNo: 'NEC0923094', name: 'Keerthika Y', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 88, feeStatus: 'paid' },
  { id: '18', tokenNo: 'NEC0923083', name: 'Anubhrah Pramod', department: 'CP09', section: 'A', semester: 5, attendancePercentage: 88, feeStatus: 'paid' },
];

export const teachers: Teacher[] = [];

export const timetableEntries: TimetableEntry[] = [
  { id: '1', day: 'MON', batch: 'A', venue: 'CR1', timeSlot: '9.00-10.00', subject: 'FSD', teacherCode: 'VOC', teacherName: 'Mr. Vinil O C' },
  { id: '2', day: 'MON', batch: 'A', venue: 'CR1', timeSlot: '10.00-11.00', subject: 'RP LAB', teacherCode: 'SE', teacherName: 'Mr. Sreedhar E' },
  { id: '3', day: 'MON', batch: 'A', venue: 'CR1', timeSlot: '11.15-12.15', subject: 'ETW', teacherCode: 'CS', teacherName: 'Mrs. Sarasa C' },
  { id: '4', day: 'MON', batch: 'A', venue: 'CR1', timeSlot: '12.15-1.15', subject: 'BIT LAB', teacherCode: 'JGK', teacherName: 'Mr. Jagadish G K' },
  { id: '5', day: 'MON', batch: 'A', venue: 'CR1', timeSlot: '1.45-2.45', subject: 'ISA', teacherCode: 'JGK', teacherName: 'Mr. Jagadish G K' },
  { id: '6', day: 'MON', batch: 'A', venue: 'CR1', timeSlot: '2.45-3.45', subject: 'ES', teacherCode: 'EK', teacherName: 'Mr. Enos Kerketta' },
  { id: '7', day: 'MON', batch: 'B', venue: 'CL1', timeSlot: '9.00-10.00', subject: 'RP', teacherCode: 'AMK', teacherName: 'Ms. Amrutha K' },
  { id: '8', day: 'MON', batch: 'B', venue: 'CL1', timeSlot: '12.15-1.15', subject: 'FSD LAB', teacherCode: 'VOC', teacherName: 'Mr. Vinil O C' },
  { id: '9', day: 'TUE', batch: 'A', venue: 'CR1', timeSlot: '9.00-10.00', subject: 'PBO', teacherCode: 'AMK', teacherName: 'Ms. Amrutha K' },
  { id: '10', day: 'TUE', batch: 'A', venue: 'CR1', timeSlot: '10.00-11.00', subject: 'ETW', teacherCode: 'CS', teacherName: 'Mrs. Sarasa C' },
  { id: '11', day: 'TUE', batch: 'A', venue: 'CR1', timeSlot: '11.15-12.15', subject: 'ISA', teacherCode: 'JGK', teacherName: 'Mr. Jagadish G K' },
  { id: '12', day: 'TUE', batch: 'A', venue: 'CR1', timeSlot: '1.45-2.45', subject: 'RP LAB', teacherCode: 'SE', teacherName: 'Mr. Sreedhar E' },
];

export const classActivities: ClassActivity[] = [
  { id: '1', date: '2025-04-01', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacherName: 'Sreedhar E' },
  { id: '2', date: '2025-04-01', time: '9:00 AM - 10:00 AM', batch: 'CP09 2022JUN NEC-B', topic: 'Project', teacherName: 'Amrutha M Kenchara' },
  { id: '3', date: '2025-04-01', time: '10:15 AM - 11:45 AM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacherName: 'Bhuvana K' },
  { id: '4', date: '2025-04-01', time: '10:15 AM - 11:45 AM', batch: 'CP09 2023 JUN NEC-B', topic: 'Dynamic Website', teacherName: 'Sreedhar E' },
  { id: '5', date: '2025-04-01', time: '12:15 PM - 1:15 PM', batch: 'CP09 2022JUN NEC-A', topic: 'Project', teacherName: 'ENOS KERKETTA' },
  { id: '6', date: '2025-04-01', time: '12:15 PM - 1:15 PM', batch: 'CP09 2024JUN NEC-A', topic: 'SQL Server Lab', teacherName: 'C S SUNIL KUMAR' },
];

export const subjectLegends = [
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
