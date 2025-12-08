import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { classActivities } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Users, CheckSquare } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();

  const todayClasses = classActivities.filter(a => 
    a.teacherName.toLowerCase().includes('sreedhar')
  );

  return (
    <div className="animate-fade-in">
      <Header 
        title="Teacher Dashboard" 
        subtitle={`Welcome back, ${user?.name}`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today's Classes"
          value={todayClasses.length}
          icon={Calendar}
          iconBg="bg-info/20"
          iconColor="text-info"
        />
        <StatCard
          label="Hours Completed"
          value="45"
          icon={Clock}
          iconBg="bg-success/20"
          iconColor="text-success"
        />
        <StatCard
          label="Hours Allocated"
          value="60"
          icon={Clock}
          iconBg="bg-warning/20"
          iconColor="text-warning"
        />
        <StatCard
          label="Students (CP09)"
          value="32"
          icon={Users}
          iconBg="bg-primary/20"
          iconColor="text-primary"
        />
      </div>

      {/* Today's Schedule */}
      <div className="glass-card p-6 mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Today's Schedule</h3>
        
        {todayClasses.length > 0 ? (
          <div className="space-y-3">
            {todayClasses.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.topic}</p>
                    <p className="text-sm text-muted-foreground">{activity.batch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{activity.time}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1 bg-warning/20 text-warning text-sm rounded-lg hover:bg-warning/30 transition-colors">
                      Mark Attendance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No classes scheduled for today</p>
        )}
      </div>

      {/* Hours Summary */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Hours Summary</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Completed Hours</span>
              <span className="font-medium text-foreground">45 / 60 hrs</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill bg-success" style={{ width: '75%' }} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-success">75%</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-warning">15 hrs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
