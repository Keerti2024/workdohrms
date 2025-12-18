# WorkDo HRM - API Endpoints (Postman Guide)

## Base URL
```
Production: https://your-domain.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication

### Headers Required
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

---

## 1. Authentication Endpoints

### POST /auth/login
Login to the system and get access token.

**Request:**
```json
{
    "email": "company@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "Company Admin",
            "email": "company@example.com",
            "role": "company"
        },
        "token": "1|abc123xyz...",
        "token_type": "Bearer",
        "expires_at": "2025-12-24T17:00:00.000000Z"
    },
    "message": "Login successful"
}
```

### POST /auth/logout
Logout and invalidate token.

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### POST /auth/forgot-password
Request password reset link.

**Request:**
```json
{
    "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
    "email": "user@example.com",
    "token": "reset_token_here",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

### GET /auth/me
Get current authenticated user.

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Company Admin",
        "email": "company@example.com",
        "phone": "+1234567890",
        "avatar": "https://...",
        "role": {
            "id": 1,
            "name": "company"
        },
        "permissions": ["view_dashboard", "manage_users", "..."]
    }
}
```

---

## 2. Dashboard Endpoints

### GET /dashboard
Get dashboard statistics.

**Query Parameters:**
- `period`: string (today, week, month, year)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "total_employees": 10,
        "total_branches": 9,
        "total_departments": 24,
        "attendance_rate": 85.5,
        "pending_leaves": 3,
        "active_jobs": 6,
        "total_candidates": 20,
        "department_distribution": [
            {"name": "Engineering", "count": 5},
            {"name": "HR", "count": 2}
        ],
        "hiring_trend": [
            {"month": "Aug 2025", "hires": 3},
            {"month": "Sep 2025", "hires": 5}
        ],
        "candidate_status": [
            {"status": "new", "count": 8},
            {"status": "interview", "count": 5}
        ],
        "leave_types": [
            {"type": "Annual", "used": 45, "total": 210}
        ]
    }
}
```

---

## 3. User Management Endpoints

### GET /users
List all users with pagination.

**Query Parameters:**
- `page`: integer (default: 1)
- `per_page`: integer (default: 15)
- `search`: string (search by name, email)
- `role`: integer (filter by role_id)
- `status`: string (active, inactive)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "data": [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+1234567890",
                "avatar": "https://...",
                "status": "active",
                "role": {
                    "id": 2,
                    "name": "HR"
                },
                "created_at": "2025-01-15T10:00:00.000000Z"
            }
        ],
        "meta": {
            "current_page": 1,
            "last_page": 5,
            "per_page": 15,
            "total": 75
        }
    }
}
```

### POST /users
Create a new user.

**Request:**
```json
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role_id": 2,
    "phone": "+1234567890"
}
```

**Response (201):**
```json
{
    "success": true,
    "data": {
        "id": 7,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": {
            "id": 2,
            "name": "HR"
        }
    },
    "message": "User created successfully"
}
```

### GET /users/{id}
Get user details.

### PUT /users/{id}
Update user.

### DELETE /users/{id}
Delete user (soft delete).

### POST /users/{id}/reset-password
Reset user password.

**Request:**
```json
{
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

---

## 4. Role Management Endpoints

### GET /roles
List all roles.

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Employee",
            "permissions_count": 133,
            "users_count": 5,
            "created_at": "2025-01-01T00:00:00.000000Z"
        },
        {
            "id": 2,
            "name": "HR",
            "permissions_count": 487,
            "users_count": 2,
            "created_at": "2025-01-01T00:00:00.000000Z"
        }
    ]
}
```

### POST /roles
Create a new role.

**Request:**
```json
{
    "name": "Manager",
    "permissions": [
        "view_dashboard",
        "view_employees",
        "edit_employees",
        "view_leaves",
        "approve_leaves"
    ]
}
```

### GET /roles/{id}
Get role with permissions.

### PUT /roles/{id}
Update role and permissions.

### DELETE /roles/{id}
Delete role.

### GET /permissions
Get all available permissions grouped by module.

**Response (200):**
```json
{
    "success": true,
    "data": {
        "dashboard": ["view_dashboard"],
        "users": ["view_users", "create_users", "edit_users", "delete_users"],
        "employees": ["view_employees", "create_employees", "edit_employees", "delete_employees"],
        "leaves": ["view_leaves", "create_leaves", "approve_leaves", "reject_leaves"]
    }
}
```

---

## 5. Branch Management Endpoints

### GET /branches
List all branches.

**Query Parameters:**
- `page`: integer
- `per_page`: integer
- `search`: string
- `status`: string (active, inactive)

### POST /branches
Create a new branch.

**Request:**
```json
{
    "name": "Head Office",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zip_code": "400001",
    "phone": "+91-22-12345678",
    "email": "headoffice@company.com",
    "status": "active"
}
```

### GET /branches/{id}
Get branch details.

### PUT /branches/{id}
Update branch.

### DELETE /branches/{id}
Delete branch.

### PATCH /branches/{id}/toggle-status
Toggle branch status (active/inactive).

---

## 6. Department Management Endpoints

### GET /departments
List all departments.

**Query Parameters:**
- `branch_id`: integer (filter by branch)

### POST /departments
Create a new department.

**Request:**
```json
{
    "branch_id": 1,
    "name": "Engineering",
    "description": "Software development team",
    "status": "active"
}
```

### GET /departments/{id}
### PUT /departments/{id}
### DELETE /departments/{id}

---

## 7. Designation Management Endpoints

### GET /designations
List all designations.

**Query Parameters:**
- `department_id`: integer (filter by department)

### POST /designations
Create a new designation.

**Request:**
```json
{
    "department_id": 1,
    "name": "Senior Software Engineer",
    "description": "Lead developer role",
    "status": "active"
}
```

### GET /designations/{id}
### PUT /designations/{id}
### DELETE /designations/{id}

---

## 8. Employee Management Endpoints

### GET /employees
List all employees.

**Query Parameters:**
- `page`: integer
- `per_page`: integer
- `search`: string
- `branch_id`: integer
- `department_id`: integer
- `designation_id`: integer
- `employment_status`: string (active, inactive, terminated, resigned)
- `employment_type`: string (full-time, part-time, contract, internship)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "data": [
            {
                "id": 1,
                "employee_id": "EMP001",
                "user": {
                    "id": 5,
                    "name": "Rahul Sharma",
                    "email": "rahul@company.com",
                    "avatar": "https://..."
                },
                "branch": {
                    "id": 1,
                    "name": "Head Office"
                },
                "department": {
                    "id": 1,
                    "name": "Engineering"
                },
                "designation": {
                    "id": 1,
                    "name": "Senior Software Engineer"
                },
                "date_of_joining": "2024-01-15",
                "employment_type": "full-time",
                "employment_status": "active"
            }
        ],
        "meta": {
            "current_page": 1,
            "last_page": 1,
            "per_page": 15,
            "total": 10
        }
    }
}
```

### POST /employees
Create a new employee.

**Request:**
```json
{
    "name": "Priya Patel",
    "email": "priya@company.com",
    "password": "password123",
    "phone": "+91-9876543210",
    "employee_id": "EMP011",
    "branch_id": 1,
    "department_id": 1,
    "designation_id": 2,
    "date_of_birth": "1990-05-15",
    "gender": "female",
    "date_of_joining": "2025-01-01",
    "employment_type": "full-time",
    "address_line_1": "456 Park Avenue",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postal_code": "400002",
    "emergency_contact_name": "Amit Patel",
    "emergency_contact_relationship": "Spouse",
    "emergency_contact_phone": "+91-9876543211",
    "bank_name": "HDFC Bank",
    "account_holder_name": "Priya Patel",
    "account_number": "1234567890",
    "bank_identifier_code": "HDFC0001234",
    "documents": [
        {
            "document_type_id": 1,
            "file": "base64_encoded_file_or_file_upload",
            "expiry_date": "2030-12-31"
        }
    ]
}
```

### GET /employees/{id}
Get employee full profile.

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "employee_id": "EMP001",
        "user": {
            "id": 5,
            "name": "Rahul Sharma",
            "email": "rahul@company.com"
        },
        "personal_info": {
            "date_of_birth": "1988-03-20",
            "gender": "male",
            "marital_status": "married"
        },
        "employment_details": {
            "branch": {"id": 1, "name": "Head Office"},
            "department": {"id": 1, "name": "Engineering"},
            "designation": {"id": 1, "name": "Senior Software Engineer"},
            "date_of_joining": "2024-01-15",
            "employment_type": "full-time",
            "employment_status": "active",
            "shift": {"id": 1, "name": "Morning Shift"}
        },
        "contact_info": {
            "address_line_1": "123 Main Street",
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "postal_code": "400001"
        },
        "emergency_contact": {
            "name": "Meera Sharma",
            "relationship": "Spouse",
            "phone": "+91-9876543212"
        },
        "banking_info": {
            "bank_name": "ICICI Bank",
            "account_holder_name": "Rahul Sharma",
            "account_number": "****7890"
        },
        "documents": [
            {
                "id": 1,
                "type": "Passport",
                "file_name": "passport.pdf",
                "expiry_date": "2030-12-31"
            }
        ],
        "statistics": {
            "total_awards": 2,
            "total_warnings": 0,
            "leave_balance": {
                "annual": 15,
                "sick": 8
            }
        }
    }
}
```

### PUT /employees/{id}
Update employee.

### DELETE /employees/{id}
Delete employee (soft delete).

---

## 9. Award Management Endpoints

### GET /award-types
List award types.

### POST /award-types
Create award type.

**Request:**
```json
{
    "name": "Employee of the Month",
    "description": "Monthly recognition award",
    "status": "active"
}
```

### GET /awards
List all awards.

**Query Parameters:**
- `employee_id`: integer
- `award_type_id`: integer
- `date_from`: date
- `date_to`: date

### POST /awards
Create an award.

**Request:**
```json
{
    "employee_id": 1,
    "award_type_id": 1,
    "award_date": "2025-12-01",
    "gift": "Gift Voucher",
    "monetary_value": 5000,
    "description": "Outstanding performance in Q4",
    "certificate": "base64_or_file_upload",
    "photo": "base64_or_file_upload"
}
```

---

## 10. Promotion Management Endpoints

### GET /promotions
List all promotions.

**Query Parameters:**
- `employee_id`: integer
- `status`: string (pending, approved, rejected)

### POST /promotions
Create a promotion request.

**Request:**
```json
{
    "employee_id": 1,
    "new_designation_id": 3,
    "promotion_date": "2025-12-15",
    "effective_date": "2026-01-01",
    "salary_adjustment": 15000,
    "description": "Promoted to Team Lead based on excellent performance"
}
```

### PATCH /promotions/{id}/approve
Approve promotion.

### PATCH /promotions/{id}/reject
Reject promotion.

**Request:**
```json
{
    "rejection_reason": "Position not available at this time"
}
```

---

## 11. Performance Management Endpoints

### GET /indicator-categories
### POST /indicator-categories
### GET /indicators
### POST /indicators

**Request:**
```json
{
    "category_id": 1,
    "name": "Code Quality",
    "measurement_unit": "rating",
    "target_value": "4.5",
    "status": "active"
}
```

### GET /goal-types
### POST /goal-types

### GET /employee-goals
List employee goals.

**Query Parameters:**
- `employee_id`: integer
- `goal_type_id`: integer
- `status`: string (pending, in_progress, completed, cancelled)

### POST /employee-goals
Create employee goal.

**Request:**
```json
{
    "employee_id": 1,
    "goal_type_id": 1,
    "title": "Complete AWS Certification",
    "description": "Obtain AWS Solutions Architect certification",
    "start_date": "2025-01-01",
    "end_date": "2025-06-30"
}
```

### PATCH /employee-goals/{id}/progress
Update goal progress.

**Request:**
```json
{
    "progress": 75
}
```

### GET /review-cycles
### POST /review-cycles

### GET /employee-reviews
### POST /employee-reviews

**Request:**
```json
{
    "employee_id": 1,
    "reviewer_id": 2,
    "review_cycle_id": 1,
    "review_date": "2025-12-20",
    "rating": 4.5,
    "comments": "Excellent performance throughout the year"
}
```

---

## 12. Resignation Management Endpoints

### GET /resignations
### POST /resignations

**Request:**
```json
{
    "employee_id": 1,
    "resignation_date": "2025-12-01",
    "last_working_day": "2025-12-31",
    "notice_period": "30 days",
    "reason": "Personal reasons",
    "description": "Relocating to another city"
}
```

### PATCH /resignations/{id}/approve
### PATCH /resignations/{id}/reject

---

## 13. Termination Management Endpoints

### GET /terminations
### POST /terminations

**Request:**
```json
{
    "employee_id": 1,
    "termination_type": "retirement",
    "termination_date": "2025-12-31",
    "notice_date": "2025-11-30",
    "reason": "Retirement",
    "description": "Employee retiring after 30 years of service"
}
```

### PATCH /terminations/{id}/complete

---

## 14. Warning Management Endpoints

### GET /warnings
### POST /warnings

**Request:**
```json
{
    "employee_id": 1,
    "subject": "Attendance Issues",
    "warning_type": "attendance",
    "severity": "written",
    "warning_date": "2025-12-01",
    "description": "Multiple late arrivals in November",
    "improvement_plan": true
}
```

### PATCH /warnings/{id}/issue
Issue the warning to employee.

---

## 15. Trip Management Endpoints

### GET /trips
### POST /trips

**Request:**
```json
{
    "employee_id": 1,
    "purpose": "Client Meeting",
    "destination": "Bangalore",
    "start_date": "2025-12-15",
    "end_date": "2025-12-17",
    "description": "Meeting with ABC Corp for project discussion",
    "advance_amount": 25000
}
```

### PATCH /trips/{id}/approve
### POST /trips/{id}/expenses

**Request:**
```json
{
    "expense_type": "Travel",
    "amount": 5000,
    "description": "Flight tickets",
    "expense_date": "2025-12-15",
    "receipt": "base64_or_file_upload"
}
```

---

## 16. Complaint Management Endpoints

### GET /complaints
### POST /complaints

**Request:**
```json
{
    "is_anonymous": false,
    "against_id": 5,
    "complaint_type": "harassment",
    "subject": "Workplace Harassment",
    "complaint_date": "2025-12-01",
    "description": "Details of the complaint..."
}
```

### PATCH /complaints/{id}/assign

**Request:**
```json
{
    "assigned_to": 2
}
```

### PATCH /complaints/{id}/resolve

**Request:**
```json
{
    "resolution": "Investigation completed. Action taken."
}
```

---

## 17. Transfer Management Endpoints

### GET /transfers
### POST /transfers

**Request:**
```json
{
    "employee_id": 1,
    "transfer_type": "branch",
    "from_branch_id": 1,
    "to_branch_id": 2,
    "transfer_date": "2025-12-01",
    "effective_date": "2026-01-01",
    "reason": "Business requirement"
}
```

### PATCH /transfers/{id}/approve
### PATCH /transfers/{id}/reject

---

## 18. Holiday Management Endpoints

### GET /holidays
List holidays.

**Query Parameters:**
- `year`: integer
- `month`: integer
- `branch_id`: integer
- `category`: string (national, religious, company)

### POST /holidays

**Request:**
```json
{
    "name": "Diwali",
    "holiday_date": "2025-10-20",
    "category": "religious",
    "holiday_type": "recurring",
    "is_paid": true,
    "description": "Festival of Lights",
    "branch_ids": [1, 2, 3]
}
```

### GET /holidays/calendar
Get holidays in calendar format.

### GET /holidays/export/pdf
Export holidays as PDF.

### GET /holidays/export/ical
Export holidays as iCal file.

---

## 19. Announcement Management Endpoints

### GET /announcements
### POST /announcements

**Request:**
```json
{
    "title": "New Year Celebration",
    "category": "company_news",
    "content": "We are organizing a New Year celebration...",
    "start_date": "2025-12-25",
    "end_date": "2026-01-05",
    "is_featured": true,
    "is_high_priority": false,
    "audience": "company_wide",
    "attachments": ["base64_or_file_upload"]
}
```

---

## 20. Asset Management Endpoints

### GET /asset-types
### POST /asset-types

### GET /assets
List assets.

**Query Parameters:**
- `asset_type_id`: integer
- `status`: string (available, assigned, under_maintenance, retired)
- `assigned_to`: integer

### POST /assets

**Request:**
```json
{
    "asset_type_id": 1,
    "name": "MacBook Pro 16",
    "asset_code": "LAPTOP-001",
    "purchase_date": "2025-01-15",
    "purchase_cost": 250000,
    "depreciation_method": "straight_line",
    "useful_life_years": 5,
    "location": "Head Office",
    "serial_number": "C02XL1234567"
}
```

### PATCH /assets/{id}/assign

**Request:**
```json
{
    "assigned_to": 1,
    "assigned_date": "2025-12-01"
}
```

### PATCH /assets/{id}/unassign

### GET /assets/dashboard
Get asset statistics.

### GET /assets/depreciation-report
Get depreciation report.

---

## 21. Training Management Endpoints

### GET /training-types
### POST /training-types

### GET /training-programs
### POST /training-programs

**Request:**
```json
{
    "training_type_id": 1,
    "name": "React Advanced Training",
    "description": "Advanced React concepts including hooks, context, and performance optimization",
    "duration_hours": 40,
    "cost": 15000,
    "capacity": 20,
    "is_self_enrollment": true,
    "is_mandatory": false,
    "status": "active"
}
```

### GET /training-sessions
### POST /training-sessions

**Request:**
```json
{
    "training_program_id": 1,
    "start_datetime": "2025-12-20T09:00:00",
    "end_datetime": "2025-12-20T17:00:00",
    "location": "Training Room A",
    "location_type": "physical",
    "trainer_ids": [2, 3]
}
```

### GET /employee-trainings
### POST /employee-trainings

**Request:**
```json
{
    "employee_id": 1,
    "training_program_id": 1,
    "training_session_id": 1
}
```

### PATCH /employee-trainings/{id}/complete

**Request:**
```json
{
    "score": 85,
    "result": "passed"
}
```

---

## 22. Recruitment Endpoints

### GET /job-categories
### POST /job-categories

### GET /job-types
### POST /job-types

### GET /job-locations
### POST /job-locations

### GET /job-requisitions
### POST /job-requisitions

**Request:**
```json
{
    "title": "Senior Software Engineer",
    "job_category_id": 1,
    "department_id": 1,
    "positions": 2,
    "priority": "high",
    "description": "We are looking for experienced software engineers...",
    "requirements": "5+ years experience in React and Node.js..."
}
```

### PATCH /job-requisitions/{id}/approve
### PATCH /job-requisitions/{id}/reject

### GET /job-postings
### POST /job-postings

**Request:**
```json
{
    "job_requisition_id": 1,
    "title": "Senior Software Engineer",
    "job_type_id": 1,
    "job_location_id": 1,
    "salary_min": 100000,
    "salary_max": 150000,
    "description": "Job description...",
    "requirements": "Requirements...",
    "benefits": "Benefits...",
    "is_featured": true,
    "deadline": "2026-01-31"
}
```

### PATCH /job-postings/{id}/publish
### PATCH /job-postings/{id}/close

### GET /candidate-sources
### POST /candidate-sources

### GET /candidates
List candidates.

**Query Parameters:**
- `job_posting_id`: integer
- `status`: string (new, screening, interview, offer, hired, rejected)
- `source_id`: integer

### POST /candidates

**Request:**
```json
{
    "job_posting_id": 1,
    "candidate_source_id": 2,
    "name": "Amit Kumar",
    "email": "amit@email.com",
    "phone": "+91-9876543210",
    "experience_years": 5,
    "expected_salary": 120000,
    "resume": "base64_or_file_upload",
    "cover_letter": "I am excited to apply for..."
}
```

### PATCH /candidates/{id}/status

**Request:**
```json
{
    "status": "interview"
}
```

### GET /interview-types
### POST /interview-types

### GET /interview-rounds
### POST /interview-rounds

**Request:**
```json
{
    "job_posting_id": 1,
    "sequence": 1,
    "name": "Phone Screening",
    "description": "Initial phone screening with HR"
}
```

### GET /interviews
### POST /interviews

**Request:**
```json
{
    "candidate_id": 1,
    "interview_round_id": 1,
    "interview_type_id": 1,
    "scheduled_datetime": "2025-12-20T10:00:00",
    "duration_minutes": 60,
    "location": "Conference Room A",
    "interviewer_ids": [2, 3]
}
```

### PATCH /interviews/{id}/complete
### PATCH /interviews/{id}/cancel

### GET /interview-feedback
### POST /interview-feedback

**Request:**
```json
{
    "interview_id": 1,
    "overall_rating": 4,
    "recommendation": "strong_hire",
    "comments": "Excellent technical skills and communication"
}
```

### GET /candidate-assessments
### POST /candidate-assessments

**Request:**
```json
{
    "candidate_id": 1,
    "assessment_type": "Technical Skills",
    "score": 85,
    "assessment_date": "2025-12-18",
    "comments": "Strong problem-solving skills"
}
```

### GET /offer-templates
### POST /offer-templates

### GET /offers
### POST /offers

**Request:**
```json
{
    "candidate_id": 1,
    "offer_template_id": 1,
    "base_salary": 120000,
    "bonus": 15000,
    "start_date": "2026-02-01",
    "expires_at": "2025-12-31"
}
```

### PATCH /offers/{id}/send
### PATCH /offers/{id}/accept
### PATCH /offers/{id}/reject

### GET /onboarding-checklists
### POST /onboarding-checklists

---

## 23. Contract Management Endpoints

### GET /contract-types
### POST /contract-types

**Request:**
```json
{
    "name": "Permanent Full-time",
    "description": "Standard permanent employment contract",
    "duration_type": "permanent",
    "probation_months": 6,
    "notice_period_days": 60,
    "is_renewable": false
}
```

### GET /employee-contracts
### POST /employee-contracts

**Request:**
```json
{
    "employee_id": 1,
    "contract_type_id": 1,
    "start_date": "2025-01-01",
    "base_salary": 100000,
    "allowances": [
        {"salary_component_id": 1, "amount": 15000},
        {"salary_component_id": 2, "amount": 40000}
    ]
}
```

### GET /contract-renewals
### POST /contract-renewals

**Request:**
```json
{
    "original_contract_id": 1,
    "new_start_date": "2026-01-01",
    "new_end_date": "2026-12-31",
    "new_base_salary": 110000
}
```

### PATCH /contract-renewals/{id}/approve

---

## 24. Document Management Endpoints

### GET /document-categories
### POST /document-categories

### GET /hr-documents
### POST /hr-documents

**Request (multipart/form-data):**
```
document_category_id: 1
name: Employee Handbook
file: [file upload]
version: 2.0
expires_at: 2026-12-31
```

### GET /hr-documents/{id}/download
Download document file.

### POST /hr-documents/{id}/acknowledge
Employee acknowledges document.

---

## 25. Meeting Management Endpoints

### GET /meeting-types
### POST /meeting-types

### GET /meeting-rooms
### POST /meeting-rooms

### GET /meetings
### POST /meetings

**Request:**
```json
{
    "meeting_type_id": 1,
    "meeting_room_id": 1,
    "title": "Project Alpha Review",
    "description": "Monthly project review meeting",
    "start_datetime": "2025-12-20T14:00:00",
    "end_datetime": "2025-12-20T15:30:00",
    "agenda": "1. Progress update\n2. Blockers\n3. Next steps",
    "attendee_ids": [1, 2, 3, 4]
}
```

### PATCH /meetings/{id}/start
### PATCH /meetings/{id}/complete
### PATCH /meetings/{id}/cancel

### POST /meetings/{id}/respond

**Request:**
```json
{
    "response": "accepted"
}
```

### GET /meeting-minutes
### POST /meeting-minutes

**Request:**
```json
{
    "meeting_id": 1,
    "content": "Meeting minutes content..."
}
```

### GET /meeting-action-items
### POST /meeting-action-items

**Request:**
```json
{
    "meeting_id": 1,
    "title": "Prepare project report",
    "description": "Compile Q4 project report",
    "assigned_to": 2,
    "due_date": "2025-12-25"
}
```

### PATCH /meeting-action-items/{id}/complete

---

## 26. Leave Management Endpoints

### GET /leave-types
### POST /leave-types

**Request:**
```json
{
    "name": "Annual Leave",
    "description": "Paid annual vacation leave",
    "max_days_per_year": 21,
    "leave_type": "paid",
    "color": "#4CAF50"
}
```

### GET /leave-policies
### POST /leave-policies

### GET /leave-applications
List leave applications.

**Query Parameters:**
- `employee_id`: integer
- `leave_type_id`: integer
- `status`: string (pending, approved, rejected, cancelled)
- `date_from`: date
- `date_to`: date

### POST /leave-applications

**Request:**
```json
{
    "leave_type_id": 1,
    "start_date": "2025-12-25",
    "end_date": "2025-12-31",
    "reason": "Year-end vacation"
}
```

### PATCH /leave-applications/{id}/approve
### PATCH /leave-applications/{id}/reject

**Request:**
```json
{
    "rejection_reason": "Critical project deadline"
}
```

### PATCH /leave-applications/{id}/cancel

### GET /leave-balances
Get leave balances.

**Query Parameters:**
- `employee_id`: integer
- `year`: integer

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "leave_type": {
                "id": 1,
                "name": "Annual Leave"
            },
            "allocated_days": 21,
            "used_days": 6,
            "carried_forward_days": 3,
            "remaining_days": 18
        }
    ]
}
```

---

## 27. Attendance Management Endpoints

### GET /shifts
### POST /shifts

**Request:**
```json
{
    "name": "Morning Shift",
    "start_time": "09:00",
    "end_time": "18:00",
    "break_duration_minutes": 60,
    "working_hours": 8,
    "grace_period_minutes": 15,
    "shift_type": "day"
}
```

### GET /attendance-policies
### POST /attendance-policies

### GET /attendance-records
List attendance records.

**Query Parameters:**
- `employee_id`: integer
- `date_from`: date
- `date_to`: date
- `status`: string (present, absent, late, half_day, on_leave)

### POST /attendance/clock-in
Clock in for the day.

**Request:**
```json
{
    "notes": "Working from office"
}
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "attendance_date": "2025-12-17",
        "clock_in_time": "2025-12-17T09:05:00",
        "status": "present"
    },
    "message": "Clocked in successfully"
}
```

### POST /attendance/clock-out
Clock out for the day.

### GET /attendance-regularizations
### POST /attendance-regularizations

**Request:**
```json
{
    "attendance_record_id": 1,
    "reason": "Forgot to clock out",
    "requested_clock_out": "2025-12-16T18:00:00"
}
```

### PATCH /attendance-regularizations/{id}/approve
### PATCH /attendance-regularizations/{id}/reject

