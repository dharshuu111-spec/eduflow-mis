import Header from '@/components/layout/Header';
import { classActivities } from '@/data/mockData';
import { Calendar } from 'lucide-react';

const TeacherClasses = () => {
  const myClasses = classActivities.filter(a => 
    a.teacherName.toLowerCase().includes('sreedhar')
  );

  return (
    <div className="animate-fade-in">
      <Header 
        title="My Classes" 
        subtitle="View and manage your scheduled classes"
      />

      <div className="glass-card overflow-hidden">
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
              {myClasses.map((activity, index) => {
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
                    </td>
                    <td className="p-4 text-muted-foreground">{activity.time}</td>
                    <td className="p-4">
                      <span className="text-info">{activity.batch}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{activity.topic}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-warning/20 text-warning text-sm rounded-lg hover:bg-warning/30 transition-colors">
                          Attendance
                        </button>
                        <button className="px-3 py-1.5 bg-success/20 text-success text-sm rounded-lg hover:bg-success/30 transition-colors">
                          Class Activity
                        </button>
                        <button className="px-3 py-1.5 bg-info/20 text-info text-sm rounded-lg hover:bg-info/30 transition-colors">
                          Class Status
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
    </div>
  );
};

export default TeacherClasses;
