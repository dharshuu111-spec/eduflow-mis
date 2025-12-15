import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { Search, Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Department, ClassActivity } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { departments as mockDepartments, classActivities as mockActivities, subjectLegends as mockLegends } from '@/data/mockData';

const Reports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');
  const [department, setDepartment] = useState('');
  const [instructor, setInstructor] = useState('');
  const [section, setSection] = useState('');
  const [showResults, setShowResults] = useState(false);

  // State for data
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [classActivities, setClassActivities] = useState<ClassActivity[]>(mockActivities);
  const [subjectLegends, setSubjectLegends] = useState<any[]>(mockLegends);

  // Get available departments based on role
  const availableDepartments = useMemo(() => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        // Admin can see all departments
        return departments;
      case 'hod':
        // HOD can only see their department
        return departments.filter(dept => dept.code === user.department);
      case 'class_coordinator':
        // Coordinator can only see their department
        return departments.filter(dept => dept.code === user.department);
      case 'subject_incharge':
        // Subject incharge can only see their department
        return departments.filter(dept => dept.code === user.department);
      default:
        return [];
    }
  }, [user, departments]);

  // Set default department based on role
  useEffect(() => {
    if (user && user.role !== 'admin' && user.department) {
      setDepartment(user.department);
    }
  }, [user]);

  // Get available instructors based on selected department and role
  const availableInstructors = useMemo(() => {
    if (!user) return [];

    // Get instructors from activities
    let instructorsList: string[] = [];
    
    if (user.role === 'subject_incharge') {
      // Subject incharge can only see their own data
      return [user.name];
    }

    // Filter activities based on department
    const deptFilter = department || user?.department;
    if (deptFilter) {
      const deptActivities = classActivities.filter(activity =>
        activity.batch.includes(deptFilter)
      );
      instructorsList = Array.from(new Set(deptActivities.map(activity => activity.teacherName)));
    } else {
      instructorsList = Array.from(new Set(
        subjectLegends
          .filter(l => l.name.includes('Mr.') || l.name.includes('Mrs.') || l.name.includes('Ms.'))
          .map(l => l.name)
      ));
    }

    // For class coordinator, filter to only staff allocated to their class
    if (user.role === 'class_coordinator' && user.section) {
      const sectionActivities = classActivities.filter(activity =>
        activity.batch.includes(user.department!) && 
        activity.batch.includes(user.section!)
      );
      instructorsList = Array.from(new Set(sectionActivities.map(activity => activity.teacherName)));
    }

    return instructorsList;
  }, [user, department, classActivities, subjectLegends]);

  // Get available sections based on role
  const availableSections = useMemo(() => {
    if (!user) return ['A', 'B'];
    
    if (user.role === 'class_coordinator' && user.section) {
      // Coordinator can only see their section
      return [user.section];
    }
    
    return ['A', 'B'];
  }, [user]);

  // Set default section for class coordinator
  useEffect(() => {
    if (user && user.role === 'class_coordinator' && user.section) {
      setSection(user.section);
    }
    if (user && user.role === 'subject_incharge') {
      setInstructor(user.name);
    }
  }, [user]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    setShowResults(true);
  };

  const handleExport = () => {
    // Get unique subjects from filtered activities
    const subjectMap = new Map<string, { 
      subject: string; 
      hoursPerSemester: number; 
      plannedHours: number; 
      coveredHours: number;
      monthlyHours: { [key: string]: number };
    }>();

    // Calculate hours per subject and month
    filteredActivities.forEach((activity) => {
      const subject = activity.topic.split(' - ')[0] || activity.topic;
      const date = new Date(activity.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, {
          subject,
          hoursPerSemester: 60, // Default semester hours
          plannedHours: 0,
          coveredHours: 0,
          monthlyHours: {}
        });
      }
      
      const subjectData = subjectMap.get(subject)!;
      subjectData.coveredHours += 1;
      subjectData.plannedHours = Math.max(subjectData.plannedHours, subjectData.coveredHours + 5);
      subjectData.monthlyHours[monthKey] = (subjectData.monthlyHours[monthKey] || 0) + 1;
    });

    // Get all unique months from the data
    const allMonths = new Set<string>();
    subjectMap.forEach((data) => {
      Object.keys(data.monthlyHours).forEach(month => allMonths.add(month));
    });
    const monthsArray = Array.from(allMonths);

    // Prepare data for Excel in the requested format
    const exportData = Array.from(subjectMap.values()).map((data, index) => {
      const coveragePercent = data.plannedHours > 0 
        ? Math.round((data.coveredHours / data.plannedHours) * 100) 
        : 0;
      
      const row: any = {
        'S.No': index + 1,
        'Subject': data.subject,
        'Hours/Semester': data.hoursPerSemester,
        'Planned Hours': data.plannedHours,
        'Covered Hours': data.coveredHours,
        'Coverage %': `${coveragePercent}%`,
      };

      // Add monthly columns
      monthsArray.forEach(month => {
        row[month] = data.monthlyHours[month] || 0;
      });

      return row;
    });

    // Add totals row
    const totals: any = {
      'S.No': '',
      'Subject': 'TOTAL',
      'Hours/Semester': exportData.reduce((sum, row) => sum + row['Hours/Semester'], 0),
      'Planned Hours': exportData.reduce((sum, row) => sum + row['Planned Hours'], 0),
      'Covered Hours': exportData.reduce((sum, row) => sum + row['Covered Hours'], 0),
      'Coverage %': '',
    };
    monthsArray.forEach(month => {
      totals[month] = exportData.reduce((sum, row) => sum + (row[month] || 0), 0);
    });
    
    // Calculate overall coverage percentage
    if (totals['Planned Hours'] > 0) {
      totals['Coverage %'] = `${Math.round((totals['Covered Hours'] / totals['Planned Hours']) * 100)}%`;
    }
    exportData.push(totals);

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const colWidths = [
      { wch: 6 },  // S.No
      { wch: 35 }, // Subject
      { wch: 15 }, // Hours/Semester
      { wch: 14 }, // Planned Hours
      { wch: 14 }, // Covered Hours
      { wch: 12 }, // Coverage %
    ];
    monthsArray.forEach(() => colWidths.push({ wch: 8 }));
    worksheet['!cols'] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Syllabus Coverage Report');

    // Generate filename with date range
    const deptName = department || 'All';
    const filename = `Syllabus_Coverage_${deptName}_${startDate}_to_${endDate}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
    toast.success('Report downloaded successfully!');
  };

  // Filter activities based on all selected criteria and role
  const filteredActivities = useMemo(() => {
    return classActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Date range filter
      if (activityDate < start || activityDate > end) {
        return false;
      }

      // Role-based filtering
      if (user) {
        // HOD can only see their department
        if (user.role === 'hod' && user.department && !activity.batch.includes(user.department)) {
          return false;
        }
        
        // Class coordinator can only see their class/section
        if (user.role === 'class_coordinator') {
          if (user.department && !activity.batch.includes(user.department)) {
            return false;
          }
          if (user.section && !activity.batch.includes(user.section)) {
            return false;
          }
        }
        
        // Subject incharge can only see their own data
        if (user.role === 'subject_incharge' && activity.teacherName !== user.name) {
          return false;
        }
      }

      // Additional filters from UI
      if (department && !activity.batch.includes(department)) {
        return false;
      }

      if (instructor && activity.teacherName !== instructor) {
        return false;
      }

      if (section && !activity.batch.includes(section)) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, department, instructor, section, user, classActivities]);

  // Get role label for display
  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin': return 'All Courses Access';
      case 'hod': return `HOD - ${user.department}`;
      case 'class_coordinator': return `Coordinator - ${user.department} Section ${user.section}`;
      case 'subject_incharge': return `Subject Incharge - ${user.name}`;
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Reports / MIS" 
        subtitle={`Generate and export instructor timetable reports • ${getRoleLabel()}`}
      />

      {/* Search Form */}
      <div className="glass-card p-6 mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Instructor Time Table Search
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Course/Department</label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setInstructor(''); // Reset instructor when department changes
              }}
              className="input-field"
              disabled={user?.role !== 'admin'}
            >
              {user?.role === 'admin' && <option value="">All Departments</option>}
              {availableDepartments.map((dept) => (
                <option key={dept.id} value={dept.code}>{dept.code} - {dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Staff/Instructor</label>
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="input-field"
              disabled={user?.role === 'subject_incharge'}
            >
              {user?.role !== 'subject_incharge' && <option value="">All Instructors</option>}
              {availableInstructors.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="input-field"
              disabled={user?.role === 'class_coordinator'}
            >
              {user?.role !== 'class_coordinator' && <option value="">#ALL#</option>}
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
          {showResults && filteredActivities.length > 0 && (
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 bg-success/20 text-success border-success/30 hover:bg-success/30">
              <FileSpreadsheet className="w-4 h-4" />
              Export to Excel
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="glass-card overflow-hidden animate-slide-up">
          <div className="bg-warning/20 p-4 border-b border-border">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning" />
              ACTIVITIES ({filteredActivities.length} records)
            </h3>
          </div>
          
          {filteredActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">DATE</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">TIME</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">BATCH</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">INSTRUCTOR</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">TOPIC</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity, index) => {
                    const date = new Date(activity.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    const dayNum = date.getDate();

                    return (
                      <tr key={activity.id} className="table-row">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-foreground">{dayNum}</span>
                            <div>
                              <p className="font-medium text-foreground">{dayName}</p>
                              <p className="text-xs text-muted-foreground">{formattedDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{activity.time}</td>
                        <td className="p-4">
                          <span className="text-info hover:underline cursor-pointer">{activity.batch}</span>
                        </td>
                        <td className="p-4 font-medium text-foreground">{activity.teacherName}</td>
                        <td className="p-4 text-muted-foreground">{activity.topic}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-warning/20 text-warning text-sm rounded-lg hover:bg-warning/30 transition-colors">
                              Attendance
                            </button>
                            <button className="px-3 py-1.5 bg-success/20 text-success text-sm rounded-lg hover:bg-success/30 transition-colors">
                              Class Activity
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No Records Found</h3>
              <p className="text-muted-foreground">No activities match your search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!showResults && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No Report Generated</h3>
          <p className="text-muted-foreground">Select date range and click "Search" to generate reports</p>
        </div>
      )}
    </div>
  );
};

export default Reports;