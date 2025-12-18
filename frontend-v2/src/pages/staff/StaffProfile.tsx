import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { staffService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  FileText,
  Building,
} from 'lucide-react';

interface StaffMember {
  id: number;
  full_name: string;
  personal_email: string;
  work_email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  job_title: { name: string } | null;
  division: { name: string } | null;
  office_location: { name: string } | null;
  employment_status: string;
  employment_type: string;
  hire_date: string;
  base_salary: number;
  compensation_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
}

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getById(Number(id));
        setStaff(response.data.data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-solarized-green/10 text-solarized-green',
      inactive: 'bg-solarized-base01/10 text-solarized-base01',
      terminated: 'bg-solarized-red/10 text-solarized-red',
      on_leave: 'bg-solarized-yellow/10 text-solarized-yellow',
    };
    return variants[status] || variants.inactive;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Staff member not found</h2>
        <Button onClick={() => navigate('/staff')} className="mt-4">
          Back to Staff List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-solarized-blue text-white text-xl">
              {getInitials(staff.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-solarized-base02">{staff.full_name}</h1>
            <p className="text-solarized-base01">{staff.job_title?.name || 'No job title'}</p>
          </div>
        </div>
        <Link to={`/staff/${id}/edit`}>
          <Button className="bg-solarized-blue hover:bg-solarized-blue/90">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-solarized-blue/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-solarized-blue" />
              </div>
              <div>
                <p className="text-sm text-solarized-base01">Email</p>
                <p className="font-medium">{staff.work_email || staff.personal_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-solarized-green/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-solarized-green" />
              </div>
              <div>
                <p className="text-sm text-solarized-base01">Phone</p>
                <p className="font-medium">{staff.phone_number || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-solarized-yellow/10 flex items-center justify-center">
                <Building className="h-5 w-5 text-solarized-yellow" />
              </div>
              <div>
                <p className="text-sm text-solarized-base01">Department</p>
                <p className="font-medium">{staff.division?.name || 'Not assigned'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-solarized-cyan/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-solarized-cyan" />
              </div>
              <div>
                <p className="text-sm text-solarized-base01">Location</p>
                <p className="font-medium">{staff.office_location?.name || 'Not assigned'}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Badge className={getStatusBadge(staff.employment_status)}>
                {staff.employment_status?.replace('_', ' ') || 'Unknown'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-solarized-base01">Full Name</p>
                    <p className="font-medium">{staff.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Personal Email</p>
                    <p className="font-medium">{staff.personal_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Date of Birth</p>
                    <p className="font-medium">{staff.date_of_birth || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Gender</p>
                    <p className="font-medium capitalize">{staff.gender || 'Not provided'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-solarized-base01">Address</p>
                    <p className="font-medium">
                      {[staff.address, staff.city, staff.state, staff.country, staff.postal_code]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="mt-4">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-solarized-base01">Job Title</p>
                    <p className="font-medium">{staff.job_title?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Division</p>
                    <p className="font-medium">{staff.division?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Office Location</p>
                    <p className="font-medium">{staff.office_location?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Hire Date</p>
                    <p className="font-medium">{staff.hire_date || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Employment Type</p>
                    <p className="font-medium capitalize">
                      {staff.employment_type?.replace('_', ' ') || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Compensation Type</p>
                    <p className="font-medium capitalize">{staff.compensation_type || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Base Salary</p>
                    <p className="font-medium">
                      {staff.base_salary ? `$${staff.base_salary.toLocaleString()}` : 'Not provided'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="mt-4">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-solarized-base01">Contact Name</p>
                    <p className="font-medium">{staff.emergency_contact_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Contact Phone</p>
                    <p className="font-medium">{staff.emergency_contact_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-solarized-base01">Relationship</p>
                    <p className="font-medium">{staff.emergency_contact_relationship || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Employee documents and files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-solarized-base01">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                    <Button variant="outline" className="mt-4">
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
