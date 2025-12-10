import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { Search, Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Department, ClassActivity } from '@/types';

const Reports = () => {
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');
  const [department, setDepartment] = useState('');
  const [instructor, setInstructor] = useState('');
  const [section, setSection] = useState('');
  const [showResults, setShowResults] = useState(false);

  // State for API data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [classActivities, setClassActivities] = useState<ClassActivity[]>([]);
  const [subjectLegends, setSubjectLegends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, activitiesRes, legendsRes] = await Promise.all([
          fetch('http://localhost:3001/api/departments'),
          fetch('http://localhost:3001/api/class-activities'),
          fetch('http://localhost:3001/api/subject-legends')
        ]);

        const departmentsData = await departmentsRes.json();
        const activitiesData = await activitiesRes.json();
        const legendsData = await legendsRes.json();

        setDepartments(departmentsData);
        setClassActivities(activitiesData);
        setSubjectLegends(legendsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    setShowResults(true);
  };

  const handleExport = () => {
    // Prepare data for Excel
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

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 }, // Date
      { wch: 15 }, // Time
      { wch: 15 }, // Batch
      { wch: 25 }, // Instructor
      { wch: 40 }, // Topic
      { wch: 10 }, // Hours
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Instructor Report');

    // Generate filename with date range
    const filename = `Instructor_Report_${startDate}_to_${endDate}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
    toast.success('Report downloaded successfully!');
  };

  const instructors = Array.from(new Set(subjectLegends.filter(l => l.name.includes('Mr.') || l.name.includes('Mrs.') || l.name.includes('Ms.')).map(l => l.name)));

  // Hierarchical filtering: instructors filtered by selected department
  const filteredInstructors = useMemo(() => {
    if (!department) {
      return instructors;
    }
    // Get instructors who have activities in the selected department
    const deptActivities = classActivities.filter(activity =>
      activity.batch.includes(department)
    );
    return Array.from(new Set(deptActivities.map(activity => activity.teacherName)));
  }, [department, instructors]);

  // Filter activities based on all selected criteria
  const filteredActivities = useMemo(() => {
    return classActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Date range filter
      if (activityDate < start || activityDate > end) {
        return false;
      }

      // Department filter
      if (department && !activity.batch.includes(department)) {
        return false;
      }

      // Instructor filter
      if (instructor && activity.teacherName !== instructor) {
        return false;
      }

      // Section filter
      if (section && !activity.batch.includes(section)) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, department, instructor, section]);

  return (
    <div className="animate-fade-in">
      <Header 
        title="Reports / MIS" 
        subtitle="Generate and export instructor timetable reports"
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
            <label className="block text-sm font-medium text-foreground mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.code}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Instructor</label>
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="input-field"
            >
              <option value="">All Instructors</option>
              {filteredInstructors.map((inst) => (
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
            >
              <option value="">#ALL#</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
          {showResults && (
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
              ACTIVITIES
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">DATE</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">TIME</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">BATCH</th>
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
                        {index === 0 && (
                          <button className="mt-2 px-3 py-1 bg-info text-info-foreground text-sm rounded-lg">
                            Day Notes
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">{activity.time}</td>
                      <td className="p-4">
                        <span className="text-info hover:underline cursor-pointer">{activity.batch}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">{activity.teacherName}</p>
                        <p className="text-sm text-muted-foreground">{activity.topic}</p>
                      </td>
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
