import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { students } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Check, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceState {
  [studentId: string]: 'present' | 'absent' | null;
}

const StaffAttendance = () => {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>(user?.section || 'A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<AttendanceState>({});

  // Filter students based on role
  const filteredStudents = students.filter(student => {
    const matchesDepartment = user?.department ? student.department === user.department : true;
    const matchesSection = student.section === selectedSection;
    const matchesSemester = user?.role === 'class_coordinator' && user?.semester 
      ? student.semester === user.semester 
      : true;
    
    return matchesDepartment && matchesSection && matchesSemester;
  });

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const newAttendance: AttendanceState = {};
    filteredStudents.forEach(s => { newAttendance[s.id] = 'present'; });
    setAttendance(newAttendance);
    toast.success('All students marked present');
  };

  const markAllAbsent = () => {
    const newAttendance: AttendanceState = {};
    filteredStudents.forEach(s => { newAttendance[s.id] = 'absent'; });
    setAttendance(newAttendance);
    toast.success('All students marked absent');
  };

  const saveAttendance = () => {
    const marked = Object.keys(attendance).length;
    if (marked === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }
    toast.success(`Attendance saved for ${marked} students`);
  };

  const getTitle = () => {
    if (user?.role === 'class_coordinator') {
      return `Mark Attendance - Semester ${user?.semester}`;
    } else if (user?.role === 'subject_incharge') {
      return `Mark Attendance - ${user?.subjects?.[0] || 'Subject'}`;
    }
    return `Mark Attendance - ${user?.department}`;
  };

  return (
    <div className="p-6 space-y-6">
      <Header 
        title={getTitle()} 
        subtitle="Mark daily attendance for your assigned students"
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Section Toggle */}
        {user?.role !== 'class_coordinator' && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Section</label>
            <div className="flex gap-2">
              {(['A', 'B'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    selectedSection === section
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="ml-auto flex gap-2">
          <button onClick={markAllPresent} className="btn-secondary text-success">
            <Check className="w-4 h-4 mr-1" /> All Present
          </button>
          <button onClick={markAllAbsent} className="btn-secondary text-destructive">
            <X className="w-4 h-4 mr-1" /> All Absent
          </button>
        </div>
      </div>

      {/* Access Info */}
      <div className="glass-card p-4 bg-primary/5 border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Access Level:</strong>{' '}
          {user?.role === 'hod' && `You can mark attendance for all classes in ${user?.department}.`}
          {user?.role === 'class_coordinator' && `You can mark attendance for Semester ${user?.semester}, Section ${user?.section}.`}
          {user?.role === 'subject_incharge' && `You can mark attendance for your subjects: ${user?.subjects?.join(', ')}.`}
        </p>
      </div>

      {/* Attendance Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Token No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Semester</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Mark</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{student.tokenNo}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{student.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{student.semester}</td>
                  <td className="py-3 px-4 text-center">
                    {attendance[student.id] ? (
                      <span className={cn(
                        'px-3 py-1 text-xs font-medium rounded-full',
                        attendance[student.id] === 'present' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      )}>
                        {attendance[student.id]}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not marked</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => markAttendance(student.id, 'present')}
                        className={cn(
                          'p-2 rounded-lg transition-all',
                          attendance[student.id] === 'present' 
                            ? 'bg-success text-white' 
                            : 'bg-muted hover:bg-success/20 text-muted-foreground hover:text-success'
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'absent')}
                        className={cn(
                          'p-2 rounded-lg transition-all',
                          attendance[student.id] === 'absent' 
                            ? 'bg-destructive text-white' 
                            : 'bg-muted hover:bg-destructive/20 text-muted-foreground hover:text-destructive'
                        )}
                      >
                        <X className="w-4 h-4" />
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
        <button onClick={saveAttendance} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default StaffAttendance;