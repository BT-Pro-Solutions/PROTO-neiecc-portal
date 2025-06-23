// Employer Dashboard functionality
window.EmployerPortal = {
    mockData: null,
    currentEmployer: null,

    async init() {
        await this.loadMockData();
        this.currentEmployer = this.mockData.employers[0]; // Mock current employer
        this.render();
        this.bindEvents();
    },

    async loadMockData() {
        try {
            const response = await fetch('./data/mock-data.json');
            this.mockData = await response.json();
        } catch (error) {
            console.error('Error loading mock data:', error);
            this.mockData = { employers: [], providers: [], applications: [] };
        }
    },

    render() {
        const container = document.getElementById('employer-portal');
        if (!container) return;

        container.innerHTML = `
            <div class="portal-header">
                <h2>Employer Dashboard</h2>
                <p>Manage company participation and employee benefits</p>
            </div>

            <div class="employer-nav">
                <button class="btn btn-primary active" data-section="overview">Overview</button>
                <button class="btn btn-secondary" data-section="employees">Employees</button>
                <button class="btn btn-secondary" data-section="billing">Billing</button>
                <button class="btn btn-secondary" data-section="settings">Settings</button>
            </div>

            <div id="employer-overview" class="employer-section active">
                ${this.renderOverview()}
            </div>

            <div id="employer-employees" class="employer-section">
                ${this.renderEmployees()}
            </div>

            <div id="employer-billing" class="employer-section">
                ${this.renderBilling()}
            </div>

            <div id="employer-settings" class="employer-section">
                ${this.renderSettings()}
            </div>
        `;
    },

    renderOverview() {
        const employer = this.currentEmployer;
        const employeeApplications = this.mockData.applications.filter(app => app.employerId === employer.id);
        const totalWeeklyCost = employeeApplications.reduce((sum, app) => sum + app.totalWeeklyCost, 0);
        const totalEmployerContribution = employeeApplications.reduce((sum, app) => sum + app.totalEmployer, 0);
        const monthlySavings = employeeApplications.reduce((sum, app) => {
            const originalCost = app.totalWeeklyCost;
            const employeeCost = app.totalEmployee;
            return sum + (originalCost - employeeCost) * 4.33; // approximate weeks per month
        }, 0);

        return `
            <div class="company-header">
                <h3>${employer.name}</h3>
                <p>${employer.address}</p>
                <div class="program-badges">
                    ${employer.programType === 'both' ? 
                        '<span class="badge badge-primary">Tri-Share</span><span class="badge badge-secondary">Co-Share</span>' :
                        `<span class="badge badge-primary">${employer.programType.charAt(0).toUpperCase() + employer.programType.slice(1)}</span>`
                    }
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Total Employees</h3>
                    <div class="dashboard-number">${employer.employeeCount}</div>
                    <p>Company Employees</p>
                </div>
                <div class="dashboard-card">
                    <h3>Participating</h3>
                    <div class="dashboard-number">${employer.participatingEmployees}</div>
                    <p>In Child Care Program</p>
                </div>
                <div class="dashboard-card">
                    <h3>Monthly Investment</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(totalEmployerContribution * 4.33)}</div>
                    <p>Your Contribution</p>
                </div>
                <div class="dashboard-card">
                    <h3>Employee Savings</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(monthlySavings)}</div>
                    <p>Monthly Family Savings</p>
                </div>
            </div>

            <div class="form-section">
                <h3>Recent Activity</h3>
                <div class="activity-timeline">
                    <div class="activity-item">
                        <div class="activity-icon">👤</div>
                        <div class="activity-content">
                            <h4>New Employee Application</h4>
                            <p>Michael Brown submitted an application for Co-Share benefits</p>
                            <small>2 days ago</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">💰</div>
                        <div class="activity-content">
                            <h4>Monthly Invoice Generated</h4>
                            <p>February invoice ready for review - ${NEIECCPortal.formatCurrency(totalEmployerContribution * 4.33)}</p>
                            <small>5 days ago</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">✅</div>
                        <div class="activity-content">
                            <h4>Application Approved</h4>
                            <p>Jessica Anderson's application has been approved for Tri-Share</p>
                            <small>1 week ago</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Program Impact Summary</h3>
                <div class="impact-grid">
                    <div class="impact-card">
                        <h4>Employee Retention</h4>
                        <div class="impact-number">95%</div>
                        <p>of participating employees report increased job satisfaction</p>
                    </div>
                    <div class="impact-card">
                        <h4>Cost Savings</h4>
                        <div class="impact-number">${NEIECCPortal.formatCurrency(monthlySavings * 12)}</div>
                        <p>annual savings for your employees</p>
                    </div>
                    <div class="impact-card">
                        <h4>Program ROI</h4>
                        <div class="impact-number">3.2x</div>
                        <p>return on investment through reduced turnover</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderEmployees() {
        const employer = this.currentEmployer;
        const employeeApplications = this.mockData.applications.filter(app => app.employerId === employer.id);

        return `
            <div class="form-section">
                <h3>Employee Applications</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Application ID</th>
                                <th>Children</th>
                                <th>Program Type</th>
                                <th>Weekly Cost</th>
                                <th>Your Contribution</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employeeApplications.map(app => {
                                return `
                                    <tr>
                                        <td>${app.employee.firstName} ${app.employee.lastName}</td>
                                        <td>${app.id}</td>
                                        <td>${app.children.length}</td>
                                        <td><span class="badge badge-primary">${app.programType}</span></td>
                                        <td>${NEIECCPortal.formatCurrency(app.totalWeeklyCost)}</td>
                                        <td>${NEIECCPortal.formatCurrency(app.totalEmployer)}</td>
                                        <td><span class="status status-${app.status.replace(/_/g, '-')}">${app.status.replace(/_/g, ' ')}</span></td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm" onclick="EmployerPortal.viewApplication('${app.id}')">View</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Program Participation by Department</h3>
                <div class="department-stats">
                    <div class="department-item">
                        <h4>Administration</h4>
                        <div class="participation-bar">
                            <div class="participation-fill" style="width: 45%"></div>
                        </div>
                        <p>9 of 20 employees participating (45%)</p>
                    </div>
                    <div class="department-item">
                        <h4>Operations</h4>
                        <div class="participation-bar">
                            <div class="participation-fill" style="width: 30%"></div>
                        </div>
                        <p>12 of 40 employees participating (30%)</p>
                    </div>
                    <div class="department-item">
                        <h4>Customer Service</h4>
                        <div class="participation-bar">
                            <div class="participation-fill" style="width: 25%"></div>
                        </div>
                        <p>8 of 32 employees participating (25%)</p>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Invite Employees</h3>
                <p>Send information about the child care assistance program to your employees.</p>
                <div class="invite-actions">
                    <button class="btn btn-primary" onclick="EmployerPortal.sendBulkInvite()">Send to All Employees</button>
                    <button class="btn btn-secondary" onclick="EmployerPortal.sendDepartmentInvite()">Send to Department</button>
                    <button class="btn btn-secondary" onclick="EmployerPortal.sendCustomInvite()">Custom Recipients</button>
                </div>
            </div>
        `;
    },

    renderBilling() {
        const employer = this.currentEmployer;
        const employeeApplications = this.mockData.applications.filter(app => app.employerId === employer.id);
        const totalEmployerContribution = employeeApplications.reduce((sum, app) => sum + app.totalEmployer, 0);
        const monthlyAmount = totalEmployerContribution * 4.33;

        // Mock billing data
        const billingHistory = [
            { month: '2024-02', amount: monthlyAmount, status: 'pending', dueDate: '2024-03-15' },
            { month: '2024-01', amount: monthlyAmount - 50, status: 'paid', paidDate: '2024-02-10' },
            { month: '2023-12', amount: monthlyAmount - 100, status: 'paid', paidDate: '2024-01-08' },
            { month: '2023-11', amount: monthlyAmount - 75, status: 'paid', paidDate: '2023-12-12' }
        ];

        return `
            <div class="billing-summary">
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Current Month</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(monthlyAmount)}</div>
                        <p>February 2024</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Outstanding</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(monthlyAmount)}</div>
                        <p>Due March 15</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>YTD Contribution</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(monthlyAmount * 2)}</div>
                        <p>2024 Total</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Admin Fees</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(0)}</div>
                        <p>During Grant Period</p>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Current Invoice</h3>
                <div class="invoice-card">
                    <div class="invoice-header">
                        <h4>Invoice #INV-2024-02-${employer.id.toUpperCase()}</h4>
                        <span class="status status-pending">Pending Payment</span>
                    </div>
                    <div class="invoice-details">
                        <div class="invoice-breakdown">
                            <h5>Billing Breakdown</h5>
                            ${employeeApplications.map(app => `
                                <div class="breakdown-item">
                                    <span>${app.employee.firstName} ${app.employee.lastName}</span>
                                    <span>${NEIECCPortal.formatCurrency(app.totalEmployer * 4.33)}/month</span>
                                </div>
                            `).join('')}
                            <div class="breakdown-total">
                                <span><strong>Total Due</strong></span>
                                <span><strong>${NEIECCPortal.formatCurrency(monthlyAmount)}</strong></span>
                            </div>
                        </div>
                        <div class="invoice-actions">
                            <button class="btn btn-primary">Pay Now</button>
                            <button class="btn btn-secondary">Download PDF</button>
                            <button class="btn btn-secondary">Email Invoice</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Billing History</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Invoice Period</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Paid Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${billingHistory.map(bill => `
                                <tr>
                                    <td>${new Date(bill.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                                    <td>${NEIECCPortal.formatCurrency(bill.amount)}</td>
                                    <td><span class="status status-${bill.status}">${bill.status}</span></td>
                                    <td>${bill.status === 'pending' ? NEIECCPortal.formatDate(bill.dueDate) : '-'}</td>
                                    <td>${bill.status === 'paid' ? NEIECCPortal.formatDate(bill.paidDate) : '-'}</td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm">Download</button>
                                        ${bill.status === 'pending' ? '<button class="btn btn-primary btn-sm">Pay</button>' : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Payment Settings</h3>
                <div class="payment-settings">
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" checked> Auto-pay enabled
                        </label>
                        <p>Automatically pay invoices on the due date</p>
                    </div>
                    <div class="setting-group">
                        <label>Payment Method</label>
                        <select class="form-control">
                            <option>Bank Transfer (ACH)</option>
                            <option>Credit Card</option>
                            <option>Check</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>Billing Contact</label>
                        <input type="email" class="form-control" value="${employer.contacts.billing}@${employer.name.toLowerCase().replace(/\s+/g, '')}.com">
                    </div>
                </div>
            </div>
        `;
    },

    renderSettings() {
        const employer = this.currentEmployer;

        return `
            <div class="form-section">
                <h3>Company Information</h3>
                <form id="company-settings-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="company-name">Company Name</label>
                            <input type="text" id="company-name" name="companyName" value="${employer.name}">
                        </div>
                        <div class="form-group">
                            <label for="company-phone">Phone</label>
                            <input type="tel" id="company-phone" name="companyPhone" value="${employer.phone}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="company-address">Address</label>
                        <input type="text" id="company-address" name="companyAddress" value="${employer.address}">
                    </div>
                    <div class="form-group">
                        <label for="company-email">Email</label>
                        <input type="email" id="company-email" name="companyEmail" value="${employer.email}">
                    </div>
                </form>
            </div>

            <div class="form-section">
                <h3>Key Contacts</h3>
                <div class="contacts-grid">
                    <div class="contact-card">
                        <h4>Main Contact</h4>
                        <input type="text" class="form-control" value="${employer.contacts.main}">
                        <input type="email" class="form-control mt-2" placeholder="Email">
                    </div>
                    <div class="contact-card">
                        <h4>HR Contact</h4>
                        <input type="text" class="form-control" value="${employer.contacts.hr}">
                        <input type="email" class="form-control mt-2" placeholder="Email">
                    </div>
                    <div class="contact-card">
                        <h4>Billing Contact</h4>
                        <input type="text" class="form-control" value="${employer.contacts.billing}">
                        <input type="email" class="form-control mt-2" placeholder="Email">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Program Participation</h3>
                <div class="program-settings">
                    <div class="setting-group">
                        <label>Program Types</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" ${employer.programType === 'tri-share' || employer.programType === 'both' ? 'checked' : ''}>
                                Tri-Share Program
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" ${employer.programType === 'co-share' || employer.programType === 'both' ? 'checked' : ''}>
                                Co-Share Program
                            </label>
                        </div>
                    </div>
                    
                    ${employer.programType === 'co-share' || employer.programType === 'both' ? `
                        <div class="setting-group">
                            <label>Co-Share Contribution Type</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="coShareType" value="percentage" ${employer.coShareType === 'percentage' ? 'checked' : ''}>
                                    Percentage of cost
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="coShareType" value="flat" ${employer.coShareType === 'flat' ? 'checked' : ''}>
                                    Flat weekly amount
                                </label>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <label>Co-Share Amount</label>
                            <div class="input-group">
                                <input type="number" class="form-control" value="${employer.coShareAmount}">
                                <span class="input-addon">${employer.coShareType === 'percentage' ? '%' : '$/week'}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="form-section">
                <h3>Document Management</h3>
                <div class="documents-grid">
                    <div class="document-card">
                        <div class="document-icon">📋</div>
                        <h4>Signed Agreement</h4>
                        <p>Program participation agreement</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-secondary">Download</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">🏢</div>
                        <h4>Company Profile</h4>
                        <p>Business license and information</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-secondary">Update</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">💰</div>
                        <h4>Payment Authorization</h4>
                        <p>ACH authorization form</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-secondary">Update</button>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-success" onclick="EmployerPortal.saveSettings()">Save Changes</button>
                <button type="button" class="btn btn-secondary">Cancel</button>
            </div>
        `;
    },

    bindEvents() {
        // Navigation between sections
        document.querySelectorAll('.employer-nav button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });
    },

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.employer-nav button').forEach(btn => {
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
        document.querySelectorAll('.employer-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`employer-${sectionName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    viewApplication(applicationId) {
        const application = this.mockData.applications.find(app => app.id === applicationId);
        if (!application) return;

        // Create modal or detailed view
        NEIECCPortal.showNotification(`Viewing application ${applicationId} - Feature coming soon!`, 'info');
    },

    sendBulkInvite() {
        NEIECCPortal.showNotification('Bulk invitation sent to all employees', 'success');
    },

    sendDepartmentInvite() {
        NEIECCPortal.showNotification('Department invitation feature coming soon', 'info');
    },

    sendCustomInvite() {
        NEIECCPortal.showNotification('Custom invitation feature coming soon', 'info');
    },

    saveSettings() {
        // Simulate saving settings
        NEIECCPortal.showNotification('Company settings saved successfully', 'success');
    }
};