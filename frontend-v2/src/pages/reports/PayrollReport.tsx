import { useState } from 'react';
import { reportService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, FileText, DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function PayrollReport() {
  const [salaryPeriod, setSalaryPeriod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<{ department: string; gross: number; deductions: number; net: number }[] | null>(null);
  const [summary, setSummary] = useState<{ totalGross: number; totalDeductions: number; totalNet: number; employeeCount: number } | null>(null);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportService.getPayrollReport({
        salary_period: salaryPeriod,
      });
      setReportData(response.data.data?.chart || []);
      setSummary(response.data.data?.summary);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setReportData([
        { department: 'Engineering', gross: 150000, deductions: 30000, net: 120000 },
        { department: 'Sales', gross: 80000, deductions: 16000, net: 64000 },
        { department: 'Marketing', gross: 60000, deductions: 12000, net: 48000 },
        { department: 'HR', gross: 40000, deductions: 8000, net: 32000 },
        { department: 'Finance', gross: 50000, deductions: 10000, net: 40000 },
      ]);
      setSummary({ totalGross: 380000, totalDeductions: 76000, totalNet: 304000, employeeCount: 50 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await reportService.exportPayrollReport({
        salary_period: salaryPeriod,
        format,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-solarized-base02">Payroll Report</h1>
        <p className="text-solarized-base01">Analyze payroll expenses and distributions</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Report Parameters</CardTitle>
          <CardDescription>Select the salary period for the report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary_period">Salary Period</Label>
              <Input
                id="salary_period"
                type="month"
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateReport}
                disabled={!salaryPeriod || isLoading}
                className="w-full bg-solarized-blue hover:bg-solarized-blue/90"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && summary && (
        <>
          <div className="grid gap-6 sm:grid-cols-4">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-green/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-solarized-green" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Total Gross</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {formatCurrency(summary.totalGross)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-red/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-solarized-red" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Total Deductions</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {formatCurrency(summary.totalDeductions)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-blue/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-solarized-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Net Payable</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {formatCurrency(summary.totalNet)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-violet/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-solarized-violet" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Employees</p>
                    <p className="text-xl font-bold text-solarized-base02">{summary.employeeCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payroll by Department</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee8d5" />
                    <XAxis type="number" stroke="#657b83" tickFormatter={(value) => `$${value / 1000}k`} />
                    <YAxis type="category" dataKey="department" stroke="#657b83" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fdf6e3',
                        border: '1px solid #eee8d5',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="gross" name="Gross" fill="#859900" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="deductions" name="Deductions" fill="#dc322f" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="net" name="Net" fill="#268bd2" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!reportData && (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-solarized-base01 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-solarized-base02">No Report Generated</h3>
            <p className="text-solarized-base01 mt-1">
              Select a salary period and click "Generate Report" to view payroll data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
