import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { teachers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Search, Eye } from 'lucide-react';

const StaffTeachers = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Only HOD can view teachers in their department
  const filteredTeachers = teachers.filter(teacher => {
    const matchesDepartment = user?.department ? teacher.department === user.department : true;
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <Header 
        title={`Teachers - ${user?.department || 'Department'}`} 
        subtitle="View teaching staff in your department"
      />

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
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
          As HOD of {user?.department}, you can view all teaching staff in your department.
        </p>
      </div>

      {/* Teachers Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employee ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subjects</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hours Allocated</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hours Completed</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const progressPercent = teacher.hoursAllocated > 0 
                    ? Math.round((teacher.hoursCompleted / teacher.hoursAllocated) * 100) 
                    : 0;
                  
                  return (
                    <tr key={teacher.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{teacher.employeeId}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{teacher.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{teacher.email}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {teacher.subjects.join(', ') || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{teacher.hoursAllocated}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{teacher.hoursCompleted}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                'h-full rounded-full transition-all',
                                progressPercent >= 75 ? 'bg-success' :
                                progressPercent >= 50 ? 'bg-warning' : 'bg-destructive'
                              )}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{progressPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No teachers found in your department. Teachers will appear here once added by the administrator.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffTeachers;