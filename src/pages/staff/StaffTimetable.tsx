import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { timetableEntries, subjectLegends } from '@/data/mockData';
import { cn } from '@/lib/utils';

const StaffTimetable = () => {
  const { user } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState<'A' | 'B'>(user?.section || 'A');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:30-10:15', '10:15-11:00', '11:15-12:00', '12:00-12:45', '13:30-14:15', '14:15-15:00', '15:00-15:45', '15:45-16:30'];

  // Filter timetable based on role
  const filteredEntries = timetableEntries.filter(entry => {
    const matchesBatch = entry.batch === selectedBatch;
    if (user?.role === 'subject_incharge' && user?.subjects) {
      return matchesBatch && user.subjects.some(sub => 
        entry.subject.toLowerCase().includes(sub.toLowerCase())
      );
    }
    return matchesBatch;
  });

  const getEntryForSlot = (day: string, timeSlot: string) => {
    return filteredEntries.find(e => e.day === day && e.timeSlot === timeSlot);
  };

  return (
    <div className="p-6 space-y-6">
      <Header 
        title={`Timetable - ${user?.department || 'Department'}`} 
        subtitle={user?.role === 'subject_incharge' 
          ? `Your subjects: ${user?.subjects?.join(', ')}` 
          : 'View class schedule'}
      />

      {/* Batch Toggle */}
      <div className="flex gap-2">
        {(['A', 'B'] as const).map((batch) => (
          <button
            key={batch}
            onClick={() => setSelectedBatch(batch)}
            className={cn(
              'px-6 py-2 rounded-lg font-medium transition-all',
              selectedBatch === batch
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Batch {batch}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-2 text-sm font-medium text-muted-foreground border-b border-border">Time</th>
                {days.map(day => (
                  <th key={day} className="py-3 px-2 text-sm font-medium text-muted-foreground border-b border-border">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td className="py-2 px-2 text-xs font-medium text-muted-foreground border-b border-border/50 bg-muted/30 whitespace-nowrap">
                    {slot}
                  </td>
                  {days.map((day) => {
                    const entry = getEntryForSlot(day, slot);
                    const isMySubject = user?.role === 'subject_incharge' && entry && 
                      user?.subjects?.some(sub => entry.subject.toLowerCase().includes(sub.toLowerCase()));
                    
                    return (
                      <td key={`${day}-${slot}`} className="py-1 px-1 border-b border-border/50">
                        {entry ? (
                          <div className={cn(
                            'p-2 rounded text-xs',
                            isMySubject 
                              ? 'bg-primary/20 border border-primary/40' 
                              : 'bg-muted/50'
                          )}>
                            <p className="font-medium text-foreground">{entry.subject}</p>
                            <p className="text-muted-foreground">{entry.teacherCode}</p>
                            <p className="text-muted-foreground text-[10px]">{entry.venue}</p>
                          </div>
                        ) : (
                          <div className="p-2 text-xs text-muted-foreground/50">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Subject Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {subjectLegends.slice(0, 8).map((legend) => (
            <div key={legend.code} className="flex items-center gap-2 text-xs">
              <span className="font-mono font-medium text-primary">{legend.code}</span>
              <span className="text-muted-foreground">{legend.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffTimetable;