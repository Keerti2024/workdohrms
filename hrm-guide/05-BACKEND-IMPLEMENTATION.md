# WorkDo HRM - Backend Implementation Guide (Laravel + Spatie)

## Table of Contents
1. Project Setup
2. Database Configuration
3. Authentication with Sanctum
4. Authorization with Spatie Permission
5. Model Implementation
6. API Controllers
7. Form Requests & Validation
8. Resources & Transformers
9. Services & Business Logic
10. Middleware
11. Testing

---

## 1. Project Setup

### Create Laravel Project
```bash
composer create-project laravel/laravel hrm-backend
cd hrm-backend
```

### Install Required Packages
```bash
# Authentication
composer require laravel/sanctum

# Authorization (Spatie Permission)
composer require spatie/laravel-permission

# API Resources
composer require spatie/laravel-query-builder

# File Storage
composer require spatie/laravel-medialibrary

# Excel Export/Import
composer require maatwebsite/excel

# PDF Generation
composer require barryvdh/laravel-dompdf

# UUID Support
composer require ramsey/uuid

# Soft Deletes Cascade
composer require askedio/laravel-soft-cascade
```

### Publish Configurations
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="migrations"
```

### Directory Structure
```
app/
├── Console/
├── Exceptions/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── UserController.php
│   │   │   ├── RoleController.php
│   │   │   ├── BranchController.php
│   │   │   ├── DepartmentController.php
│   │   │   ├── DesignationController.php
│   │   │   ├── EmployeeController.php
│   │   │   ├── AwardController.php
│   │   │   ├── PromotionController.php
│   │   │   ├── LeaveController.php
│   │   │   ├── AttendanceController.php
│   │   │   ├── PayrollController.php
│   │   │   └── ... (more controllers)
│   │   └── Controller.php
│   ├── Middleware/
│   │   ├── CheckPermission.php
│   │   └── EnsureCompanyAccess.php
│   ├── Requests/
│   │   ├── Auth/
│   │   ├── Employee/
│   │   ├── Leave/
│   │   └── ... (more request classes)
│   └── Resources/
│       ├── UserResource.php
│       ├── EmployeeResource.php
│       └── ... (more resources)
├── Models/
│   ├── User.php
│   ├── Company.php
│   ├── Branch.php
│   ├── Department.php
│   ├── Designation.php
│   ├── Employee.php
│   └── ... (more models)
├── Policies/
│   ├── EmployeePolicy.php
│   └── ... (more policies)
├── Services/
│   ├── AuthService.php
│   ├── EmployeeService.php
│   ├── PayrollService.php
│   └── ... (more services)
├── Traits/
│   ├── HasCompany.php
│   ├── HasUuid.php
│   └── ApiResponse.php
└── Providers/
    └── AuthServiceProvider.php
```

---

## 2. Database Configuration

### .env Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrm_database
DB_USERNAME=root
DB_PASSWORD=secret

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000
SESSION_DOMAIN=localhost
```

### Migration Examples

#### Create Companies Migration
```php
// database/migrations/2025_01_01_000001_create_companies_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
```

#### Create Employees Migration
```php
// database/migrations/2025_01_01_000010_create_employees_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('employee_id')->unique();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('designation_id')->constrained()->cascadeOnDelete();
            
            // Personal Information
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            
            // Employment Details
            $table->date('date_of_joining');
            $table->enum('employment_type', ['full-time', 'part-time', 'contract', 'internship'])->default('full-time');
            $table->enum('employment_status', ['active', 'inactive', 'terminated', 'resigned'])->default('active');
            $table->foreignId('shift_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('attendance_policy_id')->nullable()->constrained()->nullOnDelete();
            
            // Contact Information
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            
            // Banking Information
            $table->string('bank_name')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bank_identifier_code')->nullable();
            $table->string('bank_branch')->nullable();
            $table->string('tax_payer_id')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['company_id', 'employee_id']);
            $table->index(['employment_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
```

---

## 3. Authentication with Sanctum

### User Model
```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function company()
    {
        return $this->hasOneThrough(
            Company::class,
            Employee::class,
            'user_id',
            'id',
            'id',
            'company_id'
        );
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Accessors
    public function getAvatarUrlAttribute()
    {
        return $this->avatar 
            ? asset('storage/' . $this->avatar) 
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name);
    }
}
```

### Auth Controller
```php
// app/Http/Controllers/Api/AuthController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => now()->addDays(7)->toISOString(),
        ], 'Login successful');
    }

    public function logout(): JsonResponse
    {
        Auth::user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    public function me(): JsonResponse
    {
        $user = Auth::user();
        $user->load(['roles.permissions', 'employee.branch', 'employee.department']);

        return $this->success(new UserResource($user));
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(null, 'Password reset link sent to your email');
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password has been reset successfully');
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
```

### Login Request
```php
// app/Http/Requests/Auth/LoginRequest.php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}
```

---

## 4. Authorization with Spatie Permission

### Permission Seeder
```php
// database/seeders/PermissionSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions by module
        $permissions = [
            // Dashboard
            'dashboard' => ['view_dashboard'],
            
            // Users
            'users' => [
                'view_users', 'create_users', 'edit_users', 'delete_users',
                'export_users', 'import_users', 'reset_user_password',
                'activate_users', 'deactivate_users'
            ],
            
            // Roles
            'roles' => [
                'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
                'assign_roles', 'revoke_roles', 'view_permissions'
            ],
            
            // Branches
            'branches' => [
                'view_branches', 'create_branches', 'edit_branches', 'delete_branches',
                'activate_branches', 'deactivate_branches', 'export_branches', 'import_branches'
            ],
            
            // Departments
            'departments' => [
                'view_departments', 'create_departments', 'edit_departments', 'delete_departments',
                'activate_departments', 'deactivate_departments', 'export_departments', 'import_departments'
            ],
            
            // Designations
            'designations' => [
                'view_designations', 'create_designations', 'edit_designations', 'delete_designations',
                'activate_designations', 'deactivate_designations', 'export_designations', 'import_designations'
            ],
            
            // Employees
            'employees' => [
                'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
                'view_employee_profile', 'export_employees', 'import_employees'
            ],
            
            // Awards
            'awards' => [
                'view_awards', 'create_awards', 'edit_awards', 'delete_awards',
                'view_award_types', 'create_award_types', 'edit_award_types', 'delete_award_types'
            ],
            
            // Promotions
            'promotions' => [
                'view_promotions', 'create_promotions', 'edit_promotions', 'delete_promotions',
                'approve_promotions', 'reject_promotions'
            ],
            
            // Performance
            'performance' => [
                'view_indicators', 'create_indicators', 'edit_indicators', 'delete_indicators',
                'view_goals', 'create_goals', 'edit_goals', 'delete_goals',
                'view_reviews', 'create_reviews', 'edit_reviews', 'delete_reviews'
            ],
            
            // Resignations
            'resignations' => [
                'view_resignations', 'create_resignations', 'edit_resignations', 'delete_resignations',
                'approve_resignations', 'reject_resignations', 'process_resignations'
            ],
            
            // Terminations
            'terminations' => [
                'view_terminations', 'create_terminations', 'edit_terminations', 'delete_terminations',
                'process_terminations', 'complete_terminations'
            ],
            
            // Warnings
            'warnings' => [
                'view_warnings', 'create_warnings', 'edit_warnings', 'delete_warnings',
                'issue_warnings', 'acknowledge_warnings'
            ],
            
            // Trips
            'trips' => [
                'view_trips', 'create_trips', 'edit_trips', 'delete_trips',
                'approve_trips', 'reject_trips', 'manage_trip_expenses'
            ],
            
            // Complaints
            'complaints' => [
                'view_complaints', 'create_complaints', 'edit_complaints', 'delete_complaints',
                'assign_complaints', 'resolve_complaints', 'dismiss_complaints'
            ],
            
            // Transfers
            'transfers' => [
                'view_transfers', 'create_transfers', 'edit_transfers', 'delete_transfers',
                'approve_transfers', 'reject_transfers', 'process_transfers'
            ],
            
            // Holidays
            'holidays' => [
                'view_holidays', 'create_holidays', 'edit_holidays', 'delete_holidays',
                'export_holidays'
            ],
            
            // Announcements
            'announcements' => [
                'view_announcements', 'create_announcements', 'edit_announcements', 'delete_announcements'
            ],
            
            // Assets
            'assets' => [
                'view_assets', 'create_assets', 'edit_assets', 'delete_assets',
                'assign_assets', 'unassign_assets', 'view_asset_types',
                'create_asset_types', 'edit_asset_types', 'delete_asset_types'
            ],
            
            // Training
            'training' => [
                'view_training', 'create_training', 'edit_training', 'delete_training',
                'assign_training', 'complete_training', 'view_training_types',
                'create_training_types', 'edit_training_types', 'delete_training_types'
            ],
            
            // Recruitment
            'recruitment' => [
                'view_jobs', 'create_jobs', 'edit_jobs', 'delete_jobs', 'publish_jobs',
                'view_candidates', 'create_candidates', 'edit_candidates', 'delete_candidates',
                'view_interviews', 'schedule_interviews', 'conduct_interviews',
                'view_offers', 'create_offers', 'send_offers', 'manage_onboarding'
            ],
            
            // Contracts
            'contracts' => [
                'view_contracts', 'create_contracts', 'edit_contracts', 'delete_contracts',
                'approve_contracts', 'renew_contracts', 'terminate_contracts'
            ],
            
            // Documents
            'documents' => [
                'view_documents', 'upload_documents', 'download_documents', 'delete_documents',
                'manage_document_categories'
            ],
            
            // Meetings
            'meetings' => [
                'view_meetings', 'create_meetings', 'edit_meetings', 'delete_meetings',
                'manage_meeting_rooms', 'record_minutes', 'manage_action_items'
            ],
            
            // Leave
            'leave' => [
                'view_leaves', 'apply_leave', 'edit_leave', 'cancel_leave',
                'approve_leaves', 'reject_leaves', 'view_leave_balances',
                'manage_leave_types', 'manage_leave_policies'
            ],
            
            // Attendance
            'attendance' => [
                'view_attendance', 'clock_in_out', 'edit_attendance', 'delete_attendance',
                'approve_regularization', 'manage_shifts', 'manage_attendance_policies'
            ],
            
            // Payroll
            'payroll' => [
                'view_payroll', 'process_payroll', 'view_payslips', 'generate_payslips',
                'send_payslips', 'manage_salary_components', 'manage_employee_salaries'
            ],
            
            // Settings
            'settings' => [
                'view_settings', 'edit_settings', 'manage_currencies', 'manage_landing_page'
            ],
            
            // Media
            'media' => [
                'view_media', 'upload_media', 'download_media', 'delete_media',
                'create_directories', 'rename_media', 'move_media', 'share_media'
            ],
        ];

        // Create all permissions
        foreach ($permissions as $module => $modulePermissions) {
            foreach ($modulePermissions as $permission) {
                Permission::create(['name' => $permission, 'guard_name' => 'web']);
            }
        }

        // Create roles and assign permissions
        
        // Company (Admin) - All permissions
        $companyRole = Role::create(['name' => 'company', 'guard_name' => 'web']);
        $companyRole->givePermissionTo(Permission::all());

        // HR Role - Most permissions except settings and user management
        $hrRole = Role::create(['name' => 'hr', 'guard_name' => 'web']);
        $hrPermissions = collect($permissions)
            ->except(['settings', 'users', 'roles'])
            ->flatten()
            ->toArray();
        $hrRole->givePermissionTo($hrPermissions);

        // Manager Role - Limited permissions
        $managerRole = Role::create(['name' => 'manager', 'guard_name' => 'web']);
        $managerPermissions = [
            'view_dashboard',
            'view_employees', 'view_employee_profile',
            'view_leaves', 'approve_leaves', 'reject_leaves',
            'view_attendance',
            'view_meetings', 'create_meetings',
            'view_announcements',
            'view_holidays',
        ];
        $managerRole->givePermissionTo($managerPermissions);

        // Employee Role - Self-service permissions
        $employeeRole = Role::create(['name' => 'employee', 'guard_name' => 'web']);
        $employeePermissions = [
            'view_dashboard',
            'view_employee_profile',
            'apply_leave', 'view_leaves', 'cancel_leave', 'view_leave_balances',
            'clock_in_out', 'view_attendance',
            'view_payslips',
            'view_announcements',
            'view_holidays',
            'view_meetings',
            'view_documents', 'download_documents',
            'create_complaints',
        ];
        $employeeRole->givePermissionTo($employeePermissions);
    }
}
```

