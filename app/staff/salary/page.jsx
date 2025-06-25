'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function SalaryPage() {
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    const fetchSalary = async () => {
      const res = await fetch('/api/staff/salary');
      const data = await res.json();
      setSalaryData(data);
    };
    fetchSalary();
  }, []);

  const handleDownloadCSV = () => {
    const headers = ['Amount', 'Paid On', 'Overtime', 'Leave Deduction', 'TDA Cut', 'Festival Advance', 'Notes', 'Status'];
    const rows = salaryData.map(slip => [
     ` ₹${slip.amount}`,
      new Date(slip.paidAt).toLocaleString(),
      slip.overtime || 'N/A',
      slip.leaveDeduction || 'N/A',
      slip.tdaCut || 'N/A',
      slip.festivalAdvance || 'N/A',
      slip.notes || '-',
      slip.status,
    ]);
    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'salary-record.csv';
    link.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Salary Details</h1>

      <div className="mb-6">
        <Button onClick={handleDownloadCSV} className="flex items-center gap-2">
          <Download size={18} />
          Download Full Salary Record (CSV)
        </Button>
      </div>

      <div className="grid gap-4">
        {salaryData.length === 0 && <p>No salary records available.</p>}
        {salaryData.map((slip) => (
          <Card key={slip.id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <p><strong>Amount:</strong> ₹{slip.amount}</p>
              <p><strong>Paid On:</strong> {new Date(slip.paidAt).toLocaleString()}</p>
              {slip.overtime && <p><strong>Overtime:</strong> ₹{slip.overtime}</p>}
              {slip.leaveDeduction && <p><strong>Leave Deduction:</strong> ₹{slip.leaveDeduction}</p>}
              {slip.tdaCut && <p><strong>TDA Cut:</strong> ₹{slip.tdaCut}</p>}
              {slip.festivalAdvance && <p><strong>Festival Advance:</strong> ₹{slip.festivalAdvance}</p>}
              {slip.notes && <p><strong>Notes:</strong> {slip.notes}</p>}
              <p><strong>Status:</strong> 
                <Badge variant={slip.status === 'Approved' ? 'success' : 'secondary'} className="ml-2">
                  {slip.status}
                </Badge>
              </p>
              {slip.slipFile && (
            //     <a
            //       href={/salary_slips/${slip.slipFile}}
            //       target="_blank"
            //       className="text-blue-600 underline"
            //       rel="noopener noreferrer"
            //     >
            //       Download Salary Slip
                // </a>
                <Button asChild variant="link" className="text-blue-600 underline">
                  <a href={`/salary_slips/${slip.slipFile}`} target="_blank" rel="noopener noreferrer">
                    Download Salary Slip
                  </a>
                </Button>
            
              )}
            
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}