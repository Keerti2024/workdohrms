# WorkDo HRM - Complete Permissions List (581 Permissions)

This document contains the complete list of all 581 permissions in the WorkDo HRM system, organized by module. Each permission follows the naming convention: `action_resource` (e.g., `view_employees`, `create_leave`, `approve_payroll`).

---

## Table of Contents
1. [Dashboard Permissions (5)](#1-dashboard-permissions-5)
2. [User Management Permissions (12)](#2-user-management-permissions-12)
3. [Role Management Permissions (8)](#3-role-management-permissions-8)
4. [Branch Management Permissions (10)](#4-branch-management-permissions-10)
5. [Department Management Permissions (10)](#5-department-management-permissions-10)
6. [Designation Management Permissions (10)](#6-designation-management-permissions-10)
7. [Employee Management Permissions (25)](#7-employee-management-permissions-25)
8. [Document Type Management Permissions (8)](#8-document-type-management-permissions-8)
9. [Award Management Permissions (16)](#9-award-management-permissions-16)
10. [Promotion Management Permissions (12)](#10-promotion-management-permissions-12)
11. [Resignation Management Permissions (12)](#11-resignation-management-permissions-12)
12. [Termination Management Permissions (12)](#12-termination-management-permissions-12)
13. [Warning Management Permissions (12)](#13-warning-management-permissions-12)
14. [Trip Management Permissions (16)](#14-trip-management-permissions-16)
15. [Complaint Management Permissions (14)](#15-complaint-management-permissions-14)
16. [Transfer Management Permissions (12)](#16-transfer-management-permissions-12)
17. [Holiday Management Permissions (10)](#17-holiday-management-permissions-10)
18. [Announcement Management Permissions (10)](#18-announcement-management-permissions-10)
19. [Asset Management Permissions (20)](#19-asset-management-permissions-20)
20. [Training Management Permissions (28)](#20-training-management-permissions-28)
21. [Performance Management Permissions (24)](#21-performance-management-permissions-24)
22. [Recruitment Permissions (65)](#22-recruitment-permissions-65)
23. [Contract Management Permissions (18)](#23-contract-management-permissions-18)
24. [Document Management Permissions (16)](#24-document-management-permissions-16)
25. [Meeting Management Permissions (24)](#25-meeting-management-permissions-24)
26. [Leave Management Permissions (28)](#26-leave-management-permissions-28)
27. [Attendance Management Permissions (28)](#27-attendance-management-permissions-28)
28. [Payroll Management Permissions (40)](#28-payroll-management-permissions-40)
29. [Settings Permissions (30)](#29-settings-permissions-30)
30. [Media Library Permissions (12)](#30-media-library-permissions-12)
31. [Calendar Permissions (6)](#31-calendar-permissions-6)
32. [Currency Management Permissions (8)](#32-currency-management-permissions-8)
33. [Landing Page Permissions (10)](#33-landing-page-permissions-10)

---

## Permission Summary by Role

| Role | Total Permissions | Description |
|------|-------------------|-------------|
| Company (Admin) | 581 | All permissions - full system access |
| HR Manager | ~400 | All HR operations, limited settings |
| Manager | ~200 | Team management, approvals |
| Employee | ~50 | Self-service only |

---

## 1. Dashboard Permissions (5)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 1 | `view_dashboard` | View main dashboard | Yes | Yes | Yes | Yes |
| 2 | `view_dashboard_statistics` | View dashboard statistics cards | Yes | Yes | Yes | Yes |
| 3 | `view_dashboard_charts` | View dashboard charts | Yes | Yes | Yes | No |
| 4 | `view_company_dashboard` | View company-wide dashboard | Yes | Yes | No | No |
| 5 | `view_employee_dashboard` | View employee self-service dashboard | Yes | Yes | Yes | Yes |

---

## 2. User Management Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 6 | `view_users` | View users list | Yes | Yes | Yes | No |
| 7 | `view_user` | View single user details | Yes | Yes | Yes | No |
| 8 | `create_user` | Create new user | Yes | Yes | No | No |
| 9 | `edit_user` | Edit user details | Yes | Yes | No | No |
| 10 | `delete_user` | Delete user | Yes | No | No | No |
| 11 | `activate_user` | Activate user account | Yes | Yes | No | No |
| 12 | `deactivate_user` | Deactivate user account | Yes | Yes | No | No |
| 13 | `reset_user_password` | Reset user password | Yes | Yes | No | No |
| 14 | `impersonate_user` | Login as another user | Yes | No | No | No |
| 15 | `export_users` | Export users to file | Yes | Yes | No | No |
| 16 | `import_users` | Import users from file | Yes | Yes | No | No |
| 17 | `assign_user_role` | Assign role to user | Yes | Yes | No | No |

---

## 3. Role Management Permissions (8)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 18 | `view_roles` | View roles list | Yes | Yes | No | No |
| 19 | `view_role` | View single role details | Yes | Yes | No | No |
| 20 | `create_role` | Create new role | Yes | No | No | No |
| 21 | `edit_role` | Edit role details | Yes | No | No | No |
| 22 | `delete_role` | Delete role | Yes | No | No | No |
| 23 | `view_permissions` | View all permissions | Yes | Yes | No | No |
| 24 | `assign_role_permissions` | Assign permissions to role | Yes | No | No | No |
| 25 | `view_role_permissions` | View role permissions | Yes | Yes | No | No |

---

## 4. Branch Management Permissions (10)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 26 | `view_branches` | View branches list | Yes | Yes | Yes | Yes |
| 27 | `view_branch` | View single branch details | Yes | Yes | Yes | Yes |
| 28 | `create_branch` | Create new branch | Yes | No | No | No |
| 29 | `edit_branch` | Edit branch details | Yes | No | No | No |
| 30 | `delete_branch` | Delete branch | Yes | No | No | No |
| 31 | `activate_branch` | Activate branch | Yes | No | No | No |
| 32 | `deactivate_branch` | Deactivate branch | Yes | No | No | No |
| 33 | `export_branches` | Export branches to file | Yes | Yes | No | No |
| 34 | `import_branches` | Import branches from file | Yes | No | No | No |
| 35 | `view_branch_employees` | View employees in branch | Yes | Yes | Yes | No |

---

## 5. Department Management Permissions (10)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 36 | `view_departments` | View departments list | Yes | Yes | Yes | Yes |
| 37 | `view_department` | View single department details | Yes | Yes | Yes | Yes |
| 38 | `create_department` | Create new department | Yes | Yes | No | No |
| 39 | `edit_department` | Edit department details | Yes | Yes | No | No |
| 40 | `delete_department` | Delete department | Yes | No | No | No |
| 41 | `activate_department` | Activate department | Yes | Yes | No | No |
| 42 | `deactivate_department` | Deactivate department | Yes | Yes | No | No |
| 43 | `export_departments` | Export departments to file | Yes | Yes | No | No |
| 44 | `import_departments` | Import departments from file | Yes | Yes | No | No |
| 45 | `view_department_employees` | View employees in department | Yes | Yes | Yes | No |

---

## 6. Designation Management Permissions (10)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 46 | `view_designations` | View designations list | Yes | Yes | Yes | Yes |
| 47 | `view_designation` | View single designation details | Yes | Yes | Yes | Yes |
| 48 | `create_designation` | Create new designation | Yes | Yes | No | No |
| 49 | `edit_designation` | Edit designation details | Yes | Yes | No | No |
| 50 | `delete_designation` | Delete designation | Yes | No | No | No |
| 51 | `activate_designation` | Activate designation | Yes | Yes | No | No |
| 52 | `deactivate_designation` | Deactivate designation | Yes | Yes | No | No |
| 53 | `export_designations` | Export designations to file | Yes | Yes | No | No |
| 54 | `import_designations` | Import designations from file | Yes | Yes | No | No |
| 55 | `view_designation_employees` | View employees with designation | Yes | Yes | Yes | No |

---

## 7. Employee Management Permissions (25)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 56 | `view_employees` | View employees list | Yes | Yes | Yes | No |
| 57 | `view_employee` | View single employee details | Yes | Yes | Yes | No |
| 58 | `view_own_profile` | View own employee profile | Yes | Yes | Yes | Yes |
| 59 | `create_employee` | Create new employee | Yes | Yes | No | No |
| 60 | `edit_employee` | Edit employee details | Yes | Yes | No | No |
| 61 | `edit_own_profile` | Edit own profile | Yes | Yes | Yes | Yes |
| 62 | `delete_employee` | Delete employee | Yes | No | No | No |
| 63 | `activate_employee` | Activate employee | Yes | Yes | No | No |
| 64 | `deactivate_employee` | Deactivate employee | Yes | Yes | No | No |
| 65 | `export_employees` | Export employees to file | Yes | Yes | No | No |
| 66 | `import_employees` | Import employees from file | Yes | Yes | No | No |
| 67 | `view_employee_documents` | View employee documents | Yes | Yes | Yes | No |
| 68 | `view_own_documents` | View own documents | Yes | Yes | Yes | Yes |
| 69 | `upload_employee_document` | Upload document for employee | Yes | Yes | No | No |
| 70 | `upload_own_document` | Upload own document | Yes | Yes | Yes | Yes |
| 71 | `delete_employee_document` | Delete employee document | Yes | Yes | No | No |
| 72 | `view_employee_banking` | View employee banking info | Yes | Yes | No | No |
| 73 | `view_own_banking` | View own banking info | Yes | Yes | Yes | Yes |
| 74 | `edit_employee_banking` | Edit employee banking info | Yes | Yes | No | No |
| 75 | `edit_own_banking` | Edit own banking info | Yes | Yes | Yes | Yes |
| 76 | `view_employee_emergency_contact` | View employee emergency contact | Yes | Yes | Yes | No |
| 77 | `view_own_emergency_contact` | View own emergency contact | Yes | Yes | Yes | Yes |
| 78 | `edit_employee_emergency_contact` | Edit employee emergency contact | Yes | Yes | No | No |
| 79 | `edit_own_emergency_contact` | Edit own emergency contact | Yes | Yes | Yes | Yes |
| 80 | `view_employee_history` | View employee history/timeline | Yes | Yes | Yes | No |

---

## 8. Document Type Management Permissions (8)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 81 | `view_document_types` | View document types list | Yes | Yes | Yes | Yes |
| 82 | `view_document_type` | View single document type | Yes | Yes | Yes | Yes |
| 83 | `create_document_type` | Create new document type | Yes | Yes | No | No |
| 84 | `edit_document_type` | Edit document type | Yes | Yes | No | No |
| 85 | `delete_document_type` | Delete document type | Yes | No | No | No |
| 86 | `activate_document_type` | Activate document type | Yes | Yes | No | No |
| 87 | `deactivate_document_type` | Deactivate document type | Yes | Yes | No | No |
| 88 | `set_required_document_type` | Set document type as required | Yes | Yes | No | No |

---

## 9. Award Management Permissions (16)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 89 | `view_award_types` | View award types list | Yes | Yes | Yes | Yes |
| 90 | `view_award_type` | View single award type | Yes | Yes | Yes | Yes |
| 91 | `create_award_type` | Create new award type | Yes | Yes | No | No |
| 92 | `edit_award_type` | Edit award type | Yes | Yes | No | No |
| 93 | `delete_award_type` | Delete award type | Yes | No | No | No |
| 94 | `view_awards` | View awards list | Yes | Yes | Yes | No |
| 95 | `view_award` | View single award details | Yes | Yes | Yes | No |
| 96 | `view_own_awards` | View own awards | Yes | Yes | Yes | Yes |
| 97 | `create_award` | Create new award | Yes | Yes | Yes | No |
| 98 | `edit_award` | Edit award | Yes | Yes | No | No |
| 99 | `delete_award` | Delete award | Yes | Yes | No | No |
| 100 | `export_awards` | Export awards to file | Yes | Yes | No | No |
| 101 | `import_awards` | Import awards from file | Yes | Yes | No | No |
| 102 | `view_award_certificate` | View award certificate | Yes | Yes | Yes | Yes |
| 103 | `download_award_certificate` | Download award certificate | Yes | Yes | Yes | Yes |
| 104 | `send_award_notification` | Send award notification | Yes | Yes | Yes | No |

---

## 10. Promotion Management Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 105 | `view_promotions` | View promotions list | Yes | Yes | Yes | No |
| 106 | `view_promotion` | View single promotion details | Yes | Yes | Yes | No |
| 107 | `view_own_promotions` | View own promotions | Yes | Yes | Yes | Yes |
| 108 | `create_promotion` | Create new promotion | Yes | Yes | Yes | No |
| 109 | `edit_promotion` | Edit promotion | Yes | Yes | No | No |
| 110 | `delete_promotion` | Delete promotion | Yes | Yes | No | No |
| 111 | `approve_promotion` | Approve promotion | Yes | Yes | No | No |
| 112 | `reject_promotion` | Reject promotion | Yes | Yes | No | No |
| 113 | `export_promotions` | Export promotions to file | Yes | Yes | No | No |
| 114 | `import_promotions` | Import promotions from file | Yes | Yes | No | No |
| 115 | `view_promotion_letter` | View promotion letter | Yes | Yes | Yes | Yes |
| 116 | `download_promotion_letter` | Download promotion letter | Yes | Yes | Yes | Yes |

---

## 11. Resignation Management Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 117 | `view_resignations` | View resignations list | Yes | Yes | Yes | No |
| 118 | `view_resignation` | View single resignation details | Yes | Yes | Yes | No |
| 119 | `view_own_resignation` | View own resignation | Yes | Yes | Yes | Yes |
| 120 | `create_resignation` | Create resignation for employee | Yes | Yes | No | No |
| 121 | `submit_own_resignation` | Submit own resignation | Yes | Yes | Yes | Yes |
| 122 | `edit_resignation` | Edit resignation | Yes | Yes | No | No |
| 123 | `delete_resignation` | Delete resignation | Yes | Yes | No | No |
| 124 | `approve_resignation` | Approve resignation | Yes | Yes | No | No |
| 125 | `reject_resignation` | Reject resignation | Yes | Yes | No | No |
| 126 | `export_resignations` | Export resignations to file | Yes | Yes | No | No |
| 127 | `view_resignation_letter` | View resignation letter | Yes | Yes | Yes | Yes |
| 128 | `cancel_own_resignation` | Cancel own resignation | Yes | Yes | Yes | Yes |

---

## 12. Termination Management Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 129 | `view_terminations` | View terminations list | Yes | Yes | No | No |
| 130 | `view_termination` | View single termination details | Yes | Yes | No | No |
| 131 | `create_termination` | Create termination | Yes | Yes | No | No |
| 132 | `edit_termination` | Edit termination | Yes | Yes | No | No |
| 133 | `delete_termination` | Delete termination | Yes | No | No | No |
| 134 | `process_termination` | Process termination | Yes | Yes | No | No |
| 135 | `cancel_termination` | Cancel termination | Yes | Yes | No | No |
| 136 | `export_terminations` | Export terminations to file | Yes | Yes | No | No |
| 137 | `view_termination_letter` | View termination letter | Yes | Yes | No | No |
| 138 | `download_termination_letter` | Download termination letter | Yes | Yes | No | No |
| 139 | `send_termination_notification` | Send termination notification | Yes | Yes | No | No |
| 140 | `view_termination_clearance` | View termination clearance | Yes | Yes | No | No |

---

## 13. Warning Management Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 141 | `view_warnings` | View warnings list | Yes | Yes | Yes | No |
| 142 | `view_warning` | View single warning details | Yes | Yes | Yes | No |
| 143 | `view_own_warnings` | View own warnings | Yes | Yes | Yes | Yes |
| 144 | `create_warning` | Create warning | Yes | Yes | Yes | No |
| 145 | `edit_warning` | Edit warning | Yes | Yes | No | No |
| 146 | `delete_warning` | Delete warning | Yes | Yes | No | No |
| 147 | `acknowledge_warning` | Acknowledge warning (employee) | Yes | Yes | Yes | Yes |
| 148 | `export_warnings` | Export warnings to file | Yes | Yes | No | No |
| 149 | `view_warning_letter` | View warning letter | Yes | Yes | Yes | Yes |
| 150 | `download_warning_letter` | Download warning letter | Yes | Yes | Yes | Yes |
| 151 | `send_warning_notification` | Send warning notification | Yes | Yes | Yes | No |
| 152 | `escalate_warning` | Escalate warning | Yes | Yes | Yes | No |

---

## 14. Trip Management Permissions (16)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 153 | `view_trips` | View trips list | Yes | Yes | Yes | No |
| 154 | `view_trip` | View single trip details | Yes | Yes | Yes | No |
| 155 | `view_own_trips` | View own trips | Yes | Yes | Yes | Yes |
| 156 | `create_trip` | Create trip for employee | Yes | Yes | Yes | No |
| 157 | `request_own_trip` | Request own trip | Yes | Yes | Yes | Yes |
| 158 | `edit_trip` | Edit trip | Yes | Yes | No | No |
| 159 | `edit_own_trip` | Edit own trip (pending only) | Yes | Yes | Yes | Yes |
| 160 | `delete_trip` | Delete trip | Yes | Yes | No | No |
| 161 | `approve_trip` | Approve trip | Yes | Yes | Yes | No |
| 162 | `reject_trip` | Reject trip | Yes | Yes | Yes | No |
| 163 | `cancel_trip` | Cancel trip | Yes | Yes | Yes | No |
| 164 | `cancel_own_trip` | Cancel own trip | Yes | Yes | Yes | Yes |
| 165 | `view_trip_expenses` | View trip expenses | Yes | Yes | Yes | No |
| 166 | `add_trip_expense` | Add trip expense | Yes | Yes | Yes | Yes |
| 167 | `export_trips` | Export trips to file | Yes | Yes | No | No |
| 168 | `reimburse_trip` | Mark trip as reimbursed | Yes | Yes | No | No |

---

## 15. Complaint Management Permissions (14)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 169 | `view_complaints` | View complaints list | Yes | Yes | No | No |
| 170 | `view_complaint` | View single complaint details | Yes | Yes | No | No |
| 171 | `view_own_complaints` | View own complaints | Yes | Yes | Yes | Yes |
| 172 | `create_complaint` | Create complaint | Yes | Yes | Yes | Yes |
| 173 | `edit_complaint` | Edit complaint | Yes | Yes | No | No |
| 174 | `delete_complaint` | Delete complaint | Yes | Yes | No | No |
| 175 | `assign_complaint` | Assign complaint to investigator | Yes | Yes | No | No |
| 176 | `resolve_complaint` | Resolve complaint | Yes | Yes | No | No |
| 177 | `dismiss_complaint` | Dismiss complaint | Yes | Yes | No | No |
| 178 | `reopen_complaint` | Reopen complaint | Yes | Yes | No | No |
| 179 | `add_complaint_note` | Add note to complaint | Yes | Yes | No | No |
| 180 | `view_complaint_notes` | View complaint notes | Yes | Yes | No | No |
| 181 | `export_complaints` | Export complaints to file | Yes | Yes | No | No |
| 182 | `view_anonymous_complaints` | View anonymous complaints | Yes | Yes | No | No |

---

## 16. Transfer Management Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 183 | `view_transfers` | View transfers list | Yes | Yes | Yes | No |
| 184 | `view_transfer` | View single transfer details | Yes | Yes | Yes | No |
| 185 | `view_own_transfers` | View own transfers | Yes | Yes | Yes | Yes |
| 186 | `create_transfer` | Create transfer | Yes | Yes | Yes | No |
| 187 | `edit_transfer` | Edit transfer | Yes | Yes | No | No |
| 188 | `delete_transfer` | Delete transfer | Yes | Yes | No | No |
| 189 | `approve_transfer` | Approve transfer | Yes | Yes | No | No |
| 190 | `reject_transfer` | Reject transfer | Yes | Yes | No | No |
| 191 | `cancel_transfer` | Cancel transfer | Yes | Yes | No | No |
| 192 | `export_transfers` | Export transfers to file | Yes | Yes | No | No |
| 193 | `view_transfer_letter` | View transfer letter | Yes | Yes | Yes | Yes |
| 194 | `download_transfer_letter` | Download transfer letter | Yes | Yes | Yes | Yes |

---

## 17. Holiday Management Permissions (10)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 195 | `view_holidays` | View holidays list | Yes | Yes | Yes | Yes |
| 196 | `view_holiday` | View single holiday details | Yes | Yes | Yes | Yes |
| 197 | `create_holiday` | Create holiday | Yes | Yes | No | No |
| 198 | `edit_holiday` | Edit holiday | Yes | Yes | No | No |
| 199 | `delete_holiday` | Delete holiday | Yes | Yes | No | No |
| 200 | `export_holidays` | Export holidays to file | Yes | Yes | No | No |
| 201 | `import_holidays` | Import holidays from file | Yes | Yes | No | No |
| 202 | `view_holiday_calendar` | View holiday calendar | Yes | Yes | Yes | Yes |
| 203 | `assign_holiday_branches` | Assign holiday to branches | Yes | Yes | No | No |
| 204 | `view_upcoming_holidays` | View upcoming holidays | Yes | Yes | Yes | Yes |

---

## 18. Announcement Management Permissions (10)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 205 | `view_announcements` | View announcements list | Yes | Yes | Yes | Yes |
| 206 | `view_announcement` | View single announcement | Yes | Yes | Yes | Yes |
| 207 | `create_announcement` | Create announcement | Yes | Yes | No | No |
| 208 | `edit_announcement` | Edit announcement | Yes | Yes | No | No |
| 209 | `delete_announcement` | Delete announcement | Yes | Yes | No | No |
| 210 | `publish_announcement` | Publish announcement | Yes | Yes | No | No |
| 211 | `unpublish_announcement` | Unpublish announcement | Yes | Yes | No | No |
| 212 | `pin_announcement` | Pin announcement | Yes | Yes | No | No |
| 213 | `send_announcement_notification` | Send announcement notification | Yes | Yes | No | No |
| 214 | `view_announcement_recipients` | View announcement recipients | Yes | Yes | No | No |

---

## 19. Asset Management Permissions (20)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 215 | `view_asset_types` | View asset types list | Yes | Yes | Yes | No |
| 216 | `view_asset_type` | View single asset type | Yes | Yes | Yes | No |
| 217 | `create_asset_type` | Create asset type | Yes | Yes | No | No |
| 218 | `edit_asset_type` | Edit asset type | Yes | Yes | No | No |
| 219 | `delete_asset_type` | Delete asset type | Yes | No | No | No |
| 220 | `view_assets` | View assets list | Yes | Yes | Yes | No |
| 221 | `view_asset` | View single asset details | Yes | Yes | Yes | No |
| 222 | `view_own_assets` | View own assigned assets | Yes | Yes | Yes | Yes |
| 223 | `create_asset` | Create asset | Yes | Yes | No | No |
| 224 | `edit_asset` | Edit asset | Yes | Yes | No | No |
| 225 | `delete_asset` | Delete asset | Yes | No | No | No |
| 226 | `assign_asset` | Assign asset to employee | Yes | Yes | No | No |
| 227 | `unassign_asset` | Unassign asset from employee | Yes | Yes | No | No |
| 228 | `view_asset_history` | View asset assignment history | Yes | Yes | Yes | No |
| 229 | `export_assets` | Export assets to file | Yes | Yes | No | No |
| 230 | `import_assets` | Import assets from file | Yes | Yes | No | No |
| 231 | `mark_asset_maintenance` | Mark asset for maintenance | Yes | Yes | No | No |
| 232 | `mark_asset_retired` | Mark asset as retired | Yes | Yes | No | No |
| 233 | `view_asset_depreciation` | View asset depreciation | Yes | Yes | No | No |
| 234 | `calculate_asset_depreciation` | Calculate asset depreciation | Yes | Yes | No | No |

---

## 20. Training Management Permissions (28)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 235 | `view_training_types` | View training types list | Yes | Yes | Yes | Yes |
| 236 | `view_training_type` | View single training type | Yes | Yes | Yes | Yes |
| 237 | `create_training_type` | Create training type | Yes | Yes | No | No |
| 238 | `edit_training_type` | Edit training type | Yes | Yes | No | No |
| 239 | `delete_training_type` | Delete training type | Yes | No | No | No |
| 240 | `view_training_programs` | View training programs list | Yes | Yes | Yes | Yes |
| 241 | `view_training_program` | View single training program | Yes | Yes | Yes | Yes |
| 242 | `create_training_program` | Create training program | Yes | Yes | No | No |
| 243 | `edit_training_program` | Edit training program | Yes | Yes | No | No |
| 244 | `delete_training_program` | Delete training program | Yes | No | No | No |
| 245 | `publish_training_program` | Publish training program | Yes | Yes | No | No |
| 246 | `view_training_sessions` | View training sessions list | Yes | Yes | Yes | Yes |
| 247 | `view_training_session` | View single training session | Yes | Yes | Yes | Yes |
| 248 | `create_training_session` | Create training session | Yes | Yes | No | No |
| 249 | `edit_training_session` | Edit training session | Yes | Yes | No | No |
| 250 | `delete_training_session` | Delete training session | Yes | Yes | No | No |
| 251 | `view_employee_trainings` | View employee trainings | Yes | Yes | Yes | No |
| 252 | `view_own_trainings` | View own trainings | Yes | Yes | Yes | Yes |
| 253 | `enroll_employee_training` | Enroll employee in training | Yes | Yes | Yes | No |
| 254 | `enroll_own_training` | Enroll self in training | Yes | Yes | Yes | Yes |
| 255 | `unenroll_employee_training` | Unenroll employee from training | Yes | Yes | No | No |
| 256 | `mark_training_attendance` | Mark training attendance | Yes | Yes | No | No |
| 257 | `record_training_score` | Record training assessment score | Yes | Yes | No | No |
| 258 | `complete_training` | Mark training as complete | Yes | Yes | No | No |
| 259 | `view_training_certificate` | View training certificate | Yes | Yes | Yes | Yes |
| 260 | `download_training_certificate` | Download training certificate | Yes | Yes | Yes | Yes |
| 261 | `export_trainings` | Export trainings to file | Yes | Yes | No | No |
| 262 | `view_training_reports` | View training reports | Yes | Yes | Yes | No |

---

## 21. Performance Management Permissions (24)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 263 | `view_performance_indicators` | View performance indicators | Yes | Yes | Yes | No |
| 264 | `view_performance_indicator` | View single indicator | Yes | Yes | Yes | No |
| 265 | `create_performance_indicator` | Create performance indicator | Yes | Yes | No | No |
| 266 | `edit_performance_indicator` | Edit performance indicator | Yes | Yes | No | No |
| 267 | `delete_performance_indicator` | Delete performance indicator | Yes | No | No | No |
| 268 | `view_employee_goals` | View employee goals | Yes | Yes | Yes | No |
| 269 | `view_own_goals` | View own goals | Yes | Yes | Yes | Yes |
| 270 | `create_employee_goal` | Create goal for employee | Yes | Yes | Yes | No |
| 271 | `create_own_goal` | Create own goal | Yes | Yes | Yes | Yes |
| 272 | `edit_employee_goal` | Edit employee goal | Yes | Yes | Yes | No |
| 273 | `edit_own_goal` | Edit own goal | Yes | Yes | Yes | Yes |
| 274 | `delete_employee_goal` | Delete employee goal | Yes | Yes | No | No |
| 275 | `complete_goal` | Mark goal as complete | Yes | Yes | Yes | Yes |
| 276 | `verify_goal` | Verify goal completion | Yes | Yes | Yes | No |
| 277 | `view_performance_reviews` | View performance reviews | Yes | Yes | Yes | No |
| 278 | `view_own_reviews` | View own performance reviews | Yes | Yes | Yes | Yes |
| 279 | `create_performance_review` | Create performance review | Yes | Yes | Yes | No |
| 280 | `edit_performance_review` | Edit performance review | Yes | Yes | Yes | No |
| 281 | `delete_performance_review` | Delete performance review | Yes | Yes | No | No |
| 282 | `submit_self_assessment` | Submit self assessment | Yes | Yes | Yes | Yes |
| 283 | `submit_manager_review` | Submit manager review | Yes | Yes | Yes | No |
| 284 | `finalize_review` | Finalize performance review | Yes | Yes | No | No |
| 285 | `export_performance_reviews` | Export reviews to file | Yes | Yes | No | No |
| 286 | `view_performance_reports` | View performance reports | Yes | Yes | Yes | No |

---

## 22. Recruitment Permissions (65)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 287 | `view_job_categories` | View job categories | Yes | Yes | Yes | No |
| 288 | `create_job_category` | Create job category | Yes | Yes | No | No |
| 289 | `edit_job_category` | Edit job category | Yes | Yes | No | No |
| 290 | `delete_job_category` | Delete job category | Yes | No | No | No |
| 291 | `view_job_types` | View job types | Yes | Yes | Yes | No |
| 292 | `create_job_type` | Create job type | Yes | Yes | No | No |
| 293 | `edit_job_type` | Edit job type | Yes | Yes | No | No |
| 294 | `delete_job_type` | Delete job type | Yes | No | No | No |
| 295 | `view_job_locations` | View job locations | Yes | Yes | Yes | No |
| 296 | `create_job_location` | Create job location | Yes | Yes | No | No |
| 297 | `edit_job_location` | Edit job location | Yes | Yes | No | No |
| 298 | `delete_job_location` | Delete job location | Yes | No | No | No |
| 299 | `view_job_requisitions` | View job requisitions | Yes | Yes | Yes | No |
| 300 | `create_job_requisition` | Create job requisition | Yes | Yes | Yes | No |
| 301 | `edit_job_requisition` | Edit job requisition | Yes | Yes | No | No |
| 302 | `delete_job_requisition` | Delete job requisition | Yes | Yes | No | No |
| 303 | `approve_job_requisition` | Approve job requisition | Yes | Yes | No | No |
| 304 | `reject_job_requisition` | Reject job requisition | Yes | Yes | No | No |
| 305 | `view_job_postings` | View job postings | Yes | Yes | Yes | No |
| 306 | `view_job_posting` | View single job posting | Yes | Yes | Yes | No |
| 307 | `create_job_posting` | Create job posting | Yes | Yes | No | No |
| 308 | `edit_job_posting` | Edit job posting | Yes | Yes | No | No |
| 309 | `delete_job_posting` | Delete job posting | Yes | Yes | No | No |
| 310 | `publish_job_posting` | Publish job posting | Yes | Yes | No | No |
| 311 | `unpublish_job_posting` | Unpublish job posting | Yes | Yes | No | No |
| 312 | `close_job_posting` | Close job posting | Yes | Yes | No | No |
| 313 | `feature_job_posting` | Feature job posting | Yes | Yes | No | No |
| 314 | `view_candidate_sources` | View candidate sources | Yes | Yes | No | No |
| 315 | `create_candidate_source` | Create candidate source | Yes | Yes | No | No |
| 316 | `edit_candidate_source` | Edit candidate source | Yes | Yes | No | No |
| 317 | `delete_candidate_source` | Delete candidate source | Yes | No | No | No |
| 318 | `view_candidates` | View candidates list | Yes | Yes | Yes | No |
| 319 | `view_candidate` | View single candidate | Yes | Yes | Yes | No |
| 320 | `create_candidate` | Create candidate | Yes | Yes | No | No |
| 321 | `edit_candidate` | Edit candidate | Yes | Yes | No | No |
| 322 | `delete_candidate` | Delete candidate | Yes | Yes | No | No |
| 323 | `update_candidate_status` | Update candidate status | Yes | Yes | Yes | No |
| 324 | `view_candidate_resume` | View candidate resume | Yes | Yes | Yes | No |
| 325 | `download_candidate_resume` | Download candidate resume | Yes | Yes | Yes | No |
| 326 | `view_candidate_timeline` | View candidate timeline | Yes | Yes | Yes | No |
| 327 | `add_candidate_note` | Add note to candidate | Yes | Yes | Yes | No |
| 328 | `export_candidates` | Export candidates to file | Yes | Yes | No | No |
| 329 | `view_interview_types` | View interview types | Yes | Yes | Yes | No |
| 330 | `create_interview_type` | Create interview type | Yes | Yes | No | No |
| 331 | `edit_interview_type` | Edit interview type | Yes | Yes | No | No |
| 332 | `delete_interview_type` | Delete interview type | Yes | No | No | No |
| 333 | `view_interview_rounds` | View interview rounds | Yes | Yes | Yes | No |
| 334 | `create_interview_round` | Create interview round | Yes | Yes | No | No |
| 335 | `edit_interview_round` | Edit interview round | Yes | Yes | No | No |
| 336 | `delete_interview_round` | Delete interview round | Yes | No | No | No |
| 337 | `view_interviews` | View interviews list | Yes | Yes | Yes | No |
| 338 | `view_interview` | View single interview | Yes | Yes | Yes | No |
| 339 | `schedule_interview` | Schedule interview | Yes | Yes | Yes | No |
| 340 | `edit_interview` | Edit interview | Yes | Yes | No | No |
| 341 | `cancel_interview` | Cancel interview | Yes | Yes | No | No |
| 342 | `submit_interview_feedback` | Submit interview feedback | Yes | Yes | Yes | No |
| 343 | `view_interview_feedback` | View interview feedback | Yes | Yes | Yes | No |
| 344 | `view_candidate_assessments` | View candidate assessments | Yes | Yes | Yes | No |
| 345 | `create_candidate_assessment` | Create candidate assessment | Yes | Yes | No | No |
| 346 | `view_offer_templates` | View offer templates | Yes | Yes | No | No |
| 347 | `create_offer_template` | Create offer template | Yes | Yes | No | No |
| 348 | `edit_offer_template` | Edit offer template | Yes | Yes | No | No |
| 349 | `delete_offer_template` | Delete offer template | Yes | No | No | No |
| 350 | `view_offers` | View offers list | Yes | Yes | Yes | No |
| 351 | `view_offer` | View single offer | Yes | Yes | Yes | No |
| 352 | `create_offer` | Create offer | Yes | Yes | No | No |
| 353 | `edit_offer` | Edit offer | Yes | Yes | No | No |
| 354 | `delete_offer` | Delete offer | Yes | Yes | No | No |
| 355 | `send_offer` | Send offer to candidate | Yes | Yes | No | No |
| 356 | `withdraw_offer` | Withdraw offer | Yes | Yes | No | No |
| 357 | `view_onboarding_checklists` | View onboarding checklists | Yes | Yes | Yes | No |
| 358 | `create_onboarding_checklist` | Create onboarding checklist | Yes | Yes | No | No |
| 359 | `edit_onboarding_checklist` | Edit onboarding checklist | Yes | Yes | No | No |
| 360 | `delete_onboarding_checklist` | Delete onboarding checklist | Yes | No | No | No |
| 361 | `view_onboardings` | View onboardings | Yes | Yes | Yes | No |
| 362 | `start_onboarding` | Start onboarding process | Yes | Yes | No | No |
| 363 | `complete_onboarding_task` | Complete onboarding task | Yes | Yes | Yes | Yes |
| 364 | `view_recruitment_reports` | View recruitment reports | Yes | Yes | No | No |
| 365 | `view_recruitment_dashboard` | View recruitment dashboard | Yes | Yes | Yes | No |

---

## 23. Contract Management Permissions (18)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 366 | `view_contract_types` | View contract types | Yes | Yes | Yes | No |
| 367 | `create_contract_type` | Create contract type | Yes | Yes | No | No |
| 368 | `edit_contract_type` | Edit contract type | Yes | Yes | No | No |
| 369 | `delete_contract_type` | Delete contract type | Yes | No | No | No |
| 370 | `view_contracts` | View contracts list | Yes | Yes | Yes | No |
| 371 | `view_contract` | View single contract | Yes | Yes | Yes | No |
| 372 | `view_own_contract` | View own contract | Yes | Yes | Yes | Yes |
| 373 | `create_contract` | Create contract | Yes | Yes | No | No |
| 374 | `edit_contract` | Edit contract | Yes | Yes | No | No |
| 375 | `delete_contract` | Delete contract | Yes | No | No | No |
| 376 | `activate_contract` | Activate contract | Yes | Yes | No | No |
| 377 | `terminate_contract` | Terminate contract | Yes | Yes | No | No |
| 378 | `renew_contract` | Renew contract | Yes | Yes | No | No |
| 379 | `view_contract_renewals` | View contract renewals | Yes | Yes | Yes | No |
| 380 | `export_contracts` | Export contracts to file | Yes | Yes | No | No |
| 381 | `view_contract_document` | View contract document | Yes | Yes | Yes | Yes |
| 382 | `download_contract_document` | Download contract document | Yes | Yes | Yes | Yes |
| 383 | `view_expiring_contracts` | View expiring contracts | Yes | Yes | Yes | No |

---

## 24. Document Management Permissions (16)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 384 | `view_document_categories` | View document categories | Yes | Yes | Yes | Yes |
| 385 | `create_document_category` | Create document category | Yes | Yes | No | No |
| 386 | `edit_document_category` | Edit document category | Yes | Yes | No | No |
| 387 | `delete_document_category` | Delete document category | Yes | No | No | No |
| 388 | `view_hr_documents` | View HR documents | Yes | Yes | Yes | Yes |
| 389 | `view_hr_document` | View single HR document | Yes | Yes | Yes | Yes |
| 390 | `upload_hr_document` | Upload HR document | Yes | Yes | No | No |
| 391 | `edit_hr_document` | Edit HR document | Yes | Yes | No | No |
| 392 | `delete_hr_document` | Delete HR document | Yes | Yes | No | No |
| 393 | `download_hr_document` | Download HR document | Yes | Yes | Yes | Yes |
| 394 | `set_document_acknowledgment` | Set document acknowledgment required | Yes | Yes | No | No |
| 395 | `acknowledge_document` | Acknowledge document | Yes | Yes | Yes | Yes |
| 396 | `view_document_acknowledgments` | View document acknowledgments | Yes | Yes | No | No |
| 397 | `send_document_reminder` | Send document reminder | Yes | Yes | No | No |
| 398 | `view_document_versions` | View document versions | Yes | Yes | Yes | No |
| 399 | `upload_document_version` | Upload new document version | Yes | Yes | No | No |

---

## 25. Meeting Management Permissions (24)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 400 | `view_meeting_types` | View meeting types | Yes | Yes | Yes | Yes |
| 401 | `create_meeting_type` | Create meeting type | Yes | Yes | No | No |
| 402 | `edit_meeting_type` | Edit meeting type | Yes | Yes | No | No |
| 403 | `delete_meeting_type` | Delete meeting type | Yes | No | No | No |
| 404 | `view_meeting_rooms` | View meeting rooms | Yes | Yes | Yes | Yes |
| 405 | `create_meeting_room` | Create meeting room | Yes | Yes | No | No |
| 406 | `edit_meeting_room` | Edit meeting room | Yes | Yes | No | No |
| 407 | `delete_meeting_room` | Delete meeting room | Yes | No | No | No |
| 408 | `view_meetings` | View meetings list | Yes | Yes | Yes | No |
| 409 | `view_meeting` | View single meeting | Yes | Yes | Yes | No |
| 410 | `view_own_meetings` | View own meetings | Yes | Yes | Yes | Yes |
| 411 | `schedule_meeting` | Schedule meeting | Yes | Yes | Yes | No |
| 412 | `edit_meeting` | Edit meeting | Yes | Yes | Yes | No |
| 413 | `cancel_meeting` | Cancel meeting | Yes | Yes | Yes | No |
| 414 | `view_meeting_attendees` | View meeting attendees | Yes | Yes | Yes | Yes |
| 415 | `add_meeting_attendee` | Add meeting attendee | Yes | Yes | Yes | No |
| 416 | `remove_meeting_attendee` | Remove meeting attendee | Yes | Yes | Yes | No |
| 417 | `view_meeting_minutes` | View meeting minutes | Yes | Yes | Yes | Yes |
| 418 | `create_meeting_minutes` | Create meeting minutes | Yes | Yes | Yes | No |
| 419 | `edit_meeting_minutes` | Edit meeting minutes | Yes | Yes | Yes | No |
| 420 | `view_action_items` | View action items | Yes | Yes | Yes | Yes |
| 421 | `create_action_item` | Create action item | Yes | Yes | Yes | No |
| 422 | `complete_action_item` | Complete action item | Yes | Yes | Yes | Yes |
| 423 | `export_meetings` | Export meetings to file | Yes | Yes | No | No |

---

## 26. Leave Management Permissions (28)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 424 | `view_leave_types` | View leave types | Yes | Yes | Yes | Yes |
| 425 | `view_leave_type` | View single leave type | Yes | Yes | Yes | Yes |
| 426 | `create_leave_type` | Create leave type | Yes | Yes | No | No |
| 427 | `edit_leave_type` | Edit leave type | Yes | Yes | No | No |
| 428 | `delete_leave_type` | Delete leave type | Yes | No | No | No |
| 429 | `view_leave_policies` | View leave policies | Yes | Yes | No | No |
| 430 | `create_leave_policy` | Create leave policy | Yes | Yes | No | No |
| 431 | `edit_leave_policy` | Edit leave policy | Yes | Yes | No | No |
| 432 | `delete_leave_policy` | Delete leave policy | Yes | No | No | No |
| 433 | `view_leave_applications` | View leave applications | Yes | Yes | Yes | No |
| 434 | `view_leave_application` | View single leave application | Yes | Yes | Yes | No |
| 435 | `view_own_leave_applications` | View own leave applications | Yes | Yes | Yes | Yes |
| 436 | `create_leave_application` | Create leave for employee | Yes | Yes | Yes | No |
| 437 | `apply_own_leave` | Apply for own leave | Yes | Yes | Yes | Yes |
| 438 | `edit_leave_application` | Edit leave application | Yes | Yes | No | No |
| 439 | `edit_own_leave_application` | Edit own leave (pending only) | Yes | Yes | Yes | Yes |
| 440 | `delete_leave_application` | Delete leave application | Yes | Yes | No | No |
| 441 | `approve_leave` | Approve leave application | Yes | Yes | Yes | No |
| 442 | `reject_leave` | Reject leave application | Yes | Yes | Yes | No |
| 443 | `cancel_leave` | Cancel leave application | Yes | Yes | Yes | No |
| 444 | `cancel_own_leave` | Cancel own leave | Yes | Yes | Yes | Yes |
| 445 | `view_leave_balances` | View leave balances | Yes | Yes | Yes | No |
| 446 | `view_own_leave_balance` | View own leave balance | Yes | Yes | Yes | Yes |
| 447 | `adjust_leave_balance` | Adjust leave balance | Yes | Yes | No | No |
| 448 | `export_leave_applications` | Export leave applications | Yes | Yes | No | No |
| 449 | `view_leave_calendar` | View leave calendar | Yes | Yes | Yes | Yes |
| 450 | `view_leave_reports` | View leave reports | Yes | Yes | Yes | No |
| 451 | `carry_forward_leave` | Process leave carry forward | Yes | Yes | No | No |

---

## 27. Attendance Management Permissions (28)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 452 | `view_shifts` | View shifts list | Yes | Yes | Yes | Yes |
| 453 | `view_shift` | View single shift | Yes | Yes | Yes | Yes |
| 454 | `create_shift` | Create shift | Yes | Yes | No | No |
| 455 | `edit_shift` | Edit shift | Yes | Yes | No | No |
| 456 | `delete_shift` | Delete shift | Yes | No | No | No |
| 457 | `assign_employee_shift` | Assign shift to employee | Yes | Yes | No | No |
| 458 | `view_attendance_policies` | View attendance policies | Yes | Yes | No | No |
| 459 | `create_attendance_policy` | Create attendance policy | Yes | Yes | No | No |
| 460 | `edit_attendance_policy` | Edit attendance policy | Yes | Yes | No | No |
| 461 | `delete_attendance_policy` | Delete attendance policy | Yes | No | No | No |
| 462 | `view_attendance` | View attendance records | Yes | Yes | Yes | No |
| 463 | `view_attendance_record` | View single attendance record | Yes | Yes | Yes | No |
| 464 | `view_own_attendance` | View own attendance | Yes | Yes | Yes | Yes |
| 465 | `clock_in` | Clock in | Yes | Yes | Yes | Yes |
| 466 | `clock_out` | Clock out | Yes | Yes | Yes | Yes |
| 467 | `create_attendance_entry` | Create manual attendance entry | Yes | Yes | No | No |
| 468 | `edit_attendance_entry` | Edit attendance entry | Yes | Yes | No | No |
| 469 | `delete_attendance_entry` | Delete attendance entry | Yes | Yes | No | No |
| 470 | `view_regularizations` | View regularization requests | Yes | Yes | Yes | No |
| 471 | `view_own_regularizations` | View own regularizations | Yes | Yes | Yes | Yes |
| 472 | `request_regularization` | Request attendance regularization | Yes | Yes | Yes | Yes |
| 473 | `approve_regularization` | Approve regularization | Yes | Yes | Yes | No |
| 474 | `reject_regularization` | Reject regularization | Yes | Yes | Yes | No |
| 475 | `export_attendance` | Export attendance to file | Yes | Yes | No | No |
| 476 | `import_attendance` | Import attendance from file | Yes | Yes | No | No |
| 477 | `view_attendance_reports` | View attendance reports | Yes | Yes | Yes | No |
| 478 | `view_attendance_summary` | View attendance summary | Yes | Yes | Yes | No |
| 479 | `view_today_attendance` | View today's attendance status | Yes | Yes | Yes | Yes |

---

## 28. Payroll Management Permissions (40)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 480 | `view_salary_components` | View salary components | Yes | Yes | No | No |
| 481 | `view_salary_component` | View single salary component | Yes | Yes | No | No |
| 482 | `create_salary_component` | Create salary component | Yes | Yes | No | No |
| 483 | `edit_salary_component` | Edit salary component | Yes | Yes | No | No |
| 484 | `delete_salary_component` | Delete salary component | Yes | No | No | No |
| 485 | `view_employee_salaries` | View employee salaries | Yes | Yes | No | No |
| 486 | `view_employee_salary` | View single employee salary | Yes | Yes | No | No |
| 487 | `view_own_salary` | View own salary structure | Yes | Yes | Yes | Yes |
| 488 | `create_employee_salary` | Create employee salary | Yes | Yes | No | No |
| 489 | `edit_employee_salary` | Edit employee salary | Yes | Yes | No | No |
| 490 | `delete_employee_salary` | Delete employee salary | Yes | No | No | No |
| 491 | `view_salary_history` | View salary history | Yes | Yes | No | No |
| 492 | `view_own_salary_history` | View own salary history | Yes | Yes | Yes | Yes |
| 493 | `view_payroll_runs` | View payroll runs | Yes | Yes | No | No |
| 494 | `view_payroll_run` | View single payroll run | Yes | Yes | No | No |
| 495 | `create_payroll_run` | Create payroll run | Yes | Yes | No | No |
| 496 | `edit_payroll_run` | Edit payroll run | Yes | Yes | No | No |
| 497 | `delete_payroll_run` | Delete payroll run | Yes | No | No | No |
| 498 | `process_payroll` | Process payroll | Yes | Yes | No | No |
| 499 | `approve_payroll` | Approve payroll run | Yes | Yes | No | No |
| 500 | `reject_payroll` | Reject payroll run | Yes | Yes | No | No |
| 501 | `mark_payroll_paid` | Mark payroll as paid | Yes | Yes | No | No |
| 502 | `view_payslips` | View payslips | Yes | Yes | No | No |
| 503 | `view_payslip` | View single payslip | Yes | Yes | No | No |
| 504 | `view_own_payslips` | View own payslips | Yes | Yes | Yes | Yes |
| 505 | `create_payslip` | Create payslip | Yes | Yes | No | No |
| 506 | `edit_payslip` | Edit payslip | Yes | Yes | No | No |
| 507 | `delete_payslip` | Delete payslip | Yes | No | No | No |
| 508 | `download_payslip` | Download payslip PDF | Yes | Yes | No | No |
| 509 | `download_own_payslip` | Download own payslip | Yes | Yes | Yes | Yes |
| 510 | `send_payslip` | Send payslip to employee | Yes | Yes | No | No |
| 511 | `bulk_send_payslips` | Bulk send payslips | Yes | Yes | No | No |
| 512 | `export_payroll` | Export payroll to file | Yes | Yes | No | No |
| 513 | `view_payroll_reports` | View payroll reports | Yes | Yes | No | No |
| 514 | `view_tax_reports` | View tax reports | Yes | Yes | No | No |
| 515 | `generate_tax_forms` | Generate tax forms | Yes | Yes | No | No |
| 516 | `view_loan_deductions` | View loan deductions | Yes | Yes | No | No |
| 517 | `create_loan_deduction` | Create loan deduction | Yes | Yes | No | No |
| 518 | `edit_loan_deduction` | Edit loan deduction | Yes | Yes | No | No |
| 519 | `delete_loan_deduction` | Delete loan deduction | Yes | No | No | No |

---

## 29. Settings Permissions (30)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 520 | `view_settings` | View settings | Yes | Yes | No | No |
| 521 | `edit_general_settings` | Edit general settings | Yes | No | No | No |
| 522 | `view_general_settings` | View general settings | Yes | Yes | No | No |
| 523 | `edit_brand_settings` | Edit brand settings | Yes | No | No | No |
| 524 | `view_brand_settings` | View brand settings | Yes | Yes | No | No |
| 525 | `upload_company_logo` | Upload company logo | Yes | No | No | No |
| 526 | `upload_company_favicon` | Upload company favicon | Yes | No | No | No |
| 527 | `edit_email_settings` | Edit email settings | Yes | No | No | No |
| 528 | `view_email_settings` | View email settings | Yes | Yes | No | No |
| 529 | `test_email_settings` | Test email configuration | Yes | Yes | No | No |
| 530 | `edit_notification_settings` | Edit notification settings | Yes | No | No | No |
| 531 | `view_notification_settings` | View notification settings | Yes | Yes | No | No |
| 532 | `edit_leave_settings` | Edit leave settings | Yes | Yes | No | No |
| 533 | `view_leave_settings` | View leave settings | Yes | Yes | No | No |
| 534 | `edit_attendance_settings` | Edit attendance settings | Yes | Yes | No | No |
| 535 | `view_attendance_settings` | View attendance settings | Yes | Yes | No | No |
| 536 | `edit_payroll_settings` | Edit payroll settings | Yes | Yes | No | No |
| 537 | `view_payroll_settings` | View payroll settings | Yes | Yes | No | No |
| 538 | `edit_recruitment_settings` | Edit recruitment settings | Yes | Yes | No | No |
| 539 | `view_recruitment_settings` | View recruitment settings | Yes | Yes | No | No |
| 540 | `edit_security_settings` | Edit security settings | Yes | No | No | No |
| 541 | `view_security_settings` | View security settings | Yes | Yes | No | No |
| 542 | `manage_two_factor_auth` | Manage 2FA settings | Yes | No | No | No |
| 543 | `view_backup_settings` | View backup settings | Yes | No | No | No |
| 544 | `create_backup` | Create system backup | Yes | No | No | No |
| 545 | `restore_backup` | Restore from backup | Yes | No | No | No |
| 546 | `download_backup` | Download backup file | Yes | No | No | No |
| 547 | `view_audit_logs` | View audit logs | Yes | Yes | No | No |
| 548 | `export_audit_logs` | Export audit logs | Yes | No | No | No |
| 549 | `clear_cache` | Clear system cache | Yes | No | No | No |

---

## 30. Media Library Permissions (12)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 550 | `view_media_library` | View media library | Yes | Yes | Yes | No |
| 551 | `view_directories` | View directories | Yes | Yes | Yes | No |
| 552 | `create_directory` | Create directory | Yes | Yes | No | No |
| 553 | `edit_directory` | Edit directory | Yes | Yes | No | No |
| 554 | `delete_directory` | Delete directory | Yes | Yes | No | No |
| 555 | `view_files` | View files | Yes | Yes | Yes | No |
| 556 | `upload_file` | Upload file | Yes | Yes | Yes | No |
| 557 | `download_file` | Download file | Yes | Yes | Yes | No |
| 558 | `delete_file` | Delete file | Yes | Yes | No | No |
| 559 | `move_file` | Move file | Yes | Yes | No | No |
| 560 | `rename_file` | Rename file | Yes | Yes | No | No |
| 561 | `share_file` | Share file | Yes | Yes | Yes | No |

---

## 31. Calendar Permissions (6)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 562 | `view_calendar` | View calendar | Yes | Yes | Yes | Yes |
| 563 | `view_all_events` | View all calendar events | Yes | Yes | Yes | No |
| 564 | `view_own_events` | View own calendar events | Yes | Yes | Yes | Yes |
| 565 | `create_calendar_event` | Create calendar event | Yes | Yes | Yes | No |
| 566 | `edit_calendar_event` | Edit calendar event | Yes | Yes | Yes | No |
| 567 | `delete_calendar_event` | Delete calendar event | Yes | Yes | Yes | No |

---

## 32. Currency Management Permissions (8)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 568 | `view_currencies` | View currencies list | Yes | Yes | No | No |
| 569 | `view_currency` | View single currency | Yes | Yes | No | No |
| 570 | `create_currency` | Create currency | Yes | No | No | No |
| 571 | `edit_currency` | Edit currency | Yes | No | No | No |
| 572 | `delete_currency` | Delete currency | Yes | No | No | No |
| 573 | `set_default_currency` | Set default currency | Yes | No | No | No |
| 574 | `update_exchange_rates` | Update exchange rates | Yes | No | No | No |
| 575 | `view_exchange_rates` | View exchange rates | Yes | Yes | No | No |

---

## 33. Landing Page Permissions (10)

| # | Permission Key | Description | Company | HR | Manager | Employee |
|---|---------------|-------------|---------|-----|---------|----------|
| 576 | `view_landing_page_settings` | View landing page settings | Yes | No | No | No |
| 577 | `edit_landing_page_settings` | Edit landing page settings | Yes | No | No | No |
| 578 | `edit_hero_section` | Edit hero section | Yes | No | No | No |
| 579 | `edit_features_section` | Edit features section | Yes | No | No | No |
| 580 | `edit_pricing_section` | Edit pricing section | Yes | No | No | No |
| 581 | `edit_testimonials_section` | Edit testimonials section | Yes | No | No | No |

---

## Permission Seeder Code (Laravel)

```php
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
            // Dashboard (5)
            'view_dashboard',
            'view_dashboard_statistics',
            'view_dashboard_charts',
            'view_company_dashboard',
            'view_employee_dashboard',

            // User Management (12)
            'view_users',
            'view_user',
            'create_user',
            'edit_user',
            'delete_user',
            'activate_user',
            'deactivate_user',
            'reset_user_password',
            'impersonate_user',
            'export_users',
            'import_users',
            'assign_user_role',

            // Role Management (8)
            'view_roles',
            'view_role',
            'create_role',
            'edit_role',
            'delete_role',
            'view_permissions',
            'assign_role_permissions',
            'view_role_permissions',

            // Branch Management (10)
            'view_branches',
            'view_branch',
            'create_branch',
            'edit_branch',
            'delete_branch',
            'activate_branch',
            'deactivate_branch',
            'export_branches',
            'import_branches',
            'view_branch_employees',

            // Department Management (10)
            'view_departments',
            'view_department',
            'create_department',
            'edit_department',
            'delete_department',
            'activate_department',
            'deactivate_department',
            'export_departments',
            'import_departments',
            'view_department_employees',

            // Designation Management (10)
            'view_designations',
            'view_designation',
            'create_designation',
            'edit_designation',
            'delete_designation',
            'activate_designation',
            'deactivate_designation',
            'export_designations',
            'import_designations',
            'view_designation_employees',

            // Employee Management (25)
            'view_employees',
            'view_employee',
            'view_own_profile',
            'create_employee',
            'edit_employee',
            'edit_own_profile',
            'delete_employee',
            'activate_employee',
            'deactivate_employee',
            'export_employees',
            'import_employees',
            'view_employee_documents',
            'view_own_documents',
            'upload_employee_document',
            'upload_own_document',
            'delete_employee_document',
            'view_employee_banking',
            'view_own_banking',
            'edit_employee_banking',
            'edit_own_banking',
            'view_employee_emergency_contact',
            'view_own_emergency_contact',
            'edit_employee_emergency_contact',
            'edit_own_emergency_contact',
            'view_employee_history',

            // Document Type Management (8)
            'view_document_types',
            'view_document_type',
            'create_document_type',
            'edit_document_type',
            'delete_document_type',
            'activate_document_type',
            'deactivate_document_type',
            'set_required_document_type',

            // Award Management (16)
            'view_award_types',
            'view_award_type',
            'create_award_type',
            'edit_award_type',
            'delete_award_type',
            'view_awards',
            'view_award',
            'view_own_awards',
            'create_award',
            'edit_award',
            'delete_award',
            'export_awards',
            'import_awards',
            'view_award_certificate',
            'download_award_certificate',
            'send_award_notification',

            // Promotion Management (12)
            'view_promotions',
            'view_promotion',
            'view_own_promotions',
            'create_promotion',
            'edit_promotion',
            'delete_promotion',
            'approve_promotion',
            'reject_promotion',
            'export_promotions',
            'import_promotions',
            'view_promotion_letter',
            'download_promotion_letter',

            // Resignation Management (12)
            'view_resignations',
            'view_resignation',
            'view_own_resignation',
            'create_resignation',
            'submit_own_resignation',
            'edit_resignation',
            'delete_resignation',
            'approve_resignation',
            'reject_resignation',
            'export_resignations',
            'view_resignation_letter',
            'cancel_own_resignation',

            // Termination Management (12)
            'view_terminations',
            'view_termination',
            'create_termination',
            'edit_termination',
            'delete_termination',
            'process_termination',
            'cancel_termination',
            'export_terminations',
            'view_termination_letter',
            'download_termination_letter',
            'send_termination_notification',
            'view_termination_clearance',

            // Warning Management (12)
            'view_warnings',
            'view_warning',
            'view_own_warnings',
            'create_warning',
            'edit_warning',
            'delete_warning',
            'acknowledge_warning',
            'export_warnings',
            'view_warning_letter',
            'download_warning_letter',
            'send_warning_notification',
            'escalate_warning',

            // Trip Management (16)
            'view_trips',
            'view_trip',
            'view_own_trips',
            'create_trip',
            'request_own_trip',
            'edit_trip',
            'edit_own_trip',
            'delete_trip',
            'approve_trip',
            'reject_trip',
            'cancel_trip',
            'cancel_own_trip',
            'view_trip_expenses',
            'add_trip_expense',
            'export_trips',
            'reimburse_trip',

            // Complaint Management (14)
            'view_complaints',
            'view_complaint',
            'view_own_complaints',
            'create_complaint',
            'edit_complaint',
            'delete_complaint',
            'assign_complaint',
            'resolve_complaint',
            'dismiss_complaint',
            'reopen_complaint',
            'add_complaint_note',
            'view_complaint_notes',
            'export_complaints',
            'view_anonymous_complaints',

            // Transfer Management (12)
            'view_transfers',
            'view_transfer',
            'view_own_transfers',
            'create_transfer',
            'edit_transfer',
            'delete_transfer',
            'approve_transfer',
            'reject_transfer',
            'cancel_transfer',
            'export_transfers',
            'view_transfer_letter',
            'download_transfer_letter',

            // Holiday Management (10)
            'view_holidays',
            'view_holiday',
            'create_holiday',
            'edit_holiday',
            'delete_holiday',
            'export_holidays',
            'import_holidays',
            'view_holiday_calendar',
            'assign_holiday_branches',
            'view_upcoming_holidays',

            // Announcement Management (10)
            'view_announcements',
            'view_announcement',
            'create_announcement',
            'edit_announcement',
            'delete_announcement',
            'publish_announcement',
            'unpublish_announcement',
            'pin_announcement',
            'send_announcement_notification',
            'view_announcement_recipients',

            // Asset Management (20)
            'view_asset_types',
            'view_asset_type',
            'create_asset_type',
            'edit_asset_type',
            'delete_asset_type',
            'view_assets',
            'view_asset',
            'view_own_assets',
            'create_asset',
            'edit_asset',
            'delete_asset',
            'assign_asset',
            'unassign_asset',
            'view_asset_history',
            'export_assets',
            'import_assets',
            'mark_asset_maintenance',
            'mark_asset_retired',
            'view_asset_depreciation',
            'calculate_asset_depreciation',

            // Training Management (28)
            'view_training_types',
            'view_training_type',
            'create_training_type',
            'edit_training_type',
            'delete_training_type',
            'view_training_programs',
            'view_training_program',
            'create_training_program',
            'edit_training_program',
            'delete_training_program',
            'publish_training_program',
            'view_training_sessions',
            'view_training_session',
            'create_training_session',
            'edit_training_session',
            'delete_training_session',
            'view_employee_trainings',
            'view_own_trainings',
            'enroll_employee_training',
            'enroll_own_training',
            'unenroll_employee_training',
            'mark_training_attendance',
            'record_training_score',
            'complete_training',
            'view_training_certificate',
            'download_training_certificate',
            'export_trainings',
            'view_training_reports',

            // Performance Management (24)
            'view_performance_indicators',
            'view_performance_indicator',
            'create_performance_indicator',
            'edit_performance_indicator',
            'delete_performance_indicator',
            'view_employee_goals',
            'view_own_goals',
            'create_employee_goal',
            'create_own_goal',
            'edit_employee_goal',
            'edit_own_goal',
            'delete_employee_goal',
            'complete_goal',
            'verify_goal',
            'view_performance_reviews',
            'view_own_reviews',
            'create_performance_review',
            'edit_performance_review',
            'delete_performance_review',
            'submit_self_assessment',
            'submit_manager_review',
            'finalize_review',
            'export_performance_reviews',
            'view_performance_reports',

            // Recruitment (65)
            'view_job_categories',
            'create_job_category',
            'edit_job_category',
            'delete_job_category',
            'view_job_types',
            'create_job_type',
            'edit_job_type',
            'delete_job_type',
            'view_job_locations',
            'create_job_location',
            'edit_job_location',
            'delete_job_location',
            'view_job_requisitions',
            'create_job_requisition',
            'edit_job_requisition',
            'delete_job_requisition',
            'approve_job_requisition',
            'reject_job_requisition',
            'view_job_postings',
            'view_job_posting',
            'create_job_posting',
            'edit_job_posting',
            'delete_job_posting',
            'publish_job_posting',
            'unpublish_job_posting',
            'close_job_posting',
            'feature_job_posting',
            'view_candidate_sources',
            'create_candidate_source',
            'edit_candidate_source',
            'delete_candidate_source',
            'view_candidates',
            'view_candidate',
            'create_candidate',
            'edit_candidate',
            'delete_candidate',
            'update_candidate_status',
            'view_candidate_resume',
            'download_candidate_resume',
            'view_candidate_timeline',
            'add_candidate_note',
            'export_candidates',
            'view_interview_types',
            'create_interview_type',
            'edit_interview_type',
            'delete_interview_type',
            'view_interview_rounds',
            'create_interview_round',
            'edit_interview_round',
            'delete_interview_round',
            'view_interviews',
            'view_interview',
            'schedule_interview',
            'edit_interview',
            'cancel_interview',
            'submit_interview_feedback',
            'view_interview_feedback',
            'view_candidate_assessments',
            'create_candidate_assessment',
            'view_offer_templates',
            'create_offer_template',
            'edit_offer_template',
            'delete_offer_template',
            'view_offers',
            'view_offer',
            'create_offer',
            'edit_offer',
            'delete_offer',
            'send_offer',
            'withdraw_offer',
            'view_onboarding_checklists',
            'create_onboarding_checklist',
            'edit_onboarding_checklist',
            'delete_onboarding_checklist',
            'view_onboardings',
            'start_onboarding',
            'complete_onboarding_task',
            'view_recruitment_reports',
            'view_recruitment_dashboard',

            // Contract Management (18)
            'view_contract_types',
            'create_contract_type',
            'edit_contract_type',
            'delete_contract_type',
            'view_contracts',
            'view_contract',
            'view_own_contract',
            'create_contract',
            'edit_contract',
            'delete_contract',
            'activate_contract',
            'terminate_contract',
            'renew_contract',
            'view_contract_renewals',
            'export_contracts',
            'view_contract_document',
            'download_contract_document',
            'view_expiring_contracts',

            // Document Management (16)
            'view_document_categories',
            'create_document_category',
            'edit_document_category',
            'delete_document_category',
            'view_hr_documents',
            'view_hr_document',
            'upload_hr_document',
            'edit_hr_document',
            'delete_hr_document',
            'download_hr_document',
            'set_document_acknowledgment',
            'acknowledge_document',
            'view_document_acknowledgments',
            'send_document_reminder',
            'view_document_versions',
            'upload_document_version',

            // Meeting Management (24)
            'view_meeting_types',
            'create_meeting_type',
            'edit_meeting_type',
            'delete_meeting_type',
            'view_meeting_rooms',
            'create_meeting_room',
            'edit_meeting_room',
            'delete_meeting_room',
            'view_meetings',
            'view_meeting',
            'view_own_meetings',
            'schedule_meeting',
            'edit_meeting',
            'cancel_meeting',
            'view_meeting_attendees',
            'add_meeting_attendee',
            'remove_meeting_attendee',
            'view_meeting_minutes',
            'create_meeting_minutes',
            'edit_meeting_minutes',
            'view_action_items',
            'create_action_item',
            'complete_action_item',
            'export_meetings',

            // Leave Management (28)
            'view_leave_types',
            'view_leave_type',
            'create_leave_type',
            'edit_leave_type',
            'delete_leave_type',
            'view_leave_policies',
            'create_leave_policy',
            'edit_leave_policy',
            'delete_leave_policy',
            'view_leave_applications',
            'view_leave_application',
            'view_own_leave_applications',
            'create_leave_application',
            'apply_own_leave',
            'edit_leave_application',
            'edit_own_leave_application',
            'delete_leave_application',
            'approve_leave',
            'reject_leave',
            'cancel_leave',
            'cancel_own_leave',
            'view_leave_balances',
            'view_own_leave_balance',
            'adjust_leave_balance',
            'export_leave_applications',
            'view_leave_calendar',
            'view_leave_reports',
            'carry_forward_leave',

            // Attendance Management (28)
            'view_shifts',
            'view_shift',
            'create_shift',
            'edit_shift',
            'delete_shift',
            'assign_employee_shift',
            'view_attendance_policies',
            'create_attendance_policy',
            'edit_attendance_policy',
            'delete_attendance_policy',
            'view_attendance',
            'view_attendance_record',
            'view_own_attendance',
            'clock_in',
            'clock_out',
            'create_attendance_entry',
            'edit_attendance_entry',
            'delete_attendance_entry',
            'view_regularizations',
            'view_own_regularizations',
            'request_regularization',
            'approve_regularization',
            'reject_regularization',
            'export_attendance',
            'import_attendance',
            'view_attendance_reports',
            'view_attendance_summary',
            'view_today_attendance',

            // Payroll Management (40)
            'view_salary_components',
            'view_salary_component',
            'create_salary_component',
            'edit_salary_component',
            'delete_salary_component',
            'view_employee_salaries',
            'view_employee_salary',
            'view_own_salary',
            'create_employee_salary',
            'edit_employee_salary',
            'delete_employee_salary',
            'view_salary_history',
            'view_own_salary_history',
            'view_payroll_runs',
            'view_payroll_run',
            'create_payroll_run',
            'edit_payroll_run',
            'delete_payroll_run',
            'process_payroll',
            'approve_payroll',
            'reject_payroll',
            'mark_payroll_paid',
            'view_payslips',
            'view_payslip',
            'view_own_payslips',
            'create_payslip',
            'edit_payslip',
            'delete_payslip',
            'download_payslip',
            'download_own_payslip',
            'send_payslip',
            'bulk_send_payslips',
            'export_payroll',
            'view_payroll_reports',
            'view_tax_reports',
            'generate_tax_forms',
            'view_loan_deductions',
            'create_loan_deduction',
            'edit_loan_deduction',
            'delete_loan_deduction',

            // Settings (30)
            'view_settings',
            'edit_general_settings',
            'view_general_settings',
            'edit_brand_settings',
            'view_brand_settings',
            'upload_company_logo',
            'upload_company_favicon',
            'edit_email_settings',
            'view_email_settings',
            'test_email_settings',
            'edit_notification_settings',
            'view_notification_settings',
            'edit_leave_settings',
            'view_leave_settings',
            'edit_attendance_settings',
            'view_attendance_settings',
            'edit_payroll_settings',
            'view_payroll_settings',
            'edit_recruitment_settings',
            'view_recruitment_settings',
            'edit_security_settings',
            'view_security_settings',
            'manage_two_factor_auth',
            'view_backup_settings',
            'create_backup',
            'restore_backup',
            'download_backup',
            'view_audit_logs',
            'export_audit_logs',
            'clear_cache',

            // Media Library (12)
            'view_media_library',
            'view_directories',
            'create_directory',
            'edit_directory',
            'delete_directory',
            'view_files',
            'upload_file',
            'download_file',
            'delete_file',
            'move_file',
            'rename_file',
            'share_file',

            // Calendar (6)
            'view_calendar',
            'view_all_events',
            'view_own_events',
            'create_calendar_event',
            'edit_calendar_event',
            'delete_calendar_event',

            // Currency Management (8)
            'view_currencies',
            'view_currency',
            'create_currency',
            'edit_currency',
            'delete_currency',
            'set_default_currency',
            'update_exchange_rates',
            'view_exchange_rates',

            // Landing Page (6)
            'view_landing_page_settings',
            'edit_landing_page_settings',
            'edit_hero_section',
            'edit_features_section',
            'edit_pricing_section',
            'edit_testimonials_section',
        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // Create roles
        $companyRole = Role::create(['name' => 'company', 'guard_name' => 'api']);
        $hrRole = Role::create(['name' => 'hr', 'guard_name' => 'api']);
        $managerRole = Role::create(['name' => 'manager', 'guard_name' => 'api']);
        $employeeRole = Role::create(['name' => 'employee', 'guard_name' => 'api']);

        // Company gets all permissions
        $companyRole->givePermissionTo(Permission::all());

        // HR gets most permissions except critical admin ones
        $hrExcluded = [
            'delete_user', 'impersonate_user', 'create_role', 'edit_role', 'delete_role',
            'assign_role_permissions', 'create_branch', 'edit_branch', 'delete_branch',
            'activate_branch', 'deactivate_branch', 'import_branches', 'delete_department',
            'delete_designation', 'delete_employee', 'delete_document_type', 'delete_award_type',
            'delete_termination', 'delete_transfer', 'delete_asset_type', 'delete_asset',
            'delete_training_type', 'delete_training_program', 'delete_performance_indicator',
            'delete_job_category', 'delete_job_type', 'delete_job_location', 'delete_interview_type',
            'delete_interview_round', 'delete_candidate_source', 'delete_offer_template',
            'delete_onboarding_checklist', 'delete_contract_type', 'delete_contract',
            'delete_document_category', 'delete_meeting_type', 'delete_meeting_room',
            'delete_leave_type', 'delete_leave_policy', 'delete_shift', 'delete_attendance_policy',
            'delete_salary_component', 'delete_employee_salary', 'delete_payroll_run',
            'delete_payslip', 'delete_loan_deduction', 'edit_general_settings', 'edit_brand_settings',
            'upload_company_logo', 'upload_company_favicon', 'edit_email_settings',
            'edit_notification_settings', 'edit_security_settings', 'manage_two_factor_auth',
            'view_backup_settings', 'create_backup', 'restore_backup', 'download_backup',
            'export_audit_logs', 'clear_cache', 'create_currency', 'edit_currency', 'delete_currency',
            'set_default_currency', 'update_exchange_rates', 'view_landing_page_settings',
            'edit_landing_page_settings', 'edit_hero_section', 'edit_features_section',
            'edit_pricing_section', 'edit_testimonials_section',
        ];
        $hrPermissions = Permission::whereNotIn('name', $hrExcluded)->pluck('name');
        $hrRole->givePermissionTo($hrPermissions);

        // Manager gets team management permissions
        $managerPermissions = [
            'view_dashboard', 'view_dashboard_statistics', 'view_dashboard_charts', 'view_employee_dashboard',
            'view_users', 'view_user', 'view_branches', 'view_branch', 'view_branch_employees',
            'view_departments', 'view_department', 'view_department_employees',
            'view_designations', 'view_designation', 'view_designation_employees',
            'view_employees', 'view_employee', 'view_own_profile', 'edit_own_profile',
            'view_own_documents', 'upload_own_document', 'view_own_banking', 'edit_own_banking',
            'view_own_emergency_contact', 'edit_own_emergency_contact', 'view_employee_history',
            'view_document_types', 'view_document_type',
            'view_award_types', 'view_award_type', 'view_awards', 'view_award', 'view_own_awards',
            'create_award', 'view_award_certificate', 'download_award_certificate', 'send_award_notification',
            'view_promotions', 'view_promotion', 'view_own_promotions', 'create_promotion',
            'view_promotion_letter', 'download_promotion_letter',
            'view_resignations', 'view_resignation', 'view_own_resignation', 'submit_own_resignation',
            'view_resignation_letter', 'cancel_own_resignation',
            'view_warnings', 'view_warning', 'view_own_warnings', 'create_warning', 'acknowledge_warning',
            'view_warning_letter', 'download_warning_letter', 'send_warning_notification', 'escalate_warning',
            'view_trips', 'view_trip', 'view_own_trips', 'create_trip', 'request_own_trip',
            'edit_own_trip', 'approve_trip', 'reject_trip', 'cancel_trip', 'cancel_own_trip',
            'view_trip_expenses', 'add_trip_expense',
            'view_own_complaints', 'create_complaint',
            'view_transfers', 'view_transfer', 'view_own_transfers', 'create_transfer',
            'view_transfer_letter', 'download_transfer_letter',
            'view_holidays', 'view_holiday', 'view_holiday_calendar', 'view_upcoming_holidays',
            'view_announcements', 'view_announcement',
            'view_asset_types', 'view_asset_type', 'view_assets', 'view_asset', 'view_own_assets',
            'view_asset_history',
            'view_training_types', 'view_training_type', 'view_training_programs', 'view_training_program',
            'view_training_sessions', 'view_training_session', 'view_employee_trainings', 'view_own_trainings',
            'enroll_employee_training', 'enroll_own_training', 'view_training_certificate',
            'download_training_certificate', 'view_training_reports',
            'view_performance_indicators', 'view_performance_indicator', 'view_employee_goals',
            'view_own_goals', 'create_employee_goal', 'create_own_goal', 'edit_employee_goal',
            'edit_own_goal', 'complete_goal', 'verify_goal', 'view_performance_reviews',
            'view_own_reviews', 'create_performance_review', 'edit_performance_review',
            'submit_self_assessment', 'submit_manager_review', 'view_performance_reports',
            'view_job_categories', 'view_job_types', 'view_job_locations', 'view_job_requisitions',
            'create_job_requisition', 'view_job_postings', 'view_job_posting', 'view_candidates',
            'view_candidate', 'update_candidate_status', 'view_candidate_resume', 'download_candidate_resume',
            'view_candidate_timeline', 'add_candidate_note', 'view_interview_types', 'view_interview_rounds',
            'view_interviews', 'view_interview', 'schedule_interview', 'submit_interview_feedback',
            'view_interview_feedback', 'view_candidate_assessments', 'view_offers', 'view_offer',
            'view_onboarding_checklists', 'view_onboardings', 'complete_onboarding_task',
            'view_recruitment_dashboard',
            'view_contract_types', 'view_contracts', 'view_contract', 'view_own_contract',
            'view_contract_renewals', 'view_contract_document', 'download_contract_document',
            'view_expiring_contracts',
            'view_document_categories', 'view_hr_documents', 'view_hr_document', 'download_hr_document',
            'acknowledge_document',
            'view_meeting_types', 'view_meeting_rooms', 'view_meetings', 'view_meeting', 'view_own_meetings',
            'schedule_meeting', 'edit_meeting', 'cancel_meeting', 'view_meeting_attendees',
            'add_meeting_attendee', 'remove_meeting_attendee', 'view_meeting_minutes',
            'create_meeting_minutes', 'edit_meeting_minutes', 'view_action_items',
            'create_action_item', 'complete_action_item',
            'view_leave_types', 'view_leave_type', 'view_leave_applications', 'view_leave_application',
            'view_own_leave_applications', 'create_leave_application', 'apply_own_leave',
            'edit_own_leave_application', 'approve_leave', 'reject_leave', 'cancel_leave',
            'cancel_own_leave', 'view_leave_balances', 'view_own_leave_balance', 'view_leave_calendar',
            'view_leave_reports',
            'view_shifts', 'view_shift', 'view_attendance', 'view_attendance_record', 'view_own_attendance',
            'clock_in', 'clock_out', 'view_regularizations', 'view_own_regularizations',
            'request_regularization', 'approve_regularization', 'reject_regularization',
            'view_attendance_reports', 'view_attendance_summary', 'view_today_attendance',
            'view_media_library', 'view_directories', 'view_files', 'upload_file', 'download_file', 'share_file',
            'view_calendar', 'view_all_events', 'view_own_events', 'create_calendar_event',
            'edit_calendar_event', 'delete_calendar_event',
        ];
        $managerRole->givePermissionTo($managerPermissions);

        // Employee gets self-service permissions only
        $employeePermissions = [
            'view_dashboard', 'view_dashboard_statistics', 'view_employee_dashboard',
            'view_branches', 'view_branch', 'view_departments', 'view_department',
            'view_designations', 'view_designation',
            'view_own_profile', 'edit_own_profile', 'view_own_documents', 'upload_own_document',
            'view_own_banking', 'edit_own_banking', 'view_own_emergency_contact', 'edit_own_emergency_contact',
            'view_document_types', 'view_document_type',
            'view_award_types', 'view_award_type', 'view_own_awards', 'view_award_certificate',
            'download_award_certificate',
            'view_own_promotions', 'view_promotion_letter', 'download_promotion_letter',
            'view_own_resignation', 'submit_own_resignation', 'view_resignation_letter', 'cancel_own_resignation',
            'view_own_warnings', 'acknowledge_warning', 'view_warning_letter', 'download_warning_letter',
            'view_own_trips', 'request_own_trip', 'edit_own_trip', 'cancel_own_trip', 'add_trip_expense',
            'view_own_complaints', 'create_complaint',
            'view_own_transfers', 'view_transfer_letter', 'download_transfer_letter',
            'view_holidays', 'view_holiday', 'view_holiday_calendar', 'view_upcoming_holidays',
            'view_announcements', 'view_announcement',
            'view_own_assets',
            'view_training_types', 'view_training_type', 'view_training_programs', 'view_training_program',
            'view_training_sessions', 'view_training_session', 'view_own_trainings', 'enroll_own_training',
            'view_training_certificate', 'download_training_certificate',
            'view_own_goals', 'create_own_goal', 'edit_own_goal', 'complete_goal',
            'view_own_reviews', 'submit_self_assessment',
            'complete_onboarding_task',
            'view_own_contract', 'view_contract_document', 'download_contract_document',
            'view_document_categories', 'view_hr_documents', 'view_hr_document', 'download_hr_document',
            'acknowledge_document',
            'view_meeting_types', 'view_meeting_rooms', 'view_own_meetings', 'view_meeting_attendees',
            'view_meeting_minutes', 'view_action_items', 'complete_action_item',
            'view_leave_types', 'view_leave_type', 'view_own_leave_applications', 'apply_own_leave',
            'edit_own_leave_application', 'cancel_own_leave', 'view_own_leave_balance', 'view_leave_calendar',
            'view_shifts', 'view_shift', 'view_own_attendance', 'clock_in', 'clock_out',
            'view_own_regularizations', 'request_regularization', 'view_today_attendance',
            'view_own_salary', 'view_own_salary_history', 'view_own_payslips', 'download_own_payslip',
            'view_calendar', 'view_own_events',
        ];
        $employeeRole->givePermissionTo($employeePermissions);
    }
}
```

---

## Summary

This document provides a complete enumeration of all 581 permissions in the WorkDo HRM system, organized into 33 modules. Each permission is documented with:

- Unique permission key following the `action_resource` naming convention
- Human-readable description
- Role assignments (Company, HR, Manager, Employee)

The permission seeder code at the end can be used directly in a Laravel application with Spatie Permission package to set up the complete RBAC system.

### Permission Count by Module

| Module | Count |
|--------|-------|
| Dashboard | 5 |
| User Management | 12 |
| Role Management | 8 |
| Branch Management | 10 |
| Department Management | 10 |
| Designation Management | 10 |
| Employee Management | 25 |
| Document Type Management | 8 |
| Award Management | 16 |
| Promotion Management | 12 |
| Resignation Management | 12 |
| Termination Management | 12 |
| Warning Management | 12 |
| Trip Management | 16 |
| Complaint Management | 14 |
| Transfer Management | 12 |
| Holiday Management | 10 |
| Announcement Management | 10 |
| Asset Management | 20 |
| Training Management | 28 |
| Performance Management | 24 |
| Recruitment | 65 |
| Contract Management | 18 |
| Document Management | 16 |
| Meeting Management | 24 |
| Leave Management | 28 |
| Attendance Management | 28 |
| Payroll Management | 40 |
| Settings | 30 |
| Media Library | 12 |
| Calendar | 6 |
| Currency Management | 8 |
| Landing Page | 6 |
| **TOTAL** | **581** |
