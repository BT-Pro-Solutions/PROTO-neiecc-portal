// Admin Dashboard functionality
window.AdminPortal = {
    mockData: null,
    currentAdmin: null,

    async init() {
        await this.loadMockData();
        this.currentAdmin = this.mockData.adminUsers[0]; // Mock current admin
        this.render();
        this.bindEvents();
    },

    async loadMockData() {
        try {
            const response = await fetch('./data/mock-data.json');
            this.mockData = await response.json();
        } catch (error) {
            console.error('Error loading mock data:', error);
            this.mockData = { employers: [], providers: [], applications: [], adminUsers: [] };
        }
    },

    render() {
        const container = document.getElementById('admin-portal');
        if (!container) return;

        container.innerHTML = `
            <div class="portal-header">
                <h2>Admin Dashboard</h2>
                <p>Manage applications, approvals, and reporting</p>
            </div>

            <div class="admin-nav">
                <button class="btn btn-primary active" data-section="overview">Overview</button>
                <button class="btn btn-secondary" data-section="applications">Applications</button>
                <button class="btn btn-secondary" data-section="providers">Providers</button>
                <button class="btn btn-secondary" data-section="employers">Employers</button>
                <button class="btn btn-secondary" data-section="billing">Billing</button>
                <button class="btn btn-secondary" data-section="reports">Reports</button>
                <button class="btn btn-secondary" data-section="communications">Communications</button>
            </div>

            <div id="admin-overview" class="admin-section active">
                ${this.renderOverview()}
            </div>

            <div id="admin-applications" class="admin-section">
                ${this.renderApplications()}
            </div>

            <div id="admin-providers" class="admin-section">
                ${this.renderProviders()}
            </div>

            <div id="admin-employers" class="admin-section">
                ${this.renderEmployers()}
            </div>

            <div id="admin-billing" class="admin-section">
                ${this.renderBilling()}
            </div>

            <div id="admin-reports" class="admin-section">
                ${this.renderReports()}
            </div>

            <div id="admin-communications" class="admin-section">
                ${this.renderCommunications()}
            </div>
        `;
    },

    renderOverview() {
        const totalApplications = this.mockData.applications.length;
        const pendingApplications = this.mockData.applications.filter(app => app.status === 'pending').length;
        const approvedApplications = this.mockData.applications.filter(app => app.status === 'approved_participating').length;
        const totalChildren = this.mockData.applications.reduce((sum, app) => sum + app.children.length, 0);
        const totalWeeklySDC = this.mockData.applications
            .filter(app => app.totalSDC)
            .reduce((sum, app) => sum + app.totalSDC, 0);
        const totalWeeklyEmployer = this.mockData.applications.reduce((sum, app) => sum + app.totalEmployer, 0);
        const totalWeeklyCost = this.mockData.applications.reduce((sum, app) => sum + app.totalWeeklyCost, 0);
        const familySavings = totalWeeklyCost - this.mockData.applications.reduce((sum, app) => sum + app.totalEmployee, 0);

        return `
            <div class="admin-header">
                <h3>System Overview</h3>
                <p>Welcome back, ${this.currentAdmin.name}</p>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Total Applications</h3>
                    <div class="dashboard-number">${totalApplications}</div>
                    <p>All Applications</p>
                </div>
                <div class="dashboard-card">
                    <h3>Pending Review</h3>
                    <div class="dashboard-number">${pendingApplications}</div>
                    <p>Need Attention</p>
                </div>
                <div class="dashboard-card">
                    <h3>Active Participants</h3>
                    <div class="dashboard-number">${approvedApplications}</div>
                    <p>Approved & Participating</p>
                </div>
                <div class="dashboard-card">
                    <h3>Children Served</h3>
                    <div class="dashboard-number">${totalChildren}</div>
                    <p>Total Children</p>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>SDC Funds</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(totalWeeklySDC * 52)}</div>
                    <p>Annual Allocation</p>
                </div>
                <div class="dashboard-card">
                    <h3>Employer Investment</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(totalWeeklyEmployer * 52)}</div>
                    <p>Annual Contribution</p>
                </div>
                <div class="dashboard-card">
                    <h3>Family Savings</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(familySavings * 52)}</div>
                    <p>Annual Savings</p>
                </div>
                <div class="dashboard-card">
                    <h3>Program Impact</h3>
                    <div class="dashboard-number">$${Math.round((totalWeeklyCost * 52) / 1000)}K</div>
                    <p>Total Childcare Supported</p>
                </div>
            </div>

            <div class="form-section">
                <h3>Recent Activity</h3>
                <div class="activity-timeline">
                    <div class="activity-item">
                        <div class="activity-icon">📋</div>
                        <div class="activity-content">
                            <h4>New Application Submitted</h4>
                            <p>Michael Brown submitted Co-Share application - Manufacturing Plus Inc</p>
                            <small>2 hours ago</small>
                            <div class="activity-actions">
                                <button class="btn btn-primary btn-sm">Review</button>
                            </div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">✅</div>
                        <div class="activity-content">
                            <h4>Provider Verified</h4>
                            <p>Little Stars Learning Center credentials verified and approved</p>
                            <small>5 hours ago</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">💰</div>
                        <div class="activity-content">
                            <h4>Monthly Billing Processed</h4>
                            <p>February billing processed for all providers - $45,230 total</p>
                            <small>1 day ago</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">🏢</div>
                        <div class="activity-content">
                            <h4>New Employer Enrolled</h4>
                            <p>TechCorp Solutions joined both Tri-Share and Co-Share programs</p>
                            <small>3 days ago</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Quick Actions</h3>
                <div class="quick-actions">
                    <button class="btn btn-primary" onclick="AdminPortal.showSection('applications')">Review Pending Applications</button>
                    <button class="btn btn-secondary" onclick="AdminPortal.generateReport()">Generate Monthly Report</button>
                    <button class="btn btn-secondary" onclick="AdminPortal.showSection('communications')">Send Notifications</button>
                    <button class="btn btn-secondary" onclick="AdminPortal.showSection('billing')">Process Billing</button>
                </div>
            </div>

            <div class="form-section">
                <h3>System Alerts</h3>
                <div class="alerts-list">
                    <div class="alert alert-warning">
                        <h4>Document Expiration</h4>
                        <p>3 provider licenses expire within 30 days. Review required.</p>
                        <button class="btn btn-secondary btn-sm">View Details</button>
                    </div>
                    <div class="alert alert-info">
                        <h4>Renewal Reminders</h4>
                        <p>12 families need renewal reminders sent (30 days out).</p>
                        <button class="btn btn-primary btn-sm">Send Reminders</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderApplications() {
        const applications = this.mockData.applications;

        return `
            <div class="applications-header">
                <h3>Application Management</h3>
                <div class="applications-filters">
                    <select id="status-filter" class="form-control">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_process">In Process</option>
                        <option value="approved_participating">Approved - Participating</option>
                        <option value="denied">Denied</option>
                        <option value="incomplete_application">Incomplete</option>
                    </select>
                    <select id="program-filter" class="form-control">
                        <option value="">All Programs</option>
                        <option value="tri-share">Tri-Share</option>
                        <option value="co-share">Co-Share</option>
                    </select>
                    <input type="text" id="search-applications" class="form-control" placeholder="Search applications...">
                    <button class="btn btn-primary">Filter</button>
                </div>
            </div>

            <div class="form-section">
                <h3>Applications Requiring Review</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Applicant</th>
                                <th>Employer</th>
                                <th>Provider</th>
                                <th>Program</th>
                                <th>Children</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${applications.map(app => {
                                const employer = this.mockData.employers.find(emp => emp.id === app.employerId);
                                const provider = this.mockData.providers.find(prov => prov.id === app.providerId);
                                const assignedStaff = this.mockData.adminUsers.find(admin => admin.id === app.assignedStaff);
                                
                                return `
                                    <tr>
                                        <td>${app.id}</td>
                                        <td>${app.employee.firstName} ${app.employee.lastName}</td>
                                        <td>${employer ? employer.name : 'N/A'}</td>
                                        <td>${provider ? provider.name : 'N/A'}</td>
                                        <td><span class="badge badge-primary">${app.programType}</span></td>
                                        <td>${app.children.length}</td>
                                        <td><span class="status status-${app.status.replace(/_/g, '-')}">${app.status.replace(/_/g, ' ')}</span></td>
                                        <td>${assignedStaff ? assignedStaff.name : 'Unassigned'}</td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="AdminPortal.reviewApplication('${app.id}')">Review</button>
                                            <button class="btn btn-secondary btn-sm" onclick="AdminPortal.editApplication('${app.id}')">Edit</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Income Verification Tools</h3>
                <div class="verification-tools">
                    <div class="tool-card">
                        <h4>Federal Poverty Level Calculator</h4>
                        <p>Calculate income eligibility based on current FPL guidelines</p>
                        <button class="btn btn-primary">Open Calculator</button>
                    </div>
                    <div class="tool-card">
                        <h4>Document Verification</h4>
                        <p>Review and verify uploaded income documents</p>
                        <button class="btn btn-secondary">View Documents</button>
                    </div>
                    <div class="tool-card">
                        <h4>Cost Calculation</h4>
                        <p>Automated Tri-Share and Co-Share cost calculations</p>
                        <button class="btn btn-secondary">Calculate Costs</button>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Bulk Actions</h3>
                <div class="bulk-actions">
                    <div class="action-group">
                        <h4>Send Notifications</h4>
                        <select class="form-control">
                            <option>Application Received</option>
                            <option>More Information Needed</option>
                            <option>Application Approved</option>
                            <option>Application Denied</option>
                            <option>Renewal Reminder</option>
                        </select>
                        <button class="btn btn-primary">Send to Selected</button>
                    </div>
                    <div class="action-group">
                        <h4>Status Updates</h4>
                        <select class="form-control">
                            <option>In Process</option>
                            <option>Income Verified - Pending Provider</option>
                            <option>Approved - Participating</option>
                            <option>Denied</option>
                            <option>Incomplete Application</option>
                        </select>
                        <button class="btn btn-secondary">Update Selected</button>
                    </div>
                    <div class="action-group">
                        <h4>Assign Staff</h4>
                        <select class="form-control">
                            ${this.mockData.adminUsers.map(admin => 
                                `<option value="${admin.id}">${admin.name}</option>`
                            ).join('')}
                        </select>
                        <button class="btn btn-secondary">Assign to Selected</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderProviders() {
        const providers = this.mockData.providers;

        return `
            <div class="providers-header">
                <h3>Provider Management</h3>
                <div class="providers-actions">
                    <button class="btn btn-primary" onclick="AdminPortal.addProvider()">Add New Provider</button>
                    <button class="btn btn-secondary" onclick="AdminPortal.bulkProviderUpdate()">Bulk Update</button>
                </div>
            </div>

            <div class="form-section">
                <h3>Provider Directory</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Provider Name</th>
                                <th>Type</th>
                                <th>License #</th>
                                <th>Capacity</th>
                                <th>Enrollment</th>
                                <th>Program Children</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${providers.map(provider => {
                                const programChildren = this.mockData.applications
                                    .filter(app => app.providerId === provider.id && app.status === 'approved_participating')
                                    .reduce((sum, app) => sum + app.children.length, 0);
                                
                                return `
                                    <tr>
                                        <td>${provider.name}</td>
                                        <td>${provider.providerType.replace(/_/g, ' ')}</td>
                                        <td>${provider.licenseNumber}</td>
                                        <td>${provider.capacity}</td>
                                        <td>${provider.currentEnrollment}</td>
                                        <td>${programChildren}</td>
                                        <td><span class="status status-${provider.status}">${provider.status}</span></td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="AdminPortal.viewProvider('${provider.id}')">View</button>
                                            <button class="btn btn-secondary btn-sm" onclick="AdminPortal.editProvider('${provider.id}')">Edit</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Provider Verification Queue</h3>
                <div class="verification-queue">
                    <div class="queue-item">
                        <h4>Sunshine Daycare</h4>
                        <p><strong>Documents Pending:</strong> License renewal, Insurance certificate</p>
                        <p><strong>Submitted:</strong> 3 days ago</p>
                        <div class="queue-actions">
                            <button class="btn btn-success btn-sm">Approve</button>
                            <button class="btn btn-warning btn-sm">Request Info</button>
                            <button class="btn btn-danger btn-sm">Reject</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Provider Analytics</h3>
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Total Providers</h3>
                        <div class="dashboard-number">${providers.length}</div>
                        <p>Active Providers</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Average Capacity</h3>
                        <div class="dashboard-number">${Math.round(providers.reduce((sum, p) => sum + p.capacity, 0) / providers.length)}</div>
                        <p>Children per Provider</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Utilization Rate</h3>
                        <div class="dashboard-number">${Math.round(providers.reduce((sum, p) => sum + (p.currentEnrollment / p.capacity), 0) / providers.length * 100)}%</div>
                        <p>Average Utilization</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Program Participation</h3>
                        <div class="dashboard-number">${Math.round(providers.filter(p => this.mockData.applications.some(app => app.providerId === p.id)).length / providers.length * 100)}%</div>
                        <p>Providers in Program</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderEmployers() {
        const employers = this.mockData.employers;

        return `
            <div class="employers-header">
                <h3>Employer Management</h3>
                <div class="employers-actions">
                    <button class="btn btn-primary" onclick="AdminPortal.addEmployer()">Add New Employer</button>
                    <button class="btn btn-secondary" onclick="AdminPortal.bulkEmployerUpdate()">Bulk Update</button>
                </div>
            </div>

            <div class="form-section">
                <h3>Participating Employers</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Program Type</th>
                                <th>Employees</th>
                                <th>Participating</th>
                                <th>Monthly Investment</th>
                                <th>Co-Share Details</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employers.map(employer => {
                                const monthlyInvestment = this.mockData.applications
                                    .filter(app => app.employerId === employer.id)
                                    .reduce((sum, app) => sum + app.totalEmployer, 0) * 4.33;
                                
                                return `
                                    <tr>
                                        <td>${employer.name}</td>
                                        <td>
                                            ${employer.programType === 'both' ? 
                                                '<span class="badge badge-primary">Tri-Share</span> <span class="badge badge-secondary">Co-Share</span>' :
                                                `<span class="badge badge-primary">${employer.programType}</span>`
                                            }
                                        </td>
                                        <td>${employer.employeeCount}</td>
                                        <td>${employer.participatingEmployees}</td>
                                        <td>${NEIECCPortal.formatCurrency(monthlyInvestment)}</td>
                                        <td>
                                            ${employer.coShareType ? 
                                                `${employer.coShareType}: ${employer.coShareType === 'percentage' ? employer.coShareAmount + '%' : NEIECCPortal.formatCurrency(employer.coShareAmount) + '/week'}` :
                                                'N/A'
                                            }
                                        </td>
                                        <td><span class="status status-${employer.status}">${employer.status}</span></td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="AdminPortal.viewEmployer('${employer.id}')">View</button>
                                            <button class="btn btn-secondary btn-sm" onclick="AdminPortal.editEmployer('${employer.id}')">Edit</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Employer Budget Calculations</h3>
                <div class="budget-tools">
                    <div class="tool-card">
                        <h4>Co-Share Impact Calculator</h4>
                        <p>Calculate potential employer costs based on participation levels</p>
                        <button class="btn btn-primary">Open Calculator</button>
                    </div>
                    <div class="tool-card">
                        <h4>ROI Analysis</h4>
                        <p>Generate return on investment reports for employers</p>
                        <button class="btn btn-secondary">Generate Report</button>
                    </div>
                    <div class="tool-card">
                        <h4>Participation Trends</h4>
                        <p>Track employee participation trends over time</p>
                        <button class="btn btn-secondary">View Trends</button>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Employer Analytics</h3>
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Total Employers</h3>
                        <div class="dashboard-number">${employers.length}</div>
                        <p>Participating Companies</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Total Employees</h3>
                        <div class="dashboard-number">${employers.reduce((sum, emp) => sum + emp.employeeCount, 0)}</div>
                        <p>At Participating Companies</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Participation Rate</h3>
                        <div class="dashboard-number">${Math.round(employers.reduce((sum, emp) => sum + emp.participatingEmployees, 0) / employers.reduce((sum, emp) => sum + emp.employeeCount, 0) * 100)}%</div>
                        <p>Employee Participation</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Monthly Investment</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(employers.reduce((sum, emp) => {
                            const empApplications = this.mockData.applications.filter(app => app.employerId === emp.id);
                            return sum + empApplications.reduce((appSum, app) => appSum + app.totalEmployer, 0) * 4.33;
                        }, 0))}</div>
                        <p>Total Employer Investment</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderBilling() {
        const totalMonthlyBilling = this.mockData.applications.reduce((sum, app) => sum + app.totalWeeklyCost, 0) * 4.33;
        const sdcPortion = this.mockData.applications
            .filter(app => app.totalSDC)
            .reduce((sum, app) => sum + app.totalSDC, 0) * 4.33;
        const employerPortion = this.mockData.applications.reduce((sum, app) => sum + app.totalEmployer, 0) * 4.33;

        return `
            <div class="billing-header">
                <h3>Billing Management</h3>
                <div class="billing-summary-cards">
                    <div class="summary-card">
                        <h4>Total Monthly Billing</h4>
                        <div class="summary-amount">${NEIECCPortal.formatCurrency(totalMonthlyBilling)}</div>
                    </div>
                    <div class="summary-card">
                        <h4>SDC Funds</h4>
                        <div class="summary-amount">${NEIECCPortal.formatCurrency(sdcPortion)}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Employer Billing</h4>
                        <div class="summary-amount">${NEIECCPortal.formatCurrency(employerPortion)}</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Monthly Billing Processing</h3>
                <div class="billing-process">
                    <div class="process-step completed">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Provider Invoices Received</h4>
                            <p>All provider invoices for March 2024 have been received and reviewed</p>
                        </div>
                    </div>
                    <div class="process-step completed">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Cost Calculations</h4>
                            <p>Tri-Share and Co-Share portions calculated for all applications</p>
                        </div>
                    </div>
                    <div class="process-step active">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Employer Invoices</h4>
                            <p>Generate and send invoices to participating employers</p>
                            <button class="btn btn-primary">Generate Invoices</button>
                        </div>
                    </div>
                    <div class="process-step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Provider Payments</h4>
                            <p>Process payments to child care providers</p>
                            <button class="btn btn-secondary" disabled>Process Payments</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Pending Approvals</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Invoice Period</th>
                                <th>Children</th>
                                <th>Amount</th>
                                <th>Submitted Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.mockData.providers.map(provider => {
                                const providerApplications = this.mockData.applications.filter(app => app.providerId === provider.id);
                                const totalAmount = providerApplications.reduce((sum, app) => sum + app.totalWeeklyCost, 0) * 4.33;
                                const childrenCount = providerApplications.reduce((sum, app) => sum + app.children.length, 0);
                                
                                return `
                                    <tr>
                                        <td>${provider.name}</td>
                                        <td>March 2024</td>
                                        <td>${childrenCount}</td>
                                        <td>${NEIECCPortal.formatCurrency(totalAmount)}</td>
                                        <td>2024-03-01</td>
                                        <td><span class="status status-pending">Pending Review</span></td>
                                        <td>
                                            <button class="btn btn-success btn-sm" onclick="AdminPortal.approveInvoice('${provider.id}')">Approve</button>
                                            <button class="btn btn-secondary btn-sm" onclick="AdminPortal.reviewInvoice('${provider.id}')">Review</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>QuickBooks Integration</h3>
                <div class="integration-status">
                    <div class="integration-card">
                        <h4>Connection Status</h4>
                        <div class="status-indicator connected">Connected</div>
                        <p>Last sync: 2 hours ago</p>
                        <button class="btn btn-secondary">Sync Now</button>
                    </div>
                    <div class="integration-card">
                        <h4>Automatic Sync</h4>
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Auto-sync invoices
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Auto-sync payments
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Payment History</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Payment Date</th>
                                <th>Provider</th>
                                <th>Period</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2024-02-15</td>
                                <td>Little Stars Learning Center</td>
                                <td>February 2024</td>
                                <td>${NEIECCPortal.formatCurrency(2850)}</td>
                                <td>ACH Transfer</td>
                                <td><span class="status status-approved">Completed</span></td>
                                <td><button class="btn btn-secondary btn-sm">View Receipt</button></td>
                            </tr>
                            <tr>
                                <td>2024-02-15</td>
                                <td>Happy Tots Family Daycare</td>
                                <td>February 2024</td>
                                <td>${NEIECCPortal.formatCurrency(1420)}</td>
                                <td>ACH Transfer</td>
                                <td><span class="status status-approved">Completed</span></td>
                                <td><button class="btn btn-secondary btn-sm">View Receipt</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderReports() {
        return `
            <div class="reports-header">
                <h3>Reports & Analytics</h3>
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="AdminPortal.generateCustomReport()">Custom Report</button>
                    <button class="btn btn-secondary" onclick="AdminPortal.scheduleReport()">Schedule Report</button>
                </div>
            </div>

            <div class="form-section">
                <h3>Standard Reports</h3>
                <div class="reports-grid">
                    <div class="report-card">
                        <h4>Financial Summary</h4>
                        <p>SDC funds, employer contributions, and family savings</p>
                        <div class="report-actions">
                            <button class="btn btn-primary">Generate</button>
                            <button class="btn btn-secondary">Schedule</button>
                        </div>
                    </div>
                    <div class="report-card">
                        <h4>Utilization Report</h4>
                        <p>Program participation and capacity utilization</p>
                        <div class="report-actions">
                            <button class="btn btn-primary">Generate</button>
                            <button class="btn btn-secondary">Schedule</button>
                        </div>
                    </div>
                    <div class="report-card">
                        <h4>Audit Report</h4>
                        <p>Compliance and audit trail documentation</p>
                        <div class="report-actions">
                            <button class="btn btn-primary">Generate</button>
                            <button class="btn btn-secondary">Schedule</button>
                        </div>
                    </div>
                    <div class="report-card">
                        <h4>Employer ROI</h4>
                        <p>Return on investment analysis for employers</p>
                        <div class="report-actions">
                            <button class="btn btn-primary">Generate</button>
                            <button class="btn btn-secondary">Schedule</button>
                        </div>
                    </div>
                    <div class="report-card">
                        <h4>Provider Performance</h4>
                        <p>Provider capacity, billing, and compliance metrics</p>
                        <div class="report-actions">
                            <button class="btn btn-primary">Generate</button>
                            <button class="btn btn-secondary">Schedule</button>
                        </div>
                    </div>
                    <div class="report-card">
                        <h4>Family Impact</h4>
                        <p>Cost savings and family benefit analysis</p>
                        <div class="report-actions">
                            <button class="btn btn-primary">Generate</button>
                            <button class="btn btn-secondary">Schedule</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Dashboard Metrics</h3>
                <div class="metrics-dashboard">
                    <div class="metric-card">
                        <h4>SDC Funds Spent</h4>
                        <div class="metric-value">${NEIECCPortal.formatCurrency(45230)}</div>
                        <div class="metric-change positive">+12% from last month</div>
                        <div class="metric-chart">
                            <div class="chart-bar" style="height: 60%"></div>
                            <div class="chart-bar" style="height: 80%"></div>
                            <div class="chart-bar" style="height: 70%"></div>
                            <div class="chart-bar" style="height: 90%"></div>
                            <div class="chart-bar" style="height: 100%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h4>Co-Share Investment</h4>
                        <div class="metric-value">${NEIECCPortal.formatCurrency(28540)}</div>
                        <div class="metric-change positive">+8% from last month</div>
                        <div class="metric-chart">
                            <div class="chart-bar" style="height: 70%"></div>
                            <div class="chart-bar" style="height: 85%"></div>
                            <div class="chart-bar" style="height: 75%"></div>
                            <div class="chart-bar" style="height: 95%"></div>
                            <div class="chart-bar" style="height: 100%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h4>Family Savings</h4>
                        <div class="metric-value">${NEIECCPortal.formatCurrency(73770)}</div>
                        <div class="metric-change positive">+15% from last month</div>
                        <div class="metric-chart">
                            <div class="chart-bar" style="height: 50%"></div>
                            <div class="chart-bar" style="height: 70%"></div>
                            <div class="chart-bar" style="height: 85%"></div>
                            <div class="chart-bar" style="height: 90%"></div>
                            <div class="chart-bar" style="height: 100%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h4>Employer Investment</h4>
                        <div class="metric-value">${NEIECCPortal.formatCurrency(32150)}</div>
                        <div class="metric-change positive">+10% from last month</div>
                        <div class="metric-chart">
                            <div class="chart-bar" style="height: 65%"></div>
                            <div class="chart-bar" style="height: 75%"></div>
                            <div class="chart-bar" style="height: 80%"></div>
                            <div class="chart-bar" style="height: 95%"></div>
                            <div class="chart-bar" style="height: 100%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Report History</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Report Name</th>
                                <th>Type</th>
                                <th>Generated Date</th>
                                <th>Generated By</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>February 2024 Financial Summary</td>
                                <td>Financial</td>
                                <td>2024-03-01</td>
                                <td>${this.currentAdmin.name}</td>
                                <td>2.3 MB</td>
                                <td><button class="btn btn-secondary btn-sm">Download</button></td>
                            </tr>
                            <tr>
                                <td>Q4 2023 Audit Report</td>
                                <td>Audit</td>
                                <td>2024-01-15</td>
                                <td>James Wilson</td>
                                <td>5.1 MB</td>
                                <td><button class="btn btn-secondary btn-sm">Download</button></td>
                            </tr>
                            <tr>
                                <td>January 2024 Utilization</td>
                                <td>Utilization</td>
                                <td>2024-02-01</td>
                                <td>${this.currentAdmin.name}</td>
                                <td>1.8 MB</td>
                                <td><button class="btn btn-secondary btn-sm">Download</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderCommunications() {
        return `
            <div class="communications-header">
                <h3>Communications Center</h3>
                <div class="comm-stats">
                    <div class="stat-item">
                        <span class="stat-number">245</span>
                        <span class="stat-label">Total Recipients</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">23</span>
                        <span class="stat-label">Pending Renewals</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">8</span>
                        <span class="stat-label">Incomplete Apps</span>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Send Notifications</h3>
                <form id="notification-form" class="notification-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="recipient-type">Recipient Type</label>
                            <select id="recipient-type" name="recipientType" class="form-control">
                                <option value="">Select recipient type...</option>
                                <option value="employees">Employees/Families</option>
                                <option value="employers">Employers</option>
                                <option value="providers">Child Care Providers</option>
                                <option value="all">All Users</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="notification-template">Message Template</label>
                            <select id="notification-template" name="template" class="form-control">
                                <option value="">Select template...</option>
                                <option value="app_received">Application Received</option>
                                <option value="app_approved">Application Approved</option>
                                <option value="app_denied">Application Denied</option>
                                <option value="more_info">More Information Needed</option>
                                <option value="renewal_30">Renewal Reminder (30 days)</option>
                                <option value="renewal_7">Renewal Reminder (7 days)</option>
                                <option value="payment_received">Payment Received</option>
                                <option value="custom">Custom Message</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="message-subject">Subject</label>
                        <input type="text" id="message-subject" name="subject" class="form-control" placeholder="Enter message subject">
                    </div>
                    
                    <div class="form-group">
                        <label for="message-content">Message Content</label>
                        <textarea id="message-content" name="content" class="form-control" rows="6" placeholder="Enter your message content here..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="recipient-filter">Recipient Filter (Optional)</label>
                        <select id="recipient-filter" name="filter" class="form-control">
                            <option value="">All recipients</option>
                            <option value="pending">Pending Applications</option>
                            <option value="approved">Approved Applications</option>
                            <option value="renewal_due">Renewal Due Soon</option>
                            <option value="incomplete">Incomplete Applications</option>
                        </select>
                    </div>
                    
                    <div class="notification-preview">
                        <h4>Preview Recipients</h4>
                        <div id="recipient-count" class="recipient-count">0 recipients selected</div>
                        <div id="recipient-list" class="recipient-list"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="AdminPortal.sendNotification()">Send Notification</button>
                        <button type="button" class="btn btn-secondary" onclick="AdminPortal.previewNotification()">Preview</button>
                        <button type="button" class="btn btn-secondary" onclick="AdminPortal.saveTemplate()">Save as Template</button>
                    </div>
                </form>
            </div>

            <div class="form-section">
                <h3>Message Templates</h3>
                <div class="templates-grid">
                    <div class="template-card">
                        <h4>Application Received</h4>
                        <p>Thank you for submitting your application. We have received your request and will review it within 5-7 business days.</p>
                        <button class="btn btn-secondary btn-sm">Edit</button>
                    </div>
                    <div class="template-card">
                        <h4>Application Approved</h4>
                        <p>Congratulations! Your application has been approved. You can now begin receiving child care assistance.</p>
                        <button class="btn btn-secondary btn-sm">Edit</button>
                    </div>
                    <div class="template-card">
                        <h4>Application Denied</h4>
                        <p>We regret to inform you that your application has been denied. Please contact us for more information.</p>
                        <button class="btn btn-secondary btn-sm">Edit</button>
                    </div>
                    <div class="template-card">
                        <h4>More Information Needed</h4>
                        <p>We need additional information to process your application. Please log in to your account to see what's needed.</p>
                        <button class="btn btn-secondary btn-sm">Edit</button>
                    </div>
                    <div class="template-card">
                        <h4>Renewal Reminder</h4>
                        <p>Your program benefits expire in 30 days. Please submit your renewal application to continue receiving assistance.</p>
                        <button class="btn btn-secondary btn-sm">Edit</button>
                    </div>
                    <div class="template-card">
                        <h4>Payment Processed</h4>
                        <p>Your payment has been processed successfully. Thank you for your participation in our program.</p>
                        <button class="btn btn-secondary btn-sm">Edit</button>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Communication History</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Recipients</th>
                                <th>Sent By</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2024-03-10</td>
                                <td>Email</td>
                                <td>Renewal Reminder - 30 Days</td>
                                <td>23 families</td>
                                <td>${this.currentAdmin.name}</td>
                                <td><span class="status status-approved">Delivered</span></td>
                                <td><button class="btn btn-secondary btn-sm">View</button></td>
                            </tr>
                            <tr>
                                <td>2024-03-08</td>
                                <td>Email</td>
                                <td>Application Approved</td>
                                <td>5 families</td>
                                <td>James Wilson</td>
                                <td><span class="status status-approved">Delivered</span></td>
                                <td><button class="btn btn-secondary btn-sm">View</button></td>
                            </tr>
                            <tr>
                                <td>2024-03-05</td>
                                <td>Email</td>
                                <td>Monthly Invoice Available</td>
                                <td>3 employers</td>
                                <td>${this.currentAdmin.name}</td>
                                <td><span class="status status-approved">Delivered</span></td>
                                <td><button class="btn btn-secondary btn-sm">View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Navigation between sections
        document.querySelectorAll('.admin-nav button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Template selection
        const templateSelect = document.getElementById('notification-template');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                this.loadTemplate(e.target.value);
            });
        }

        // Recipient type selection
        const recipientSelect = document.getElementById('recipient-type');
        if (recipientSelect) {
            recipientSelect.addEventListener('change', (e) => {
                this.updateRecipientCount();
            });
        }
    },

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.admin-nav button').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-primary');
        });

        const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.classList.add('btn-primary');
            activeBtn.classList.remove('btn-secondary');
        }

        // Show section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`admin-${sectionName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    reviewApplication(applicationId) {
        NEIECCPortal.showNotification(`Opening application ${applicationId} for review - Feature coming soon!`, 'info');
    },

    editApplication(applicationId) {
        NEIECCPortal.showNotification(`Editing application ${applicationId} - Feature coming soon!`, 'info');
    },

    approveInvoice(providerId) {
        NEIECCPortal.showNotification('Invoice approved successfully', 'success');
    },

    reviewInvoice(providerId) {
        NEIECCPortal.showNotification(`Reviewing invoice for provider ${providerId} - Feature coming soon!`, 'info');
    },

    sendNotification() {
        const form = document.getElementById('notification-form');
        const formData = new FormData(form);
        
        if (!formData.get('recipientType') || !formData.get('subject') || !formData.get('content')) {
            NEIECCPortal.showNotification('Please fill in all required fields', 'error');
            return;
        }

        NEIECCPortal.showNotification('Notification sent successfully!', 'success');
        form.reset();
    },

    previewNotification() {
        NEIECCPortal.showNotification('Notification preview - Feature coming soon!', 'info');
    },

    loadTemplate(templateType) {
        const templates = {
            'app_received': {
                subject: 'Application Received - NEIECC Child Care Assistance',
                content: 'Thank you for submitting your application for child care assistance. We have received your request and will review it within 5-7 business days. You will receive updates on your application status via email.'
            },
            'app_approved': {
                subject: 'Application Approved - Welcome to the Program!',
                content: 'Congratulations! Your application for child care assistance has been approved. You can now begin receiving benefits through our Tri-Share/Co-Share program. Please contact your child care provider to coordinate the new payment arrangement.'
            },
            'app_denied': {
                subject: 'Application Update - Additional Review Required',
                content: 'Thank you for your interest in our child care assistance program. After reviewing your application, we need to discuss next steps. Please contact our office to schedule a consultation.'
            },
            'more_info': {
                subject: 'Action Required - Additional Information Needed',
                content: 'We need additional information to process your child care assistance application. Please log in to your account at your earliest convenience to see what documentation is required.'
            },
            'renewal_30': {
                subject: 'Renewal Reminder - Action Required in 30 Days',
                content: 'Your child care assistance benefits expire in 30 days. To continue receiving assistance, please submit your renewal application and updated documentation through your online account.'
            },
            'renewal_7': {
                subject: 'URGENT: Renewal Due in 7 Days',
                content: 'This is a reminder that your child care assistance benefits expire in 7 days. Please submit your renewal application immediately to avoid interruption of services.'
            }
        };

        const template = templates[templateType];
        if (template) {
            document.getElementById('message-subject').value = template.subject;
            document.getElementById('message-content').value = template.content;
        }
    },

    updateRecipientCount() {
        const recipientType = document.getElementById('recipient-type').value;
        const filter = document.getElementById('recipient-filter').value;
        
        let count = 0;
        switch (recipientType) {
            case 'employees':
                count = this.mockData.applications.length;
                break;
            case 'employers':
                count = this.mockData.employers.length;
                break;
            case 'providers':
                count = this.mockData.providers.length;
                break;
            case 'all':
                count = this.mockData.applications.length + this.mockData.employers.length + this.mockData.providers.length;
                break;
        }

        const countElement = document.getElementById('recipient-count');
        if (countElement) {
            countElement.textContent = `${count} recipients selected`;
        }
    },

    generateReport() {
        NEIECCPortal.showNotification('Generating monthly report...', 'info');
        setTimeout(() => {
            NEIECCPortal.showNotification('Monthly report generated successfully!', 'success');
        }, 2000);
    },

    addProvider() {
        NEIECCPortal.showNotification('Add new provider form - Feature coming soon!', 'info');
    },

    addEmployer() {
        NEIECCPortal.showNotification('Add new employer form - Feature coming soon!', 'info');
    },

    viewProvider(providerId) {
        NEIECCPortal.showNotification(`Viewing provider ${providerId} details - Feature coming soon!`, 'info');
    },

    viewEmployer(employerId) {
        NEIECCPortal.showNotification(`Viewing employer ${employerId} details - Feature coming soon!`, 'info');
    }
};