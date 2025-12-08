import { useState } from 'react';
import Header from '@/components/layout/Header';
import { departments, students } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CalendarCheck, ChevronRight, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const Attendance = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent'>>({});

  const filteredStudents = students.filter(student => 
    student.department === selectedDepartment && student.section === selectedSection
  );

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const markedCount = Object.keys(attendanceData).length;
    if (markedCount === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }
    toast.success(`Attendance saved for ${markedCount} students`);
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newData: Record<string, 'present' | 'absent'> = {};
    filteredStudents.forEach(student => {
      newData[student.id] = status;
    });
    setAttendanceData(newData);
  };

  if (!selectedDepartment) {
    return (
      <div className="animate-fade-in">
        <Header 
          title="Attendance Management" 
          subtitle="Select a department to mark attendance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.code)}
              className="glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center mb-4 group-hover:bg-warning/30 transition-colors">
                  <CalendarCheck className="w-6 h-6 text-warning" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-warning transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{dept.code}</h3>
              <p className="text-sm text-muted-foreground mt-1">{dept.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSection) {
    return (
      <div className="animate-fade-in">
        <Header 
          title={`${selectedDepartment} - Select Section`} 
          subtitle="Choose a section to mark attendance"
        />

        <button 
          onClick={() => setSelectedDepartment(null)}
          className="text-primary hover:underline mb-6 flex items-center gap-2"
        >
          ← Back to Departments
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {['A', 'B'].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section as 'A' | 'B')}
              className="glass-card p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
            >
              <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-heading font-bold text-warning">{section}</span>
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground">Section {section}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header 
        title={`Mark Attendance - ${selectedDepartment} Section ${selectedSection}`} 
        subtitle="Mark student attendance for the day"
      />

      <button 
        onClick={() => setSelectedSection(null)}
        className="text-primary hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Sections
      </button>

      {/* Date Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => handleMarkAll('present')}
            className="btn-primary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Token No.</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Current %</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="table-row">
                  <td className="p-4 font-mono text-sm text-foreground">{student.tokenNo}</td>
                  <td className="p-4 font-medium text-foreground">{student.name}</td>
                  <td className="p-4">
                    <span className={cn(
                      'department-badge',
                      student.attendancePercentage >= 85 ? 'bg-success/20 text-success' :
                      student.attendancePercentage >= 75 ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    )}>
                      {student.attendancePercentage}%
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleMarkAttendance(student.id, 'present')}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium transition-all',
                          attendanceData[student.id] === 'present'
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-success/20 hover:text-success'
                        )}
                      >
                        P
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(student.id, 'absent')}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium transition-all',
                          attendanceData[student.id] === 'absent'
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-destructive/20 hover:text-destructive'
                        )}
                      >
                        A
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSaveAttendance} className="btn-primary">
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
