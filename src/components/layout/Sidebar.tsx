import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Calendar, 
  FileText,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/admin/students', icon: <GraduationCap className="w-5 h-5" /> },
  { label: 'Teachers', path: '/admin/teachers', icon: <Users className="w-5 h-5" /> },
  { label: 'Attendance', path: '/admin/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
  { label: 'Timetable', path: '/admin/timetable', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Reports / MIS', path: '/admin/reports', icon: <FileText className="w-5 h-5" /> },
];

const hodNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/staff/students', icon: <GraduationCap className="w-5 h-5" /> },
  { label: 'Teachers', path: '/staff/teachers', icon: <Users className="w-5 h-5" /> },
  { label: 'Attendance', path: '/staff/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
  { label: 'Timetable', path: '/staff/timetable', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Reports', path: '/staff/reports', icon: <FileText className="w-5 h-5" /> },
];

const coordinatorNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/staff/students', icon: <GraduationCap className="w-5 h-5" /> },
  { label: 'Attendance', path: '/staff/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
  { label: 'Timetable', path: '/staff/timetable', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Reports', path: '/staff/reports', icon: <FileText className="w-5 h-5" /> },
];

const subjectInchargeNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'My Classes', path: '/staff/classes', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Attendance', path: '/staff/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
  { label: 'Reports', path: '/staff/reports', icon: <FileText className="w-5 h-5" /> },
];

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Attendance', path: '/student/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
  { label: 'Accounts', path: '/student/accounts', icon: <FileText className="w-5 h-5" /> },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'admin':
        return adminNavItems;
      case 'hod':
        return hodNavItems;
      case 'class_coordinator':
        return coordinatorNavItems;
      case 'subject_incharge':
        return subjectInchargeNavItems;
      case 'student':
        return studentNavItems;
      default:
        return [];
    }
  };

  const getRoleLabel = (): string => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'hod': return `HOD - ${user?.department || ''}`;
      case 'class_coordinator': return `Coordinator - Sem ${user?.semester} ${user?.section}`;
      case 'subject_incharge': return 'Subject Incharge';
      case 'student': return 'Student';
      default: return '';
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-foreground">Digital MIS</h1>
            <p className="text-xs text-muted-foreground">Academic Year 2024-25</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn('nav-item', isActive && 'active')
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="nav-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-muted-foreground mt-4 px-2">
          Logged in as {getRoleLabel()}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
