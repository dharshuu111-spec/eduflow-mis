import { useState } from 'react';
import Header from '@/components/layout/Header';
import { students } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

const TeacherAttendance = () => {
  const [selectedBatch, setSelectedBatch] = useState<'A' | 'B'>('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent'>>({});

  const filteredStudents = students.filter(student => 
    student.department === 'CP09' && student.section === selectedBatch
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
    toast.success(`Attendance saved for ${markedCount} students. Your hours have been updated.`);
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Mark Attendance" 
        subtitle="Mark attendance for your assigned batches"
      />

      {/* Batch Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          {['A', 'B'].map((batch) => (
            <button
              key={batch}
              onClick={() => setSelectedBatch(batch as 'A' | 'B')}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-all',
                selectedBatch === batch
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              CP09 - Batch {batch}
            </button>
          ))}
        </div>
        
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
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
                        <Check className="w-4 h-4" />
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
        <button onClick={handleSaveAttendance} className="btn-primary">
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendance;
