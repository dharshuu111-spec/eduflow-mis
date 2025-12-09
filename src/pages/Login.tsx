import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import loginBg from '@/assets/login-bg.jpg';

const Login = () => {
  const [role, setRole] = useState<UserRole | ''>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select your role');
      return;
    }

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password, role as UserRole);
    setIsLoading(false);

    if (result.success) {
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'hod' || role === 'class_coordinator' || role === 'subject_incharge') {
        navigate('/staff/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass-card p-8 bg-card/90 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Digital MIS</h1>
            <p className="text-primary mt-1 font-medium">Management Information System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Login as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="input-field appearance-none cursor-pointer"
              >
              <option value="">Select your role</option>
                <option value="admin">Administrator</option>
                <option value="hod">HOD (Course Head)</option>
                <option value="class_coordinator">Class Coordinator</option>
                <option value="subject_incharge">Subject Incharge</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username/Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                className="input-field"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: admin / admin123</p>
              <p>HOD: hod / hod123</p>
              <p>Coordinator: coordinator / coord123</p>
              <p>Subject Incharge: subjectincharge / subject123</p>
              <p>Student: student / student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
