import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { classActivities, subjectLegends } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const StaffReports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');

  // Filter activities based on role
  const filteredActivities = classActivities.filter(activity => {
    if (user?.role === 'subject_incharge' && user?.subjects) {
      return user.subjects.some(sub => 
        activity.topic.toLowerCase().includes(sub.toLowerCase())
      );
    }
    return true;
  });

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
  const monthlyData = [
    { month: 'April', allocated: 40, completed: 32 },
    { month: 'May', allocated: 40, completed: 28 },
    { month: 'June', allocated: 40, completed: 35 },
  ];

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="My Reports" 
        subtitle="View your hours and activity reports"
      />

      {/* Date Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Hours Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Total Hours Completed</p>
          <p className="text-3xl font-bold text-foreground">{totalHours}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Hours Allocated</p>
          <p className="text-3xl font-bold text-foreground">120</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Coverage</p>
          <p className="text-3xl font-bold text-primary">{Math.round((totalHours / 120) * 100)}%</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
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

      {/* Recent Activities */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Batch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Topic</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.slice(0, 10).map((activity) => (
                <tr key={activity.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 text-sm text-foreground">{activity.date}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.time}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.batch}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{activity.topic}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffReports;