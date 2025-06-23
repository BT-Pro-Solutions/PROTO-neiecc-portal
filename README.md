# NEIECC Tri-Share/Co-Share Portal

A web-based portal prototype for the Northeast Indiana Early Childhood Coalition (NEIECC) Tri-Share and Co-Share child care assistance programs.

## Features

This portal provides comprehensive functionality for all stakeholders in the child care assistance program:

### 🏠 Landing Page
- Role-based portal selection
- Program information (Tri-Share vs Co-Share)
- Professional, responsive design

### 👨‍👩‍👧‍👦 Employee Portal
- **Dashboard**: Application overview, savings tracking, notifications
- **Application Form**: Complete multi-step application with:
  - Household income details
  - Employer verification from participating employers
  - Child care provider selection with rate information
  - Child information with dynamic forms
  - Legal agreements and terms
- **Application Status**: Real-time status tracking with detailed breakdowns
- **Document Management**: Upload and track required documents

### 🏢 Employer Dashboard
- **Overview**: Company statistics, employee participation, program impact
- **Employee Management**: Track participating employees and applications
- **Billing**: Invoice management, payment history, auto-pay settings
- **Settings**: Company information, program participation, document management

### 🏫 Child Care Provider Portal
- **Dashboard**: Capacity tracking, enrollment statistics, revenue overview
- **Enrollment**: Manage enrolled children, pending applications, capacity by age group
- **Billing**: Monthly billing submission, payment tracking, attendance logs
- **Documents**: License management, required documents, monthly reports
- **Settings**: Provider information, rates, program settings, integrations

### ⚙️ Admin Dashboard
- **Overview**: System-wide statistics, recent activity, quick actions
- **Applications**: Review and approve applications, income verification tools
- **Provider Management**: Verify credentials, manage provider directory
- **Employer Management**: Company participation, budget calculations
- **Billing**: Process monthly billing, approve invoices, QuickBooks integration
- **Reports**: Financial summaries, utilization reports, audit documentation
- **Communications**: Send notifications, manage templates, communication history

## Program Types

### Tri-Share Program
Three funding sources:
- **SDC Funds**: State/federal assistance
- **Employer Funds**: Company contribution
- **Employee Funds**: Family contribution (via payroll deduction)

### Co-Share Program
Two funding sources:
- **Employer Funds**: Company contribution (percentage or flat rate)
- **Employee Funds**: Family contribution (via payroll deduction)

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Data**: JSON mock data files
- **Storage**: localStorage for session management
- **Architecture**: Modular JavaScript with portal-specific modules

## File Structure

```
├── index.html              # Main landing page
├── css/
│   └── main.css            # Comprehensive stylesheet
├── js/
│   ├── main.js             # Core application logic
│   ├── employee.js         # Employee portal functionality
│   ├── employer.js         # Employer dashboard functionality
│   ├── provider.js         # Provider portal functionality
│   └── admin.js            # Admin dashboard functionality
├── data/
│   └── mock-data.json      # Mock data for all entities
└── README.md               # This file
```

## Usage

1. **Start a local server**:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

2. **Open your browser** and navigate to `http://localhost:8000`

3. **Explore the portals**:
   - Click on any portal card to access that role's functionality
   - Navigate between sections using the portal navigation
   - All data is simulated - no actual backend required

## Key Features Implemented

### Forms & Validation
- ✅ Multi-step application forms
- ✅ Dynamic form fields (add/remove children)
- ✅ Form validation and error handling
- ✅ Draft saving functionality

### Data Management
- ✅ Comprehensive mock data structure
- ✅ Relationship mapping (employers, providers, applications)
- ✅ Realistic financial calculations
- ✅ Status tracking and workflows

### User Experience
- ✅ Responsive design for all screen sizes
- ✅ Professional styling and branding
- ✅ Interactive dashboards with real-time data
- ✅ Notification system
- ✅ Document upload interfaces

### Business Logic
- ✅ Tri-Share vs Co-Share cost calculations
- ✅ Income verification processes
- ✅ Provider capacity management
- ✅ Billing and payment tracking
- ✅ Communication templates

## Future Enhancements

- Backend API integration
- Database persistence
- User authentication
- Payment processing
- Document storage
- Email notifications
- Advanced reporting
- Mobile app version

## License

This is a prototype developed for NEIECC. All rights reserved.