---

## 28. Payroll Management Endpoints

### GET /salary-components
### POST /salary-components

**Request:**
```json
{
    "name": "House Rent Allowance",
    "component_type": "earning",
    "calculation_type": "percentage",
    "percentage": 40,
    "is_taxable": true,
    "is_mandatory": false
}
```

### GET /employee-salaries
### POST /employee-salaries

**Request:**
```json
{
    "employee_id": 1,
    "base_salary": 100000,
    "effective_date": "2025-01-01",
    "components": [
        {"salary_component_id": 1, "amount": 15000},
        {"salary_component_id": 2, "amount": 40000}
    ]
}
```

### GET /payroll-runs
### POST /payroll-runs

**Request:**
```json
{
    "period_month": 12,
    "period_year": 2025
}
```

### POST /payroll-runs/{id}/process
Process payroll and generate payslips.

### GET /payslips
List payslips.

**Query Parameters:**
- `employee_id`: integer
- `payroll_run_id`: integer
- `period_month`: integer
- `period_year`: integer

### GET /payslips/{id}
Get payslip details.

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "employee": {
            "id": 1,
            "name": "Rahul Sharma",
            "employee_id": "EMP001"
        },
        "period": "December 2025",
        "base_salary": 100000,
        "earnings": {
            "Basic Salary": 100000,
            "House Rent Allowance": 40000,
            "Dearness Allowance": 15000,
            "Special Allowance": 10000
        },
        "total_earnings": 165000,
        "deductions": {
            "Provident Fund": 12000,
            "Professional Tax": 200,
            "Income Tax": 15000
        },
        "total_deductions": 27200,
        "net_pay": 137800
    }
}
```

### GET /payslips/{id}/download
Download payslip as PDF.

### POST /payslips/{id}/send
Email payslip to employee.

---

## 29. Settings Endpoints

### GET /settings
Get all settings.

### PUT /settings
Update settings.

**Request:**
```json
{
    "default_language": "en",
    "date_format": "Y-m-d",
    "time_format": "H:i",
    "timezone": "Asia/Kolkata"
}
```

### POST /settings/logo
Upload company logo.

### GET /currencies
### POST /currencies

---

## 30. Media Library Endpoints

### GET /media/directories
### POST /media/directories

**Request:**
```json
{
    "name": "HR Documents",
    "parent_id": null
}
```

### GET /media/files
### POST /media/files

**Request (multipart/form-data):**
```
directory_id: 1
file: [file upload]
```

### GET /media/files/{id}/download
### DELETE /media/files/{id}

---

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "An error occurred. Please try again later."
}
```

