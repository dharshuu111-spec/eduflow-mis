import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { Plus, Search, Users, ChevronRight, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Student } from '@/types';

const Students = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, studentsRes] = await Promise.all([
          fetch('http://localhost:3001/api/departments'),
          fetch('http://localhost:3001/api/students')
        ]);

        const departmentsData = await departmentsRes.json();
        const studentsData = await studentsRes.json();

        setDepartments(departmentsData);
        setAllStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = allStudents.filter(student => {
    const matchesDept = !selectedDepartment || student.department === selectedDepartment;
    const matchesSection = !selectedSection || student.section === selectedSection;
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.tokenNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSection && matchesSearch;
  });

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    toast.success(`Student "${studentName}" removed successfully`);
  };

  if (!selectedDepartment) {
    return (
      <div className="animate-fade-in">
        <Header 
          title="Students Management" 
          subtitle="Select a department to view students"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.code)}
              className="glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{dept.code}</h3>
              <p className="text-sm text-muted-foreground mt-1">{dept.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSection) {
    return (
      <div className="animate-fade-in">
        <Header 
          title={`${selectedDepartment} - Select Section`} 
          subtitle="Choose a section to view students"
        />

        <button 
          onClick={() => setSelectedDepartment(null)}
          className="text-primary hover:underline mb-6 flex items-center gap-2"
        >
          ← Back to Departments
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {['A', 'B'].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section as 'A' | 'B')}
              className="glass-card p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-heading font-bold text-primary">{section}</span>
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground">Section {section}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {allStudents.filter(s => s.department === selectedDepartment && s.section === section).length} students
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header 
        title={`${selectedDepartment} - Section ${selectedSection}`} 
        subtitle={`${filteredStudents.length} students enrolled`}
      />

      <button 
        onClick={() => setSelectedSection(null)}
        className="text-primary hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Sections
      </button>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or token number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => navigate('/admin/students/add')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Students Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Token No.</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Semester</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Attendance</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Fee Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="table-row">
                  <td className="p-4 font-mono text-sm text-foreground">{student.tokenNo}</td>
                  <td className="p-4 font-medium text-foreground">{student.name}</td>
                  <td className="p-4 text-muted-foreground">{student.semester}</td>
                  <td className="p-4">
                    <span className={cn(
                      'department-badge',
                      student.attendancePercentage >= 85 ? 'bg-success/20 text-success' :
                      student.attendancePercentage >= 75 ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    )}>
                      {student.attendancePercentage}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      'department-badge',
                      student.feeStatus === 'paid' ? 'bg-success/20 text-success' :
                      student.feeStatus === 'partial' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    )}>
                      {student.feeStatus === 'paid' ? 'Paid' :
                       student.feeStatus === 'partial' ? `Partial (₹${student.pendingAmount})` :
                       `Pending (₹${student.pendingAmount})`}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default Students;
