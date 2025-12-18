# WorkDo HRM - Complete Feature Inventory & Coverage Matrix

This document provides an exhaustive inventory of every feature, screen, action, and field in the WorkDo HRM system, mapped to permissions, API endpoints, database tables, and React components.

---

## Table of Contents
1. [Login & Authentication](#1-login--authentication)
2. [Dashboard](#2-dashboard)
3. [Staff Management](#3-staff-management)
4. [HR Management](#4-hr-management)
5. [Recruitment](#5-recruitment)
6. [Contract Management](#6-contract-management)
7. [Document Management](#7-document-management)
8. [Meetings](#8-meetings)
9. [Calendar](#9-calendar)
10. [Media Library](#10-media-library)
11. [Leave Management](#11-leave-management)
12. [Attendance Management](#12-attendance-management)
13. [Time Tracking](#13-time-tracking)
14. [Payroll Management](#14-payroll-management)
15. [Currencies](#15-currencies)
16. [Landing Page](#16-landing-page)
17. [Settings](#17-settings)

---

## 1. Login & Authentication

### 1.1 Login Page
| Element | Type | Validation | Required |
|---------|------|------------|----------|
| Email Address | Input (email) | Valid email format | Yes |
| Password | Input (password) | Min 8 characters | Yes |
| Remember Me | Checkbox | - | No |
| Forgot Password | Link | - | - |
| Log In | Button | - | - |
| Login as Company | Button (Demo) | - | - |
| Login as HR | Button (Demo) | - | - |
| Login as Employee | Button (Demo) | - | - |
| Language Selector | Dropdown | EN, ES, AR, DA, DE, FR | No |

**API Endpoints:**
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

**Database Tables:** `users`, `password_reset_tokens`, `personal_access_tokens`

**React Components:** `LoginPage`, `ForgotPasswordPage`, `ResetPasswordPage`

### 1.2 Forgot Password Page
| Element | Type | Validation | Required |
|---------|------|------------|----------|
| Email Address | Input (email) | Valid email, exists in system | Yes |
| Send Reset Link | Button | - | - |
| Back to Login | Link | - | - |

### 1.3 Reset Password Page
| Element | Type | Validation | Required |
|---------|------|------------|----------|
| Email Address | Input (email) | Valid email | Yes |
| New Password | Input (password) | Min 8 chars, 1 uppercase, 1 number | Yes |
| Confirm Password | Input (password) | Must match password | Yes |
| Reset Password | Button | - | - |

---

## 2. Dashboard

### 2.1 Company/Admin Dashboard
**Permission Required:** `view_dashboard`

#### Statistics Cards
| Widget | Data Displayed | Click Action |
|--------|----------------|--------------|
| Total Employees | Count + "X this month" | Navigate to Employees |
| Branches | Count + "X departments" | Navigate to Branches |
| Attendance Rate | Percentage + "X present today" | Navigate to Attendance |
| Pending Leaves | Count + "X on leave today" | Navigate to Leave Applications |
| Active Jobs | Count + "X this month" | Navigate to Job Postings |
| Total Candidates | Count + "X this month" | Navigate to Candidates |

#### Charts
| Chart | Type | Data |
|-------|------|------|
| Department Distribution | Donut/Pie | Employee count per department |
| Hiring Trend (6 Months) | Bar Chart | Monthly hire count |
| Candidate Status | Pie Chart | Hired, Interview, New, Offer, Rejected, Screening |
| Leave Types | Donut | Usage by leave type (Annual, Sick, etc.) |

#### Lists
| List | Columns | Actions |
|------|---------|---------|
| Recent Leave Applications | Employee, Status, Type, Dates | View All |
| Recent Candidates | Name, Status, Position, Date | View All |
| Recent Announcements | Title, Priority, Category, Date | View All |
| Recent Meetings | Title, Status, DateTime | View All |

#### Additional Charts
| Chart | Type | Data |
|-------|------|------|
| Employee Growth (2025) | Line Chart | Monthly employee count |

**API Endpoints:**
- `GET /api/v1/dashboard` - Get all dashboard statistics
- `GET /api/v1/dashboard?period=month` - Filter by period

**Database Tables:** All tables (aggregated data)

**React Components:** `Dashboard`, `StatCard`, `DepartmentChart`, `HiringTrendChart`, `CandidateStatusChart`, `LeaveTypesChart`, `RecentLeavesList`, `RecentCandidatesList`, `RecentAnnouncementsList`, `RecentMeetingsList`, `EmployeeGrowthChart`

### 2.2 Employee Dashboard
**Permission Required:** `view_dashboard` (employee role)

#### Statistics Cards
| Widget | Data Displayed |
|--------|----------------|
| Total Awards | Count |
| Total Warnings | Count |
| Total Complaints | Count |

#### Attendance Widget
| Element | Type | Action |
|---------|------|--------|
| Shift Info | Display | Shows "Morning Shift 09:00 to 18:00" |
| Clock In | Button | Records clock in time |
| Clock Out | Button | Records clock out time |
| Clock In Time | Display | Shows time or "--:-- --" |
| Clock Out Time | Display | Shows time or "--:-- --" |

#### Lists
| List | Data |
|------|------|
| Announcements | Company announcements |
| Meetings | Upcoming meetings |

---

## 3. Staff Management

### 3.1 Users
**Menu Path:** Staff > Users
**Permission Required:** `view_users`
**URL:** `/hrm/users`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Name (with avatar, email) | Yes | Yes (search) |
| Roles | No | Yes (dropdown) |
| Joined | Yes | Yes (date range) |
| Actions | No | No |

#### Actions per Row
| Action | Icon | Permission Required |
|--------|------|---------------------|
| View | Eye | `view_users` |
| Edit | Pencil | `edit_users` |
| Reset Password | Key | `reset_user_password` |
| Lock/Unlock | Padlock | `activate_users` / `deactivate_users` |
| Delete | Trash | `delete_users` |

#### Page Actions
| Action | Permission Required |
|--------|---------------------|
| Add User | `create_users` |
| Search | `view_users` |
| Filters | `view_users` |
| Export | `export_users` |
| Import | `import_users` |

#### Add/Edit User Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Name | Input (text) | Max 255 chars | Yes |
| Email | Input (email) | Valid email, unique | Yes |
| Password | Input (password) | Min 8 chars | Yes (Add only) |
| Confirm Password | Input (password) | Must match | Yes (Add only) |
| Role | Select | Must select one | Yes |

**API Endpoints:**
- `GET /api/v1/users` - List users
- `GET /api/v1/users/{id}` - Get user
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `POST /api/v1/users/{id}/reset-password` - Reset password
- `PATCH /api/v1/users/{id}/activate` - Activate user
- `PATCH /api/v1/users/{id}/deactivate` - Deactivate user

**Database Tables:** `users`, `model_has_roles`

**React Components:** `UsersPage`, `UsersList`, `AddUserModal`, `EditUserModal`, `UserFilters`

### 3.2 Roles
**Menu Path:** Staff > Roles
**Permission Required:** `view_roles`
**URL:** `/hrm/roles`

#### List View
| Column | Sortable |
|--------|----------|
| # | No |
| Role Name | Yes |
| Permissions Count | No |
| Actions | No |

#### Actions per Row
| Action | Icon | Permission Required |
|--------|------|---------------------|
| View Permissions | Eye | `view_roles` |
| Edit | Pencil | `edit_roles` |
| Delete | Trash | `delete_roles` |

#### Add/Edit Role Modal
| Field | Type | Required |
|-------|------|----------|
| Role Name | Input (text) | Yes |
| Permissions | Checkbox Matrix | No |

#### Permissions Matrix Categories
| Category | Permissions Count |
|----------|-------------------|
| Dashboard | 1 |
| Users | 9 |
| Roles | 7 |
| Branches | 8 |
| Departments | 8 |
| Designations | 8 |
| Employees | 7 |
| Awards | 8 |
| Promotions | 6 |
| Performance | 15 |
| Resignations | 6 |
| Terminations | 5 |
| Warnings | 5 |
| Trips | 8 |
| Complaints | 6 |
| Transfers | 6 |
| Holidays | 5 |
| Announcements | 4 |
| Assets | 10 |
| Training | 12 |
| Recruitment | 17 |
| Contracts | 7 |
| Documents | 5 |
| Meetings | 7 |
| Leave | 9 |
| Attendance | 7 |
| Payroll | 7 |
| Settings | 4 |
| Media | 8 |
| **TOTAL** | **581** |

**API Endpoints:**
- `GET /api/v1/roles` - List roles
- `GET /api/v1/roles/{id}` - Get role with permissions
- `POST /api/v1/roles` - Create role
- `PUT /api/v1/roles/{id}` - Update role
- `DELETE /api/v1/roles/{id}` - Delete role
- `GET /api/v1/permissions` - List all permissions

**Database Tables:** `roles`, `permissions`, `role_has_permissions`

**React Components:** `RolesPage`, `RolesList`, `AddRoleModal`, `EditRoleModal`, `PermissionsMatrix`

---

## 4. HR Management

### 4.1 Branches
**Menu Path:** HR Management > Branch
**Permission Required:** `view_branches`
**URL:** `/hrm/branches`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Branch Name | Yes | Yes (search) |
| Status | No | Yes (Active/Inactive) |
| Actions | No | No |

#### Actions per Row
| Action | Icon | Permission Required |
|--------|------|---------------------|
| View | Eye | `view_branches` |
| Edit | Pencil | `edit_branches` |
| Delete | Trash | `delete_branches` |

#### Add/Edit Branch Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Branch Name | Input (text) | Max 255 chars | Yes |
| Address | Textarea | Max 500 chars | No |
| City | Input (text) | Max 100 chars | No |
| State | Input (text) | Max 100 chars | No |
| Country | Select | Country list | No |
| Zip Code | Input (text) | Max 20 chars | No |
| Status | Toggle | Active/Inactive | Yes |

**API Endpoints:**
- `GET /api/v1/branches` - List branches
- `GET /api/v1/branches/{id}` - Get branch
- `POST /api/v1/branches` - Create branch
- `PUT /api/v1/branches/{id}` - Update branch
- `DELETE /api/v1/branches/{id}` - Delete branch

**Database Tables:** `branches`

**React Components:** `BranchesPage`, `BranchesList`, `AddBranchModal`, `EditBranchModal`

### 4.2 Departments
**Menu Path:** HR Management > Department
**Permission Required:** `view_departments`
**URL:** `/hrm/departments`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Department Name | Yes | Yes (search) |
| Branch | No | Yes (dropdown) |
| Status | No | Yes (Active/Inactive) |
| Actions | No | No |

#### Add/Edit Department Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Department Name | Input (text) | Max 255 chars | Yes |
| Branch | Select | Must exist | Yes |
| Description | Textarea | Max 500 chars | No |
| Status | Toggle | Active/Inactive | Yes |

**API Endpoints:**
- `GET /api/v1/departments` - List departments
- `GET /api/v1/departments/{id}` - Get department
- `POST /api/v1/departments` - Create department
- `PUT /api/v1/departments/{id}` - Update department
- `DELETE /api/v1/departments/{id}` - Delete department

**Database Tables:** `departments`

**React Components:** `DepartmentsPage`, `DepartmentsList`, `AddDepartmentModal`, `EditDepartmentModal`

### 4.3 Designations
**Menu Path:** HR Management > Designation
**Permission Required:** `view_designations`
**URL:** `/hrm/designations`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Designation Name | Yes | Yes (search) |
| Department | No | Yes (dropdown) |
| Status | No | Yes (Active/Inactive) |
| Actions | No | No |

#### Add/Edit Designation Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Designation Name | Input (text) | Max 255 chars | Yes |
| Department | Select | Must exist | Yes |
| Description | Textarea | Max 500 chars | No |
| Status | Toggle | Active/Inactive | Yes |

**API Endpoints:**
- `GET /api/v1/designations` - List designations
- `GET /api/v1/designations/{id}` - Get designation
- `POST /api/v1/designations` - Create designation
- `PUT /api/v1/designations/{id}` - Update designation
- `DELETE /api/v1/designations/{id}` - Delete designation

**Database Tables:** `designations`

**React Components:** `DesignationsPage`, `DesignationsList`, `AddDesignationModal`, `EditDesignationModal`

### 4.4 Employees
**Menu Path:** HR Management > Employee
**Permission Required:** `view_employees`
**URL:** `/hrm/employees`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee ID | Yes | Yes (search) |
| Name (with avatar) | Yes | Yes (search) |
| Email | No | Yes (search) |
| Branch | No | Yes (dropdown) |
| Department | No | Yes (dropdown) |
| Designation | No | Yes (dropdown) |
| Date of Joining | Yes | Yes (date range) |
| Status | No | Yes (Active/Inactive/Terminated/Resigned) |
| Actions | No | No |

#### Actions per Row
| Action | Icon | Permission Required |
|--------|------|---------------------|
| View Profile | Eye | `view_employee_profile` |
| Edit | Pencil | `edit_employees` |
| Delete | Trash | `delete_employees` |

#### Add Employee Form (Multi-Tab)

**Tab 1: Personal Details**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| First Name | Input (text) | Max 100 chars | Yes |
| Last Name | Input (text) | Max 100 chars | Yes |
| Email | Input (email) | Valid email, unique | Yes |
| Phone | Input (tel) | Valid phone format | No |
| Date of Birth | Date Picker | Must be past date | No |
| Gender | Select | Male/Female/Other | No |
| Marital Status | Select | Single/Married/Divorced/Widowed | No |
| Profile Photo | File Upload | Image, max 2MB | No |

**Tab 2: Employment Details**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee ID | Input (text) | Unique, max 50 chars | Yes |
| Branch | Select | Must exist | Yes |
| Department | Select | Must exist, filtered by branch | Yes |
| Designation | Select | Must exist, filtered by department | Yes |
| Date of Joining | Date Picker | - | Yes |
| Employment Type | Select | Full-time/Part-time/Contract/Internship | Yes |
| Shift | Select | Available shifts | No |
| Attendance Policy | Select | Available policies | No |

**Tab 3: Contact Information**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Address Line 1 | Input (text) | Max 255 chars | No |
| Address Line 2 | Input (text) | Max 255 chars | No |
| City | Input (text) | Max 100 chars | No |
| State | Input (text) | Max 100 chars | No |
| Country | Select | Country list | No |
| Postal Code | Input (text) | Max 20 chars | No |

**Tab 4: Emergency Contact**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Contact Name | Input (text) | Max 255 chars | No |
| Relationship | Input (text) | Max 100 chars | No |
| Phone Number | Input (tel) | Valid phone format | No |

**Tab 5: Banking Information**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Bank Name | Input (text) | Max 255 chars | No |
| Account Holder Name | Input (text) | Max 255 chars | No |
| Account Number | Input (text) | Max 50 chars | No |
| Bank Identifier Code | Input (text) | Max 20 chars | No |
| Bank Branch | Input (text) | Max 255 chars | No |
| Tax Payer ID | Input (text) | Max 50 chars | No |

**Tab 6: Documents**
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Document Type | Select | Available types | Yes (if adding) |
| Document File | File Upload | PDF/Image, max 10MB | Yes (if adding) |
| Expiry Date | Date Picker | Future date | No |

**API Endpoints:**
- `GET /api/v1/employees` - List employees
- `GET /api/v1/employees/{id}` - Get employee
- `GET /api/v1/employees/profile` - Get current employee profile
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/{id}` - Update employee
- `DELETE /api/v1/employees/{id}` - Delete employee
- `POST /api/v1/employees/import` - Import employees
- `GET /api/v1/employees/export` - Export employees

**Database Tables:** `employees`, `users`, `employee_documents`, `document_types`

**React Components:** `EmployeesPage`, `EmployeesList`, `AddEmployeeForm`, `EditEmployeeForm`, `EmployeeProfile`, `EmployeeDocuments`

### 4.5 Employee Profile View
**URL:** `/hrm/employees/{id}`

#### Profile Tabs
| Tab | Content |
|-----|---------|
| Overview | Personal info, employment details, contact |
| Documents | Uploaded documents with expiry dates |
| Awards | List of awards received |
| Leave Balances | Leave allocation and usage |
| Attendance | Attendance records |
| Payslips | Salary history and payslips |
| Contracts | Employment contracts |
| Training | Training programs enrolled |

### 4.6 Document Types
**Menu Path:** HR Management > Document Type
**Permission Required:** `view_document_types`

#### List View
| Column | Actions |
|--------|---------|
| Document Type Name | View, Edit, Delete |
| Is Required | Yes/No |
| Description | - |

#### Add/Edit Document Type Modal
| Field | Type | Required |
|-------|------|----------|
| Name | Input (text) | Yes |
| Description | Textarea | No |
| Is Required | Toggle | No |

### 4.7 Award Types
**Menu Path:** HR Management > Award Type
**Permission Required:** `view_award_types`

#### Add/Edit Award Type Modal
| Field | Type | Required |
|-------|------|----------|
| Name | Input (text) | Yes |
| Description | Textarea | No |

### 4.8 Awards
**Menu Path:** HR Management > Award
**Permission Required:** `view_awards`
**URL:** `/hrm/awards`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Award Type | No | Yes (dropdown) |
| Award Date | Yes | Yes (date range) |
| Gift | No | No |
| Description | No | No |
| Actions | No | No |

#### Add/Edit Award Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Award Type | Select | Must exist | Yes |
| Award Date | Date Picker | - | Yes |
| Gift | Input (text) | Max 255 chars | No |
| Monetary Value | Input (number) | Positive number | No |
| Description | Textarea | Max 1000 chars | No |

**API Endpoints:**
- `GET /api/v1/awards` - List awards
- `GET /api/v1/awards/{id}` - Get award
- `POST /api/v1/awards` - Create award
- `PUT /api/v1/awards/{id}` - Update award
- `DELETE /api/v1/awards/{id}` - Delete award
- `GET /api/v1/award-types` - List award types
- `POST /api/v1/award-types` - Create award type
- `PUT /api/v1/award-types/{id}` - Update award type
- `DELETE /api/v1/award-types/{id}` - Delete award type

**Database Tables:** `awards`, `award_types`

### 4.9 Promotions
**Menu Path:** HR Management > Promotion
**Permission Required:** `view_promotions`
**URL:** `/hrm/promotions`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Current Designation | No | No |
| New Designation | No | No |
| Promotion Date | Yes | Yes (date range) |
| Status | No | Yes (Pending/Approved/Rejected) |
| Actions | No | No |

#### Actions per Row
| Action | Permission Required |
|--------|---------------------|
| View | `view_promotions` |
| Edit | `edit_promotions` |
| Approve | `approve_promotions` |
| Reject | `reject_promotions` |
| Delete | `delete_promotions` |

#### Add/Edit Promotion Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Current Designation | Display | Auto-filled | - |
| New Designation | Select | Must exist | Yes |
| Promotion Date | Date Picker | - | Yes |
| Description | Textarea | Max 1000 chars | No |

**API Endpoints:**
- `GET /api/v1/promotions` - List promotions
- `POST /api/v1/promotions` - Create promotion
- `PUT /api/v1/promotions/{id}` - Update promotion
- `PATCH /api/v1/promotions/{id}/approve` - Approve promotion
- `PATCH /api/v1/promotions/{id}/reject` - Reject promotion
- `DELETE /api/v1/promotions/{id}` - Delete promotion

**Database Tables:** `promotions`

### 4.10 Resignations
**Menu Path:** HR Management > Resignation
**Permission Required:** `view_resignations`
**URL:** `/hrm/resignations`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Resignation Date | Yes | Yes (date range) |
| Last Working Day | Yes | Yes (date range) |
| Reason | No | No |
| Status | No | Yes (Pending/Approved/Rejected) |
| Actions | No | No |

#### Add/Edit Resignation Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Resignation Date | Date Picker | - | Yes |
| Last Working Day | Date Picker | After resignation date | Yes |
| Reason | Textarea | Max 1000 chars | Yes |
| Notice Period (Days) | Input (number) | Positive integer | No |

**API Endpoints:**
- `GET /api/v1/resignations` - List resignations
- `POST /api/v1/resignations` - Create resignation
- `PUT /api/v1/resignations/{id}` - Update resignation
- `PATCH /api/v1/resignations/{id}/approve` - Approve resignation
- `PATCH /api/v1/resignations/{id}/reject` - Reject resignation
- `DELETE /api/v1/resignations/{id}` - Delete resignation

**Database Tables:** `resignations`

### 4.11 Terminations
**Menu Path:** HR Management > Termination
**Permission Required:** `view_terminations`
**URL:** `/hrm/terminations`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Termination Type | No | Yes (dropdown) |
| Termination Date | Yes | Yes (date range) |
| Reason | No | No |
| Status | No | Yes (Pending/Completed) |
| Actions | No | No |

#### Add/Edit Termination Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Termination Type | Select | Voluntary/Involuntary/Retirement/End of Contract | Yes |
| Termination Date | Date Picker | - | Yes |
| Reason | Textarea | Max 1000 chars | Yes |
| Notice Given | Toggle | Yes/No | No |
| Severance Package | Input (number) | Positive number | No |

**API Endpoints:**
- `GET /api/v1/terminations` - List terminations
- `POST /api/v1/terminations` - Create termination
- `PUT /api/v1/terminations/{id}` - Update termination
- `PATCH /api/v1/terminations/{id}/process` - Process termination
- `DELETE /api/v1/terminations/{id}` - Delete termination

**Database Tables:** `terminations`

### 4.12 Warnings
**Menu Path:** HR Management > Warning
**Permission Required:** `view_warnings`
**URL:** `/hrm/warnings`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Warning Type | No | Yes (dropdown) |
| Warning Date | Yes | Yes (date range) |
| Subject | No | No |
| Status | No | Yes (Issued/Acknowledged) |
| Actions | No | No |

#### Add/Edit Warning Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Warning Type | Select | Verbal/Written/Final | Yes |
| Warning Date | Date Picker | - | Yes |
| Subject | Input (text) | Max 255 chars | Yes |
| Description | Textarea | Max 1000 chars | Yes |

**API Endpoints:**
- `GET /api/v1/warnings` - List warnings
- `POST /api/v1/warnings` - Create warning
- `PUT /api/v1/warnings/{id}` - Update warning
- `PATCH /api/v1/warnings/{id}/acknowledge` - Acknowledge warning
- `DELETE /api/v1/warnings/{id}` - Delete warning

**Database Tables:** `warnings`

### 4.13 Trips
**Menu Path:** HR Management > Trip
**Permission Required:** `view_trips`
**URL:** `/hrm/trips`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Destination | No | Yes (search) |
| Start Date | Yes | Yes (date range) |
| End Date | Yes | Yes (date range) |
| Purpose | No | No |
| Status | No | Yes (Pending/Approved/Rejected/Completed) |
| Actions | No | No |

#### Add/Edit Trip Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Destination | Input (text) | Max 255 chars | Yes |
| Start Date | Date Picker | - | Yes |
| End Date | Date Picker | After start date | Yes |
| Purpose | Textarea | Max 1000 chars | Yes |
| Estimated Budget | Input (number) | Positive number | No |

#### Trip Expenses (Sub-feature)
| Field | Type | Required |
|-------|------|----------|
| Expense Type | Select | Yes |
| Amount | Input (number) | Yes |
| Date | Date Picker | Yes |
| Receipt | File Upload | No |
| Description | Textarea | No |

**API Endpoints:**
- `GET /api/v1/trips` - List trips
- `POST /api/v1/trips` - Create trip
- `PUT /api/v1/trips/{id}` - Update trip
- `PATCH /api/v1/trips/{id}/approve` - Approve trip
- `PATCH /api/v1/trips/{id}/reject` - Reject trip
- `DELETE /api/v1/trips/{id}` - Delete trip
- `GET /api/v1/trips/{id}/expenses` - List trip expenses
- `POST /api/v1/trips/{id}/expenses` - Add trip expense

**Database Tables:** `trips`, `trip_expenses`

### 4.14 Complaints
**Menu Path:** HR Management > Complaint
**Permission Required:** `view_complaints`
**URL:** `/hrm/complaints`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Complaint From | Yes | Yes (dropdown) |
| Complaint Against | No | Yes (dropdown) |
| Title | No | Yes (search) |
| Date | Yes | Yes (date range) |
| Status | No | Yes (Open/In Progress/Resolved/Dismissed) |
| Actions | No | No |

#### Add/Edit Complaint Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Complaint From | Select | Must exist | Yes |
| Complaint Against | Select | Must exist | Yes |
| Title | Input (text) | Max 255 chars | Yes |
| Date | Date Picker | - | Yes |
| Description | Textarea | Max 2000 chars | Yes |
| Is Anonymous | Toggle | Yes/No | No |

**API Endpoints:**
- `GET /api/v1/complaints` - List complaints
- `POST /api/v1/complaints` - Create complaint
- `PUT /api/v1/complaints/{id}` - Update complaint
- `PATCH /api/v1/complaints/{id}/assign` - Assign complaint
- `PATCH /api/v1/complaints/{id}/resolve` - Resolve complaint
- `PATCH /api/v1/complaints/{id}/dismiss` - Dismiss complaint
- `DELETE /api/v1/complaints/{id}` - Delete complaint

**Database Tables:** `complaints`

### 4.15 Transfers
**Menu Path:** HR Management > Transfer
**Permission Required:** `view_transfers`
**URL:** `/hrm/transfers`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| From Branch | No | Yes (dropdown) |
| To Branch | No | Yes (dropdown) |
| Transfer Date | Yes | Yes (date range) |
| Status | No | Yes (Pending/Approved/Rejected) |
| Actions | No | No |

#### Add/Edit Transfer Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| From Branch | Display | Auto-filled | - |
| To Branch | Select | Must exist | Yes |
| From Department | Display | Auto-filled | - |
| To Department | Select | Must exist | Yes |
| Transfer Date | Date Picker | - | Yes |
| Reason | Textarea | Max 1000 chars | No |

**API Endpoints:**
- `GET /api/v1/transfers` - List transfers
- `POST /api/v1/transfers` - Create transfer
- `PUT /api/v1/transfers/{id}` - Update transfer
- `PATCH /api/v1/transfers/{id}/approve` - Approve transfer
- `PATCH /api/v1/transfers/{id}/reject` - Reject transfer
- `DELETE /api/v1/transfers/{id}` - Delete transfer

**Database Tables:** `transfers`

### 4.16 Holidays
**Menu Path:** HR Management > Holiday
**Permission Required:** `view_holidays`
**URL:** `/hrm/holidays`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Holiday Name | Yes | Yes (search) |
| Date | Yes | Yes (date range) |
| Branches | No | Yes (dropdown) |
| Actions | No | No |

#### Add/Edit Holiday Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Holiday Name | Input (text) | Max 255 chars | Yes |
| Date | Date Picker | - | Yes |
| Branches | Multi-select | At least one | Yes |
| Description | Textarea | Max 500 chars | No |

**API Endpoints:**
- `GET /api/v1/holidays` - List holidays
- `GET /api/v1/holidays/calendar` - Get holidays calendar
- `POST /api/v1/holidays` - Create holiday
- `PUT /api/v1/holidays/{id}` - Update holiday
- `DELETE /api/v1/holidays/{id}` - Delete holiday
- `GET /api/v1/holidays/export` - Export holidays

**Database Tables:** `holidays`, `holiday_branch`

### 4.17 Announcements
**Menu Path:** HR Management > Announcement
**Permission Required:** `view_announcements`
**URL:** `/hrm/announcements`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Title | Yes | Yes (search) |
| Category | No | Yes (dropdown) |
| Priority | No | Yes (High/Medium/Low) |
| Start Date | Yes | Yes (date range) |
| End Date | Yes | Yes (date range) |
| Actions | No | No |

#### Add/Edit Announcement Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Title | Input (text) | Max 255 chars | Yes |
| Category | Select | Company News/Policy Updates/HR Updates/Events | Yes |
| Priority | Select | High/Medium/Low | Yes |
| Start Date | Date Picker | - | Yes |
| End Date | Date Picker | After start date | Yes |
| Content | Rich Text Editor | - | Yes |
| Attachments | File Upload (multiple) | Max 10MB each | No |
| Target Branches | Multi-select | All or specific | No |
| Target Departments | Multi-select | All or specific | No |

**API Endpoints:**
- `GET /api/v1/announcements` - List announcements
- `GET /api/v1/announcements/{id}` - Get announcement
- `POST /api/v1/announcements` - Create announcement
- `PUT /api/v1/announcements/{id}` - Update announcement
- `DELETE /api/v1/announcements/{id}` - Delete announcement

**Database Tables:** `announcements`, `announcement_attachments`

### 4.18 Assets
**Menu Path:** HR Management > Asset
**Permission Required:** `view_assets`
**URL:** `/hrm/assets`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Asset Name | Yes | Yes (search) |
| Asset Type | No | Yes (dropdown) |
| Serial Number | No | Yes (search) |
| Assigned To | No | Yes (dropdown) |
| Status | No | Yes (Available/Assigned/Under Maintenance/Retired) |
| Actions | No | No |

#### Add/Edit Asset Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Asset Name | Input (text) | Max 255 chars | Yes |
| Asset Type | Select | Must exist | Yes |
| Serial Number | Input (text) | Unique, max 100 chars | No |
| Purchase Date | Date Picker | - | No |
| Purchase Cost | Input (number) | Positive number | No |
| Warranty Expiry | Date Picker | - | No |
| Description | Textarea | Max 1000 chars | No |
| Depreciation Method | Select | Straight-line/Declining Balance | No |
| Useful Life (Years) | Input (number) | Positive integer | No |
| Salvage Value | Input (number) | Positive number | No |

#### Asset Assignment
| Field | Type | Required |
|-------|------|----------|
| Employee | Select | Yes |
| Assignment Date | Date Picker | Yes |
| Expected Return Date | Date Picker | No |
| Notes | Textarea | No |

**API Endpoints:**
- `GET /api/v1/assets` - List assets
- `GET /api/v1/assets/{id}` - Get asset
- `POST /api/v1/assets` - Create asset
- `PUT /api/v1/assets/{id}` - Update asset
- `DELETE /api/v1/assets/{id}` - Delete asset
- `POST /api/v1/assets/{id}/assign` - Assign asset
- `POST /api/v1/assets/{id}/unassign` - Unassign asset
- `GET /api/v1/asset-types` - List asset types
- `POST /api/v1/asset-types` - Create asset type
- `PUT /api/v1/asset-types/{id}` - Update asset type
- `DELETE /api/v1/asset-types/{id}` - Delete asset type

**Database Tables:** `assets`, `asset_types`, `asset_assignments`

### 4.19 Training
**Menu Path:** HR Management > Training
**Permission Required:** `view_training`
**URL:** `/hrm/training`

#### Sub-menus
- Training Types
- Training Programs
- Training Sessions
- Employee Training

#### Training Types
| Field | Type | Required |
|-------|------|----------|
| Name | Input (text) | Yes |
| Description | Textarea | No |

#### Training Programs
| Field | Type | Required |
|-------|------|----------|
| Program Name | Input (text) | Yes |
| Training Type | Select | Yes |
| Description | Textarea | No |
| Duration (Hours) | Input (number) | Yes |
| Cost | Input (number) | No |
| Provider | Input (text) | No |
| Status | Select (Active/Inactive) | Yes |

#### Training Sessions
| Field | Type | Required |
|-------|------|----------|
| Training Program | Select | Yes |
| Session Name | Input (text) | Yes |
| Trainer | Input (text) | No |
| Start Date | Date Picker | Yes |
| End Date | Date Picker | Yes |
| Location | Input (text) | No |
| Max Participants | Input (number) | No |
| Status | Select (Scheduled/In Progress/Completed/Cancelled) | Yes |

#### Employee Training
| Field | Type | Required |
|-------|------|----------|
| Employee | Select | Yes |
| Training Session | Select | Yes |
| Status | Select (Enrolled/In Progress/Completed/Dropped) | Yes |
| Completion Date | Date Picker | No |
| Score | Input (number) | No |
| Certificate | File Upload | No |

**API Endpoints:**
- `GET /api/v1/training-types` - List training types
- `POST /api/v1/training-types` - Create training type
- `GET /api/v1/training-programs` - List training programs
- `POST /api/v1/training-programs` - Create training program
- `GET /api/v1/training-sessions` - List training sessions
- `POST /api/v1/training-sessions` - Create training session
- `GET /api/v1/employee-trainings` - List employee trainings
- `POST /api/v1/employee-trainings` - Enroll employee in training

**Database Tables:** `training_types`, `training_programs`, `training_sessions`, `employee_trainings`

### 4.20 Performance (Indicators)
**Menu Path:** HR Management > Indicator
**Permission Required:** `view_indicators`
**URL:** `/hrm/indicators`

#### Indicator Categories
| Field | Type | Required |
|-------|------|----------|
| Category Name | Input (text) | Yes |
| Description | Textarea | No |

#### Indicators
| Field | Type | Required |
|-------|------|----------|
| Indicator Name | Input (text) | Yes |
| Category | Select | Yes |
| Description | Textarea | No |
| Rating Scale | Select (1-5, 1-10) | Yes |

**API Endpoints:**
- `GET /api/v1/indicator-categories` - List categories
- `POST /api/v1/indicator-categories` - Create category
- `GET /api/v1/indicators` - List indicators
- `POST /api/v1/indicators` - Create indicator

**Database Tables:** `indicator_categories`, `indicators`

### 4.21 Goals
**Menu Path:** HR Management > Goal
**Permission Required:** `view_goals`
**URL:** `/hrm/goals`

#### Goal Types
| Field | Type | Required |
|-------|------|----------|
| Type Name | Input (text) | Yes |
| Description | Textarea | No |

#### Employee Goals
| Field | Type | Required |
|-------|------|----------|
| Employee | Select | Yes |
| Goal Type | Select | Yes |
| Goal Title | Input (text) | Yes |
| Description | Textarea | No |
| Start Date | Date Picker | Yes |
| End Date | Date Picker | Yes |
| Target Value | Input (number) | No |
| Progress | Input (number, 0-100) | No |
| Status | Select (Not Started/In Progress/Completed/Cancelled) | Yes |

**API Endpoints:**
- `GET /api/v1/goal-types` - List goal types
- `POST /api/v1/goal-types` - Create goal type
- `GET /api/v1/employee-goals` - List employee goals
- `POST /api/v1/employee-goals` - Create employee goal
- `PUT /api/v1/employee-goals/{id}` - Update employee goal

**Database Tables:** `goal_types`, `employee_goals`

### 4.22 Reviews
**Menu Path:** HR Management > Review
**Permission Required:** `view_reviews`
**URL:** `/hrm/reviews`

#### Review Cycles
| Field | Type | Required |
|-------|------|----------|
| Cycle Name | Input (text) | Yes |
| Start Date | Date Picker | Yes |
| End Date | Date Picker | Yes |
| Status | Select (Draft/Active/Completed) | Yes |

#### Employee Reviews
| Field | Type | Required |
|-------|------|----------|
| Employee | Select | Yes |
| Review Cycle | Select | Yes |
| Reviewer | Select | Yes |
| Review Date | Date Picker | Yes |
| Overall Rating | Select (1-5) | Yes |
| Strengths | Textarea | No |
| Areas for Improvement | Textarea | No |
| Comments | Textarea | No |
| Status | Select (Pending/Completed) | Yes |

**API Endpoints:**
- `GET /api/v1/review-cycles` - List review cycles
- `POST /api/v1/review-cycles` - Create review cycle
- `GET /api/v1/employee-reviews` - List employee reviews
- `POST /api/v1/employee-reviews` - Create employee review

**Database Tables:** `review_cycles`, `employee_reviews`

---

## 5. Recruitment

### 5.1 Job Categories
**Menu Path:** Recruitment > Job Category
**Permission Required:** `view_job_categories`

| Field | Type | Required |
|-------|------|----------|
| Category Name | Input (text) | Yes |
| Description | Textarea | No |

### 5.2 Job Types
**Menu Path:** Recruitment > Job Type
**Permission Required:** `view_job_types`

| Field | Type | Required |
|-------|------|----------|
| Type Name | Input (text) | Yes |
| Description | Textarea | No |

**Pre-defined Types:** Full-time, Part-time, Contract, Internship, Hybrid, Remote

### 5.3 Job Locations
**Menu Path:** Recruitment > Job Location
**Permission Required:** `view_job_locations`

| Field | Type | Required |
|-------|------|----------|
| Location Name | Input (text) | Yes |
| City | Input (text) | No |
| State | Input (text) | No |
| Country | Select | No |
| Is Remote | Toggle | No |

### 5.4 Job Requisitions
**Menu Path:** Recruitment > Job Requisition
**Permission Required:** `view_job_requisitions`

| Field | Type | Required |
|-------|------|----------|
| Title | Input (text) | Yes |
| Department | Select | Yes |
| Number of Positions | Input (number) | Yes |
| Priority | Select (High/Medium/Low) | Yes |
| Requested By | Select (Employee) | Yes |
| Justification | Textarea | Yes |
| Status | Select (Draft/Pending/Approved/Rejected) | Yes |

### 5.5 Job Postings
**Menu Path:** Recruitment > Job
**Permission Required:** `view_jobs`
**URL:** `/hrm/jobs`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Job Title | Yes | Yes (search) |
| Job Type | No | Yes (dropdown) |
| Location | No | Yes (dropdown) |
| Status | No | Yes (Draft/Published/Closed) |
| Applications | No | No |
| Deadline | Yes | Yes (date range) |
| Actions | No | No |

#### Add/Edit Job Posting Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Job Title | Input (text) | Max 255 chars | Yes |
| Job Category | Select | Must exist | Yes |
| Job Type | Select | Must exist | Yes |
| Job Location | Select | Must exist | Yes |
| Department | Select | Must exist | No |
| Salary Range (Min) | Input (number) | Positive number | No |
| Salary Range (Max) | Input (number) | Greater than min | No |
| Experience Required | Input (text) | - | No |
| Description | Rich Text Editor | - | Yes |
| Requirements | Rich Text Editor | - | Yes |
| Benefits | Rich Text Editor | - | No |
| Application Deadline | Date Picker | Future date | No |
| Is Featured | Toggle | - | No |
| Status | Select | Draft/Published/Closed | Yes |

**API Endpoints:**
- `GET /api/v1/jobs` - List job postings
- `GET /api/v1/jobs/{id}` - Get job posting
- `POST /api/v1/jobs` - Create job posting
- `PUT /api/v1/jobs/{id}` - Update job posting
- `DELETE /api/v1/jobs/{id}` - Delete job posting
- `PATCH /api/v1/jobs/{id}/publish` - Publish job
- `PATCH /api/v1/jobs/{id}/close` - Close job

**Database Tables:** `job_postings`, `job_categories`, `job_types`, `job_locations`

### 5.6 Candidate Sources
**Menu Path:** Recruitment > Candidate Source
**Permission Required:** `view_candidate_sources`

| Field | Type | Required |
|-------|------|----------|
| Source Name | Input (text) | Yes |
| Description | Textarea | No |

**Pre-defined Sources:** LinkedIn, Indeed, Company Website, Referral, Job Fair, Agency

### 5.7 Candidates
**Menu Path:** Recruitment > Candidate
**Permission Required:** `view_candidates`
**URL:** `/hrm/candidates`

#### List View (Table or Kanban)
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Name | Yes | Yes (search) |
| Email | No | Yes (search) |
| Job Position | No | Yes (dropdown) |
| Source | No | Yes (dropdown) |
| Status | No | Yes (dropdown) |
| Applied Date | Yes | Yes (date range) |
| Actions | No | No |

#### Kanban View Columns
| Column | Status |
|--------|--------|
| New | New applications |
| Screening | Under review |
| Interview | Interview scheduled |
| Offer | Offer extended |
| Hired | Accepted offer |
| Rejected | Not selected |

#### Add/Edit Candidate Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| First Name | Input (text) | Max 100 chars | Yes |
| Last Name | Input (text) | Max 100 chars | Yes |
| Email | Input (email) | Valid email | Yes |
| Phone | Input (tel) | Valid phone | No |
| Job Position | Select | Must exist | Yes |
| Source | Select | Must exist | No |
| Experience (Years) | Input (number) | Positive number | No |
| Current Salary | Input (number) | Positive number | No |
| Expected Salary | Input (number) | Positive number | No |
| Resume | File Upload | PDF/DOC, max 5MB | Yes |
| Cover Letter | Textarea | Max 2000 chars | No |
| LinkedIn Profile | Input (url) | Valid URL | No |
| Portfolio URL | Input (url) | Valid URL | No |
| Status | Select | New/Screening/Interview/Offer/Hired/Rejected | Yes |

**API Endpoints:**
- `GET /api/v1/candidates` - List candidates
- `GET /api/v1/candidates/{id}` - Get candidate
- `POST /api/v1/candidates` - Create candidate
- `PUT /api/v1/candidates/{id}` - Update candidate
- `DELETE /api/v1/candidates/{id}` - Delete candidate
- `PATCH /api/v1/candidates/{id}/status` - Update candidate status
- `GET /api/v1/candidates/{id}/timeline` - Get candidate timeline

**Database Tables:** `candidates`, `candidate_sources`

### 5.8 Interview Types
**Menu Path:** Recruitment > Interview Type
**Permission Required:** `view_interview_types`

| Field | Type | Required |
|-------|------|----------|
| Type Name | Input (text) | Yes |
| Description | Textarea | No |

**Pre-defined Types:** Phone Screening, Technical Interview, HR Interview, Panel Interview, Final Interview

### 5.9 Interview Rounds
**Menu Path:** Recruitment > Interview Round
**Permission Required:** `view_interview_rounds`

| Field | Type | Required |
|-------|------|----------|
| Round Name | Input (text) | Yes |
| Order | Input (number) | Yes |
| Description | Textarea | No |

### 5.10 Interviews
**Menu Path:** Recruitment > Interview
**Permission Required:** `view_interviews`
**URL:** `/hrm/interviews`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Candidate | Yes | Yes (dropdown) |
| Job Position | No | Yes (dropdown) |
| Interview Type | No | Yes (dropdown) |
| Round | No | Yes (dropdown) |
| Date & Time | Yes | Yes (date range) |
| Interviewers | No | No |
| Status | No | Yes (Scheduled/Completed/Cancelled/No Show) |
| Actions | No | No |

#### Schedule Interview Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Candidate | Select | Must exist | Yes |
| Interview Type | Select | Must exist | Yes |
| Interview Round | Select | Must exist | Yes |
| Date | Date Picker | Future date | Yes |
| Start Time | Time Picker | - | Yes |
| End Time | Time Picker | After start time | Yes |
| Location | Input (text) | Max 255 chars | No |
| Meeting Link | Input (url) | Valid URL | No |
| Interviewers | Multi-select (Employees) | At least one | Yes |
| Notes | Textarea | Max 1000 chars | No |

#### Interview Feedback Modal
| Field | Type | Required |
|-------|------|----------|
| Overall Rating | Select (1-5) | Yes |
| Technical Skills | Select (1-5) | No |
| Communication | Select (1-5) | No |
| Problem Solving | Select (1-5) | No |
| Cultural Fit | Select (1-5) | No |
| Strengths | Textarea | No |
| Weaknesses | Textarea | No |
| Recommendation | Select (Hire/Maybe/No Hire) | Yes |
| Comments | Textarea | No |

**API Endpoints:**
- `GET /api/v1/interviews` - List interviews
- `GET /api/v1/interviews/{id}` - Get interview
- `POST /api/v1/interviews` - Schedule interview
- `PUT /api/v1/interviews/{id}` - Update interview
- `DELETE /api/v1/interviews/{id}` - Cancel interview
- `POST /api/v1/interviews/{id}/feedback` - Submit feedback
- `GET /api/v1/interviews/{id}/feedback` - Get all feedback

**Database Tables:** `interviews`, `interview_types`, `interview_rounds`, `interview_interviewers`, `interview_feedback`

### 5.11 Candidate Assessments
**Menu Path:** Recruitment > Assessment
**Permission Required:** `view_assessments`

| Field | Type | Required |
|-------|------|----------|
| Candidate | Select | Yes |
| Assessment Type | Select | Yes |
| Score | Input (number) | No |
| Max Score | Input (number) | No |
| Date | Date Picker | Yes |
| Notes | Textarea | No |
| Attachment | File Upload | No |

### 5.12 Offer Templates
**Menu Path:** Recruitment > Offer Template
**Permission Required:** `view_offer_templates`

| Field | Type | Required |
|-------|------|----------|
| Template Name | Input (text) | Yes |
| Content | Rich Text Editor | Yes |
| Variables | Display | - |

**Available Variables:** {{candidate_name}}, {{job_title}}, {{salary}}, {{start_date}}, {{company_name}}

### 5.13 Offers
**Menu Path:** Recruitment > Offer
**Permission Required:** `view_offers`
**URL:** `/hrm/offers`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Candidate | Yes | Yes (dropdown) |
| Job Position | No | Yes (dropdown) |
| Salary Offered | No | No |
| Start Date | Yes | Yes (date range) |
| Expiry Date | Yes | Yes (date range) |
| Status | No | Yes (Draft/Sent/Accepted/Rejected/Expired) |
| Actions | No | No |

#### Create Offer Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Candidate | Select | Must exist | Yes |
| Offer Template | Select | Must exist | No |
| Job Title | Input (text) | Max 255 chars | Yes |
| Salary | Input (number) | Positive number | Yes |
| Start Date | Date Picker | Future date | Yes |
| Expiry Date | Date Picker | After today | Yes |
| Benefits | Textarea | - | No |
| Terms & Conditions | Rich Text Editor | - | No |
| Attachments | File Upload (multiple) | - | No |

**API Endpoints:**
- `GET /api/v1/offers` - List offers
- `GET /api/v1/offers/{id}` - Get offer
- `POST /api/v1/offers` - Create offer
- `PUT /api/v1/offers/{id}` - Update offer
- `DELETE /api/v1/offers/{id}` - Delete offer
- `POST /api/v1/offers/{id}/send` - Send offer to candidate
- `PATCH /api/v1/offers/{id}/accept` - Accept offer
- `PATCH /api/v1/offers/{id}/reject` - Reject offer

**Database Tables:** `offers`, `offer_templates`

### 5.14 Onboarding Checklists
**Menu Path:** Recruitment > Onboarding Checklist
**Permission Required:** `manage_onboarding`

| Field | Type | Required |
|-------|------|----------|
| Checklist Name | Input (text) | Yes |
| Description | Textarea | No |
| Items | Repeater | Yes |

#### Checklist Items
| Field | Type | Required |
|-------|------|----------|
| Item Name | Input (text) | Yes |
| Description | Textarea | No |
| Assigned To | Select (Role/Employee) | No |
| Due Days (from start) | Input (number) | No |
| Is Required | Toggle | No |

### 5.15 Onboarding
**Menu Path:** Recruitment > Onboarding
**Permission Required:** `manage_onboarding`
**URL:** `/hrm/onboarding`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Checklist | No | Yes (dropdown) |
| Start Date | Yes | Yes (date range) |
| Progress | No | No |
| Status | No | Yes (In Progress/Completed) |
| Actions | No | No |

**API Endpoints:**
- `GET /api/v1/onboarding-checklists` - List checklists
- `POST /api/v1/onboarding-checklists` - Create checklist
- `GET /api/v1/onboarding` - List onboarding records
- `POST /api/v1/onboarding` - Start onboarding
- `PATCH /api/v1/onboarding/{id}/items/{itemId}` - Complete item

**Database Tables:** `onboarding_checklists`, `onboarding_checklist_items`, `employee_onboarding`, `employee_onboarding_items`

---

## 6. Contract Management

### 6.1 Contract Types
**Menu Path:** Contract Management > Contract Type
**Permission Required:** `view_contract_types`

| Field | Type | Required |
|-------|------|----------|
| Type Name | Input (text) | Yes |
| Description | Textarea | No |
| Default Duration (Months) | Input (number) | No |

**Pre-defined Types:** Permanent, Fixed-term, Probation, Consultancy

### 6.2 Employee Contracts
**Menu Path:** Contract Management > Contract
**Permission Required:** `view_contracts`
**URL:** `/hrm/contracts`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Contract Type | No | Yes (dropdown) |
| Start Date | Yes | Yes (date range) |
| End Date | Yes | Yes (date range) |
| Status | No | Yes (Active/Expired/Terminated) |
| Actions | No | No |

#### Add/Edit Contract Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Contract Type | Select | Must exist | Yes |
| Contract Number | Input (text) | Unique | No |
| Start Date | Date Picker | - | Yes |
| End Date | Date Picker | After start date | Yes |
| Salary | Input (number) | Positive number | Yes |
| Working Hours (per week) | Input (number) | Positive number | No |
| Probation Period (Days) | Input (number) | Positive integer | No |
| Notice Period (Days) | Input (number) | Positive integer | No |
| Terms & Conditions | Rich Text Editor | - | No |
| Contract Document | File Upload | PDF, max 10MB | No |

#### Contract Allowances
| Field | Type | Required |
|-------|------|----------|
| Allowance Type | Select | Yes |
| Amount | Input (number) | Yes |
| Frequency | Select (Monthly/Annual/One-time) | Yes |

**API Endpoints:**
- `GET /api/v1/contracts` - List contracts
- `GET /api/v1/contracts/{id}` - Get contract
- `POST /api/v1/contracts` - Create contract
- `PUT /api/v1/contracts/{id}` - Update contract
- `DELETE /api/v1/contracts/{id}` - Delete contract
- `PATCH /api/v1/contracts/{id}/terminate` - Terminate contract
- `GET /api/v1/contract-types` - List contract types

**Database Tables:** `employee_contracts`, `contract_types`, `contract_allowances`

### 6.3 Contract Renewals
**Menu Path:** Contract Management > Renewal
**Permission Required:** `renew_contracts`

| Field | Type | Required |
|-------|------|----------|
| Contract | Select | Yes |
| New End Date | Date Picker | Yes |
| Salary Adjustment | Input (number) | No |
| Notes | Textarea | No |

**API Endpoints:**
- `GET /api/v1/contract-renewals` - List renewals
- `POST /api/v1/contract-renewals` - Create renewal

**Database Tables:** `contract_renewals`

---

## 7. Document Management

### 7.1 Document Categories
**Menu Path:** Document Management > Category
**Permission Required:** `manage_document_categories`

| Field | Type | Required |
|-------|------|----------|
| Category Name | Input (text) | Yes |
| Description | Textarea | No |
| Parent Category | Select | No |

### 7.2 HR Documents
**Menu Path:** Document Management > Document
**Permission Required:** `view_documents`
**URL:** `/hrm/documents`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Document Name | Yes | Yes (search) |
| Category | No | Yes (dropdown) |
| Version | No | No |
| Uploaded By | No | Yes (dropdown) |
| Upload Date | Yes | Yes (date range) |
| Actions | No | No |

#### Upload Document Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Document Name | Input (text) | Max 255 chars | Yes |
| Category | Select | Must exist | Yes |
| Description | Textarea | Max 1000 chars | No |
| File | File Upload | PDF/DOC/XLS, max 20MB | Yes |
| Version | Input (text) | - | No |
| Requires Acknowledgment | Toggle | - | No |
| Target Employees | Multi-select | - | No |
| Expiry Date | Date Picker | - | No |

**API Endpoints:**
- `GET /api/v1/documents` - List documents
- `GET /api/v1/documents/{id}` - Get document
- `POST /api/v1/documents` - Upload document
- `PUT /api/v1/documents/{id}` - Update document
- `DELETE /api/v1/documents/{id}` - Delete document
- `GET /api/v1/documents/{id}/download` - Download document
- `GET /api/v1/document-categories` - List categories

**Database Tables:** `hr_documents`, `document_categories`

### 7.3 Document Acknowledgments
**Menu Path:** Document Management > Acknowledgment
**Permission Required:** `view_documents`

| Column | Data |
|--------|------|
| Document | Document name |
| Employee | Employee name |
| Acknowledged At | Date/time |
| Status | Pending/Acknowledged |

**API Endpoints:**
- `GET /api/v1/documents/{id}/acknowledgments` - List acknowledgments
- `POST /api/v1/documents/{id}/acknowledge` - Acknowledge document

**Database Tables:** `document_acknowledgments`

---

## 8. Meetings

### 8.1 Meeting Types
**Menu Path:** Meetings > Meeting Type
**Permission Required:** `view_meeting_types`

| Field | Type | Required |
|-------|------|----------|
| Type Name | Input (text) | Yes |
| Description | Textarea | No |
| Default Duration (Minutes) | Input (number) | No |

**Pre-defined Types:** Team Meeting, One-on-One, All Hands, Training, Interview, Client Meeting

### 8.2 Meeting Rooms
**Menu Path:** Meetings > Meeting Room
**Permission Required:** `manage_meeting_rooms`

| Field | Type | Required |
|-------|------|----------|
| Room Name | Input (text) | Yes |
| Location | Input (text) | No |
| Capacity | Input (number) | Yes |
| Amenities | Multi-select | No |
| Status | Select (Available/Unavailable) | Yes |

**Amenities Options:** Projector, Whiteboard, Video Conferencing, Phone, TV Screen

### 8.3 Meetings
**Menu Path:** Meetings > Meeting
**Permission Required:** `view_meetings`
**URL:** `/hrm/meetings`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Title | Yes | Yes (search) |
| Type | No | Yes (dropdown) |
| Date & Time | Yes | Yes (date range) |
| Location/Room | No | Yes (dropdown) |
| Organizer | No | Yes (dropdown) |
| Status | No | Yes (Scheduled/In Progress/Completed/Cancelled) |
| Actions | No | No |

#### Schedule Meeting Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Title | Input (text) | Max 255 chars | Yes |
| Meeting Type | Select | Must exist | Yes |
| Date | Date Picker | - | Yes |
| Start Time | Time Picker | - | Yes |
| End Time | Time Picker | After start time | Yes |
| Meeting Room | Select | Must be available | No |
| Location | Input (text) | Max 255 chars | No |
| Meeting Link | Input (url) | Valid URL | No |
| Attendees | Multi-select (Employees) | At least one | Yes |
| Agenda | Rich Text Editor | - | No |
| Attachments | File Upload (multiple) | - | No |
| Send Invitations | Toggle | - | No |
| Recurrence | Select (None/Daily/Weekly/Monthly) | - | No |

**API Endpoints:**
- `GET /api/v1/meetings` - List meetings
- `GET /api/v1/meetings/{id}` - Get meeting
- `POST /api/v1/meetings` - Schedule meeting
- `PUT /api/v1/meetings/{id}` - Update meeting
- `DELETE /api/v1/meetings/{id}` - Cancel meeting
- `PATCH /api/v1/meetings/{id}/start` - Start meeting
- `PATCH /api/v1/meetings/{id}/complete` - Complete meeting

**Database Tables:** `meetings`, `meeting_types`, `meeting_rooms`, `meeting_attendees`

### 8.4 Meeting Minutes
**Menu Path:** Meetings > Minutes
**Permission Required:** `record_minutes`

| Field | Type | Required |
|-------|------|----------|
| Meeting | Select | Yes |
| Content | Rich Text Editor | Yes |
| Recorded By | Display (current user) | - |
| Recorded At | Display (current time) | - |

**API Endpoints:**
- `GET /api/v1/meetings/{id}/minutes` - Get meeting minutes
- `POST /api/v1/meetings/{id}/minutes` - Record minutes
- `PUT /api/v1/meetings/{id}/minutes` - Update minutes

**Database Tables:** `meeting_minutes`

### 8.5 Action Items
**Menu Path:** Meetings > Action Items
**Permission Required:** `manage_action_items`

| Field | Type | Required |
|-------|------|----------|
| Meeting | Select | Yes |
| Title | Input (text) | Yes |
| Description | Textarea | No |
| Assigned To | Select (Employee) | Yes |
| Due Date | Date Picker | Yes |
| Priority | Select (High/Medium/Low) | Yes |
| Status | Select (Pending/In Progress/Completed) | Yes |

**API Endpoints:**
- `GET /api/v1/meetings/{id}/action-items` - List action items
- `POST /api/v1/meetings/{id}/action-items` - Create action item
- `PUT /api/v1/action-items/{id}` - Update action item
- `PATCH /api/v1/action-items/{id}/complete` - Complete action item

**Database Tables:** `meeting_action_items`

---

## 9. Calendar

**Menu Path:** Calendar
**Permission Required:** `view_calendar`
**URL:** `/hrm/calendar`

### Calendar Views
| View | Description |
|------|-------------|
| Month | Monthly calendar grid |
| Week | Weekly calendar with time slots |
| Day | Daily calendar with time slots |
| List | List view of events |

### Event Types Displayed
| Event Type | Color | Source |
|------------|-------|--------|
| Meetings | Blue | meetings table |
| Holidays | Green | holidays table |
| Leave | Orange | leave_applications table |
| Birthdays | Pink | employees table |
| Work Anniversaries | Purple | employees table |

### Calendar Actions
| Action | Description |
|--------|-------------|
| Click Date | Create new event |
| Click Event | View event details |
| Drag Event | Reschedule event |
| Filter | Filter by event type |

**API Endpoints:**
- `GET /api/v1/calendar?start={date}&end={date}` - Get calendar events
- `GET /api/v1/calendar/events/{type}` - Get events by type

---

## 10. Media Library

**Menu Path:** Media Library
**Permission Required:** `view_media`
**URL:** `/hrm/media`

### Directory Structure
| Action | Permission Required |
|--------|---------------------|
| Create Directory | `create_directories` |
| Rename Directory | `rename_media` |
| Delete Directory | `delete_media` |
| Move Directory | `move_media` |

### File Operations
| Action | Permission Required |
|--------|---------------------|
| Upload File | `upload_media` |
| Download File | `download_media` |
| Rename File | `rename_media` |
| Delete File | `delete_media` |
| Move File | `move_media` |
| Share File | `share_media` |

### Upload File Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Files | File Upload (multiple) | Max 50MB each | Yes |
| Directory | Select | Must exist | Yes |

**API Endpoints:**
- `GET /api/v1/media/directories` - List directories
- `POST /api/v1/media/directories` - Create directory
- `PUT /api/v1/media/directories/{id}` - Rename directory
- `DELETE /api/v1/media/directories/{id}` - Delete directory
- `GET /api/v1/media/files` - List files
- `POST /api/v1/media/files` - Upload files
- `GET /api/v1/media/files/{id}/download` - Download file
- `PUT /api/v1/media/files/{id}` - Rename file
- `DELETE /api/v1/media/files/{id}` - Delete file
- `POST /api/v1/media/files/{id}/move` - Move file
- `POST /api/v1/media/files/{id}/share` - Share file

**Database Tables:** `media_directories`, `media_files`

---

## 11. Leave Management

### 11.1 Leave Types
**Menu Path:** Leave Management > Leave Type
**Permission Required:** `manage_leave_types`
**URL:** `/hrm/leave-types`

#### List View
| Column | Actions |
|--------|---------|
| Leave Type Name | View, Edit, Delete |
| Max Days Per Year | - |
| Leave Type (Paid/Unpaid) | - |
| Color | - |
| Status | Active/Inactive |

#### Add/Edit Leave Type Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Name | Input (text) | Max 100 chars | Yes |
| Max Days Per Year | Input (number) | Positive integer | Yes |
| Leave Type | Select | Paid/Unpaid | Yes |
| Color | Color Picker | Valid hex color | Yes |
| Description | Textarea | Max 500 chars | No |
| Requires Approval | Toggle | - | No |
| Allow Half Day | Toggle | - | No |
| Allow Negative Balance | Toggle | - | No |
| Carry Forward | Toggle | - | No |
| Max Carry Forward Days | Input (number) | Positive integer | No |
| Status | Toggle | Active/Inactive | Yes |

**Pre-defined Leave Types:**
1. Annual Leave (Paid, 20 days, Green)
2. Sick Leave (Paid, 10 days, Red)
3. Maternity Leave (Paid, 90 days, Pink)
4. Paternity Leave (Paid, 14 days, Blue)
5. Emergency Leave (Paid, 5 days, Orange)
6. Compensatory Leave (Paid, 5 days, Teal)
7. Marriage Leave (Paid, 5 days, Purple)
8. Personal Leave (Unpaid, 10 days, Gray)
9. Study Leave (Unpaid, 30 days, Indigo)
10. Bereavement Leave (Paid, 5 days, Brown)

**API Endpoints:**
- `GET /api/v1/leave-types` - List leave types
- `GET /api/v1/leave-types/{id}` - Get leave type
- `POST /api/v1/leave-types` - Create leave type
- `PUT /api/v1/leave-types/{id}` - Update leave type
- `DELETE /api/v1/leave-types/{id}` - Delete leave type

**Database Tables:** `leave_types`

### 11.2 Leave Policies
**Menu Path:** Leave Management > Leave Policy
**Permission Required:** `manage_leave_policies`

#### Add/Edit Leave Policy Modal
| Field | Type | Required |
|-------|------|----------|
| Policy Name | Input (text) | Yes |
| Description | Textarea | No |
| Applicable To | Select (All/Branch/Department/Designation) | Yes |
| Leave Allocations | Repeater | Yes |

#### Leave Allocations
| Field | Type | Required |
|-------|------|----------|
| Leave Type | Select | Yes |
| Days Allocated | Input (number) | Yes |

**API Endpoints:**
- `GET /api/v1/leave-policies` - List policies
- `POST /api/v1/leave-policies` - Create policy
- `PUT /api/v1/leave-policies/{id}` - Update policy
- `DELETE /api/v1/leave-policies/{id}` - Delete policy

**Database Tables:** `leave_policies`, `leave_policy_allocations`

### 11.3 Leave Applications
**Menu Path:** Leave Management > Leave Application
**Permission Required:** `view_leaves`
**URL:** `/hrm/leave-applications`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Leave Type | No | Yes (dropdown) |
| Start Date | Yes | Yes (date range) |
| End Date | Yes | Yes (date range) |
| Total Days | No | No |
| Status | No | Yes (Pending/Approved/Rejected/Cancelled) |
| Actions | No | No |

#### Actions per Row
| Action | Permission Required |
|--------|---------------------|
| View | `view_leaves` |
| Approve | `approve_leaves` |
| Reject | `reject_leaves` |
| Cancel | `cancel_leave` (own only) |
| Delete | `delete_leaves` |

#### Apply Leave Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Leave Type | Select | Must exist | Yes |
| Start Date | Date Picker | Not in past | Yes |
| End Date | Date Picker | After/equal start date | Yes |
| Half Day | Toggle | - | No |
| Half Day Type | Select | First Half/Second Half | If half day |
| Reason | Textarea | Max 1000 chars | No |
| Attachment | File Upload | PDF/Image, max 5MB | No |

#### Reject Leave Modal
| Field | Type | Required |
|-------|------|----------|
| Rejection Reason | Textarea | Yes |

**API Endpoints:**
- `GET /api/v1/leave` - List leave applications
- `GET /api/v1/leave/{id}` - Get leave application
- `POST /api/v1/leave` - Apply for leave
- `PATCH /api/v1/leave/{id}/approve` - Approve leave
- `PATCH /api/v1/leave/{id}/reject` - Reject leave
- `PATCH /api/v1/leave/{id}/cancel` - Cancel leave
- `DELETE /api/v1/leave/{id}` - Delete leave

**Database Tables:** `leave_applications`

### 11.4 Leave Balances
**Menu Path:** Leave Management > Leave Balance
**Permission Required:** `view_leave_balances`
**URL:** `/hrm/leave-balances`

#### List View
| Column | Filterable |
|--------|------------|
| Employee | Yes (dropdown) |
| Leave Type | Yes (dropdown) |
| Year | Yes (dropdown) |
| Allocated Days | No |
| Used Days | No |
| Carried Forward | No |
| Remaining Days | No |

**API Endpoints:**
- `GET /api/v1/leave/balances` - Get leave balances
- `GET /api/v1/leave/balances?employee_id={id}` - Get employee balances
- `POST /api/v1/leave/balances/adjust` - Adjust balance (admin)

**Database Tables:** `leave_balances`

---

## 12. Attendance Management

### 12.1 Shifts
**Menu Path:** Attendance Management > Shift
**Permission Required:** `manage_shifts`
**URL:** `/hrm/shifts`

#### List View
| Column | Actions |
|--------|---------|
| Shift Name | View, Edit, Delete |
| Start Time | - |
| End Time | - |
| Break Duration | - |
| Working Hours | - |
| Shift Type | Day/Night/Rotating |

#### Add/Edit Shift Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Shift Name | Input (text) | Max 100 chars | Yes |
| Start Time | Time Picker | - | Yes |
| End Time | Time Picker | - | Yes |
| Break Duration (Minutes) | Input (number) | Positive integer | No |
| Grace Period (Minutes) | Input (number) | Positive integer | No |
| Shift Type | Select | Day/Night/Rotating | Yes |
| Working Days | Multi-select | Mon-Sun | Yes |
| Status | Toggle | Active/Inactive | Yes |

**API Endpoints:**
- `GET /api/v1/shifts` - List shifts
- `GET /api/v1/shifts/{id}` - Get shift
- `POST /api/v1/shifts` - Create shift
- `PUT /api/v1/shifts/{id}` - Update shift
- `DELETE /api/v1/shifts/{id}` - Delete shift

**Database Tables:** `shifts`

### 12.2 Attendance Policies
**Menu Path:** Attendance Management > Attendance Policy
**Permission Required:** `manage_attendance_policies`

#### Add/Edit Policy Modal
| Field | Type | Required |
|-------|------|----------|
| Policy Name | Input (text) | Yes |
| Late Threshold (Minutes) | Input (number) | Yes |
| Half Day Threshold (Hours) | Input (number) | Yes |
| Overtime Threshold (Minutes) | Input (number) | No |
| Auto Clock Out | Toggle | No |
| Auto Clock Out Time | Time Picker | If auto enabled |

**API Endpoints:**
- `GET /api/v1/attendance-policies` - List policies
- `POST /api/v1/attendance-policies` - Create policy
- `PUT /api/v1/attendance-policies/{id}` - Update policy
- `DELETE /api/v1/attendance-policies/{id}` - Delete policy

**Database Tables:** `attendance_policies`

### 12.3 Attendance Records
**Menu Path:** Attendance Management > Attendance
**Permission Required:** `view_attendance`
**URL:** `/hrm/attendance`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Date | Yes | Yes (date range) |
| Shift | No | Yes (dropdown) |
| Clock In | No | No |
| Clock Out | No | No |
| Working Hours | No | No |
| Overtime | No | No |
| Status | No | Yes (Present/Absent/Late/Half Day/On Leave) |
| Actions | No | No |

#### Manual Attendance Entry Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Date | Date Picker | - | Yes |
| Clock In Time | Time Picker | - | Yes |
| Clock Out Time | Time Picker | After clock in | No |
| Status | Select | Present/Absent/Late/Half Day | Yes |
| Notes | Textarea | Max 500 chars | No |

**API Endpoints:**
- `GET /api/v1/attendance` - List attendance records
- `GET /api/v1/attendance/{id}` - Get attendance record
- `POST /api/v1/attendance` - Create manual entry
- `PUT /api/v1/attendance/{id}` - Update attendance
- `DELETE /api/v1/attendance/{id}` - Delete attendance
- `GET /api/v1/attendance/today` - Get today's status
- `POST /api/v1/attendance/clock-in` - Clock in
- `POST /api/v1/attendance/clock-out` - Clock out
- `GET /api/v1/attendance/report` - Get attendance report

**Database Tables:** `attendance_records`

### 12.4 Attendance Regularizations
**Menu Path:** Attendance Management > Regularization
**Permission Required:** `approve_regularization`

#### List View
| Column | Filterable |
|--------|------------|
| Employee | Yes |
| Date | Yes |
| Original Clock In | No |
| Original Clock Out | No |
| Requested Clock In | No |
| Requested Clock Out | No |
| Reason | No |
| Status | Yes (Pending/Approved/Rejected) |

#### Request Regularization Modal
| Field | Type | Required |
|-------|------|----------|
| Date | Date Picker | Yes |
| Requested Clock In | Time Picker | Yes |
| Requested Clock Out | Time Picker | Yes |
| Reason | Textarea | Yes |

**API Endpoints:**
- `GET /api/v1/attendance/regularizations` - List regularizations
- `POST /api/v1/attendance/regularizations` - Request regularization
- `PATCH /api/v1/attendance/regularizations/{id}/approve` - Approve
- `PATCH /api/v1/attendance/regularizations/{id}/reject` - Reject

**Database Tables:** `attendance_regularizations`

---

## 13. Time Tracking

**Menu Path:** Time Tracking
**Permission Required:** `view_time_tracking`
**URL:** `/hrm/time-tracking`

### 13.1 Time Entries
| Field | Type | Required |
|-------|------|----------|
| Project | Select | Yes |
| Task | Input (text) | Yes |
| Date | Date Picker | Yes |
| Start Time | Time Picker | Yes |
| End Time | Time Picker | Yes |
| Duration | Display (calculated) | - |
| Description | Textarea | No |
| Billable | Toggle | No |

### 13.2 Timesheets
| Column | Data |
|--------|------|
| Employee | Employee name |
| Week | Week range |
| Total Hours | Sum of time entries |
| Billable Hours | Sum of billable entries |
| Status | Draft/Submitted/Approved |

**API Endpoints:**
- `GET /api/v1/time-entries` - List time entries
- `POST /api/v1/time-entries` - Create time entry
- `PUT /api/v1/time-entries/{id}` - Update time entry
- `DELETE /api/v1/time-entries/{id}` - Delete time entry
- `GET /api/v1/timesheets` - List timesheets
- `POST /api/v1/timesheets/{id}/submit` - Submit timesheet
- `PATCH /api/v1/timesheets/{id}/approve` - Approve timesheet

**Database Tables:** `time_entries`, `timesheets`

---

## 14. Payroll Management

### 14.1 Salary Components
**Menu Path:** Payroll Management > Salary Component
**Permission Required:** `manage_salary_components`
**URL:** `/hrm/salary-components`

#### List View
| Column | Actions |
|--------|---------|
| Component Name | View, Edit, Delete |
| Type | Earning/Deduction |
| Calculation Type | Fixed/Percentage |
| Is Taxable | Yes/No |
| Is Mandatory | Yes/No |

#### Add/Edit Salary Component Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Component Name | Input (text) | Max 100 chars | Yes |
| Component Type | Select | Earning/Deduction | Yes |
| Calculation Type | Select | Fixed/Percentage | Yes |
| Percentage | Input (number) | 0-100 | If percentage |
| Is Taxable | Toggle | - | No |
| Is Mandatory | Toggle | - | No |
| Description | Textarea | Max 500 chars | No |

**Pre-defined Components:**
**Earnings:**
- Basic Salary (Fixed, Taxable, Mandatory)
- House Rent Allowance (Percentage, Taxable)
- Transport Allowance (Fixed, Non-taxable)
- Medical Allowance (Fixed, Non-taxable)
- Bonus (Fixed, Taxable)
- Overtime (Fixed, Taxable)

**Deductions:**
- Income Tax (Percentage, Mandatory)
- Provident Fund (Percentage, Mandatory)
- Professional Tax (Fixed)
- Health Insurance (Fixed)
- Loan Deduction (Fixed)

**API Endpoints:**
- `GET /api/v1/salary-components` - List components
- `GET /api/v1/salary-components/{id}` - Get component
- `POST /api/v1/salary-components` - Create component
- `PUT /api/v1/salary-components/{id}` - Update component
- `DELETE /api/v1/salary-components/{id}` - Delete component

**Database Tables:** `salary_components`

### 14.2 Employee Salaries
**Menu Path:** Payroll Management > Employee Salary
**Permission Required:** `manage_employee_salaries`
**URL:** `/hrm/employee-salaries`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Base Salary | No | No |
| Total Earnings | No | No |
| Total Deductions | No | No |
| Net Salary | No | No |
| Effective Date | Yes | Yes (date range) |
| Actions | No | No |

#### Add/Edit Employee Salary Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Employee | Select | Must exist | Yes |
| Base Salary | Input (number) | Positive number | Yes |
| Effective Date | Date Picker | - | Yes |
| Salary Components | Repeater | - | No |

#### Salary Component Entry
| Field | Type | Required |
|-------|------|----------|
| Component | Select | Yes |
| Amount | Input (number) | Yes |

**API Endpoints:**
- `GET /api/v1/employee-salaries` - List employee salaries
- `GET /api/v1/employee-salaries/{id}` - Get employee salary
- `POST /api/v1/employee-salaries` - Create employee salary
- `PUT /api/v1/employee-salaries/{id}` - Update employee salary
- `DELETE /api/v1/employee-salaries/{id}` - Delete employee salary

**Database Tables:** `employee_salaries`, `employee_salary_components`

### 14.3 Payroll Runs
**Menu Path:** Payroll Management > Payroll Run
**Permission Required:** `process_payroll`
**URL:** `/hrm/payroll-runs`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Pay Period | Yes | Yes (date range) |
| Total Employees | No | No |
| Total Gross | No | No |
| Total Deductions | No | No |
| Total Net | No | No |
| Status | No | Yes (Draft/Processing/Completed/Paid) |
| Actions | No | No |

#### Create Payroll Run Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Pay Period Start | Date Picker | - | Yes |
| Pay Period End | Date Picker | After start | Yes |
| Payment Date | Date Picker | - | Yes |
| Include Employees | Select | All/Branch/Department | Yes |
| Branch | Select | If filtered | Conditional |
| Department | Select | If filtered | Conditional |

#### Payroll Run Actions
| Action | Description |
|--------|-------------|
| Process | Generate payslips |
| Review | Review generated payslips |
| Approve | Approve payroll |
| Mark as Paid | Mark all as paid |
| Export | Export to Excel/PDF |

**API Endpoints:**
- `GET /api/v1/payroll-runs` - List payroll runs
- `GET /api/v1/payroll-runs/{id}` - Get payroll run
- `POST /api/v1/payroll-runs` - Create payroll run
- `POST /api/v1/payroll-runs/{id}/process` - Process payroll
- `PATCH /api/v1/payroll-runs/{id}/approve` - Approve payroll
- `PATCH /api/v1/payroll-runs/{id}/mark-paid` - Mark as paid
- `GET /api/v1/payroll-runs/{id}/export` - Export payroll

**Database Tables:** `payroll_runs`

### 14.4 Payslips
**Menu Path:** Payroll Management > Payslip
**Permission Required:** `view_payslips`
**URL:** `/hrm/payslips`

#### List View
| Column | Sortable | Filterable |
|--------|----------|------------|
| # | No | No |
| Employee | Yes | Yes (dropdown) |
| Pay Period | Yes | Yes (date range) |
| Base Salary | No | No |
| Total Earnings | No | No |
| Total Deductions | No | No |
| Net Pay | No | No |
| Status | No | Yes (Generated/Sent/Paid) |
| Actions | No | No |

#### Payslip View
| Section | Content |
|---------|---------|
| Header | Company logo, name, address |
| Employee Info | Name, ID, department, designation |
| Pay Period | Start date, end date, payment date |
| Earnings | List of earning components with amounts |
| Deductions | List of deduction components with amounts |
| Summary | Gross salary, total deductions, net pay |
| Footer | Company signature, employee signature |

#### Payslip Actions
| Action | Permission Required |
|--------|---------------------|
| View | `view_payslips` |
| Download PDF | `view_payslips` |
| Send Email | `send_payslips` |
| Print | `view_payslips` |

**API Endpoints:**
- `GET /api/v1/payslips` - List payslips
- `GET /api/v1/payslips/{id}` - Get payslip
- `GET /api/v1/payslips/{id}/download` - Download PDF
- `POST /api/v1/payslips/{id}/send` - Send via email
- `GET /api/v1/payslips/my` - Get own payslips (employee)

**Database Tables:** `payslips`

---

## 15. Currencies

**Menu Path:** Currencies
**Permission Required:** `manage_currencies`
**URL:** `/hrm/currencies`

### List View
| Column | Actions |
|--------|---------|
| Currency Name | Edit, Delete |
| Currency Code | - |
| Symbol | - |
| Exchange Rate | - |
| Is Default | Yes/No |

### Add/Edit Currency Modal
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Currency Name | Input (text) | Max 100 chars | Yes |
| Currency Code | Input (text) | 3 chars (ISO) | Yes |
| Symbol | Input (text) | Max 5 chars | Yes |
| Exchange Rate | Input (number) | Positive number | Yes |
| Is Default | Toggle | Only one default | No |

**API Endpoints:**
- `GET /api/v1/currencies` - List currencies
- `GET /api/v1/currencies/{id}` - Get currency
- `POST /api/v1/currencies` - Create currency
- `PUT /api/v1/currencies/{id}` - Update currency
- `DELETE /api/v1/currencies/{id}` - Delete currency

**Database Tables:** `currencies`

---

## 16. Landing Page

**Menu Path:** Landing Page
**Permission Required:** `manage_landing_page`
**URL:** `/hrm/landing-page`

### Sections
| Section | Editable Fields |
|---------|-----------------|
| Hero | Title, Subtitle, CTA Button, Background Image |
| Features | Feature cards (icon, title, description) |
| Statistics | Stat cards (number, label) |
| Testimonials | Testimonial cards (quote, author, company) |
| Pricing | Pricing plans (name, price, features) |
| FAQ | FAQ items (question, answer) |
| Contact | Contact form, address, phone, email |
| Footer | Links, social media, copyright |

### Landing Page Settings
| Field | Type | Required |
|-------|------|----------|
| Logo | File Upload | No |
| Favicon | File Upload | No |
| Primary Color | Color Picker | No |
| Secondary Color | Color Picker | No |
| Meta Title | Input (text) | No |
| Meta Description | Textarea | No |
| Google Analytics ID | Input (text) | No |

**API Endpoints:**
- `GET /api/v1/landing-page` - Get landing page content
- `PUT /api/v1/landing-page` - Update landing page content
- `PUT /api/v1/landing-page/settings` - Update settings

**Database Tables:** `landing_page_sections`, `landing_page_settings`

---

## 17. Settings

**Menu Path:** Settings
**Permission Required:** `view_settings`
**URL:** `/hrm/settings`

### 17.1 General Settings
| Field | Type | Description |
|-------|------|-------------|
| Company Name | Input (text) | Organization name |
| Company Email | Input (email) | Primary contact email |
| Company Phone | Input (tel) | Primary phone number |
| Company Address | Textarea | Full address |
| Company Website | Input (url) | Website URL |
| Timezone | Select | System timezone |
| Date Format | Select | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD |
| Time Format | Select | 12-hour, 24-hour |
| Week Start Day | Select | Sunday, Monday |
| Financial Year Start | Select | Month |

### 17.2 Brand Settings
| Field | Type | Description |
|-------|------|-------------|
| Logo | File Upload | Company logo |
| Favicon | File Upload | Browser favicon |
| Primary Color | Color Picker | Brand primary color |
| Secondary Color | Color Picker | Brand secondary color |
| Login Background | File Upload | Login page background |

### 17.3 Email Settings
| Field | Type | Description |
|-------|------|-------------|
| Mail Driver | Select | SMTP, Mailgun, SES |
| SMTP Host | Input (text) | Mail server host |
| SMTP Port | Input (number) | Mail server port |
| SMTP Username | Input (text) | Mail username |
| SMTP Password | Input (password) | Mail password |
| SMTP Encryption | Select | TLS, SSL, None |
| From Email | Input (email) | Sender email |
| From Name | Input (text) | Sender name |

### 17.4 Notification Settings
| Notification Type | Email | In-App | Push |
|-------------------|-------|--------|------|
| Leave Application | Toggle | Toggle | Toggle |
| Leave Approval | Toggle | Toggle | Toggle |
| Attendance Alert | Toggle | Toggle | Toggle |
| Payslip Generated | Toggle | Toggle | Toggle |
| Meeting Reminder | Toggle | Toggle | Toggle |
| Announcement | Toggle | Toggle | Toggle |
| Birthday Reminder | Toggle | Toggle | Toggle |
| Contract Expiry | Toggle | Toggle | Toggle |

### 17.5 Leave Settings
| Field | Type | Description |
|-------|------|-------------|
| Leave Year Start | Select | Month |
| Allow Backdated Leave | Toggle | Allow past date applications |
| Max Backdated Days | Input (number) | Maximum days in past |
| Require Attachment for Sick Leave | Toggle | Mandatory attachment |
| Auto Approve After Days | Input (number) | Auto-approve threshold |

### 17.6 Attendance Settings
| Field | Type | Description |
|-------|------|-------------|
| Enable Geo-fencing | Toggle | Location-based attendance |
| Office Latitude | Input (number) | Office location |
| Office Longitude | Input (number) | Office location |
| Geo-fence Radius (meters) | Input (number) | Allowed radius |
| Enable Face Recognition | Toggle | Biometric attendance |
| Enable IP Restriction | Toggle | Restrict by IP |
| Allowed IP Addresses | Textarea | Comma-separated IPs |

### 17.7 Payroll Settings
| Field | Type | Description |
|-------|------|-------------|
| Pay Frequency | Select | Monthly, Bi-weekly, Weekly |
| Pay Day | Input (number) | Day of month |
| Currency | Select | Default currency |
| Tax Calculation Method | Select | Gross, Net |
| Enable Overtime | Toggle | Calculate overtime |
| Overtime Rate | Input (number) | Multiplier (e.g., 1.5) |

### 17.8 Recruitment Settings
| Field | Type | Description |
|-------|------|-------------|
| Enable Career Page | Toggle | Public job listings |
| Career Page URL | Display | Auto-generated URL |
| Application Form Fields | Multi-select | Required fields |
| Auto-reject After Days | Input (number) | Auto-reject threshold |
| Enable Assessment | Toggle | Candidate assessments |

### 17.9 Security Settings
| Field | Type | Description |
|-------|------|-------------|
| Password Min Length | Input (number) | Minimum characters |
| Require Uppercase | Toggle | At least one uppercase |
| Require Number | Toggle | At least one number |
| Require Special Character | Toggle | At least one special char |
| Password Expiry Days | Input (number) | Force password change |
| Max Login Attempts | Input (number) | Before lockout |
| Lockout Duration (Minutes) | Input (number) | Account lockout time |
| Enable 2FA | Toggle | Two-factor authentication |
| Session Timeout (Minutes) | Input (number) | Auto logout time |

### 17.10 Backup Settings
| Field | Type | Description |
|-------|------|-------------|
| Enable Auto Backup | Toggle | Automatic backups |
| Backup Frequency | Select | Daily, Weekly, Monthly |
| Backup Time | Time Picker | Scheduled time |
| Backup Retention Days | Input (number) | Keep backups for |
| Backup Storage | Select | Local, S3, Google Drive |

**API Endpoints:**
- `GET /api/v1/settings` - Get all settings
- `GET /api/v1/settings/{group}` - Get settings by group
- `PUT /api/v1/settings` - Update settings
- `PUT /api/v1/settings/{group}` - Update settings group
- `POST /api/v1/settings/test-email` - Test email configuration
- `POST /api/v1/settings/backup` - Trigger manual backup

**Database Tables:** `settings`

---

## Role-Based Access Summary

### Company (Admin) Role
- Full access to all modules
- Can manage users and roles
- Can configure all settings
- Can manage landing page
- Can manage currencies

### HR Role
- Access to all HR modules
- Cannot manage users/roles
- Cannot access settings
- Cannot manage landing page
- Cannot manage currencies

### Employee Role
- Dashboard (self-service view)
- Own profile view/edit
- Apply for leave
- View leave balances
- Clock in/out
- View own attendance
- View own payslips
- View announcements
- View holidays
- View meetings (as attendee)
- Submit complaints
- View own documents

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total Menu Items | 45+ |
| Total Pages/Screens | 60+ |
| Total Forms | 80+ |
| Total Form Fields | 500+ |
| Total API Endpoints | 200+ |
| Total Database Tables | 50+ |
| Total Permissions | 581 |
| Total React Components | 150+ |