### Check Permission Middleware
```php
// app/Http/Middleware/CheckPermission.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user() || !$request->user()->can($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action',
            ], 403);
        }

        return $next($request);
    }
}
```

### Register Middleware in Kernel
```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    // ... other middleware
    'permission' => \App\Http\Middleware\CheckPermission::class,
];
```

---

## 5. Model Implementation

### Base Model Trait
```php
// app/Traits/HasCompany.php
<?php

namespace App\Traits;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;

trait HasCompany
{
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeForCompany(Builder $query, ?int $companyId = null): Builder
    {
        $companyId = $companyId ?? auth()->user()?->employee?->company_id;
        
        return $query->where('company_id', $companyId);
    }

    protected static function bootHasCompany(): void
    {
        static::creating(function ($model) {
            if (!$model->company_id && auth()->check()) {
                $model->company_id = auth()->user()->employee?->company_id;
            }
        });
    }
}
```

### Employee Model
```php
// app/Models/Employee.php
<?php

namespace App\Models;

use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Employee extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, HasCompany, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'company_id',
        'employee_id',
        'branch_id',
        'department_id',
        'designation_id',
        'date_of_birth',
        'gender',
        'marital_status',
        'date_of_joining',
        'employment_type',
        'employment_status',
        'shift_id',
        'attendance_policy_id',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'country',
        'postal_code',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_phone',
        'bank_name',
        'account_holder_name',
        'account_number',
        'bank_identifier_code',
        'bank_branch',
        'tax_payer_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_joining' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function attendancePolicy()
    {
        return $this->belongsTo(AttendancePolicy::class);
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function awards()
    {
        return $this->hasMany(Award::class);
    }

    public function leaveApplications()
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function contracts()
    {
        return $this->hasMany(EmployeeContract::class);
    }

    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    public function trainings()
    {
        return $this->hasMany(EmployeeTraining::class);
    }

    public function goals()
    {
        return $this->hasMany(EmployeeGoal::class);
    }

    public function reviews()
    {
        return $this->hasMany(EmployeeReview::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('employment_status', 'active');
    }

    public function scopeByBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    // Media Collections
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_photo')
            ->singleFile();

        $this->addMediaCollection('documents');
    }

    // Accessors
    public function getFullAddressAttribute(): string
    {
        return collect([
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ])->filter()->implode(', ');
    }

    public function getCurrentContractAttribute()
    {
        return $this->contracts()
            ->where('status', 'active')
            ->latest()
            ->first();
    }

    public function getCurrentSalaryAttribute()
    {
        return $this->salaries()
            ->where('effective_date', '<=', now())
            ->latest('effective_date')
            ->first();
    }
}
```

