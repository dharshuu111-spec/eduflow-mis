import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { departments } from '@/data/mockData';
import { toast } from 'sonner';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tokenNo: '',
    name: '',
    department: '',
    section: '',
    semester: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tokenNo || !formData.name || !formData.department || !formData.section || !formData.semester) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Student added successfully!');
    navigate('/admin/students');
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Add New Student" 
        subtitle="Create a new student profile"
      />

      <button 
        onClick={() => navigate('/admin/students')}
        className="text-primary hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Students
      </button>

      <div className="glass-card p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Token Number <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.tokenNo}
                onChange={(e) => setFormData({ ...formData, tokenNo: e.target.value })}
                placeholder="e.g., NEC0923028"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter student's full name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.code}>{dept.code} - {dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Section <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="input-field"
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Semester <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="input-field"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary">
              Add Student
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin/students')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
