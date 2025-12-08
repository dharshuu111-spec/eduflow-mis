import Header from '@/components/layout/Header';
import { students } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, Check, X } from 'lucide-react';

const StudentAttendance = () => {
  const studentData = students[0];

  // Mock attendance data for the month
  const attendanceRecords = [
    { date: '2025-10-01', status: 'P' },
    { date: '2025-10-02', status: 'P' },
    { date: '2025-10-03', status: 'P' },
    { date: '2025-10-04', status: 'A' },
    { date: '2025-10-05', status: 'P' },
    { date: '2025-10-06', status: 'P' },
    { date: '2025-10-07', status: 'P' },
    { date: '2025-10-08', status: 'P' },
    { date: '2025-10-09', status: 'A' },
    { date: '2025-10-10', status: 'P' },
    { date: '2025-10-11', status: 'P' },
    { date: '2025-10-12', status: 'P' },
    { date: '2025-10-13', status: 'P' },
    { date: '2025-10-14', status: 'P' },
    { date: '2025-10-15', status: 'P' },
    { date: '2025-10-16', status: 'P' },
    { date: '2025-10-17', status: 'P' },
    { date: '2025-10-18', status: 'P' },
    { date: '2025-10-19', status: 'P' },
    { date: '2025-10-20', status: 'P' },
    { date: '2025-10-21', status: 'P' },
    { date: '2025-10-22', status: 'P' },
    { date: '2025-10-23', status: 'P' },
    { date: '2025-10-24', status: 'P' },
    { date: '2025-10-25', status: 'P' },
  ];

  const presentCount = attendanceRecords.filter(r => r.status === 'P').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'A').length;
  const monthPercentage = Math.round((presentCount / attendanceRecords.length) * 100);

  return (
    <div className="animate-fade-in">
      <Header 
        title="My Attendance" 
        subtitle="View your attendance records"
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Overall %</p>
          <p className={cn(
            'text-2xl font-bold',
            studentData.attendancePercentage >= 85 ? 'text-success' : 'text-warning'
          )}>
            {studentData.attendancePercentage}%
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">This Month %</p>
          <p className="text-2xl font-bold text-info">{monthPercentage}%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Present (Oct)</p>
          <p className="text-2xl font-bold text-success">{presentCount}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Absent (Oct)</p>
          <p className="text-2xl font-bold text-destructive">{absentCount}</p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          October 2025
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for alignment */}
          <div></div>
          <div></div>
          
          {attendanceRecords.map((record, index) => {
            const date = new Date(record.date);
            const dayNum = date.getDate();
            
            return (
              <div
                key={record.date}
                className={cn(
                  'aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all',
                  record.status === 'P' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-destructive/20 text-destructive'
                )}
              >
                <span>{dayNum}</span>
                {record.status === 'P' ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/20"></div>
            <span className="text-sm text-muted-foreground">Present (P)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20"></div>
            <span className="text-sm text-muted-foreground">Absent (A)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
