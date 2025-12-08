import { useState } from 'react';
import Header from '@/components/layout/Header';
import { departments, timetableEntries, subjectLegends } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';

const days = ['MON', 'TUE', 'WED', 'THR', 'FRI'];
const timeSlots = [
  '9.00-10.00',
  '10.00-11.00',
  '11.15-12.15',
  '12.15-1.15',
  '1.45-2.45',
  '2.45-3.45',
];

const Timetable = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<'A' | 'B'>('A');

  const getEntry = (day: string, timeSlot: string) => {
    return timetableEntries.find(
      entry => entry.day === day && entry.timeSlot === timeSlot && entry.batch === selectedBatch
    );
  };

  if (!selectedDepartment) {
    return (
      <div className="animate-fade-in">
        <Header 
          title="Timetable Management" 
          subtitle="Select a department to view timetable"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.code)}
              className="glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center mb-4 group-hover:bg-info/30 transition-colors">
                  <Calendar className="w-6 h-6 text-info" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-info transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{dept.code}</h3>
              <p className="text-sm text-muted-foreground mt-1">{dept.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header 
        title={`${selectedDepartment} - Timetable`} 
        subtitle="Weekly class schedule"
      />

      <button 
        onClick={() => setSelectedDepartment(null)}
        className="text-primary hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Departments
      </button>

      {/* Batch Toggle */}
      <div className="flex gap-2 mb-6">
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
            Batch {batch}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 font-medium text-muted-foreground text-left">Day / Time</th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="p-4 font-medium text-muted-foreground text-center text-sm">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-border/50">
                  <td className="p-4 font-semibold text-foreground">{day}</td>
                  {timeSlots.map((slot) => {
                    const entry = getEntry(day, slot);
                    return (
                      <td key={slot} className="p-2 text-center">
                        {entry ? (
                          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <p className="font-medium text-primary text-sm">{entry.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1">({entry.teacherCode})</p>
                          </div>
                        ) : (
                          <div className="p-2 text-muted-foreground text-sm">-</div>
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
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Legends</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjectLegends.map((legend) => (
            <div key={legend.code} className="flex items-center gap-2">
              <span className="font-mono text-primary font-medium">{legend.code}</span>
              <span className="text-sm text-muted-foreground">- {legend.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
