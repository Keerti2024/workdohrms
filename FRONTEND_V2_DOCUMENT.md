# Frontend V2 - Solarized Airbnb-Style UI/UX Redesign

## Overview
This document tracks the complete redesign of the WorkDo HRMS frontend with a new solarized, calming Airbnb-style layout.

## Design Philosophy

### Solarized Color Palette
The design uses the Solarized color scheme for a calming, eye-friendly experience:

**Base Colors:**
- `--base03: #002b36` - Dark background
- `--base02: #073642` - Dark highlight
- `--base01: #586e75` - Secondary content
- `--base00: #657b83` - Body text
- `--base0: #839496` - Primary content
- `--base1: #93a1a1` - Comments
- `--base2: #eee8d5` - Light background
- `--base3: #fdf6e3` - Light highlight

**Accent Colors:**
- `--violet: #6c71c4` - Primary accent
- `--blue: #268bd2` - Info
- `--cyan: #2aa198` - Secondary accent
- `--green: #859900` - Success
- `--yellow: #b58900` - Warning
- `--red: #dc322f` - Danger

### Airbnb-Style Principles
1. **High whitespace** - Generous padding and margins
2. **Card-based layouts** - Content organized in clean cards
3. **Soft elevation** - Subtle shadows for depth
4. **Rounded corners** - Friendly, approachable feel
5. **Clear typography hierarchy** - Easy to scan
6. **Minimal borders** - Clean, uncluttered look
7. **Large touch targets** - Mobile-friendly interactions

## Technical Stack
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom solarized theme
- **State Management:** React Context + hooks
- **API Client:** Axios with interceptors
- **Icons:** Lucide React
- **Charts:** Recharts

## Pages to Implement

### Authentication
- [x] Login page with visible button
- [ ] Register page
- [ ] Forgot password page

### Dashboard
- [ ] Main dashboard with metrics cards
- [ ] Quick actions
- [ ] Recent activity
- [ ] Announcements

### Staff Management
- [ ] Staff list with pagination
- [ ] Staff profile view
- [ ] Create/Edit staff form
- [ ] Staff documents

### Attendance
- [ ] Clock in/out interface
- [ ] Attendance logs
- [ ] Attendance summary/reports

### Leave Management
- [ ] Leave requests list
- [ ] Apply for leave form
- [ ] Leave approvals
- [ ] Leave balances

### Payroll
- [ ] Salary setup
- [ ] Payslip generation
- [ ] Bulk payslip generation
- [ ] Payslip history

### Recruitment
- [ ] Job postings
- [ ] Candidates list
- [ ] Interview scheduling
- [ ] Offer management

### Other Modules
- [ ] Performance management
- [ ] Asset management
- [ ] Training management
- [ ] Contracts
- [ ] Meetings
- [ ] Calendar
- [ ] Reports
- [ ] Settings

## API Integration
The frontend connects to the Laravel backend at `http://127.0.0.1:8000/api`

Key endpoints:
- `POST /auth/sign-in` - Login
- `GET /staff-members` - List staff
- `POST /clock-in` - Clock in
- `GET /time-off-requests` - Leave requests
- `GET /dashboard` - Dashboard data

## Progress Log

### December 18, 2025
- Created documentation structure
- Seeded demo data (13 users, 12 staff, 276 work logs)
- Starting frontend-v2 implementation

---
*This document is updated throughout the development process*
