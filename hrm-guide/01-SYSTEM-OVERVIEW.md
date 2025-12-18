# WorkDo HRM System - Complete Implementation Guide

## Table of Contents
1. System Overview
2. Technology Stack
3. User Roles and Permissions
4. Module Overview
5. Database Schema
6. API Endpoints
7. Frontend Components
8. Implementation Guide

---

## 1. System Overview

WorkDo HRM is a comprehensive Human Resource Management System that provides end-to-end HR solutions including employee management, recruitment, payroll, attendance tracking, leave management, performance reviews, and more.

### Key Features
- **Multi-tenant Architecture**: Support for multiple companies/organizations
- **Role-Based Access Control (RBAC)**: 581 granular permissions across all modules
- **Multi-language Support**: English, Spanish, Arabic, Danish, German, French
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Demo Credentials
- **Company (Admin)**: company@example.com
- **HR**: hr@example.com
- **Employee**: employee@example.com

---

## 2. Technology Stack

### Backend (Recommended)
- **Framework**: Laravel 10.x
- **PHP Version**: 8.1+
- **Database**: MySQL 8.0+ / PostgreSQL 14+
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Laravel Permission
- **File Storage**: Laravel Storage (S3 compatible)
- **Queue**: Laravel Queue with Redis
- **Cache**: Redis

### Frontend (Recommended)
- **Framework**: React 18.x
- **State Management**: Redux Toolkit / Zustand
- **UI Library**: Tailwind CSS + Headless UI
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Charts**: Chart.js / Recharts
- **Date Handling**: Day.js
- **Icons**: Heroicons / Lucide React

---

## 3. User Roles and Permissions

### Role Hierarchy

```
Company (Admin)
    |
    +-- HR (Manager)
    |       |
    |       +-- Employee
    |
    +-- Manager
            |
            +-- Employee
```

### Role Comparison

| Feature | Company | HR | Employee |
|---------|---------|-----|----------|
| Dashboard | Full Analytics | HR Analytics | Self-Service |
| Staff Management | Full CRUD | View Only | No Access |
| Role Management | Full CRUD | No Access | No Access |
| HR Management | Full CRUD | Full CRUD | View Own |
| Recruitment | Full CRUD | Full CRUD | View Jobs |
| Contract Management | Full CRUD | Full CRUD | View Own |
| Document Management | Full CRUD | Full CRUD | View/Download |
| Meetings | Full CRUD | Full CRUD | View Own |
| Leave Management | Full CRUD | Full CRUD | Apply/View Own |
| Attendance | Full CRUD | Full CRUD | Clock In/Out |
| Payroll | Full CRUD | Full CRUD | View Own |
| Settings | Full Access | No Access | No Access |
| Landing Page | Full CRUD | No Access | No Access |

### Permission Categories (581 Total Permissions)

1. **Dashboard** (1 permission): view_dashboard
2. **Users** (9 permissions): view, create, edit, delete, export, import, reset_password, activate, deactivate
3. **Roles** (7 permissions): view, create, edit, delete, assign, revoke, view_permissions
4. **Media** (8 permissions): view, upload, download, delete, create_directory, rename, move, share
5. **Branches** (8 permissions): view, create, edit, delete, activate, deactivate, export, import
6. **Departments** (8 permissions): view, create, edit, delete, activate, deactivate, export, import
7. **Designations** (8 permissions): view, create, edit, delete, activate, deactivate, export, import
8. **Document Types** (7 permissions): view, create, edit, delete, activate, deactivate, export
9. **Employees** (7 permissions): view, create, edit, delete, export, import, view_profile
10. **Award Types** (7 permissions): view, create, edit, delete, activate, deactivate, export
11. **Awards** (7 permissions): view, create, edit, delete, export, import, approve
12. **Promotions** (5+ permissions): view, create, edit, delete, approve
13. **Resignations** (9 permissions): view, create, edit, delete, approve, reject, process, export, import
14. **Terminations** (9 permissions): view, create, edit, delete, approve, process, export, import, complete
15. **Warnings** (9 permissions): view, create, edit, delete, issue, acknowledge, export, import, escalate
16. **Trips** (10 permissions): view, create, edit, delete, approve, reject, expense, reconcile, export, import
17. **Complaints** (9 permissions): view, create, edit, delete, assign, resolve, dismiss, export, import
18. **Transfers** (9 permissions): view, create, edit, delete, approve, reject, process, export, import
19. **Holidays** (7+ permissions): view, create, edit, delete, export, import, calendar_view
20. **And many more...**

