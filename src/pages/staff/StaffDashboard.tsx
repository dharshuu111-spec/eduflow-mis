import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import DepartmentAttendanceCard from '@/components/dashboard/DepartmentAttendanceCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import { useAuth } from '@/contexts/AuthContext';
import { departmentAttendance, classActivities } from '@/data/mockData';
import { 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Clock,
  FileText,
  Calendar
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  
  const getFilteredData = () => {
    if (user?.role === 'hod' || user?.role === 'class_coordinator' || user?.role === 'subject_incharge') {
      return departmentAttendance.filter(d => d.departmentCode === user.department);
    }
    return [];
  };

  const filteredAttendance = getFilteredData();
  
  const getRoleTitle = () => {
    switch (user?.role) {
      case 'hod': return `HOD Dashboard - ${user?.department}`;
      case 'class_coordinator': return `Class Coordinator - Semester ${user?.semester} Section ${user?.section}`;
      case 'subject_incharge': return `Subject Incharge Dashboard`;
      default: return 'Staff Dashboard';
    }
  };

  const getRoleSubtitle = () => {
    switch (user?.role) {
      case 'hod': return `Manage your department's students, teachers, and attendance`;
      case 'class_coordinator': return `Manage your assigned class attendance and reports`;
      case 'subject_incharge': return `View and manage attendance for your subjects: ${user?.subjects?.join(', ')}`;
      default: return 'Manage your assigned responsibilities';
    }
  };

  const todayActivities = classActivities.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <Header 
        title={getRoleTitle()} 
        subtitle={getRoleSubtitle()}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={user?.role === 'class_coordinator' ? '45' : '180'}
          icon={GraduationCap}
          trend={{ value: 'Your assigned', positive: true }}
        />
        <StatCard
          label="Today's Attendance"
          value={user?.role === 'class_coordinator' ? '42' : '165'}
          icon={CalendarCheck}
          trend={{ value: `${user?.role === 'class_coordinator' ? '93.3' : '91.6'}%`, positive: true }}
        />
        {user?.role === 'hod' && (
          <StatCard
            label="Teachers"
            value="8"
            icon={Users}
            trend={{ value: 'Department staff', positive: true }}
          />
        )}
        <StatCard
          label="Hours Completed"
          value="124"
          icon={Clock}
          trend={{ value: 'This month', positive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentAttendanceCard data={filteredAttendance.length > 0 ? filteredAttendance : departmentAttendance.slice(0, 1)} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <QuickActionCard
            label="Mark Attendance"
            description="Mark today's attendance"
            icon={CalendarCheck}
            path="/staff/attendance"
          />
          <QuickActionCard
            label="View Timetable"
            description="Check class schedule"
            icon={Calendar}
            path="/staff/timetable"
          />
          <QuickActionCard
            label="Generate Report"
            description="View hours and coverage"
            icon={FileText}
            path="/staff/reports"
          />
        </div>
      </div>

      {/* Today's Classes */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Activities</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Batch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Topic</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayActivities.map((activity) => (
                <tr key={activity.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 text-sm text-foreground">{activity.time}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{activity.batch}</td>
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

export default StaffDashboard;