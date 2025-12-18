import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, attendanceService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  on_leave_today: number;
  pending_leave_requests: number;
  pending_approvals: number;
}

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
}

const COLORS = ['#859900', '#dc322f', '#b58900', '#268bd2'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes] = await Promise.all([
          dashboardService.getStats(),
        ]);
        setStats(dashboardRes.data.data);
        
        const mockAttendance: AttendanceData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          mockAttendance.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            present: Math.floor(Math.random() * 20) + 80,
            absent: Math.floor(Math.random() * 10) + 5,
          });
        }
        setAttendanceData(mockAttendance);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      await attendanceService.clockIn();
      setClockedIn(true);
    } catch (error) {
      console.error('Clock in failed:', error);
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      await attendanceService.clockOut();
      setClockedIn(false);
    } catch (error) {
      console.error('Clock out failed:', error);
    } finally {
      setClockLoading(false);
    }
  };

  const pieData = stats ? [
    { name: 'Present', value: stats.present_today },
    { name: 'Absent', value: stats.absent_today },
    { name: 'On Leave', value: stats.on_leave_today },
  ] : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-solarized-base02">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-solarized-base01">
            Here's what's happening in your organization today.
          </p>
        </div>
        <div className="flex gap-2">
          {!clockedIn ? (
            <Button
              onClick={handleClockIn}
              disabled={clockLoading}
              className="bg-solarized-green hover:bg-solarized-green/90"
            >
              <Clock className="mr-2 h-4 w-4" />
              Clock In
            </Button>
          ) : (
            <Button
              onClick={handleClockOut}
              disabled={clockLoading}
              variant="outline"
              className="border-solarized-red text-solarized-red hover:bg-solarized-red/10"
            >
              <Clock className="mr-2 h-4 w-4" />
              Clock Out
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-solarized-base01">
              Total Employees
            </CardTitle>
            <Users className="h-5 w-5 text-solarized-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-solarized-base02">
              {stats?.total_employees || 0}
            </div>
            <p className="text-xs text-solarized-base01 mt-1">
              <TrendingUp className="inline h-3 w-3 text-solarized-green mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-solarized-base01">
              Present Today
            </CardTitle>
            <UserCheck className="h-5 w-5 text-solarized-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-solarized-base02">
              {stats?.present_today || 0}
            </div>
            <p className="text-xs text-solarized-base01 mt-1">
              {stats && stats.total_employees > 0
                ? `${Math.round((stats.present_today / stats.total_employees) * 100)}% attendance rate`
                : '0% attendance rate'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-solarized-base01">
              On Leave
            </CardTitle>
            <Calendar className="h-5 w-5 text-solarized-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-solarized-base02">
              {stats?.on_leave_today || 0}
            </div>
            <p className="text-xs text-solarized-base01 mt-1">
              {stats?.pending_leave_requests || 0} pending requests
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-solarized-base01">
              Pending Approvals
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-solarized-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-solarized-base02">
              {stats?.pending_approvals || 0}
            </div>
            <Link to="/leave/approvals" className="text-xs text-solarized-blue hover:underline mt-1 inline-flex items-center">
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Last 7 days attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee8d5" />
                  <XAxis dataKey="date" stroke="#657b83" />
                  <YAxis stroke="#657b83" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fdf6e3',
                      border: '1px solid #eee8d5',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stackId="1"
                    stroke="#859900"
                    fill="#859900"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="absent"
                    stackId="1"
                    stroke="#dc322f"
                    fill="#dc322f"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>Employee attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-solarized-base01">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/staff/create">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6 text-solarized-blue" />
                <span>Add Employee</span>
              </Button>
            </Link>
            <Link to="/leave/apply">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6 text-solarized-green" />
                <span>Apply Leave</span>
              </Button>
            </Link>
            <Link to="/payroll/generate">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <DollarSign className="h-6 w-6 text-solarized-yellow" />
                <span>Generate Payroll</span>
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6 text-solarized-cyan" />
                <span>View Reports</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates in the system</CardDescription>
            </div>
            <Link to="/reports">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-solarized-green/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-solarized-green" />
                </div>
                <div>
                  <p className="text-sm font-medium">Leave request approved</p>
                  <p className="text-xs text-solarized-base01">John Doe's leave request was approved</p>
                  <p className="text-xs text-solarized-base00 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-solarized-blue/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-solarized-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium">New employee added</p>
                  <p className="text-xs text-solarized-base01">Sarah Smith joined the Engineering team</p>
                  <p className="text-xs text-solarized-base00 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-solarized-yellow/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-solarized-yellow" />
                </div>
                <div>
                  <p className="text-sm font-medium">Payroll generated</p>
                  <p className="text-xs text-solarized-base01">December 2024 payroll has been processed</p>
                  <p className="text-xs text-solarized-base00 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