### Leave Application Model
```php
// app/Models/LeaveApplication.php
<?php

namespace App\Models;

use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
        'total_days' => 'decimal:1',
    ];

    // Relationships
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeForPeriod($query, $startDate, $endDate)
    {
        return $query->where(function ($q) use ($startDate, $endDate) {
            $q->whereBetween('start_date', [$startDate, $endDate])
              ->orWhereBetween('end_date', [$startDate, $endDate])
              ->orWhere(function ($q2) use ($startDate, $endDate) {
                  $q2->where('start_date', '<=', $startDate)
                     ->where('end_date', '>=', $endDate);
              });
        });
    }

    // Methods
    public function approve(User $approver): void
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ]);

        // Deduct from leave balance
        $this->employee->leaveBalances()
            ->where('leave_type_id', $this->leave_type_id)
            ->where('year', $this->start_date->year)
            ->decrement('used_days', $this->total_days);
    }

    public function reject(User $approver, string $reason): void
    {
        $this->update([
            'status' => 'rejected',
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    public function cancel(): void
    {
        if ($this->status === 'approved') {
            // Restore leave balance
            $this->employee->leaveBalances()
                ->where('leave_type_id', $this->leave_type_id)
                ->where('year', $this->start_date->year)
                ->increment('used_days', -$this->total_days);
        }

        $this->update(['status' => 'cancelled']);
    }
}
```

---

## 6. API Controllers

### Employee Controller
```php
// app/Http/Controllers/Api/EmployeeController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\EmployeeCollection;
use App\Models\Employee;
use App\Services\EmployeeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class EmployeeController extends Controller
{
    use ApiResponse;

    public function __construct(
        private EmployeeService $employeeService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Employee::class);

        $employees = QueryBuilder::for(Employee::class)
            ->forCompany()
            ->allowedFilters([
                AllowedFilter::exact('branch_id'),
                AllowedFilter::exact('department_id'),
                AllowedFilter::exact('designation_id'),
                AllowedFilter::exact('employment_status'),
                AllowedFilter::exact('employment_type'),
                AllowedFilter::scope('search', 'searchByName'),
            ])
            ->allowedSorts(['created_at', 'date_of_joining', 'employee_id'])
            ->allowedIncludes(['user', 'branch', 'department', 'designation'])
            ->with(['user', 'branch', 'department', 'designation'])
            ->paginate($request->get('per_page', 15));

        return $this->success(new EmployeeCollection($employees));
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $this->authorize('create', Employee::class);

        $employee = $this->employeeService->create($request->validated());

        return $this->success(
            new EmployeeResource($employee->load(['user', 'branch', 'department', 'designation'])),
            'Employee created successfully',
            201
        );
    }

    public function show(Employee $employee): JsonResponse
    {
        $this->authorize('view', $employee);

        $employee->load([
            'user',
            'branch',
            'department',
            'designation',
            'shift',
            'documents.documentType',
            'awards.awardType',
            'leaveBalances.leaveType',
        ]);

        return $this->success(new EmployeeResource($employee));
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        $this->authorize('update', $employee);

        $employee = $this->employeeService->update($employee, $request->validated());

        return $this->success(
            new EmployeeResource($employee->load(['user', 'branch', 'department', 'designation'])),
            'Employee updated successfully'
        );
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $this->authorize('delete', $employee);

        $this->employeeService->delete($employee);

        return $this->success(null, 'Employee deleted successfully');
    }

    public function profile(): JsonResponse
    {
        $employee = auth()->user()->employee;

        if (!$employee) {
            return $this->error('Employee profile not found', 404);
        }

        $employee->load([
            'user',
            'branch',
            'department',
            'designation',
            'shift',
            'documents.documentType',
            'awards.awardType',
            'leaveBalances.leaveType',
            'currentContract',
            'currentSalary',
        ]);

        return $this->success(new EmployeeResource($employee));
    }
}
```

### Leave Controller
```php
// app/Http/Controllers/Api/LeaveController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Leave\StoreLeaveRequest;
use App\Http\Requests\Leave\ApproveLeaveRequest;
use App\Http\Requests\Leave\RejectLeaveRequest;
use App\Http\Resources\LeaveApplicationResource;
use App\Http\Resources\LeaveBalanceResource;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use App\Services\LeaveService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class LeaveController extends Controller
{
    use ApiResponse;

    public function __construct(
        private LeaveService $leaveService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', LeaveApplication::class);

        $query = QueryBuilder::for(LeaveApplication::class)
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::exact('leave_type_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::scope('date_from', 'fromDate'),
                AllowedFilter::scope('date_to', 'toDate'),
            ])
            ->allowedSorts(['created_at', 'start_date', 'end_date'])
            ->with(['employee.user', 'leaveType', 'approver']);

        // If employee, only show their own leaves
        if (auth()->user()->hasRole('employee')) {
            $query->where('employee_id', auth()->user()->employee->id);
        }

        $leaves = $query->paginate($request->get('per_page', 15));

        return $this->success(LeaveApplicationResource::collection($leaves));
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $this->authorize('create', LeaveApplication::class);

        $leave = $this->leaveService->apply($request->validated());

        return $this->success(
            new LeaveApplicationResource($leave->load(['employee.user', 'leaveType'])),
            'Leave application submitted successfully',
            201
        );
    }

    public function show(LeaveApplication $leave): JsonResponse
    {
        $this->authorize('view', $leave);

        return $this->success(
            new LeaveApplicationResource($leave->load(['employee.user', 'leaveType', 'approver']))
        );
    }

    public function approve(ApproveLeaveRequest $request, LeaveApplication $leave): JsonResponse
    {
        $this->authorize('approve', $leave);

        $this->leaveService->approve($leave, auth()->user());

        return $this->success(
            new LeaveApplicationResource($leave->fresh(['employee.user', 'leaveType', 'approver'])),
            'Leave application approved successfully'
        );
    }

    public function reject(RejectLeaveRequest $request, LeaveApplication $leave): JsonResponse
    {
        $this->authorize('reject', $leave);

        $this->leaveService->reject($leave, auth()->user(), $request->rejection_reason);

        return $this->success(
            new LeaveApplicationResource($leave->fresh(['employee.user', 'leaveType', 'approver'])),
            'Leave application rejected'
        );
    }

    public function cancel(LeaveApplication $leave): JsonResponse
    {
        $this->authorize('cancel', $leave);

        $this->leaveService->cancel($leave);

        return $this->success(null, 'Leave application cancelled');
    }

    public function balances(Request $request): JsonResponse
    {
        $employeeId = $request->get('employee_id', auth()->user()->employee?->id);
        $year = $request->get('year', now()->year);

        $balances = LeaveBalance::where('employee_id', $employeeId)
            ->where('year', $year)
            ->with('leaveType')
            ->get();

        return $this->success(LeaveBalanceResource::collection($balances));
    }
}
```

### Attendance Controller
```php
// app/Http/Controllers/Api/AttendanceController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttendanceRecordResource;
use App\Models\AttendanceRecord;
use App\Services\AttendanceService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    use ApiResponse;

    public function __construct(
        private AttendanceService $attendanceService
    ) {}

    public function clockIn(Request $request): JsonResponse
    {
        $this->authorize('clockIn', AttendanceRecord::class);

        $employee = auth()->user()->employee;

        if (!$employee) {
            return $this->error('Employee profile not found', 404);
        }

        $attendance = $this->attendanceService->clockIn($employee, $request->notes);

        return $this->success(
            new AttendanceRecordResource($attendance),
            'Clocked in successfully'
        );
    }

    public function clockOut(Request $request): JsonResponse
    {
        $this->authorize('clockOut', AttendanceRecord::class);

        $employee = auth()->user()->employee;

        if (!$employee) {
            return $this->error('Employee profile not found', 404);
        }

        $attendance = $this->attendanceService->clockOut($employee, $request->notes);

        return $this->success(
            new AttendanceRecordResource($attendance),
            'Clocked out successfully'
        );
    }

    public function todayStatus(): JsonResponse
    {
        $employee = auth()->user()->employee;

        if (!$employee) {
            return $this->error('Employee profile not found', 404);
        }

        $attendance = AttendanceRecord::where('employee_id', $employee->id)
            ->where('attendance_date', today())
            ->first();

        return $this->success([
            'attendance' => $attendance ? new AttendanceRecordResource($attendance) : null,
            'shift' => $employee->shift,
            'is_clocked_in' => $attendance && $attendance->clock_in_time && !$attendance->clock_out_time,
        ]);
    }
}
```

---

## 7. Form Requests & Validation

### Store Employee Request
```php
// app/Http/Requests/Employee/StoreEmployeeRequest.php
<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // User fields
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            
            // Employee fields
            'employee_id' => ['required', 'string', 'max:50', 'unique:employees,employee_id'],
            'branch_id' => ['required', 'exists:branches,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'designation_id' => ['required', 'exists:designations,id'],
            
            // Personal Information
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'marital_status' => ['nullable', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            
            // Employment Details
            'date_of_joining' => ['required', 'date'],
            'employment_type' => ['required', Rule::in(['full-time', 'part-time', 'contract', 'internship'])],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'attendance_policy_id' => ['nullable', 'exists:attendance_policies,id'],
            
            // Contact Information
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            
            // Emergency Contact
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            
            // Banking Information
            'bank_name' => ['nullable', 'string', 'max:255'],
            'account_holder_name' => ['nullable', 'string', 'max:255'],
            'account_number' => ['nullable', 'string', 'max:50'],
            'bank_identifier_code' => ['nullable', 'string', 'max:20'],
            'bank_branch' => ['nullable', 'string', 'max:255'],
            'tax_payer_id' => ['nullable', 'string', 'max:50'],
            
            // Documents
            'documents' => ['nullable', 'array'],
            'documents.*.document_type_id' => ['required_with:documents', 'exists:document_types,id'],
            'documents.*.file' => ['required_with:documents', 'file', 'max:10240'],
            'documents.*.expiry_date' => ['nullable', 'date', 'after:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already registered.',
            'employee_id.unique' => 'This employee ID is already in use.',
            'date_of_birth.before' => 'Date of birth must be in the past.',
        ];
    }
}
```

### Store Leave Request
```php
// app/Http/Requests/Leave/StoreLeaveRequest.php
<?php

namespace App\Http\Requests\Leave;

use App\Models\LeaveBalance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $employee = auth()->user()->employee;
            $startDate = $this->date('start_date');
            $endDate = $this->date('end_date');
            $totalDays = $startDate->diffInDays($endDate) + 1;

            // Check leave balance
            $balance = LeaveBalance::where('employee_id', $employee->id)
                ->where('leave_type_id', $this->leave_type_id)
                ->where('year', $startDate->year)
                ->first();

            if (!$balance) {
                $validator->errors()->add('leave_type_id', 'No leave balance found for this leave type.');
                return;
            }

            $remainingDays = $balance->allocated_days + $balance->carried_forward_days - $balance->used_days;

            if ($totalDays > $remainingDays) {
                $validator->errors()->add(
                    'end_date',
                    "Insufficient leave balance. You have {$remainingDays} days remaining."
                );
            }
        });
    }
}
```

