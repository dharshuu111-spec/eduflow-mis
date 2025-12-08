import { useState } from 'react';
import Header from '@/components/layout/Header';
import { classActivities, subjectLegends } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Search, Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');
  const [instructor, setInstructor] = useState('');
  const [section, setSection] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    setShowResults(true);
  };

  const handleExport = () => {
    toast.success('Report exported to Excel successfully!');
  };

  const instructors = Array.from(new Set(subjectLegends.filter(l => l.name.includes('Mr.') || l.name.includes('Mrs.') || l.name.includes('Ms.')).map(l => l.name)));

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            <label className="block text-sm font-medium text-foreground mb-2">Instructor</label>
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="input-field"
            >
              <option value="">All Instructors</option>
              {instructors.map((inst) => (
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
                {classActivities.map((activity, index) => {
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
