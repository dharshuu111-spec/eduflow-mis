import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { students } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CalendarCheck, IndianRupee, GraduationCap, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Mock student data - In real app, this would come from the database
  const studentData = students[0];

  return (
    <div className="animate-fade-in">
      <Header 
        title="Student Dashboard" 
        subtitle={`Welcome back, ${user?.name}`}
      />

      {/* Profile Card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-heading font-bold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">Token No: {studentData.tokenNo}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="department-badge bg-primary/20 text-primary">
                {studentData.department}
              </span>
              <span className="department-badge bg-info/20 text-info">
                Section {studentData.section}
              </span>
              <span className="department-badge bg-warning/20 text-warning">
                Semester {studentData.semester}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Attendance"
          value={`${studentData.attendancePercentage}%`}
          icon={CalendarCheck}
          iconBg={studentData.attendancePercentage >= 85 ? 'bg-success/20' : 'bg-warning/20'}
          iconColor={studentData.attendancePercentage >= 85 ? 'text-success' : 'text-warning'}
        />
        <StatCard
          label="Classes Attended"
          value="71"
          icon={Clock}
          iconBg="bg-info/20"
          iconColor="text-info"
        />
        <StatCard
          label="Total Classes"
          value="80"
          icon={GraduationCap}
          iconBg="bg-primary/20"
          iconColor="text-primary"
        />
        <StatCard
          label="Fee Status"
          value={studentData.feeStatus === 'paid' ? 'Paid' : studentData.pendingAmount ? `₹${studentData.pendingAmount}` : 'Pending'}
          icon={IndianRupee}
          iconBg={studentData.feeStatus === 'paid' ? 'bg-success/20' : 'bg-destructive/20'}
          iconColor={studentData.feeStatus === 'paid' ? 'text-success' : 'text-destructive'}
        />
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Attendance Summary</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Overall Attendance</span>
                <span className={cn(
                  'font-medium',
                  studentData.attendancePercentage >= 85 ? 'text-success' : 'text-warning'
                )}>
                  {studentData.attendancePercentage}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={cn(
                    'progress-bar-fill',
                    studentData.attendancePercentage >= 85 ? 'bg-success' : 'bg-warning'
                  )}
                  style={{ width: `${studentData.attendancePercentage}%` }} 
                />
              </div>
            </div>
            
            {studentData.attendancePercentage < 85 && (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning font-medium">
                  ⚠️ Your attendance is below 85%. Please attend more classes to avoid shortage.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground">Present Days</p>
                <p className="text-2xl font-bold text-success">71</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-muted-foreground">Absent Days</p>
                <p className="text-2xl font-bold text-destructive">9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Details */}
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Fee Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Total Fee</span>
              <span className="font-medium text-foreground">₹85,000</span>
            </div>
            <div className="flex justify-between p-4 rounded-lg bg-success/10">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-medium text-success">₹85,000</span>
            </div>
            <div className="flex justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Pending Amount</span>
              <span className={cn(
                'font-medium',
                studentData.pendingAmount ? 'text-destructive' : 'text-success'
              )}>
                {studentData.pendingAmount ? `₹${studentData.pendingAmount}` : '₹0'}
              </span>
            </div>

            {studentData.feeStatus === 'paid' ? (
              <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-center">
                <p className="text-success font-medium">✓ All fees paid</p>
              </div>
            ) : (
              <button className="w-full btn-primary">
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
