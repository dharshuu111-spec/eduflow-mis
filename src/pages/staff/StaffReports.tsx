import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { departments as mockDepartments, classActivities as mockActivities, subjectLegends as mockLegends } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Download, Calendar, FileSpreadsheet, Search } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Department, ClassActivity } from '@/types';

const StaffReports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');
  const [department, setDepartment] = useState('');
  const [instructor, setInstructor] = useState('');
  const [section, setSection] = useState('');
  const [showResults, setShowResults] = useState(false);

  // State for data
  const [departments] = useState<Department[]>(mockDepartments);
  const [classActivities] = useState<ClassActivity[]>(mockActivities);
  const [subjectLegends] = useState<any[]>(mockLegends);

  // Get available departments based on role
  const availableDepartments = useMemo(() => {
    if (!user) return [];
    
    switch (user.role) {
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
        return departments;
    }
  }, [user, departments]);

  // Set default department based on role
  useEffect(() => {
    if (user && user.department) {
      setDepartment(user.department);
    }
  }, [user]);

  // Get available instructors based on selected department and role
  const availableInstructors = useMemo(() => {
    if (!user) return [];

    // Subject incharge can only see their own data
    if (user.role === 'subject_incharge') {
      return [user.name];
    }

    let instructorsList: string[] = [];
    
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

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    setShowResults(true);
  };

  const handleExport = () => {
    const exportData = filteredActivities.map((activity) => {
      const date = new Date(activity.date);
      return {
        'Date': date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
        'Time': activity.time,
        'Batch': activity.batch,
        'Instructor': activity.teacherName,
        'Topic': activity.topic,
        'Hours': 1,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 40 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Report');

    const filename = `Staff_Report_${startDate}_to_${endDate}.xlsx`;
    XLSX.writeFile(workbook, filename);
    toast.success('Report downloaded successfully!');
  };

  // Calculate hours summary
  const totalHours = filteredActivities.length;
  const allocatedHours = 120;
  
  const monthlyData = [
    { month: 'April', allocated: 40, completed: 32 },
    { month: 'May', allocated: 40, completed: 28 },
    { month: 'June', allocated: 40, completed: 35 },
  ];

  // Get role label for display
  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'hod': return `HOD - ${user.department}`;
      case 'class_coordinator': return `Coordinator - ${user.department} Section ${user.section}`;
      case 'subject_incharge': return `Subject Incharge - ${user.name}`;
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Reports / MIS" 
        subtitle={`Generate and export activity reports • ${getRoleLabel()}`}
      />

      {/* Search Form */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Activity Report Search
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
                setInstructor('');
              }}
              className="input-field"
              disabled={user?.role !== 'admin' && user?.role !== 'hod'}
            >
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

      {/* Hours Summary */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total Hours Completed</p>
            <p className="text-3xl font-bold text-foreground">{totalHours}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Hours Allocated</p>
            <p className="text-3xl font-bold text-foreground">{allocatedHours}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Coverage</p>
            <p className="text-3xl font-bold text-primary">{Math.round((totalHours / allocatedHours) * 100)}%</p>
          </div>
        </div>
      )}

      {/* Results Table */}
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
                    <th className="text-left p-4 font-medium text-muted-foreground">HOURS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity) => {
                    const date = new Date(activity.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <tr key={activity.id} className="table-row">
                        <td className="p-4">
                          <span className="text-foreground font-medium">{dayName}, {formattedDate}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{activity.time}</td>
                        <td className="p-4">
                          <span className="text-info">{activity.batch}</span>
                        </td>
                        <td className="p-4 font-medium text-foreground">{activity.teacherName}</td>
                        <td className="p-4 text-muted-foreground">{activity.topic}</td>
                        <td className="p-4 text-foreground font-medium">1</td>
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

      {/* Monthly Breakdown - only show after search */}
      {showResults && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Monthly Hours Breakdown
          </h3>
          <div className="space-y-4">
            {monthlyData.map((data) => {
              const percent = Math.round((data.completed / data.allocated) * 100);
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{data.month} 2025</span>
                    <span className="text-muted-foreground">{data.completed}/{data.allocated} hours ({percent}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all',
                        percent >= 75 ? 'bg-success' : percent >= 50 ? 'bg-warning' : 'bg-destructive'
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffReports;