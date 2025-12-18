import { useState, useEffect } from 'react';
import { payrollService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { DollarSign, Download, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface SalarySlip {
  id: number;
  reference: string;
  staff_member?: { full_name: string };
  salary_period: string;
  total_earnings: number;
  total_deductions: number;
  net_payable: number;
  status: string;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function SalarySlips() {
  const [slips, setSlips] = useState<SalarySlip[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [salaryPeriod, setSalaryPeriod] = useState('');

  useEffect(() => {
    fetchSlips();
  }, [page]);

  const fetchSlips = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page };
      if (salaryPeriod) params.salary_period = salaryPeriod;
      
      const response = await payrollService.getSalarySlips(params);
      setSlips(response.data.data || []);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Failed to fetch salary slips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await payrollService.downloadSlip(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-slip-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download slip:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      generated: 'bg-solarized-yellow/10 text-solarized-yellow',
      paid: 'bg-solarized-green/10 text-solarized-green',
      cancelled: 'bg-solarized-red/10 text-solarized-red',
    };
    return variants[status] || variants.generated;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-solarized-base02">Salary Slips</h1>
        <p className="text-solarized-base01">View and download generated salary slips</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="salary_period">Salary Period</Label>
              <Input
                id="salary_period"
                type="month"
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchSlips} className="bg-solarized-blue hover:bg-solarized-blue/90">
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : slips.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-solarized-base01 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-solarized-base02">No salary slips found</h3>
              <p className="text-solarized-base01 mt-1">Generate payroll to create salary slips.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slips.map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell className="font-medium">{slip.reference}</TableCell>
                        <TableCell>{slip.staff_member?.full_name || 'Unknown'}</TableCell>
                        <TableCell>{slip.salary_period}</TableCell>
                        <TableCell className="text-solarized-green">
                          {formatCurrency(slip.total_earnings)}
                        </TableCell>
                        <TableCell className="text-solarized-red">
                          {formatCurrency(slip.total_deductions)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(slip.net_payable)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(slip.status)}>
                            {slip.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(slip.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-solarized-base01">
                    Showing {(meta.current_page - 1) * meta.per_page + 1} to{' '}
                    {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-solarized-base01">
                      Page {meta.current_page} of {meta.last_page}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.last_page}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
