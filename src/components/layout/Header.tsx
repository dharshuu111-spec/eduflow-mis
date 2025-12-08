import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between pb-6 border-b border-border mb-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          ACADEMIC YEAR • 2024-25
        </p>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="font-medium text-foreground">Welcome, {user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
