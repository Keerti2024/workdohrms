import { useState, useEffect } from 'react';
import { leaveService } from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus, Edit, Trash2, Calendar, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface LeaveCategory {
  id: number;
  name: string;
  annual_quota: number;
  is_paid: boolean;
  is_carry_forward_allowed: boolean;
  max_carry_forward_days: number;
  is_active: boolean;
}

export default function LeaveCategories() {
  const [categories, setCategories] = useState<LeaveCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<LeaveCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    annual_quota: '10',
    is_paid: true,
    is_carry_forward_allowed: false,
    max_carry_forward_days: '0',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await leaveService.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await leaveService.updateCategory(editingCategory.id, formData);
      } else {
        await leaveService.createCategory(formData);
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: LeaveCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      annual_quota: category.annual_quota.toString(),
      is_paid: category.is_paid,
      is_carry_forward_allowed: category.is_carry_forward_allowed,
      max_carry_forward_days: category.max_carry_forward_days.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await leaveService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      annual_quota: '10',
      is_paid: true,
      is_carry_forward_allowed: false,
      max_carry_forward_days: '0',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-solarized-base02">Leave Categories</h1>
          <p className="text-solarized-base01">Manage leave types and policies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-solarized-blue hover:bg-solarized-blue/90"
              onClick={() => {
                setEditingCategory(null);
                resetForm();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update the leave category details.' : 'Create a new leave category.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Annual Leave"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_quota">Annual Quota (days)</Label>
                  <Input
                    id="annual_quota"
                    type="number"
                    value={formData.annual_quota}
                    onChange={(e) => setFormData({ ...formData, annual_quota: e.target.value })}
                    min="0"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_paid">Paid Leave</Label>
                  <Switch
                    id="is_paid"
                    checked={formData.is_paid}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_paid: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_carry_forward_allowed">Allow Carry Forward</Label>
                  <Switch
                    id="is_carry_forward_allowed"
                    checked={formData.is_carry_forward_allowed}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_carry_forward_allowed: checked })
                    }
                  />
                </div>
                {formData.is_carry_forward_allowed && (
                  <div className="space-y-2">
                    <Label htmlFor="max_carry_forward_days">Max Carry Forward Days</Label>
                    <Input
                      id="max_carry_forward_days"
                      type="number"
                      value={formData.max_carry_forward_days}
                      onChange={(e) =>
                        setFormData({ ...formData, max_carry_forward_days: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-solarized-blue hover:bg-solarized-blue/90">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-solarized-base01 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-solarized-base02">No categories configured</h3>
              <p className="text-solarized-base01 mt-1">Create your first leave category to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Annual Quota</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Carry Forward</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.annual_quota} days</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          category.is_paid
                            ? 'bg-solarized-green/10 text-solarized-green'
                            : 'bg-solarized-base01/10 text-solarized-base01'
                        }
                      >
                        {category.is_paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {category.is_carry_forward_allowed
                        ? `Up to ${category.max_carry_forward_days} days`
                        : 'Not allowed'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          category.is_active
                            ? 'bg-solarized-blue/10 text-solarized-blue'
                            : 'bg-solarized-base01/10 text-solarized-base01'
                        }
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(category.id)}
                            className="text-solarized-red"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
