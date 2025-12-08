import Header from '@/components/layout/Header';
import { students } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { IndianRupee, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StudentAccounts = () => {
  const studentData = students[0];

  const feeBreakdown = [
    { description: 'Tuition Fee - Semester 5', amount: 30000, status: 'paid', date: '2024-07-15' },
    { description: 'Lab Fee', amount: 5000, status: 'paid', date: '2024-07-15' },
    { description: 'Library Fee', amount: 2000, status: 'paid', date: '2024-07-15' },
    { description: 'Examination Fee', amount: 3000, status: 'paid', date: '2024-11-01' },
    { description: 'Sports & Activities', amount: 2000, status: 'paid', date: '2024-07-15' },
    { description: 'Development Fee', amount: 5000, status: 'paid', date: '2024-07-15' },
  ];

  const totalAmount = feeBreakdown.reduce((acc, fee) => acc + fee.amount, 0);
  const paidAmount = feeBreakdown.filter(f => f.status === 'paid').reduce((acc, fee) => acc + fee.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="animate-fade-in">
      <Header 
        title="Fee & Accounts" 
        subtitle="View your fee details and payment history"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fee</p>
              <p className="text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-2xl font-bold text-success">₹{paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              pendingAmount > 0 ? 'bg-destructive/20' : 'bg-success/20'
            )}>
              {pendingAmount > 0 ? (
                <AlertCircle className="w-6 h-6 text-destructive" />
              ) : (
                <CheckCircle className="w-6 h-6 text-success" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className={cn(
                'text-2xl font-bold',
                pendingAmount > 0 ? 'text-destructive' : 'text-success'
              )}>
                ₹{pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Status Banner */}
      {pendingAmount === 0 ? (
        <div className="glass-card p-6 mb-6 bg-success/10 border-success/30">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <h3 className="font-heading font-semibold text-success">All Fees Cleared!</h3>
              <p className="text-muted-foreground">You have no pending dues for the current semester.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 mb-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <h3 className="font-heading font-semibold text-destructive">Payment Pending</h3>
                <p className="text-muted-foreground">Please clear your pending dues to avoid late fees.</p>
              </div>
            </div>
            <button className="btn-primary">Pay Now</button>
          </div>
        </div>
      )}

      {/* Fee Breakdown */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Fee Breakdown - Semester 5</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {feeBreakdown.map((fee, index) => (
                <tr key={index} className="table-row">
                  <td className="p-4 font-medium text-foreground">{fee.description}</td>
                  <td className="p-4 text-foreground">₹{fee.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={cn(
                      'department-badge',
                      fee.status === 'paid' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    )}>
                      {fee.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {fee.status === 'paid' ? new Date(fee.date).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 font-semibold">
                <td className="p-4 text-foreground">Total</td>
                <td className="p-4 text-foreground">₹{totalAmount.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAccounts;
