import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { Plus, Search, Users, ChevronRight, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Teacher, Department } from '@/types';
import { departments as mockDepartments, teachers as initialTeachers } from '@/data/mockData';

const Teachers = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    subjects: '',
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesDept = !selectedDepartment || teacher.department === selectedDepartment;
    const matchesSearch = !searchQuery ||
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.employeeId || !newTeacher.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: newTeacher.employeeId,
          name: newTeacher.name,
          department: selectedDepartment,
          email: newTeacher.email,
          phone: newTeacher.phone,
          subjects: newTeacher.subjects ? newTeacher.subjects.split(',').map(s => s.trim()) : [],
        }),
      });

      if (response.ok) {
        toast.success('Teacher added successfully!');
        setShowAddModal(false);
        setNewTeacher({ name: '', employeeId: '', email: '', phone: '', subjects: '' });

        // Refresh teachers list
        const teachersRes = await fetch('http://localhost:3001/api/teachers');
        const teachersData = await teachersRes.json();
        setTeachers(teachersData);
      } else {
        toast.error('Failed to add teacher');
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast.error('Failed to add teacher');
    }
  };

  if (!selectedDepartment) {
    return (
      <div className="animate-fade-in">
        <Header 
          title="Teachers Management" 
          subtitle="Select a department to view teachers"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.code)}
              className="glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mb-4 group-hover:bg-success/30 transition-colors">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{dept.code}</h3>
              <p className="text-sm text-muted-foreground mt-1">{dept.name}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {teachers.filter(t => t.department === dept.code).length} teachers
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
        title={`${selectedDepartment} - Teachers`} 
        subtitle={`${filteredTeachers.length} teachers in department`}
      />

      <button 
        onClick={() => setSelectedDepartment(null)}
        className="text-primary hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Departments
      </button>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Teacher
        </button>
      </div>

      {/* Teachers List */}
      {filteredTeachers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No Teachers Found</h3>
          <p className="text-muted-foreground mb-6">No teachers have been added to this department yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add First Teacher
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Subjects</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Hours (Completed/Allocated)</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="table-row">
                    <td className="p-4 font-mono text-sm text-foreground">{teacher.employeeId}</td>
                    <td className="p-4 font-medium text-foreground">{teacher.name}</td>
                    <td className="p-4 text-muted-foreground">{teacher.email}</td>
                    <td className="p-4 text-muted-foreground">{teacher.subjects.join(', ')}</td>
                    <td className="p-4">
                      <span className="department-badge bg-primary/20 text-primary">
                        {teacher.hoursCompleted} / {teacher.hoursAllocated}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
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
      )}

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg animate-slide-up">
            <h2 className="font-heading font-bold text-xl text-foreground mb-6">Add New Teacher</h2>
            
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Employee ID <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={newTeacher.employeeId}
                  onChange={(e) => setNewTeacher({ ...newTeacher, employeeId: e.target.value })}
                  placeholder="e.g., EMP001"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="Enter teacher's full name"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  placeholder="teacher@nttf.co.in"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subjects (comma separated)
                </label>
                <input
                  type="text"
                  value={newTeacher.subjects}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subjects: e.target.value })}
                  placeholder="FSD, RP, ISA"
                  className="input-field"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Add Teacher
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
