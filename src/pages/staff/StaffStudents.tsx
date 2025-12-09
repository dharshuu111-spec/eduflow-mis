import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { students, departments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Search, Eye } from 'lucide-react';

const StaffStudents = () => {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter based on role
  const getAccessibleDepartments = () => {
    if (user?.role === 'hod') {
      return departments.filter(d => d.code === user.department);
    } else if (user?.role === 'class_coordinator') {
      return departments.filter(d => d.code === user.department);
    }
    return [];
  };

  const accessibleDepts = getAccessibleDepartments();

  const filteredStudents = students.filter(student => {
    const matchesSection = student.section === selectedSection;
    const matchesDepartment = user?.department ? student.department === user.department : true;
    const matchesSemester = user?.role === 'class_coordinator' && user?.semester 
      ? student.semester === user.semester 
      : true;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.tokenNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSection && matchesDepartment && matchesSemester && matchesSearch;
  });

  const getTitle = () => {
    if (user?.role === 'class_coordinator') {
      return `Students - Semester ${user?.semester} Section ${selectedSection}`;
    }
    return `Students - ${user?.department || 'Department'}`;
  };

  return (
    <div className="p-6 space-y-6">
      <Header 
        title={getTitle()} 
        subtitle={`View students in your ${user?.role === 'class_coordinator' ? 'assigned class' : 'department'}`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Section Toggle */}
        <div className="flex gap-2">
          {(['A', 'B'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all',
                selectedSection === section
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Section {section}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* Access Info */}
      <div className="glass-card p-4 bg-primary/5 border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Access Level:</strong>{' '}
          {user?.role === 'hod' && `You can view all students in ${user?.department} department.`}
          {user?.role === 'class_coordinator' && `You can view students in Semester ${user?.semester}, Section ${user?.section}.`}
          {user?.role === 'subject_incharge' && `You can view students enrolled in your subjects.`}
        </p>
      </div>

      {/* Students Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Token No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Semester</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Section</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Attendance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fee Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{student.tokenNo}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{student.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{student.semester}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{student.section}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      student.attendancePercentage >= 75 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    )}>
                      {student.attendancePercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      student.feeStatus === 'paid' ? 'bg-success/20 text-success' :
                      student.feeStatus === 'pending' ? 'bg-destructive/20 text-destructive' :
                      'bg-warning/20 text-warning'
                    )}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View Details">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No students found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StaffStudents;