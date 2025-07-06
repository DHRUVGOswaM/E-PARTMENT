'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search } from 'lucide-react';
import toast, { toast as hotToast } from 'react-hot-toast';

export default function SalaryPage() {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchError, setSearchError] = useState('');

  const fetchSalaryByNameAndPhone = async () => {
    if (!searchName.trim() || !searchPhone.trim()) {
      setSearchError('Please enter both name and phone number');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(searchPhone)) {
      setSearchError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    setLoading(true);
    setSearchError('');
    
    try {
      const res = await fetch(`/api/staff/salary-by-details?name=${encodeURIComponent(searchName)}&phone=${encodeURIComponent(searchPhone)}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch salary data');
      }
      
      setSalaryData(data.slips || []);
      if (data.slips && data.slips.length === 0) {
        toast.info('No salary records found for the provided details');
      } else {
        toast.success('Salary records loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching salary:', error);
      setSearchError(error.message);
      setSalaryData([]);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Staff Salary Status</h1>

      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Salary Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={searchPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    setSearchPhone(value);
                  }
                }}
                maxLength={10}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={fetchSalaryByNameAndPhone} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Searching...' : 'Check Salary Status'}
              </Button>
            </div>
          </div>
          {searchError && (
            <p className="text-red-500 text-sm mt-2">{searchError}</p>
          )}
        </CardContent>
      </Card>

      {salaryData.length > 0 && (
        <div className="mb-6">
          <Button onClick={handleDownloadCSV} className="flex items-center gap-2">
            <Download size={18} />
            Download Full Salary Record (CSV)
          </Button>
        </div>
      )}

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