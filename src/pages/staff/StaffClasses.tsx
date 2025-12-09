import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { classActivities, timetableEntries } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CalendarCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

const StaffClasses = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter classes based on user's subjects
  const myClasses = timetableEntries.filter(entry => {
    if (user?.role === 'subject_incharge' && user?.subjects) {
      return user.subjects.some(sub => 
        entry.subject.toLowerCase().includes(sub.toLowerCase())
      );
    }
    return true;
  });

  const todayClasses = myClasses.filter(entry => entry.day === 'Monday'); // Mock for today

  const handleMarkAttendance = (classId: string) => {
    toast.success('Redirecting to attendance marking...');
  };

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="My Classes" 
        subtitle={`Subjects: ${user?.subjects?.join(', ') || 'All assigned subjects'}`}
      />

      {/* Date Selector */}
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Today's Schedule
        </h3>
        
        <div className="grid gap-4">
          {todayClasses.length > 0 ? (
            todayClasses.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium text-foreground">{entry.timeSlot.split('-')[0]}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{entry.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      Batch {entry.batch} • {entry.venue}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAttendance(entry.id)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Mark Attendance
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No classes scheduled for today.</p>
          )}
        </div>
      </div>

      {/* Recent Class Activities */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Class Activities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Batch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Topic Covered</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {classActivities.slice(0, 8).map((activity) => (
                <tr key={activity.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 text-sm text-foreground">{activity.date}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.time}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.batch}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{activity.topic}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffClasses;