# WorkDo HRM - Testing Guide

This guide covers comprehensive testing strategies for the WorkDo HRM system, including unit tests, integration tests, and end-to-end tests for both the Laravel backend and React frontend.

---

## Table of Contents
1. [Testing Overview](#1-testing-overview)
2. [Backend Testing (Laravel)](#2-backend-testing-laravel)
3. [Frontend Testing (React)](#3-frontend-testing-react)
4. [API Testing](#4-api-testing)
5. [End-to-End Testing](#5-end-to-end-testing)
6. [Performance Testing](#6-performance-testing)
7. [Security Testing](#7-security-testing)
8. [Test Data Management](#8-test-data-management)
9. [Continuous Integration](#9-continuous-integration)
10. [Test Coverage Reports](#10-test-coverage-reports)

---

## 1. Testing Overview

### Testing Pyramid

```
                    /\
                   /  \
                  / E2E \        <- Few, slow, expensive
                 /--------\
                /Integration\    <- Some, medium speed
               /--------------\
              /   Unit Tests   \ <- Many, fast, cheap
             /------------------\
```

### Testing Strategy

| Test Type | Backend | Frontend | Coverage Target |
|-----------|---------|----------|-----------------|
| Unit Tests | PHPUnit | Jest/Vitest | 80%+ |
| Integration Tests | PHPUnit + DB | React Testing Library | 60%+ |
| API Tests | PHPUnit HTTP | Axios Mock | 90%+ |
| E2E Tests | - | Cypress/Playwright | Critical paths |

### Test Environment Setup

```bash
# Backend
cp .env.example .env.testing
php artisan key:generate --env=testing

# Frontend
cp .env.example .env.test
```

---

## 2. Backend Testing (Laravel)

### 2.1 Setup

```bash
# Install testing dependencies
composer require --dev phpunit/phpunit mockery/mockery

# Create testing database
mysql -u root -p -e "CREATE DATABASE hrm_testing;"

# Configure .env.testing
DB_CONNECTION=mysql
DB_DATABASE=hrm_testing
```

### 2.2 Unit Tests

Unit tests focus on testing individual classes and methods in isolation.

#### Testing Models

```php
<?php
// tests/Unit/Models/EmployeeTest.php

namespace Tests\Unit\Models;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Designation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $employee = Employee::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $employee->user);
        $this->assertEquals($user->id, $employee->user->id);
    }

    /** @test */
    public function it_belongs_to_a_department()
    {
        $department = Department::factory()->create();
        $employee = Employee::factory()->create(['department_id' => $department->id]);

        $this->assertInstanceOf(Department::class, $employee->department);
        $this->assertEquals($department->id, $employee->department->id);
    }

    /** @test */
    public function it_belongs_to_a_designation()
    {
        $designation = Designation::factory()->create();
        $employee = Employee::factory()->create(['designation_id' => $designation->id]);

        $this->assertInstanceOf(Designation::class, $employee->designation);
    }

    /** @test */
    public function it_can_calculate_years_of_service()
    {
        $employee = Employee::factory()->create([
            'joining_date' => now()->subYears(3)->subMonths(6),
        ]);

        $this->assertEquals(3, $employee->yearsOfService());
    }

    /** @test */
    public function it_can_check_if_employee_is_on_probation()
    {
        $employeeOnProbation = Employee::factory()->create([
            'joining_date' => now()->subMonths(2),
            'probation_period' => 3,
        ]);

        $employeeNotOnProbation = Employee::factory()->create([
            'joining_date' => now()->subMonths(6),
            'probation_period' => 3,
        ]);

        $this->assertTrue($employeeOnProbation->isOnProbation());
        $this->assertFalse($employeeNotOnProbation->isOnProbation());
    }

    /** @test */
    public function it_has_full_name_attribute()
    {
        $employee = Employee::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $this->assertEquals('John Doe', $employee->full_name);
    }

    /** @test */
    public function it_can_be_soft_deleted()
    {
        $employee = Employee::factory()->create();
        $employee->delete();

        $this->assertSoftDeleted('employees', ['id' => $employee->id]);
    }
}
```

#### Testing Services

```php
<?php
// tests/Unit/Services/LeaveServiceTest.php

namespace Tests\Unit\Services;

use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Services\LeaveService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveServiceTest extends TestCase
{
    use RefreshDatabase;

    private LeaveService $leaveService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->leaveService = new LeaveService();
    }

    /** @test */
    public function it_can_calculate_leave_days_excluding_weekends()
    {
        // Monday to Friday = 5 days
        $startDate = '2024-01-08'; // Monday
        $endDate = '2024-01-12';   // Friday

        $days = $this->leaveService->calculateLeaveDays($startDate, $endDate);

        $this->assertEquals(5, $days);
    }

    /** @test */
    public function it_can_calculate_leave_days_including_weekends()
    {
        // Monday to next Monday = 6 working days (excluding weekend)
        $startDate = '2024-01-08'; // Monday
        $endDate = '2024-01-15';   // Monday

        $days = $this->leaveService->calculateLeaveDays($startDate, $endDate);

        $this->assertEquals(6, $days);
    }

    /** @test */
    public function it_can_check_if_employee_has_sufficient_balance()
    {
        $employee = Employee::factory()->create();
        $leaveType = LeaveType::factory()->create();
        
        LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'balance' => 10,
            'used' => 3,
        ]);

        $hasSufficientBalance = $this->leaveService->hasSufficientBalance(
            $employee->id,
            $leaveType->id,
            5
        );

        $this->assertTrue($hasSufficientBalance);
    }

    /** @test */
    public function it_returns_false_when_insufficient_balance()
    {
        $employee = Employee::factory()->create();
        $leaveType = LeaveType::factory()->create();
        
        LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'balance' => 10,
            'used' => 8,
        ]);

        $hasSufficientBalance = $this->leaveService->hasSufficientBalance(
            $employee->id,
            $leaveType->id,
            5
        );

        $this->assertFalse($hasSufficientBalance);
    }

    /** @test */
    public function it_can_deduct_leave_balance()
    {
        $employee = Employee::factory()->create();
        $leaveType = LeaveType::factory()->create();
        
        $balance = LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'balance' => 10,
            'used' => 2,
        ]);

        $this->leaveService->deductBalance($employee->id, $leaveType->id, 3);

        $balance->refresh();
        $this->assertEquals(5, $balance->used);
    }

    /** @test */
    public function it_can_restore_leave_balance_on_cancellation()
    {
        $employee = Employee::factory()->create();
        $leaveType = LeaveType::factory()->create();
        
        $balance = LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'balance' => 10,
            'used' => 5,
        ]);

        $this->leaveService->restoreBalance($employee->id, $leaveType->id, 3);

        $balance->refresh();
        $this->assertEquals(2, $balance->used);
    }
}
```

#### Testing Payroll Calculations

```php
<?php
// tests/Unit/Services/PayrollServiceTest.php

namespace Tests\Unit\Services;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\SalaryComponent;
use App\Services\PayrollService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollServiceTest extends TestCase
{
    use RefreshDatabase;

    private PayrollService $payrollService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->payrollService = new PayrollService();
    }

    /** @test */
    public function it_can_calculate_gross_salary()
    {
        $employee = Employee::factory()->create();
        
        // Create salary components
        $basicSalary = SalaryComponent::factory()->create([
            'name' => 'Basic Salary',
            'type' => 'earning',
        ]);
        
        $hra = SalaryComponent::factory()->create([
            'name' => 'HRA',
            'type' => 'earning',
        ]);

        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $basicSalary->id,
            'amount' => 50000,
        ]);

        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $hra->id,
            'amount' => 20000,
        ]);

        $grossSalary = $this->payrollService->calculateGrossSalary($employee->id);

        $this->assertEquals(70000, $grossSalary);
    }

    /** @test */
    public function it_can_calculate_total_deductions()
    {
        $employee = Employee::factory()->create();
        
        $pf = SalaryComponent::factory()->create([
            'name' => 'Provident Fund',
            'type' => 'deduction',
        ]);
        
        $tax = SalaryComponent::factory()->create([
            'name' => 'Income Tax',
            'type' => 'deduction',
        ]);

        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $pf->id,
            'amount' => 6000,
        ]);

        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $tax->id,
            'amount' => 5000,
        ]);

        $totalDeductions = $this->payrollService->calculateTotalDeductions($employee->id);

        $this->assertEquals(11000, $totalDeductions);
    }

    /** @test */
    public function it_can_calculate_net_salary()
    {
        $employee = Employee::factory()->create();
        
        // Earnings
        $basicSalary = SalaryComponent::factory()->create(['type' => 'earning']);
        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $basicSalary->id,
            'amount' => 50000,
        ]);

        // Deductions
        $pf = SalaryComponent::factory()->create(['type' => 'deduction']);
        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $pf->id,
            'amount' => 6000,
        ]);

        $netSalary = $this->payrollService->calculateNetSalary($employee->id);

        $this->assertEquals(44000, $netSalary);
    }

    /** @test */
    public function it_can_calculate_prorated_salary_for_partial_month()
    {
        $employee = Employee::factory()->create([
            'joining_date' => '2024-01-15', // Joined mid-month
        ]);
        
        $basicSalary = SalaryComponent::factory()->create(['type' => 'earning']);
        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $basicSalary->id,
            'amount' => 31000, // 1000 per day
        ]);

        $proratedSalary = $this->payrollService->calculateProratedSalary(
            $employee->id,
            '2024-01',
            17 // Working days from 15th to 31st
        );

        $this->assertEquals(17000, $proratedSalary);
    }

    /** @test */
    public function it_can_calculate_overtime_pay()
    {
        $employee = Employee::factory()->create();
        
        $basicSalary = SalaryComponent::factory()->create(['type' => 'earning']);
        EmployeeSalary::factory()->create([
            'employee_id' => $employee->id,
            'salary_component_id' => $basicSalary->id,
            'amount' => 52000, // ~250 per hour (assuming 208 hours/month)
        ]);

        // 10 hours overtime at 1.5x rate
        $overtimePay = $this->payrollService->calculateOvertimePay(
            $employee->id,
            10,
            1.5
        );

        $this->assertEquals(3750, $overtimePay); // 250 * 10 * 1.5
    }
}
```

### 2.3 Integration Tests

Integration tests verify that different parts of the application work together correctly.

#### Testing API Endpoints

```php
<?php
// tests/Feature/Api/EmployeeApiTest.php

namespace Tests\Feature\Api;

use App\Models\Employee;
use App\Models\User;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('company');
    }

    /** @test */
    public function it_can_list_employees()
    {
        Sanctum::actingAs($this->adminUser);
        
        Employee::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/employees');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'employee_id',
                        'first_name',
                        'last_name',
                        'email',
                        'department',
                        'designation',
                        'status',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'total',
                    'per_page',
                ],
            ]);
    }

    /** @test */
    public function it_can_create_an_employee()
    {
        Sanctum::actingAs($this->adminUser);
        
        $department = Department::factory()->create();
        $designation = Designation::factory()->create();

        $employeeData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '1234567890',
            'department_id' => $department->id,
            'designation_id' => $designation->id,
            'joining_date' => '2024-01-15',
            'gender' => 'male',
            'date_of_birth' => '1990-05-20',
        ];

        $response = $this->postJson('/api/v1/employees', $employeeData);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
            ]);

        $this->assertDatabaseHas('employees', [
            'email' => 'john.doe@example.com',
        ]);
    }

    /** @test */
    public function it_can_show_an_employee()
    {
        Sanctum::actingAs($this->adminUser);
        
        $employee = Employee::factory()->create();

        $response = $this->getJson("/api/v1/employees/{$employee->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $employee->id,
                'first_name' => $employee->first_name,
            ]);
    }

    /** @test */
    public function it_can_update_an_employee()
    {
        Sanctum::actingAs($this->adminUser);
        
        $employee = Employee::factory()->create();

        $response = $this->putJson("/api/v1/employees/{$employee->id}", [
            'first_name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'first_name' => 'Updated Name',
            ]);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'first_name' => 'Updated Name',
        ]);
    }

    /** @test */
    public function it_can_delete_an_employee()
    {
        Sanctum::actingAs($this->adminUser);
        
        $employee = Employee::factory()->create();

        $response = $this->deleteJson("/api/v1/employees/{$employee->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted('employees', ['id' => $employee->id]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_employee()
    {
        Sanctum::actingAs($this->adminUser);

        $response = $this->postJson('/api/v1/employees', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'first_name',
                'last_name',
                'email',
                'department_id',
                'designation_id',
                'joining_date',
            ]);
    }

    /** @test */
    public function it_prevents_duplicate_email()
    {
        Sanctum::actingAs($this->adminUser);
        
        Employee::factory()->create(['email' => 'existing@example.com']);
        $department = Department::factory()->create();
        $designation = Designation::factory()->create();

        $response = $this->postJson('/api/v1/employees', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'existing@example.com',
            'department_id' => $department->id,
            'designation_id' => $designation->id,
            'joining_date' => '2024-01-15',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/v1/employees');

        $response->assertStatus(401);
    }

    /** @test */
    public function it_requires_proper_permissions()
    {
        $employeeUser = User::factory()->create();
        $employeeUser->assignRole('employee');
        
        Sanctum::actingAs($employeeUser);

        $response = $this->postJson('/api/v1/employees', []);

        $response->assertStatus(403);
    }
}
```

#### Testing Leave Application Workflow

```php
<?php
// tests/Feature/Api/LeaveApplicationApiTest.php

namespace Tests\Feature\Api;

use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LeaveApplicationApiTest extends TestCase
{
    use RefreshDatabase;

    private User $employeeUser;
    private User $hrUser;
    private Employee $employee;
    private LeaveType $leaveType;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->employeeUser = User::factory()->create();
        $this->employeeUser->assignRole('employee');
        
        $this->employee = Employee::factory()->create([
            'user_id' => $this->employeeUser->id,
        ]);
        
        $this->leaveType = LeaveType::factory()->create([
            'name' => 'Annual Leave',
            'days_per_year' => 20,
        ]);
        
        LeaveBalance::factory()->create([
            'employee_id' => $this->employee->id,
            'leave_type_id' => $this->leaveType->id,
            'balance' => 20,
            'used' => 0,
        ]);
        
        $this->hrUser = User::factory()->create();
        $this->hrUser->assignRole('hr');
    }

    /** @test */
    public function employee_can_apply_for_leave()
    {
        Sanctum::actingAs($this->employeeUser);

        $response = $this->postJson('/api/v1/leave-applications', [
            'leave_type_id' => $this->leaveType->id,
            'start_date' => '2024-02-01',
            'end_date' => '2024-02-03',
            'reason' => 'Personal work',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'status' => 'pending',
                'leave_type_id' => $this->leaveType->id,
            ]);

        $this->assertDatabaseHas('leave_applications', [
            'employee_id' => $this->employee->id,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function employee_cannot_apply_for_leave_with_insufficient_balance()
    {
        Sanctum::actingAs($this->employeeUser);

        // Update balance to have only 2 days
        LeaveBalance::where('employee_id', $this->employee->id)
            ->where('leave_type_id', $this->leaveType->id)
            ->update(['used' => 18]);

        $response = $this->postJson('/api/v1/leave-applications', [
            'leave_type_id' => $this->leaveType->id,
            'start_date' => '2024-02-01',
            'end_date' => '2024-02-05', // 5 days requested
            'reason' => 'Personal work',
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Insufficient leave balance',
            ]);
    }

    /** @test */
    public function hr_can_approve_leave_application()
    {
        Sanctum::actingAs($this->employeeUser);
        
        $leaveApplication = LeaveApplication::factory()->create([
            'employee_id' => $this->employee->id,
            'leave_type_id' => $this->leaveType->id,
            'status' => 'pending',
            'days' => 3,
        ]);

        Sanctum::actingAs($this->hrUser);

        $response = $this->postJson("/api/v1/leave-applications/{$leaveApplication->id}/approve");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'status' => 'approved',
            ]);

        // Verify balance was deducted
        $balance = LeaveBalance::where('employee_id', $this->employee->id)
            ->where('leave_type_id', $this->leaveType->id)
            ->first();
        
        $this->assertEquals(3, $balance->used);
    }

    /** @test */
    public function hr_can_reject_leave_application()
    {
        $leaveApplication = LeaveApplication::factory()->create([
            'employee_id' => $this->employee->id,
            'leave_type_id' => $this->leaveType->id,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->hrUser);

        $response = $this->postJson("/api/v1/leave-applications/{$leaveApplication->id}/reject", [
            'rejection_reason' => 'Project deadline',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'status' => 'rejected',
            ]);
    }

    /** @test */
    public function employee_can_cancel_pending_leave_application()
    {
        Sanctum::actingAs($this->employeeUser);
        
        $leaveApplication = LeaveApplication::factory()->create([
            'employee_id' => $this->employee->id,
            'leave_type_id' => $this->leaveType->id,
            'status' => 'pending',
        ]);

        $response = $this->postJson("/api/v1/leave-applications/{$leaveApplication->id}/cancel");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'status' => 'cancelled',
            ]);
    }

    /** @test */
    public function employee_cannot_cancel_approved_leave_application()
    {
        Sanctum::actingAs($this->employeeUser);
        
        $leaveApplication = LeaveApplication::factory()->create([
            'employee_id' => $this->employee->id,
            'leave_type_id' => $this->leaveType->id,
            'status' => 'approved',
        ]);

        $response = $this->postJson("/api/v1/leave-applications/{$leaveApplication->id}/cancel");

        $response->assertStatus(422);
    }

    /** @test */
    public function employee_can_view_own_leave_applications()
    {
        Sanctum::actingAs($this->employeeUser);
        
        LeaveApplication::factory()->count(3)->create([
            'employee_id' => $this->employee->id,
        ]);

        $response = $this->getJson('/api/v1/leave-applications/my');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function employee_can_view_own_leave_balance()
    {
        Sanctum::actingAs($this->employeeUser);

        $response = $this->getJson('/api/v1/leave-balances/my');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'leave_type_id' => $this->leaveType->id,
                'balance' => 20,
                'used' => 0,
            ]);
    }
}
```

### 2.4 Model Factories

```php
<?php
// database/factories/EmployeeFactory.php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Designation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'employee_id' => 'EMP' . $this->faker->unique()->numberBetween(1000, 9999),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'department_id' => Department::factory(),
            'designation_id' => Designation::factory(),
            'joining_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'date_of_birth' => $this->faker->dateTimeBetween('-60 years', '-20 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'marital_status' => $this->faker->randomElement(['single', 'married', 'divorced']),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'country' => $this->faker->country(),
            'postal_code' => $this->faker->postcode(),
            'status' => 'active',
            'probation_period' => 3,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    public function onProbation(): static
    {
        return $this->state(fn (array $attributes) => [
            'joining_date' => now()->subMonths(1),
            'probation_period' => 3,
        ]);
    }
}
```

```php
<?php
// database/factories/LeaveApplicationFactory.php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveApplicationFactory extends Factory
{
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+1 month');
        $endDate = (clone $startDate)->modify('+' . rand(1, 5) . ' days');

        return [
            'employee_id' => Employee::factory(),
            'leave_type_id' => LeaveType::factory(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days' => $startDate->diff($endDate)->days + 1,
            'reason' => $this->faker->sentence(),
            'status' => 'pending',
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $this->faker->sentence(),
        ]);
    }
}
```

### 2.5 Running Backend Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/Api/EmployeeApiTest.php

# Run specific test method
php artisan test --filter=it_can_create_an_employee

# Run with coverage
php artisan test --coverage

# Run in parallel
php artisan test --parallel

# Run with verbose output
php artisan test -v
```

---

## 3. Frontend Testing (React)

### 3.1 Setup

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
```

Configure Vitest in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

Create test setup file `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

### 3.2 Component Unit Tests

```typescript
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });
});
```

```typescript
// src/components/employees/EmployeeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmployeeCard } from './EmployeeCard';

const mockEmployee = {
  id: 1,
  employee_id: 'EMP001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  department: { name: 'Engineering' },
  designation: { name: 'Software Engineer' },
  avatar_url: null,
  status: 'active',
};

describe('EmployeeCard', () => {
  it('renders employee information', () => {
    render(<EmployeeCard employee={mockEmployee} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('EMP001')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('shows active status badge', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Active')).toHaveClass('bg-green-100');
  });

  it('shows inactive status badge', () => {
    render(<EmployeeCard employee={{ ...mockEmployee, status: 'inactive' }} />);
    expect(screen.getByText('Inactive')).toHaveClass('bg-red-100');
  });

  it('shows default avatar when no avatar_url', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByTestId('default-avatar')).toBeInTheDocument();
  });

  it('shows avatar image when avatar_url is provided', () => {
    render(
      <EmployeeCard
        employee={{ ...mockEmployee, avatar_url: 'https://example.com/avatar.jpg' }}
      />
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });
});
```

### 3.3 Form Testing

```typescript
// src/components/employees/EmployeeForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeForm } from './EmployeeForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('EmployeeForm', () => {
  it('renders all form fields', () => {
    render(<EmployeeForm onSubmit={vi.fn()} />, { wrapper });

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/joining date/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={vi.fn()} />, { wrapper });

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={vi.fn()} />, { wrapper });

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<EmployeeForm onSubmit={handleSubmit} />, { wrapper });

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '1234567890');
    await user.selectOptions(screen.getByLabelText(/department/i), '1');
    await user.selectOptions(screen.getByLabelText(/designation/i), '1');
    await user.type(screen.getByLabelText(/joining date/i), '2024-01-15');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        department_id: '1',
        designation_id: '1',
        joining_date: '2024-01-15',
      });
    });
  });

  it('pre-fills form when editing existing employee', () => {
    const existingEmployee = {
      id: 1,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      department_id: 2,
      designation_id: 3,
      joining_date: '2023-06-01',
    };

    render(<EmployeeForm employee={existingEmployee} onSubmit={vi.fn()} />, { wrapper });

    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Smith');
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@example.com');
  });
});
```

### 3.4 Hook Testing

```typescript
// src/hooks/useEmployees.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEmployees, useEmployee, useCreateEmployee } from './useEmployees';
import { server } from '../test/mocks/server';
import { rest } from 'msw';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useEmployees', () => {
  it('fetches employees list', async () => {
    const { result } = renderHook(() => useEmployees(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(3);
  });

  it('handles error when fetching fails', async () => {
    server.use(
      rest.get('/api/v1/employees', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useEmployees(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useEmployee', () => {
  it('fetches single employee', async () => {
    const { result } = renderHook(() => useEmployee(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.first_name).toBe('John');
  });
});

describe('useCreateEmployee', () => {
  it('creates new employee', async () => {
    const { result } = renderHook(() => useCreateEmployee(), { wrapper });

    result.current.mutate({
      first_name: 'New',
      last_name: 'Employee',
      email: 'new@example.com',
      department_id: 1,
      designation_id: 1,
      joining_date: '2024-01-15',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

### 3.5 MSW Mock Handlers

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

const API_URL = 'http://localhost:8000/api/v1';

export const handlers = [
  // Employees
  rest.get(`${API_URL}/employees`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 1,
            employee_id: 'EMP001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            department: { id: 1, name: 'Engineering' },
            designation: { id: 1, name: 'Software Engineer' },
            status: 'active',
          },
          {
            id: 2,
            employee_id: 'EMP002',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane@example.com',
            department: { id: 2, name: 'HR' },
            designation: { id: 2, name: 'HR Manager' },
            status: 'active',
          },
          {
            id: 3,
            employee_id: 'EMP003',
            first_name: 'Bob',
            last_name: 'Wilson',
            email: 'bob@example.com',
            department: { id: 1, name: 'Engineering' },
            designation: { id: 3, name: 'Senior Engineer' },
            status: 'inactive',
          },
        ],
        meta: {
          current_page: 1,
          total: 3,
          per_page: 10,
        },
      })
    );
  }),

  rest.get(`${API_URL}/employees/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id: Number(id),
        employee_id: 'EMP001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        department: { id: 1, name: 'Engineering' },
        designation: { id: 1, name: 'Software Engineer' },
        status: 'active',
      })
    );
  }),

  rest.post(`${API_URL}/employees`, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        id: 4,
        employee_id: 'EMP004',
        ...body,
        status: 'active',
      })
    );
  }),

  // Leave Applications
  rest.get(`${API_URL}/leave-applications/my`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 1,
            leave_type: { id: 1, name: 'Annual Leave' },
            start_date: '2024-02-01',
            end_date: '2024-02-03',
            days: 3,
            status: 'pending',
            reason: 'Personal work',
          },
        ],
      })
    );
  }),

  rest.post(`${API_URL}/leave-applications`, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        ...body,
        status: 'pending',
      })
    );
  }),

  // Authentication
  rest.post(`${API_URL}/auth/login`, async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'admin@example.com' && password === 'password') {
      return res(
        ctx.json({
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'company',
          },
          token: 'mock-token-123',
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    );
  }),

  rest.get(`${API_URL}/auth/me`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader === 'Bearer mock-token-123') {
      return res(
        ctx.json({
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'company',
          permissions: ['view_employees', 'create_employees', 'edit_employees'],
        })
      );
    }
    
    return res(ctx.status(401));
  }),
];
```

### 3.6 Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/employees/EmployeeCard.test.tsx

# Run tests matching pattern
npm test -- --grep "EmployeeForm"
```

---

## 4. API Testing

### 4.1 Postman Tests

Add tests to Postman collection requests:

```javascript
// Login - Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
});

pm.test("Response has user object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('user');
    pm.expect(jsonData.user).to.have.property('id');
    pm.expect(jsonData.user).to.have.property('email');
});

// Save token for subsequent requests
pm.test("Save auth token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.token);
});
```

```javascript
// List Employees - Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('array');
});

pm.test("Response has pagination meta", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('meta');
    pm.expect(jsonData.meta).to.have.property('current_page');
    pm.expect(jsonData.meta).to.have.property('total');
});

pm.test("Each employee has required fields", function () {
    var jsonData = pm.response.json();
    jsonData.data.forEach(function(employee) {
        pm.expect(employee).to.have.property('id');
        pm.expect(employee).to.have.property('employee_id');
        pm.expect(employee).to.have.property('first_name');
        pm.expect(employee).to.have.property('last_name');
        pm.expect(employee).to.have.property('email');
    });
});
```

```javascript
// Create Employee - Tests
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response contains created employee", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.first_name).to.eql(pm.request.body.first_name);
});

// Save employee ID for subsequent tests
pm.test("Save employee ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("created_employee_id", jsonData.id);
});
```

### 4.2 Newman CLI Testing

```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman/WorkDo-HRM-API.postman_collection.json \
  -e postman/WorkDo-HRM-API.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export reports/api-test-report.html

# Run with specific folder
newman run postman/WorkDo-HRM-API.postman_collection.json \
  -e postman/WorkDo-HRM-API.postman_environment.json \
  --folder "Employees"
```

---

## 5. End-to-End Testing

### 5.1 Cypress Setup

```bash
npm install --save-dev cypress @testing-library/cypress
```

Configure `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  },
  env: {
    apiUrl: 'http://localhost:8000/api/v1',
  },
});
```

### 5.2 Cypress Custom Commands

```typescript
// cypress/support/commands.ts
import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      loginAsEmployee(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@example.com', 'password');
});

Cypress.Commands.add('loginAsEmployee', () => {
  cy.login('employee@example.com', 'password');
});
```

### 5.3 E2E Test Scenarios

```typescript
// cypress/e2e/auth/login.cy.ts
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays login form', () => {
    cy.findByLabelText(/email/i).should('be.visible');
    cy.findByLabelText(/password/i).should('be.visible');
    cy.findByRole('button', { name: /sign in/i }).should('be.visible');
  });

  it('shows error for invalid credentials', () => {
    cy.findByLabelText(/email/i).type('invalid@example.com');
    cy.findByLabelText(/password/i).type('wrongpassword');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.findByText(/invalid credentials/i).should('be.visible');
  });

  it('redirects to dashboard on successful login', () => {
    cy.findByLabelText(/email/i).type('admin@example.com');
    cy.findByLabelText(/password/i).type('password');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.url().should('include', '/dashboard');
    cy.findByText(/welcome/i).should('be.visible');
  });

  it('shows validation errors for empty fields', () => {
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.findByText(/email is required/i).should('be.visible');
    cy.findByText(/password is required/i).should('be.visible');
  });
});
```

```typescript
// cypress/e2e/employees/employee-management.cy.ts
describe('Employee Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/employees');
  });

  it('displays employee list', () => {
    cy.findByRole('table').should('be.visible');
    cy.findAllByRole('row').should('have.length.greaterThan', 1);
  });

  it('can search for employees', () => {
    cy.findByPlaceholderText(/search/i).type('John');
    cy.findAllByRole('row').should('contain', 'John');
  });

  it('can filter by department', () => {
    cy.findByLabelText(/department/i).select('Engineering');
    cy.findAllByRole('row').each(($row) => {
      cy.wrap($row).should('contain', 'Engineering');
    });
  });

  it('can create new employee', () => {
    cy.findByRole('button', { name: /add employee/i }).click();

    cy.findByLabelText(/first name/i).type('New');
    cy.findByLabelText(/last name/i).type('Employee');
    cy.findByLabelText(/email/i).type('new.employee@example.com');
    cy.findByLabelText(/phone/i).type('1234567890');
    cy.findByLabelText(/department/i).select('Engineering');
    cy.findByLabelText(/designation/i).select('Software Engineer');
    cy.findByLabelText(/joining date/i).type('2024-01-15');

    cy.findByRole('button', { name: /save/i }).click();

    cy.findByText(/employee created successfully/i).should('be.visible');
    cy.findByText('New Employee').should('be.visible');
  });

  it('can edit existing employee', () => {
    cy.findAllByRole('row').first().findByRole('button', { name: /edit/i }).click();

    cy.findByLabelText(/first name/i).clear().type('Updated');
    cy.findByRole('button', { name: /save/i }).click();

    cy.findByText(/employee updated successfully/i).should('be.visible');
    cy.findByText('Updated').should('be.visible');
  });

  it('can delete employee', () => {
    cy.findAllByRole('row').first().findByRole('button', { name: /delete/i }).click();
    cy.findByRole('button', { name: /confirm/i }).click();

    cy.findByText(/employee deleted successfully/i).should('be.visible');
  });

  it('can export employees to CSV', () => {
    cy.findByRole('button', { name: /export/i }).click();
    cy.findByRole('menuitem', { name: /csv/i }).click();

    // Verify download started
    cy.readFile('cypress/downloads/employees.csv').should('exist');
  });
});
```

```typescript
// cypress/e2e/leave/leave-application.cy.ts
describe('Leave Application', () => {
  beforeEach(() => {
    cy.loginAsEmployee();
    cy.visit('/leave/apply');
  });

  it('displays leave application form', () => {
    cy.findByLabelText(/leave type/i).should('be.visible');
    cy.findByLabelText(/start date/i).should('be.visible');
    cy.findByLabelText(/end date/i).should('be.visible');
    cy.findByLabelText(/reason/i).should('be.visible');
  });

  it('shows leave balance', () => {
    cy.findByText(/available balance/i).should('be.visible');
    cy.findByText(/\d+ days/i).should('be.visible');
  });

  it('can submit leave application', () => {
    cy.findByLabelText(/leave type/i).select('Annual Leave');
    cy.findByLabelText(/start date/i).type('2024-02-01');
    cy.findByLabelText(/end date/i).type('2024-02-03');
    cy.findByLabelText(/reason/i).type('Personal work');

    cy.findByRole('button', { name: /submit/i }).click();

    cy.findByText(/leave application submitted/i).should('be.visible');
    cy.url().should('include', '/leave/my-applications');
  });

  it('shows error for insufficient balance', () => {
    cy.findByLabelText(/leave type/i).select('Annual Leave');
    cy.findByLabelText(/start date/i).type('2024-02-01');
    cy.findByLabelText(/end date/i).type('2024-03-01'); // 30 days
    cy.findByLabelText(/reason/i).type('Long vacation');

    cy.findByRole('button', { name: /submit/i }).click();

    cy.findByText(/insufficient leave balance/i).should('be.visible');
  });

  it('can view leave application history', () => {
    cy.visit('/leave/my-applications');

    cy.findByRole('table').should('be.visible');
    cy.findAllByRole('row').should('have.length.greaterThan', 0);
  });

  it('can cancel pending leave application', () => {
    cy.visit('/leave/my-applications');

    cy.findAllByRole('row')
      .filter(':contains("Pending")')
      .first()
      .findByRole('button', { name: /cancel/i })
      .click();

    cy.findByRole('button', { name: /confirm/i }).click();

    cy.findByText(/leave application cancelled/i).should('be.visible');
  });
});
```

### 5.4 Running E2E Tests

```bash
# Open Cypress UI
npm run cypress:open

# Run all tests headlessly
npm run cypress:run

# Run specific spec file
npm run cypress:run -- --spec "cypress/e2e/auth/login.cy.ts"

# Run with specific browser
npm run cypress:run -- --browser chrome
```

---

## 6. Performance Testing

### 6.1 Laravel Performance Testing

```php
<?php
// tests/Performance/EmployeeListPerformanceTest.php

namespace Tests\Performance;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmployeeListPerformanceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function employee_list_loads_within_acceptable_time()
    {
        // Create 1000 employees
        Employee::factory()->count(1000)->create();

        $user = User::factory()->create();
        $user->assignRole('company');
        Sanctum::actingAs($user);

        $startTime = microtime(true);
        
        $response = $this->getJson('/api/v1/employees?per_page=50');
        
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

        $response->assertStatus(200);
        $this->assertLessThan(500, $executionTime, "API response took {$executionTime}ms, expected less than 500ms");
    }

    /** @test */
    public function employee_search_is_performant()
    {
        Employee::factory()->count(1000)->create();

        $user = User::factory()->create();
        $user->assignRole('company');
        Sanctum::actingAs($user);

        $startTime = microtime(true);
        
        $response = $this->getJson('/api/v1/employees?search=john');
        
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(300, $executionTime, "Search took {$executionTime}ms, expected less than 300ms");
    }
}
```

### 6.2 Load Testing with k6

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
  },
};

const BASE_URL = 'http://localhost:8000/api/v1';

export function setup() {
  // Login and get token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@example.com',
    password: 'password',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  return { token: loginRes.json('token') };
}

export default function (data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // Test employee list endpoint
  const employeesRes = http.get(`${BASE_URL}/employees`, { headers });
  check(employeesRes, {
    'employees status is 200': (r) => r.status === 200,
    'employees response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test dashboard endpoint
  const dashboardRes = http.get(`${BASE_URL}/dashboard`, { headers });
  check(dashboardRes, {
    'dashboard status is 200': (r) => r.status === 200,
    'dashboard response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
```

Run load test:

```bash
k6 run k6/load-test.js
```

---

## 7. Security Testing

### 7.1 Authentication Tests

```php
<?php
// tests/Feature/Security/AuthenticationSecurityTest.php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationSecurityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_rate_limits_login_attempts()
    {
        $user = User::factory()->create();

        // Make 6 failed login attempts (limit is 5)
        for ($i = 0; $i < 6; $i++) {
            $response = $this->postJson('/api/v1/auth/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        $response->assertStatus(429); // Too Many Requests
    }

    /** @test */
    public function it_invalidates_token_on_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Logout
        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout')
            ->assertStatus(200);

        // Try to use the same token
        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }

    /** @test */
    public function it_prevents_sql_injection_in_login()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => "admin@example.com' OR '1'='1",
            'password' => "password' OR '1'='1",
        ]);

        $response->assertStatus(422); // Validation error, not SQL error
    }

    /** @test */
    public function it_prevents_xss_in_user_input()
    {
        $user = User::factory()->create();
        $user->assignRole('company');
        
        $this->actingAs($user);

        $response = $this->postJson('/api/v1/employees', [
            'first_name' => '<script>alert("xss")</script>',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            // ... other required fields
        ]);

        // The response should have escaped/sanitized the input
        $this->assertStringNotContainsString('<script>', $response->json('first_name'));
    }
}
```

### 7.2 Authorization Tests

```php
<?php
// tests/Feature/Security/AuthorizationSecurityTest.php

namespace Tests\Feature\Security;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationSecurityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function employee_cannot_access_admin_endpoints()
    {
        $employeeUser = User::factory()->create();
        $employeeUser->assignRole('employee');
        
        Sanctum::actingAs($employeeUser);

        // Try to access admin-only endpoints
        $this->getJson('/api/v1/users')->assertStatus(403);
        $this->getJson('/api/v1/roles')->assertStatus(403);
        $this->postJson('/api/v1/employees', [])->assertStatus(403);
    }

    /** @test */
    public function employee_cannot_view_other_employees_data()
    {
        $employee1User = User::factory()->create();
        $employee1User->assignRole('employee');
        $employee1 = Employee::factory()->create(['user_id' => $employee1User->id]);

        $employee2 = Employee::factory()->create();

        Sanctum::actingAs($employee1User);

        // Try to view another employee's details
        $this->getJson("/api/v1/employees/{$employee2->id}")
            ->assertStatus(403);
    }

    /** @test */
    public function employee_can_only_view_own_payslips()
    {
        $employee1User = User::factory()->create();
        $employee1User->assignRole('employee');
        $employee1 = Employee::factory()->create(['user_id' => $employee1User->id]);

        $employee2 = Employee::factory()->create();

        Sanctum::actingAs($employee1User);

        // Can view own payslips
        $this->getJson('/api/v1/payslips/my')->assertStatus(200);

        // Cannot view other employee's payslips
        $this->getJson("/api/v1/employees/{$employee2->id}/payslips")
            ->assertStatus(403);
    }

    /** @test */
    public function hr_cannot_modify_admin_settings()
    {
        $hrUser = User::factory()->create();
        $hrUser->assignRole('hr');
        
        Sanctum::actingAs($hrUser);

        $this->putJson('/api/v1/settings/general', [
            'company_name' => 'Hacked Company',
        ])->assertStatus(403);
    }
}
```

---

## 8. Test Data Management

### 8.1 Database Seeder for Testing

```php
<?php
// database/seeders/TestDataSeeder.php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
        $admin->assignRole('company');

        // Create HR user
        $hr = User::factory()->create([
            'name' => 'HR Manager',
            'email' => 'hr@example.com',
        ]);
        $hr->assignRole('hr');

        // Create branches
        $branches = Branch::factory()->count(3)->create();

        // Create departments
        $departments = Department::factory()->count(5)->create([
            'branch_id' => $branches->random()->id,
        ]);

        // Create designations
        $designations = Designation::factory()->count(10)->create();

        // Create leave types
        $leaveTypes = [
            LeaveType::create(['name' => 'Annual Leave', 'days_per_year' => 20]),
            LeaveType::create(['name' => 'Sick Leave', 'days_per_year' => 10]),
            LeaveType::create(['name' => 'Personal Leave', 'days_per_year' => 5]),
        ];

        // Create employees
        Employee::factory()->count(50)->create([
            'department_id' => $departments->random()->id,
            'designation_id' => $designations->random()->id,
        ])->each(function ($employee) use ($leaveTypes) {
            // Create leave balances for each employee
            foreach ($leaveTypes as $leaveType) {
                LeaveBalance::create([
                    'employee_id' => $employee->id,
                    'leave_type_id' => $leaveType->id,
                    'balance' => $leaveType->days_per_year,
                    'used' => rand(0, 5),
                    'year' => date('Y'),
                ]);
            }
        });

        // Create employee user
        $employeeUser = User::factory()->create([
            'name' => 'Test Employee',
            'email' => 'employee@example.com',
        ]);
        $employeeUser->assignRole('employee');
        
        Employee::factory()->create([
            'user_id' => $employeeUser->id,
            'first_name' => 'Test',
            'last_name' => 'Employee',
            'email' => 'employee@example.com',
        ]);
    }
}
```

### 8.2 Test Database Reset

```bash
# Reset test database
php artisan migrate:fresh --env=testing --seed --seeder=TestDataSeeder
```

---

## 9. Continuous Integration

### 9.1 GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: hrm_testing
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql, dom, filter, gd, json, mbstring, pdo
          coverage: xdebug

      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Copy .env
        run: cp .env.example .env.testing

      - name: Generate key
        run: php artisan key:generate --env=testing

      - name: Run migrations
        run: php artisan migrate --env=testing
        env:
          DB_CONNECTION: mysql
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_DATABASE: hrm_testing
          DB_USERNAME: root
          DB_PASSWORD: password

      - name: Run tests with coverage
        run: php artisan test --coverage --coverage-clover coverage.xml
        env:
          DB_CONNECTION: mysql
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_DATABASE: hrm_testing
          DB_USERNAME: root
          DB_PASSWORD: password

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: coverage.xml

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Run linter
        run: cd frontend && npm run lint

      - name: Run type check
        run: cd frontend && npm run typecheck

      - name: Run tests with coverage
        run: cd frontend && npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: frontend/coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: hrm_testing
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install backend dependencies
        run: composer install --prefer-dist --no-progress

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Setup backend
        run: |
          cp .env.example .env
          php artisan key:generate
          php artisan migrate --seed

      - name: Start backend server
        run: php artisan serve &

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Start frontend server
        run: cd frontend && npm run preview &

      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          working-directory: frontend
          wait-on: 'http://localhost:5173'
          wait-on-timeout: 120

      - name: Upload Cypress screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: frontend/cypress/screenshots

      - name: Upload Cypress videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: frontend/cypress/videos
```

---

## 10. Test Coverage Reports

### 10.1 Backend Coverage Configuration

```xml
<!-- phpunit.xml -->
<phpunit>
    <coverage>
        <include>
            <directory suffix=".php">./app</directory>
        </include>
        <exclude>
            <directory suffix=".php">./app/Console</directory>
            <directory suffix=".php">./app/Exceptions</directory>
        </exclude>
        <report>
            <html outputDirectory="coverage-report"/>
            <clover outputFile="coverage.xml"/>
        </report>
    </coverage>
</phpunit>
```

### 10.2 Frontend Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/index.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
```

### 10.3 Viewing Coverage Reports

```bash
# Backend - Generate HTML report
php artisan test --coverage-html coverage-report
open coverage-report/index.html

# Frontend - Generate HTML report
npm test -- --coverage
open coverage/index.html
```

---

## Summary

This testing guide provides comprehensive coverage for testing the WorkDo HRM system:

| Test Type | Tool | Coverage Target |
|-----------|------|-----------------|
| Backend Unit Tests | PHPUnit | 80%+ |
| Backend Integration Tests | PHPUnit + DB | 60%+ |
| Frontend Unit Tests | Vitest | 80%+ |
| Frontend Component Tests | React Testing Library | 70%+ |
| API Tests | Postman/Newman | 90%+ |
| E2E Tests | Cypress | Critical paths |
| Performance Tests | k6 | Response time < 500ms |
| Security Tests | PHPUnit | All auth/authz paths |

Following this guide ensures the HRM system is thoroughly tested and maintains high quality standards throughout development.