---

## 8. Resources & Transformers

### Employee Resource
```php
// app/Http/Resources/EmployeeResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'user' => new UserResource($this->whenLoaded('user')),
            
            'personal_info' => [
                'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
                'gender' => $this->gender,
                'marital_status' => $this->marital_status,
            ],
            
            'employment_details' => [
                'branch' => new BranchResource($this->whenLoaded('branch')),
                'department' => new DepartmentResource($this->whenLoaded('department')),
                'designation' => new DesignationResource($this->whenLoaded('designation')),
                'date_of_joining' => $this->date_of_joining->format('Y-m-d'),
                'employment_type' => $this->employment_type,
                'employment_status' => $this->employment_status,
                'shift' => new ShiftResource($this->whenLoaded('shift')),
            ],
            
            'contact_info' => [
                'address_line_1' => $this->address_line_1,
                'address_line_2' => $this->address_line_2,
                'city' => $this->city,
                'state' => $this->state,
                'country' => $this->country,
                'postal_code' => $this->postal_code,
                'full_address' => $this->full_address,
            ],
            
            'emergency_contact' => [
                'name' => $this->emergency_contact_name,
                'relationship' => $this->emergency_contact_relationship,
                'phone' => $this->emergency_contact_phone,
            ],
            
            'banking_info' => $this->when(
                $request->user()?->can('view_banking_info') || $request->user()?->id === $this->user_id,
                [
                    'bank_name' => $this->bank_name,
                    'account_holder_name' => $this->account_holder_name,
                    'account_number' => $this->maskAccountNumber($this->account_number),
                    'bank_identifier_code' => $this->bank_identifier_code,
                    'bank_branch' => $this->bank_branch,
                    'tax_payer_id' => $this->tax_payer_id,
                ]
            ),
            
            'documents' => EmployeeDocumentResource::collection($this->whenLoaded('documents')),
            'awards' => AwardResource::collection($this->whenLoaded('awards')),
            'leave_balances' => LeaveBalanceResource::collection($this->whenLoaded('leaveBalances')),
            
            'statistics' => $this->when($this->relationLoaded('awards'), [
                'total_awards' => $this->awards->count(),
                'total_warnings' => $this->whenLoaded('warnings', fn() => $this->warnings->count(), 0),
            ]),
            
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    private function maskAccountNumber(?string $accountNumber): ?string
    {
        if (!$accountNumber || strlen($accountNumber) < 4) {
            return $accountNumber;
        }

        return str_repeat('*', strlen($accountNumber) - 4) . substr($accountNumber, -4);
    }
}
```

### User Resource
```php
// app/Http/Resources/UserResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar_url,
            'status' => $this->status,
            'role' => $this->when($this->relationLoaded('roles'), function () {
                $role = $this->roles->first();
                return $role ? [
                    'id' => $role->id,
                    'name' => $role->name,
                ] : null;
            }),
            'permissions' => $this->when(
                $this->relationLoaded('roles') && $this->roles->first()?->relationLoaded('permissions'),
                fn() => $this->getAllPermissions()->pluck('name')
            ),
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

---

## 9. Services & Business Logic

### Employee Service
```php
// app/Services/EmployeeService.php
<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeService
{
    public function create(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'status' => 'active',
            ]);

            // Assign employee role
            $user->assignRole('employee');

            // Create employee
            $employee = Employee::create([
                'user_id' => $user->id,
                'company_id' => auth()->user()->employee->company_id,
                'employee_id' => $data['employee_id'],
                'branch_id' => $data['branch_id'],
                'department_id' => $data['department_id'],
                'designation_id' => $data['designation_id'],
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? null,
                'marital_status' => $data['marital_status'] ?? null,
                'date_of_joining' => $data['date_of_joining'],
                'employment_type' => $data['employment_type'],
                'employment_status' => 'active',
                'shift_id' => $data['shift_id'] ?? null,
                'attendance_policy_id' => $data['attendance_policy_id'] ?? null,
                'address_line_1' => $data['address_line_1'] ?? null,
                'address_line_2' => $data['address_line_2'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'country' => $data['country'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
                'emergency_contact_name' => $data['emergency_contact_name'] ?? null,
                'emergency_contact_relationship' => $data['emergency_contact_relationship'] ?? null,
                'emergency_contact_phone' => $data['emergency_contact_phone'] ?? null,
                'bank_name' => $data['bank_name'] ?? null,
                'account_holder_name' => $data['account_holder_name'] ?? null,
                'account_number' => $data['account_number'] ?? null,
                'bank_identifier_code' => $data['bank_identifier_code'] ?? null,
                'bank_branch' => $data['bank_branch'] ?? null,
                'tax_payer_id' => $data['tax_payer_id'] ?? null,
            ]);

            // Handle documents
            if (!empty($data['documents'])) {
                foreach ($data['documents'] as $document) {
                    $employee->documents()->create([
                        'document_type_id' => $document['document_type_id'],
                        'file_path' => $document['file']->store('employee-documents', 'public'),
                        'file_name' => $document['file']->getClientOriginalName(),
                        'expiry_date' => $document['expiry_date'] ?? null,
                    ]);
                }
            }

            // Initialize leave balances
            $this->initializeLeaveBalances($employee);

            return $employee;
        });
    }

    public function update(Employee $employee, array $data): Employee
    {
        return DB::transaction(function () use ($employee, $data) {
            // Update user if user fields provided
            if (isset($data['name']) || isset($data['email']) || isset($data['phone'])) {
                $employee->user->update(array_filter([
                    'name' => $data['name'] ?? null,
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'] ?? null,
                ]));
            }

            // Update employee
            $employee->update(array_filter($data, fn($key) => !in_array($key, ['name', 'email', 'phone', 'password', 'documents']), ARRAY_FILTER_USE_KEY));

            return $employee->fresh();
        });
    }

    public function delete(Employee $employee): void
    {
        DB::transaction(function () use ($employee) {
            $employee->user->delete();
            $employee->delete();
        });
    }

    private function initializeLeaveBalances(Employee $employee): void
    {
        $leaveTypes = \App\Models\LeaveType::where('status', 'active')->get();
        $year = now()->year;

        foreach ($leaveTypes as $leaveType) {
            $employee->leaveBalances()->create([
                'leave_type_id' => $leaveType->id,
                'year' => $year,
                'allocated_days' => $leaveType->max_days_per_year,
                'used_days' => 0,
                'carried_forward_days' => 0,
            ]);
        }
    }
}
```

### Attendance Service
```php
// app/Services/AttendanceService.php
<?php

namespace App\Services;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use Carbon\Carbon;

class AttendanceService
{
    public function clockIn(Employee $employee, ?string $notes = null): AttendanceRecord
    {
        $today = today();
        
        // Check if already clocked in
        $existingRecord = AttendanceRecord::where('employee_id', $employee->id)
            ->where('attendance_date', $today)
            ->first();

        if ($existingRecord && $existingRecord->clock_in_time) {
            throw new \Exception('Already clocked in for today');
        }

        $now = now();
        $shift = $employee->shift;
        $status = 'present';

        // Check if late
        if ($shift) {
            $shiftStart = Carbon::parse($today->format('Y-m-d') . ' ' . $shift->start_time);
            $graceEnd = $shiftStart->copy()->addMinutes($shift->grace_period_minutes);

            if ($now->gt($graceEnd)) {
                $status = 'late';
            }
        }

        if ($existingRecord) {
            $existingRecord->update([
                'clock_in_time' => $now,
                'status' => $status,
                'notes' => $notes,
            ]);
            return $existingRecord;
        }

        return AttendanceRecord::create([
            'employee_id' => $employee->id,
            'shift_id' => $shift?->id,
            'attendance_date' => $today,
            'clock_in_time' => $now,
            'status' => $status,
            'notes' => $notes,
        ]);
    }

