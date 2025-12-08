import Header from '@/components/layout/Header';
import { FileSpreadsheet, Download, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const TeacherReports = () => {
  const handleExport = () => {
    toast.success('Report exported to Excel successfully!');
  };

  const monthlyData = [
    { month: 'July 2024', hours: 14, percentage: 23 },
    { month: 'Aug 2024', hours: 13, percentage: 22 },
    { month: 'Sep 2024', hours: 22, percentage: 22 },
    { month: 'Oct 2024', hours: 22, percentage: 22 },
    { month: 'Nov 2024', hours: 22, percentage: 22 },
    { month: 'Dec 2024', hours: 23, percentage: 23 },
  ];

  return (
    <div className="animate-fade-in">
      <Header 
        title="My Reports" 
        subtitle="View your hours and activity summary"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Hours Completed</p>
              <p className="text-2xl font-bold text-foreground">116 hrs</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours Allocated</p>
              <p className="text-2xl font-bold text-foreground">120 hrs</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cumulative Coverage</p>
              <p className="text-2xl font-bold text-foreground">97%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-semibold text-foreground">Monthly Hours Breakdown</h3>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Month</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Hours Completed</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Coverage %</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, index) => {
                const cumulative = monthlyData.slice(0, index + 1).reduce((acc, curr) => acc + curr.hours, 0);
                return (
                  <tr key={row.month} className="table-row">
                    <td className="p-4 font-medium text-foreground">{row.month}</td>
                    <td className="p-4 text-foreground">{row.hours} hrs</td>
                    <td className="p-4">
                      <span className="department-badge bg-success/20 text-success">
                        {row.percentage}%
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{cumulative} hrs</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherReports;
