import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
  variant?: 'primary' | 'info' | 'warning' | 'danger';
}

const variantStyles = {
  primary: 'bg-primary/10 hover:bg-primary/20 text-primary',
  info: 'bg-info/10 hover:bg-info/20 text-info',
  warning: 'bg-warning/10 hover:bg-warning/20 text-warning',
  danger: 'bg-destructive/10 hover:bg-destructive/20 text-destructive',
};

const iconBgStyles = {
  primary: 'bg-primary/20',
  info: 'bg-info/20',
  warning: 'bg-warning/20',
  danger: 'bg-destructive/20',
};

const QuickActionCard = ({ label, description, icon: Icon, path, variant = 'primary' }: QuickActionCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={cn(
        'quick-action-card text-left p-4 min-h-[120px]',
        variantStyles[variant]
      )}
    >
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', iconBgStyles[variant])}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  );
};

export default QuickActionCard;
