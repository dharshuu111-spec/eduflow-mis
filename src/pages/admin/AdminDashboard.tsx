import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import DepartmentAttendanceCard from '@/components/dashboard/DepartmentAttendanceCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import { departmentAttendance, students } from '@/data/mockData';
import { Users, GraduationCap, CalendarCheck, IndianRupee, UserPlus, Calendar, FileText, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
  const totalStudents = students.length;
  const totalTeachers = 10; // Mock data
  const overallAttendance = 94.2;
  const pendingFees = '₹2.4L';

  return (
    <div className="animate-fade-in">
      <Header 
        title="Administrator Dashboard" 
        subtitle="Complete system overview and management controls"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          iconBg="bg-info/20"
          iconColor="text-info"
        />
        <StatCard
          label="Total Teachers"
          value={totalTeachers}
          icon={Users}
          iconBg="bg-success/20"
          iconColor="text-success"
        />
        <StatCard
          label="Attendance Rate"
          value={`${overallAttendance}%`}
          icon={CalendarCheck}
          iconBg="bg-warning/20"
          iconColor="text-warning"
        />
        <StatCard
          label="Pending Fees"
          value={pendingFees}
          icon={IndianRupee}
          iconBg="bg-destructive/20"
          iconColor="text-destructive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Attendance - Takes 2 columns */}
        <div className="lg:col-span-2">
          <DepartmentAttendanceCard data={departmentAttendance} />
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Frequently used administrative tools</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              label="Add Student"
              description="Create a new student profile"
              icon={UserPlus}
              path="/admin/students/add"
              variant="info"
            />
            <QuickActionCard
              label="Mark Attendance"
              description="Update class attendance"
              icon={CheckSquare}
              path="/admin/attendance"
              variant="primary"
            />
            <QuickActionCard
              label="View Timetable"
              description="Check daily schedule"
              icon={Calendar}
              path="/admin/timetable"
              variant="warning"
            />
            <QuickActionCard
              label="Fee Reports"
              description="Analyze pending payments"
              icon={FileText}
              path="/admin/reports"
              variant="danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