---

## 4. Module Overview

### 4.1 Dashboard Module
- **Company Dashboard**: Total employees, branches, departments, attendance rate, pending leaves, active jobs, candidates, department distribution chart, hiring trend chart, candidate status chart, leave types chart
- **HR Dashboard**: Similar to Company but focused on HR metrics
- **Employee Dashboard**: Self-service portal with awards, warnings, complaints, attendance clock in/out, recent announcements, upcoming meetings

### 4.2 Staff Module
- **Users**: List, Add, Edit, View, Delete, Reset Password, Filters by Role
- **Roles**: List, Add with 581 permissions, Edit, Delete, Permission assignment

### 4.3 HR Management Module

#### 4.3.1 Branches
- Fields: Name*, Address, City, State/Province, Country, ZIP/Postal Code, Phone, Email, Status
- Features: CRUD, Search, Filters, Lock/Unlock

#### 4.3.2 Departments
- Fields: Name*, Branch*, Description, Status
- Relationships: Belongs to Branch
- Features: CRUD, Search, Filters

#### 4.3.3 Designations
- Fields: Name*, Description, Department*, Status
- Relationships: Belongs to Department (which belongs to Branch)
- Features: CRUD, Search, Filters

#### 4.3.4 Document Types
- Fields: Name*, Description, Required (toggle)
- Features: CRUD, Search, Filters

#### 4.3.5 Employees
- **Basic Information**: Full Name*, Employee ID*, Email*, Password, Phone, Date of Birth, Gender (Male/Female/Other), Profile Image
- **Employment Details**: Branch*, Department* (cascading), Designation* (cascading), Date of Joining, Employment Type (Full-time/Part-time/Contract/Internship), Employment Status (Active/Inactive), Shift, Attendance Policy
- **Contact Information**: Address Line 1, Address Line 2, City, State/Province, Country, Postal/Zip Code
- **Emergency Contact**: Name, Relationship, Phone Number
- **Banking Information**: Bank Name, Account Holder Name, Account Number, BIC/SWIFT, Bank Branch, Tax Payer ID
- **Documents**: Dynamic document entries with Document Type, File, Expiry Date

#### 4.3.6 Award Types
- Fields: Name*, Description, Status
- Features: CRUD, Search, Filters

#### 4.3.7 Awards
- Fields: Employee*, Award Type*, Award Date*, Gift, Monetary Value, Description, Certificate (file), Photo (file)
- Features: CRUD, Search, Filters

#### 4.3.8 Promotions
- Fields: Employee*, Previous Designation, New Designation*, Promotion Date*, Effective Date*, Salary Adjustment, Description, Document
- Status: Pending, Approved, Rejected
- Features: CRUD, Approval workflow

#### 4.3.9 Performance Management
- **Indicator Categories**: Name, Description, Status (e.g., Job Performance, Quality of Work, Communication Skills)
- **Indicators**: Name, Category*, Measurement Unit (Rating/Percentage/Hours), Target Value, Status
- **Goal Types**: Name, Description, Status (e.g., Compliance Goals, Leadership Goals, Innovation Goals)
- **Employee Goals**: Title, Employee*, Goal Type*, Start Date, End Date, Progress (%), Status
- **Review Cycles**: Name, Frequency (Monthly/Quarterly/Semi-Annual/Annual), Description, Status
- **Employee Reviews**: Employee*, Reviewer*, Review Cycle*, Review Date, Rating, Status (Scheduled/In Progress/Completed)

#### 4.3.10 Resignations
- Fields: Employee*, Resignation Date*, Last Working Day*, Notice Period, Reason, Description, Document
- Status: Pending, Rejected, Completed
- Features: CRUD, Approval workflow

#### 4.3.11 Terminations
- Fields: Employee*, Type (retirement, etc.), Termination Date*, Notice Date, Reason, Description, Document
- Status: In progress, Completed
- Features: CRUD, Process workflow

#### 4.3.12 Warnings
- Fields: Employee*, Subject*, Type (performance/attendance/conduct), Severity (Written/Final), Date*, Description, Improvement Plan (Yes/No), Document
- Status: Draft, Issued
- Features: CRUD, Issue workflow

#### 4.3.13 Trips
- Fields: Employee*, Purpose*, Destination*, Start Date*, End Date*, Description, Advance Amount
- Status: Planned, Ongoing, Cancelled
- Advance Status: Requested, Approved, Reconciled
- Features: CRUD, Expense tracking

#### 4.3.14 Complaints
- Fields: Complainant (can be Anonymous), Against (Employee or -), Type (Discrimination/Harassment/Management Issues/Workplace Conditions), Subject*, Date*, Description, Document, Assigned To
- Status: Submitted, Resolved, Dismissed
- Features: CRUD, Anonymous reporting, Assignment

#### 4.3.15 Transfers
- Fields: Employee*, Transfer Type (Branch/Department/Designation), From*, To*, Transfer Date*, Effective Date*, Reason, Document
- Status: Pending, Approved
- Features: CRUD, Approval workflow

#### 4.3.16 Holidays
- Fields: Name*, Date*, Category (National/Religious/Company), Branches (multi-select), Type (Recurring/Paid), Description
- Features: CRUD, Calendar View, Export PDF, Export iCal

#### 4.3.17 Announcements
- Fields: Title*, Category (Company News/Policy Updates/HR Updates/Benefits), Start Date*, End Date*, Audience (Company-wide/Departments), Content, Attachments, Featured (toggle), High Priority (toggle)
- Status: Active, Expired
- Features: CRUD, Dashboard View, Analytics

#### 4.3.18 Asset Management
- **Asset Types**: Name, Description (e.g., Computer Hardware, Furniture, Mobile Devices, Network Equipment, Vehicles)
- **Assets**: Name*, Asset Type*, Asset Code*, Status (Available/Assigned/Under Maintenance), Assigned To, Purchase Date, Purchase Cost, Location, Depreciation Method
- **Dashboard**: Total Assets, Available, Assigned, Under Maintenance, Total Purchase Value, Current Value, Total Depreciation
- **Depreciation Report**: Asset details with purchase cost, current value, depreciation percentage

#### 4.3.19 Training Management
- **Training Types**: Name, Description, Departments (multi-select)
- **Training Programs**: Name*, Training Type*, Status (Draft/Active), Duration, Cost, Capacity, Self-Enrollment (toggle), Mandatory (toggle)
- **Training Sessions**: Program*, Date & Time, Location (Virtual/Physical), Status (Scheduled/In Progress/Completed), Trainers (multi-select)
- **Employee Training**: Employee*, Training Program*, Status (Assigned/In Progress/Completed), Assigned Date, Completion Date, Score, Result (Passed/Failed), Assessments

### 4.4 Recruitment Module (ATS)

#### 4.4.1 Job Categories
- Fields: Name*, Description, Status
- Examples: Administrative and Support, Research and Development, Legal and Compliance

#### 4.4.2 Job Requisitions
- Fields: Code (auto-generated REQ-YYYY-XXXX), Title*, Category*, Department*, Positions*, Priority (High/Medium/Low), Description
- Status: Approved, On Hold, Rejected
- Features: CRUD, Approval workflow

#### 4.4.3 Job Types
- Fields: Name*, Description, Status
- Examples: Full-time, Part-time, Contract, Internship, Freelance, Temporary, Remote, Hybrid

#### 4.4.4 Job Locations
- Fields: Name*, Address, Type (Remote/On-site), Status
- Examples: Head Office - Mumbai, Remote Work - Global

#### 4.4.5 Job Postings
- Fields: Code (auto-generated JOB-YYYY-XXXX), Title*, Type*, Location*, Salary Range (Min-Max), Description, Requirements, Benefits, Published (toggle), Featured (toggle), Deadline
- Status: Draft, Published, Closed
- Features: CRUD, Publish/Unpublish

#### 4.4.6 Candidate Sources
- Fields: Name*, Description, Status
- Examples: Company Website, LinkedIn, Naukri.com, Indeed, Employee Referral, Recruitment Agency, Campus Recruitment, Walk-in Interview

#### 4.4.7 Candidates
- Fields: Name*, Email*, Phone, Job*, Source*, Experience (years), Expected Salary, Resume (file), Cover Letter
- Status: New, Screening, Interview, Offer, Hired, Rejected
- Features: CRUD, Status workflow, Filters

#### 4.4.8 Interview Types
- Fields: Name*, Description, Status
- Examples: Phone Screening, Video Interview, Technical Interview, Behavioral Interview, Panel Interview, HR Interview, Case Study Interview

#### 4.4.9 Interview Rounds
- Fields: Job*, Sequence*, Name*, Description, Status
- Example: Phone Screening (1) -> Technical Assessment (2) -> Technical Interview (3) -> Final Interview (4)

#### 4.4.10 Interviews
- Fields: Candidate*, Round*, Type*, Date & Time*, Duration, Location, Interviewers (multi-select)
- Status: Scheduled, Completed, Cancelled
- Features: CRUD, Calendar integration

#### 4.4.11 Interview Feedback
- Fields: Candidate*, Round*, Interviewer*, Overall Rating (1-5 stars), Recommendation (Reject/Maybe/Strong Hire), Comments
- Features: CRUD, Rating system

#### 4.4.12 Candidate Assessments
- Fields: Candidate*, Assessment Type*, Score (out of 100), Status (Pass/Pending/Fail), Conducted By, Date
- Assessment Types: Personality, Communication, Aptitude, Technical, Logical Reasoning, Presentation, Group Discussion, Case Study

#### 4.4.13 Offer Templates
- Fields: Name*, Content (with template variables), Variables (candidate_name, job_title, company_name, etc.)
- Examples: Standard Full-Time Offer, Contract Position Offer, Senior Management Offer, Internship Offer

#### 4.4.14 Offers
- Fields: Candidate*, Template*, Salary (Base + Bonus), Start Date*, Expires*, Offer Date
- Status: Draft, Sent, Accepted, Rejected, Expired
- Features: CRUD, Send offer, Track acceptance

#### 4.4.15 Onboarding Checklists
- Fields: Name*, Description, Items (dynamic list), Status
- Examples: Standard Employee Onboarding (8 items), Finance Department Onboarding, Remote Employee Onboarding

### 4.5 Contract Management Module

#### 4.5.1 Contract Types
- Fields: Name*, Description, Duration (Permanent/Fixed months), Probation Period, Notice Period, Renewable (toggle)
- Examples: Permanent Full-time, Fixed-term Contract, Part-time Contract

#### 4.5.2 Employee Contracts
- Fields: Contract # (auto-generated EMP-YYYY-XXXX), Employee*, Contract Type*, Start Date*, End Date (for fixed-term), Base Salary*, Allowances (dynamic), Status
- Status: Active, Expired, Terminated
- Features: CRUD, Approval workflow

#### 4.5.3 Contract Renewals
- Fields: Renewal # (auto-generated REN-YYYY-XXXX), Original Contract*, New Period*, New Compensation*, Requested By
- Status: Pending, Processed, Approved
- Features: CRUD, Approval workflow

#### 4.5.4 Contract Templates
- Fields: Name*, Content (with template variables), Variables
- Features: CRUD, Template management

### 4.6 Document Management Module

#### 4.6.1 Document Categories
- Fields: Name*, Description, Icon, Order, Type (Mandatory/Optional), Status
- Examples: Identity Documents, Educational Certificates, Employment Documents, Financial Documents

#### 4.6.2 HR Documents
- Fields: Name*, Category*, File*, Version, Status (Published/Expired), Expires, Description
- Features: CRUD, Version control, Download tracking

#### 4.6.3 Acknowledgments
- Track employee acknowledgment of documents

#### 4.6.4 Document Templates
- Reusable document templates

### 4.7 Meetings Module

#### 4.7.1 Meeting Types
- Fields: Name*, Description, Default Duration, Color, Status
- Examples: Brainstorming, Performance Review, All Hands, Project

#### 4.7.2 Meeting Rooms
- Fields: Name*, Location, Capacity, Amenities, Status

#### 4.7.3 Meetings
- Fields: Title*, Type*, Room/Location, Date & Time*, Duration, Attendees (multi-select), Agenda, Status
- Status: Scheduled, In Progress, Completed, Cancelled

#### 4.7.4 Meeting Attendees
- Track attendance and responses

#### 4.7.5 Meeting Minutes
- Fields: Meeting*, Content, Recorded By, Date

#### 4.7.6 Action Items
- Fields: Meeting*, Title*, Assigned To*, Due Date*, Status (Pending/In Progress/Completed)

### 4.8 Leave Management Module

#### 4.8.1 Leave Types
- Fields: Name*, Description, Max Days/Year*, Type (Paid/Unpaid), Color, Status
- Examples: Annual Leave (21 days), Sick Leave (10 days), Maternity Leave (90 days), Paternity Leave (15 days), Emergency Leave (5 days), Compassionate Leave, Marriage Leave, Personal Leave, Study Leave, Bereavement Leave

#### 4.8.2 Leave Policies
- Fields: Name*, Leave Types (with allocations), Applicable To (Departments/Designations), Carry Forward (toggle), Max Carry Forward Days

#### 4.8.3 Leave Applications
- Fields: Employee*, Leave Type*, Start Date*, End Date*, Reason, Status
- Status: Pending, Approved, Rejected
- Features: CRUD, Approval workflow, Calendar view

#### 4.8.4 Leave Balances
- Track remaining leave balances per employee per leave type

### 4.9 Attendance Management Module

#### 4.9.1 Shifts
- Fields: Name*, Start Time*, End Time*, Break Duration, Working Hours, Grace Period, Type (Day/Night), Status
- Examples: Morning Shift (09:00-18:00), Evening Shift (14:00-23:00), Night Shift (22:00-07:00)

#### 4.9.2 Attendance Policies
- Fields: Name*, Shifts (multi-select), Late Threshold, Early Leave Threshold, Overtime Rules

#### 4.9.3 Attendance Records
- Fields: Employee*, Date*, Clock In Time, Clock Out Time, Status (Present/Absent/Late/Half Day), Overtime Hours

#### 4.9.4 Attendance Regularization
- Fields: Employee*, Date*, Reason*, Status (Pending/Approved/Rejected)

### 4.10 Time Tracking Module
- Track time spent on projects/tasks
- Timesheet management
- Overtime tracking

### 4.11 Payroll Management Module

#### 4.11.1 Salary Components
- Fields: Name*, Type (Earning/Deduction), Calculation (Percentage/Fixed), Amount/Percentage*, Taxable (toggle), Mandatory (toggle), Status
- Examples: 
  - Earnings: Dearness Allowance (15%), House Rent Allowance (40%), Medical Allowance ($1,500), Special Allowance ($3,000), Transport Allowance ($2,000)
  - Deductions: Employee State Insurance (0.75%), Provident Fund, Professional Tax

#### 4.11.2 Employee Salaries
- Fields: Employee*, Base Salary*, Components (dynamic), Effective Date

#### 4.11.3 Payroll Runs
- Fields: Period (Month/Year), Status (Draft/Processing/Completed), Run Date
- Features: Generate payslips, Approve, Process payments

#### 4.11.4 Payslips
- Fields: Employee*, Period*, Earnings (itemized), Deductions (itemized), Net Pay, Status
- Features: View, Download PDF, Email

### 4.12 Settings Module

#### 4.12.1 System Settings
- Default Language, Date Format, Time Format, Default Timezone

#### 4.12.2 Brand Settings
- Logo (Dark/Light), Company Name, Theme (colors)

#### 4.12.3 Currency Settings
- Default Currency, Currency Symbol, Decimal Places

#### 4.12.4 Email Settings
- SMTP Configuration, Email Templates

#### 4.12.5 Storage Settings
- File Storage Driver (Local/S3), Max File Size

#### 4.12.6 ReCaptcha Settings
- Site Key, Secret Key, Enable/Disable

#### 4.12.7 Chat GPT Settings
- API Key, Model Selection

#### 4.12.8 Cookie Settings
- Cookie Consent, Privacy Policy

#### 4.12.9 SEO Settings
- Meta Title, Meta Description, Keywords

#### 4.12.10 Cache Settings
- Cache Driver, Cache TTL

### 4.13 Landing Page Module
- Hero Section, Features, Testimonials, FAQ, Contact, Footer, Newsletter

### 4.14 Calendar Module
- Integrated calendar view for holidays, meetings, leaves, events

### 4.15 Media Library Module
- File management with directories, upload, download, share

### 4.16 Currencies Module
- Manage multiple currencies for international operations

---

## Next Steps
- See `02-DATABASE-SCHEMA.md` for complete database design
- See `03-API-ENDPOINTS.md` for Postman guide
- See `04-FRONTEND-COMPONENTS.md` for React component structure
- See `05-BACKEND-IMPLEMENTATION.md` for Laravel/Spatie guide
- See `06-FRONTEND-IMPLEMENTATION.md` for React guide
