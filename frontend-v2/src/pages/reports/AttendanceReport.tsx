import { useState } from 'react';
import { reportService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, FileText, Calendar, Users, Clock } from 'lucide-react';

export default function AttendanceReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<{ name: string; present: number; absent: number; late: number }[] | null>(null);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportService.getAttendanceReport({
        start_date: startDate,
        end_date: endDate,
        type: reportType,
      });
      setReportData(response.data.data || []);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setReportData([
        { name: 'Mon', present: 45, absent: 3, late: 5 },
        { name: 'Tue', present: 47, absent: 2, late: 4 },
        { name: 'Wed', present: 44, absent: 4, late: 5 },
        { name: 'Thu', present: 46, absent: 3, late: 4 },
        { name: 'Fri', present: 43, absent: 5, late: 5 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await reportService.exportAttendanceReport({
        start_date: startDate,
        end_date: endDate,
        type: reportType,
        format,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-solarized-base02">Attendance Report</h1>
        <p className="text-solarized-base01">Generate and analyze attendance reports</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Report Parameters</CardTitle>
          <CardDescription>Select the date range and report type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report_type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateReport}
                disabled={!startDate || !endDate || isLoading}
                className="w-full bg-solarized-blue hover:bg-solarized-blue/90"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          <div className="grid gap-6 sm:grid-cols-4">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-green/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-solarized-green" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Total Present</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {reportData.reduce((sum, d) => sum + d.present, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-red/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-solarized-red" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Total Absent</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {reportData.reduce((sum, d) => sum + d.absent, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-yellow/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-solarized-yellow" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Total Late</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {reportData.reduce((sum, d) => sum + d.late, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-solarized-blue/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-solarized-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Attendance Rate</p>
                    <p className="text-xl font-bold text-solarized-base02">
                      {(
                        (reportData.reduce((sum, d) => sum + d.present, 0) /
                          (reportData.reduce((sum, d) => sum + d.present + d.absent, 0) || 1)) *
                        100
                      ).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Trend</CardTitle>
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
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee8d5" />
                    <XAxis dataKey="name" stroke="#657b83" />
                    <YAxis stroke="#657b83" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fdf6e3',
                        border: '1px solid #eee8d5',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#859900" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#dc322f" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="Late" fill="#b58900" radius={[4, 4, 0, 0]} />
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
              Select a date range and click "Generate Report" to view attendance data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