---

## Postman Collection Structure

```
WorkDo HRM API
├── Auth
│   ├── Login
│   ├── Logout
│   ├── Forgot Password
│   ├── Reset Password
│   └── Get Current User
├── Dashboard
│   └── Get Dashboard Stats
├── Users
│   ├── List Users
│   ├── Create User
│   ├── Get User
│   ├── Update User
│   ├── Delete User
│   └── Reset Password
├── Roles
│   ├── List Roles
│   ├── Create Role
│   ├── Get Role
│   ├── Update Role
│   ├── Delete Role
│   └── Get Permissions
├── Branches
│   └── [CRUD Operations]
├── Departments
│   └── [CRUD Operations]
├── Designations
│   └── [CRUD Operations]
├── Employees
│   └── [CRUD Operations + Profile]
├── Awards
│   ├── Award Types [CRUD]
│   └── Awards [CRUD]
├── Promotions
│   └── [CRUD + Approve/Reject]
├── Performance
│   ├── Indicator Categories [CRUD]
│   ├── Indicators [CRUD]
│   ├── Goal Types [CRUD]
│   ├── Employee Goals [CRUD + Progress]
│   ├── Review Cycles [CRUD]
│   └── Employee Reviews [CRUD]
├── Resignations
│   └── [CRUD + Approve/Reject]
├── Terminations
│   └── [CRUD + Complete]
├── Warnings
│   └── [CRUD + Issue]
├── Trips
│   └── [CRUD + Expenses]
├── Complaints
│   └── [CRUD + Assign/Resolve]
├── Transfers
│   └── [CRUD + Approve/Reject]
├── Holidays
│   └── [CRUD + Calendar + Export]
├── Announcements
│   └── [CRUD]
├── Assets
│   ├── Asset Types [CRUD]
│   ├── Assets [CRUD + Assign]
│   ├── Dashboard
│   └── Depreciation Report
├── Training
│   ├── Training Types [CRUD]
│   ├── Training Programs [CRUD]
│   ├── Training Sessions [CRUD]
│   └── Employee Trainings [CRUD + Complete]
├── Recruitment
│   ├── Job Categories [CRUD]
│   ├── Job Types [CRUD]
│   ├── Job Locations [CRUD]
│   ├── Job Requisitions [CRUD + Approve]
│   ├── Job Postings [CRUD + Publish]
│   ├── Candidate Sources [CRUD]
│   ├── Candidates [CRUD + Status]
│   ├── Interview Types [CRUD]
│   ├── Interview Rounds [CRUD]
│   ├── Interviews [CRUD + Complete]
│   ├── Interview Feedback [CRUD]
│   ├── Candidate Assessments [CRUD]
│   ├── Offer Templates [CRUD]
│   ├── Offers [CRUD + Send/Accept]
│   └── Onboarding Checklists [CRUD]
├── Contracts
│   ├── Contract Types [CRUD]
│   ├── Employee Contracts [CRUD]
│   └── Contract Renewals [CRUD + Approve]
├── Documents
│   ├── Document Categories [CRUD]
│   ├── HR Documents [CRUD + Download]
│   └── Acknowledgments
├── Meetings
│   ├── Meeting Types [CRUD]
│   ├── Meeting Rooms [CRUD]
│   ├── Meetings [CRUD + Actions]
│   ├── Meeting Minutes [CRUD]
│   └── Action Items [CRUD + Complete]
├── Leave
│   ├── Leave Types [CRUD]
│   ├── Leave Policies [CRUD]
│   ├── Leave Applications [CRUD + Approve]
│   └── Leave Balances
├── Attendance
│   ├── Shifts [CRUD]
│   ├── Attendance Policies [CRUD]
│   ├── Attendance Records
│   ├── Clock In/Out
│   └── Regularizations [CRUD + Approve]
├── Payroll
│   ├── Salary Components [CRUD]
│   ├── Employee Salaries [CRUD]
│   ├── Payroll Runs [CRUD + Process]
│   └── Payslips [List + Download + Send]
├── Settings
│   ├── Get Settings
│   ├── Update Settings
│   └── Upload Logo
├── Currencies
│   └── [CRUD]
└── Media Library
    ├── Directories [CRUD]
    └── Files [CRUD + Download]
```

---

## Environment Variables (Postman)

```
{{base_url}} = http://localhost:8000/api/v1
{{token}} = Bearer token from login
{{company_id}} = 1
```

---

## Next Steps
- See `04-FRONTEND-COMPONENTS.md` for React component structure
- See `05-BACKEND-IMPLEMENTATION.md` for Laravel/Spatie implementation guide
- See `06-FRONTEND-IMPLEMENTATION.md` for React implementation guide
