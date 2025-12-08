import { DepartmentAttendance } from '@/types';
import { cn } from '@/lib/utils';
import { Code, Cpu, Database, Monitor } from 'lucide-react';

interface DepartmentAttendanceCardProps {
  data: DepartmentAttendance[];
}

const departmentIcons: Record<string, React.ReactNode> = {
  'CP01': <Code className="w-5 h-5" />,
  'CP04': <Cpu className="w-5 h-5" />,
  'CP08': <Monitor className="w-5 h-5" />,
  'CP09': <Database className="w-5 h-5" />,
};

const getProgressColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-success';
  if (percentage >= 75) return 'bg-warning';
  return 'bg-destructive';
};

const DepartmentAttendanceCard = ({ data }: DepartmentAttendanceCardProps) => {
  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Department-wise Attendance</h3>
        <p className="text-sm text-muted-foreground">Live attendance snapshot by course</p>
      </div>

      <div className="space-y-4">
        {data.map((dept) => (
          <div key={dept.departmentCode} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {departmentIcons[dept.departmentCode] || <Code className="w-5 h-5" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="font-medium text-foreground">{dept.departmentCode}</p>
                  <p className="text-xs text-muted-foreground">{dept.departmentName}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-bold',
                    dept.percentage >= 90 ? 'text-success' : dept.percentage >= 75 ? 'text-warning' : 'text-destructive'
                  )}>
                    {dept.percentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">{dept.present} / {dept.total} present</p>
                </div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className={cn('progress-bar-fill', getProgressColor(dept.percentage))}
                  style={{ width: `${dept.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentAttendanceCard;