    public function clockOut(Employee $employee, ?string $notes = null): AttendanceRecord
    {
        $today = today();
        
        $record = AttendanceRecord::where('employee_id', $employee->id)
            ->where('attendance_date', $today)
            ->first();

        if (!$record || !$record->clock_in_time) {
            throw new \Exception('You must clock in first');
        }

        if ($record->clock_out_time) {
            throw new \Exception('Already clocked out for today');
        }

        $now = now();
        $overtimeHours = 0;

        // Calculate overtime
        if ($employee->shift) {
            $shiftEnd = Carbon::parse($today->format('Y-m-d') . ' ' . $employee->shift->end_time);
            
            if ($now->gt($shiftEnd)) {
                $overtimeMinutes = $now->diffInMinutes($shiftEnd);
                $overtimeHours = round($overtimeMinutes / 60, 2);
            }
        }

        $record->update([
            'clock_out_time' => $now,
            'overtime_hours' => $overtimeHours,
            'notes' => $notes ? ($record->notes . "\n" . $notes) : $record->notes,
        ]);

        return $record;
    }
}
```

### Payroll Service
```php
// app/Services/PayrollService.php
<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function processPayroll(PayrollRun $payrollRun): void
    {
        DB::transaction(function () use ($payrollRun) {
            $payrollRun->update(['status' => 'processing']);

            $employees = Employee::where('company_id', $payrollRun->company_id)
                ->where('employment_status', 'active')
                ->with(['currentSalary.components.salaryComponent'])
                ->get();

            foreach ($employees as $employee) {
                $this->generatePayslip($payrollRun, $employee);
            }

            $payrollRun->update([
                'status' => 'completed',
                'processed_by' => auth()->id(),
                'processed_at' => now(),
            ]);
        });
    }

    private function generatePayslip(PayrollRun $payrollRun, Employee $employee): Payslip
    {
        $salary = $employee->currentSalary;
        
        if (!$salary) {
            return null;
        }

        $baseSalary = $salary->base_salary;
        $earnings = ['Basic Salary' => $baseSalary];
        $deductions = [];
        $totalEarnings = $baseSalary;
        $totalDeductions = 0;

        foreach ($salary->components as $component) {
            $salaryComponent = $component->salaryComponent;
            $amount = $component->amount;

            if ($salaryComponent->component_type === 'earning') {
                $earnings[$salaryComponent->name] = $amount;
                $totalEarnings += $amount;
            } else {
                $deductions[$salaryComponent->name] = $amount;
                $totalDeductions += $amount;
            }
        }

        return Payslip::create([
            'payroll_run_id' => $payrollRun->id,
            'employee_id' => $employee->id,
            'base_salary' => $baseSalary,
            'total_earnings' => $totalEarnings,
            'total_deductions' => $totalDeductions,
            'net_pay' => $totalEarnings - $totalDeductions,
            'earnings_breakdown' => $earnings,
            'deductions_breakdown' => $deductions,
            'status' => 'generated',
        ]);
    }
}
```

---

## 10. API Routes

```php
// routes/api.php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DesignationController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\PayrollController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Users
    Route::apiResource('users', UserController::class);
    Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword']);

    // Roles
    Route::apiResource('roles', RoleController::class);
    Route::get('/permissions', [RoleController::class, 'permissions']);

    // Organization Structure
    Route::apiResource('branches', BranchController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('designations', DesignationController::class);

    // Employees
    Route::get('/employees/profile', [EmployeeController::class, 'profile']);
    Route::apiResource('employees', EmployeeController::class);

    // Leave Management
    Route::get('/leave/balances', [LeaveController::class, 'balances']);
    Route::patch('/leave/{leave}/approve', [LeaveController::class, 'approve']);
    Route::patch('/leave/{leave}/reject', [LeaveController::class, 'reject']);
    Route::patch('/leave/{leave}/cancel', [LeaveController::class, 'cancel']);
    Route::apiResource('leave', LeaveController::class)->except(['update', 'destroy']);

    // Attendance
    Route::get('/attendance/today', [AttendanceController::class, 'todayStatus']);
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
    Route::apiResource('attendance', AttendanceController::class)->only(['index', 'show']);

    // Payroll
    Route::get('/payslips', [PayrollController::class, 'payslips']);
    Route::get('/payslips/{payslip}', [PayrollController::class, 'showPayslip']);
    Route::get('/payslips/{payslip}/download', [PayrollController::class, 'downloadPayslip']);
    Route::post('/payroll-runs/{payrollRun}/process', [PayrollController::class, 'process']);
    Route::apiResource('payroll-runs', PayrollController::class);

    // ... more routes for other modules
});
```

---

## 11. Testing

### Feature Test Example
```php
// tests/Feature/EmployeeTest.php
<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Company $company;
    protected Branch $branch;
    protected Department $department;
    protected Designation $designation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\PermissionSeeder::class);

        $this->company = Company::factory()->create();
        $this->branch = Branch::factory()->create(['company_id' => $this->company->id]);
        $this->department = Department::factory()->create(['branch_id' => $this->branch->id]);
        $this->designation = Designation::factory()->create(['department_id' => $this->department->id]);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('company');

        $adminEmployee = Employee::factory()->create([
            'user_id' => $this->admin->id,
            'company_id' => $this->company->id,
            'branch_id' => $this->branch->id,
            'department_id' => $this->department->id,
            'designation_id' => $this->designation->id,
        ]);
    }

    public function test_admin_can_list_employees(): void
    {
        Sanctum::actingAs($this->admin);

        Employee::factory()->count(5)->create([
            'company_id' => $this->company->id,
            'branch_id' => $this->branch->id,
            'department_id' => $this->department->id,
            'designation_id' => $this->designation->id,
        ]);

        $response = $this->getJson('/api/v1/employees');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'employee_id', 'user', 'employment_details']
                    ],
                    'meta'
                ]
            ]);
    }

    public function test_admin_can_create_employee(): void
    {
        Sanctum::actingAs($this->admin);

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'employee_id' => 'EMP001',
            'branch_id' => $this->branch->id,
            'department_id' => $this->department->id,
            'designation_id' => $this->designation->id,
            'date_of_joining' => now()->format('Y-m-d'),
            'employment_type' => 'full-time',
        ];

        $response = $this->postJson('/api/v1/employees', $data);

        $response->assertCreated()
            ->assertJsonPath('data.employee_id', 'EMP001')
            ->assertJsonPath('data.user.name', 'John Doe');

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
        $this->assertDatabaseHas('employees', ['employee_id' => 'EMP001']);
    }

    public function test_employee_cannot_create_employee(): void
    {
        $employee = User::factory()->create();
        $employee->assignRole('employee');

        Employee::factory()->create([
            'user_id' => $employee->id,
            'company_id' => $this->company->id,
            'branch_id' => $this->branch->id,
            'department_id' => $this->department->id,
            'designation_id' => $this->designation->id,
        ]);

        Sanctum::actingAs($employee);

        $response = $this->postJson('/api/v1/employees', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'employee_id' => 'EMP002',
            'branch_id' => $this->branch->id,
            'department_id' => $this->department->id,
            'designation_id' => $this->designation->id,
            'date_of_joining' => now()->format('Y-m-d'),
            'employment_type' => 'full-time',
        ]);

        $response->assertForbidden();
    }
}
```

---

## Next Steps
- See `06-FRONTEND-IMPLEMENTATION.md` for React implementation guide
- See `07-DEPLOYMENT.md` for deployment instructions
