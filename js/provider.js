// Provider Portal functionality
window.ProviderPortal = {
    mockData: null,
    currentProvider: null,

    async init() {
        await this.loadMockData();
        this.currentProvider = this.mockData.providers[0]; // Mock current provider
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
        const container = document.getElementById('provider-portal');
        if (!container) return;

        container.innerHTML = `
            <div class="portal-header">
                <h2>Child Care Provider Portal</h2>
                <p>Enroll in the system and submit billing</p>
            </div>

            <div class="provider-nav">
                <button class="btn btn-primary active" data-section="dashboard">Dashboard</button>
                <button class="btn btn-secondary" data-section="enrollment">Enrollment</button>
                <button class="btn btn-secondary" data-section="billing">Billing</button>
                <button class="btn btn-secondary" data-section="documents">Documents</button>
                <button class="btn btn-secondary" data-section="settings">Settings</button>
            </div>

            <div id="provider-dashboard" class="provider-section active">
                ${this.renderDashboard()}
            </div>

            <div id="provider-enrollment" class="provider-section">
                ${this.renderEnrollment()}
            </div>

            <div id="provider-billing" class="provider-section">
                ${this.renderBilling()}
            </div>

            <div id="provider-documents" class="provider-section">
                ${this.renderDocuments()}
            </div>

            <div id="provider-settings" class="provider-section">
                ${this.renderSettings()}
            </div>
        `;
    },

    renderDashboard() {
        const provider = this.currentProvider;
        const enrolledChildren = this.mockData.applications
            .filter(app => app.providerId === provider.id && app.status === 'approved_participating')
            .reduce((sum, app) => sum + app.children.length, 0);
        
        const monthlyRevenue = this.mockData.applications
            .filter(app => app.providerId === provider.id && app.status === 'approved_participating')
            .reduce((sum, app) => sum + app.totalWeeklyCost, 0) * 4.33;

        const pendingPayments = this.mockData.applications
            .filter(app => app.providerId === provider.id && app.status === 'approved_participating')
            .reduce((sum, app) => sum + app.totalWeeklyCost, 0) * 2; // 2 weeks pending

        return `
            <div class="provider-header">
                <h3>${provider.name}</h3>
                <p>${provider.address}</p>
                <div class="provider-badges">
                    <span class="badge badge-primary">${provider.providerType.replace(/_/g, ' ')}</span>
                    <span class="badge badge-secondary">License: ${provider.licenseNumber}</span>
                    ${provider.isEmployer ? '<span class="badge badge-success">Employer-Provider</span>' : ''}
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Total Capacity</h3>
                    <div class="dashboard-number">${provider.capacity}</div>
                    <p>Licensed Capacity</p>
                </div>
                <div class="dashboard-card">
                    <h3>Current Enrollment</h3>
                    <div class="dashboard-number">${provider.currentEnrollment}</div>
                    <p>Children Enrolled</p>
                </div>
                <div class="dashboard-card">
                    <h3>Program Children</h3>
                    <div class="dashboard-number">${enrolledChildren}</div>
                    <p>Tri-Share/Co-Share</p>
                </div>
                <div class="dashboard-card">
                    <h3>Monthly Revenue</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(monthlyRevenue)}</div>
                    <p>From Program</p>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Pending Payments</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(pendingPayments)}</div>
                    <p>Awaiting Payment</p>
                </div>
                <div class="dashboard-card">
                    <h3>Utilization Rate</h3>
                    <div class="dashboard-number">${Math.round((provider.currentEnrollment / provider.capacity) * 100)}%</div>
                    <p>Capacity Utilized</p>
                </div>
                <div class="dashboard-card">
                    <h3>Program Rate</h3>
                    <div class="dashboard-number">${Math.round((enrolledChildren / provider.currentEnrollment) * 100)}%</div>
                    <p>Children in Program</p>
                </div>
                <div class="dashboard-card">
                    <h3>Available Spots</h3>
                    <div class="dashboard-number">${provider.capacity - provider.currentEnrollment}</div>
                    <p>Open Positions</p>
                </div>
            </div>

            <div class="form-section">
                <h3>Recent Activity</h3>
                <div class="activity-timeline">
                    <div class="activity-item">
                        <div class="activity-icon">💰</div>
                        <div class="activity-content">
                            <h4>Payment Received</h4>
                            <p>February payment processed - ${NEIECCPortal.formatCurrency(monthlyRevenue)}</p>
                            <small>2 days ago</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">📋</div>
                        <div class="activity-content">
                            <h4>Billing Submitted</h4>
                            <p>March billing submitted for ${enrolledChildren} children</p>
                            <small>5 days ago</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">👶</div>
                        <div class="activity-content">
                            <h4>New Enrollment</h4>
                            <p>Emma Anderson enrolled in Tri-Share program</p>
                            <small>1 week ago</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Weekly Rates Overview</h3>
                <div class="rates-grid">
                    ${Object.entries(provider.weeklyRates).map(([ageGroup, rate]) => `
                        <div class="rate-card">
                            <h4>${ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}</h4>
                            <div class="rate-amount">${NEIECCPortal.formatCurrency(rate)}</div>
                            <p>per week</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderEnrollment() {
        const provider = this.currentProvider;
        const enrolledApplications = this.mockData.applications.filter(app => 
            app.providerId === provider.id && app.status === 'approved_participating'
        );

        return `
            <div class="form-section">
                <h3>Enrolled Children</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Child Name</th>
                                <th>Age Group</th>
                                <th>Parent/Guardian</th>
                                <th>Program Type</th>
                                <th>Weekly Rate</th>
                                <th>Start Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrolledApplications.flatMap(app => 
                                app.children.map(child => `
                                    <tr>
                                        <td>${child.name}</td>
                                        <td>${child.ageGroup}</td>
                                        <td>${app.employee.firstName} ${app.employee.lastName}</td>
                                        <td><span class="badge badge-primary">${app.programType}</span></td>
                                        <td>${NEIECCPortal.formatCurrency(child.weeklyChildcareCost)}</td>
                                        <td>${NEIECCPortal.formatDate(app.approvedDate)}</td>
                                        <td><span class="status status-approved">Active</span></td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm">View</button>
                                            <button class="btn btn-primary btn-sm">Bill</button>
                                        </td>
                                    </tr>
                                `)
                            ).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Pending Enrollments</h3>
                <div class="pending-enrollments">
                    <div class="enrollment-card">
                        <h4>Sophia Brown</h4>
                        <p><strong>Parent:</strong> Michael Brown</p>
                        <p><strong>Age:</strong> 2 years (Toddler)</p>
                        <p><strong>Program:</strong> Co-Share</p>
                        <p><strong>Requested Rate:</strong> ${NEIECCPortal.formatCurrency(145)}/week</p>
                        <div class="enrollment-actions">
                            <button class="btn btn-success">Accept Enrollment</button>
                            <button class="btn btn-secondary">Request Info</button>
                            <button class="btn btn-danger">Decline</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Enrollment Capacity by Age Group</h3>
                <div class="capacity-breakdown">
                    <div class="capacity-item">
                        <h4>Infants (0-12 months)</h4>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: 80%"></div>
                        </div>
                        <p>8 of 10 spots filled</p>
                    </div>
                    <div class="capacity-item">
                        <h4>Toddlers (13-24 months)</h4>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: 75%"></div>
                        </div>
                        <p>15 of 20 spots filled</p>
                    </div>
                    <div class="capacity-item">
                        <h4>Preschool (2-4 years)</h4>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: 90%"></div>
                        </div>
                        <p>45 of 50 spots filled</p>
                    </div>
                    <div class="capacity-item">
                        <h4>School Age (5+ years)</h4>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: 70%"></div>
                        </div>
                        <p>28 of 40 spots filled</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderBilling() {
        const provider = this.currentProvider;
        const enrolledApplications = this.mockData.applications.filter(app => 
            app.providerId === provider.id && app.status === 'approved_participating'
        );

        const currentMonthBilling = enrolledApplications.reduce((sum, app) => sum + app.totalWeeklyCost, 0) * 4.33;

        // Mock billing history
        const billingHistory = [
            { 
                month: '2024-03', 
                amount: currentMonthBilling, 
                status: 'draft',
                children: enrolledApplications.reduce((sum, app) => sum + app.children.length, 0),
                submitDate: null
            },
            { 
                month: '2024-02', 
                amount: currentMonthBilling - 100, 
                status: 'paid',
                children: enrolledApplications.reduce((sum, app) => sum + app.children.length, 0),
                submitDate: '2024-02-28',
                paidDate: '2024-03-15'
            },
            { 
                month: '2024-01', 
                amount: currentMonthBilling - 200, 
                status: 'paid',
                children: enrolledApplications.reduce((sum, app) => sum + app.children.length, 0) - 1,
                submitDate: '2024-01-31',
                paidDate: '2024-02-15'
            }
        ];

        return `
            <div class="billing-summary">
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Current Month</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(currentMonthBilling)}</div>
                        <p>March 2024 - Draft</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Last Payment</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(currentMonthBilling - 100)}</div>
                        <p>February 2024</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>YTD Revenue</h3>
                        <div class="dashboard-number">${NEIECCPortal.formatCurrency(currentMonthBilling * 2.5)}</div>
                        <p>2024 Program Revenue</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Pending Review</h3>
                        <div class="dashboard-number">0</div>
                        <p>Invoices Under Review</p>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Current Month Billing - March 2024</h3>
                <div class="billing-form">
                    <div class="billing-children">
                        <h4>Children to Bill</h4>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" id="select-all" checked>
                                        </th>
                                        <th>Child Name</th>
                                        <th>Age Group</th>
                                        <th>Days Attended</th>
                                        <th>Weekly Rate</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${enrolledApplications.flatMap(app => 
                                        app.children.map(child => `
                                            <tr>
                                                <td><input type="checkbox" checked></td>
                                                <td>${child.name}</td>
                                                <td>${child.ageGroup}</td>
                                                <td>
                                                    <input type="number" class="form-control form-control-sm" value="20" min="0" max="22">
                                                </td>
                                                <td>${NEIECCPortal.formatCurrency(child.weeklyChildcareCost)}</td>
                                                <td>${NEIECCPortal.formatCurrency(child.weeklyChildcareCost * 4.33)}</td>
                                            </tr>
                                        `)
                                    ).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="5"><strong>Total Monthly Billing</strong></td>
                                        <td><strong>${NEIECCPortal.formatCurrency(currentMonthBilling)}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div class="billing-breakdown">
                        <h4>Payment Breakdown</h4>
                        <div class="breakdown-grid">
                            ${enrolledApplications.map(app => `
                                <div class="breakdown-card">
                                    <h5>${app.employee.firstName} ${app.employee.lastName}</h5>
                                    <div class="breakdown-details">
                                        ${app.totalSDC ? `<div class="breakdown-item">
                                            <span>SDC Portion:</span>
                                            <span>${NEIECCPortal.formatCurrency(app.totalSDC * 4.33)}</span>
                                        </div>` : ''}
                                        <div class="breakdown-item">
                                            <span>Employer Portion:</span>
                                            <span>${NEIECCPortal.formatCurrency(app.totalEmployer * 4.33)}</span>
                                        </div>
                                        <div class="breakdown-item">
                                            <span>Employee Portion:</span>
                                            <span>${NEIECCPortal.formatCurrency(app.totalEmployee * 4.33)}</span>
                                        </div>
                                        <div class="breakdown-total">
                                            <span><strong>Total:</strong></span>
                                            <span><strong>${NEIECCPortal.formatCurrency(app.totalWeeklyCost * 4.33)}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="billing-actions">
                        <button class="btn btn-primary" onclick="ProviderPortal.submitBilling()">Submit Monthly Billing</button>
                        <button class="btn btn-secondary" onclick="ProviderPortal.saveDraft()">Save as Draft</button>
                        <button class="btn btn-secondary">Preview Invoice</button>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Billing History</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Billing Period</th>
                                <th>Children</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Submit Date</th>
                                <th>Payment Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${billingHistory.map(bill => `
                                <tr>
                                    <td>${new Date(bill.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                                    <td>${bill.children}</td>
                                    <td>${NEIECCPortal.formatCurrency(bill.amount)}</td>
                                    <td><span class="status status-${bill.status}">${bill.status}</span></td>
                                    <td>${bill.submitDate ? NEIECCPortal.formatDate(bill.submitDate) : '-'}</td>
                                    <td>${bill.paidDate ? NEIECCPortal.formatDate(bill.paidDate) : '-'}</td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm">View</button>
                                        ${bill.status === 'draft' ? '<button class="btn btn-primary btn-sm">Edit</button>' : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Attendance Tracking</h3>
                <p>Upload attendance logs to support your billing submissions.</p>
                <div class="upload-area">
                    <div class="upload-box">
                        <div class="upload-icon">📁</div>
                        <h4>Upload Attendance Logs</h4>
                        <p>Drag and drop files here or click to browse</p>
                        <button class="btn btn-primary">Choose Files</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderDocuments() {
        const provider = this.currentProvider;

        return `
            <div class="form-section">
                <h3>Required Documents</h3>
                <div class="documents-grid">
                    <div class="document-card">
                        <div class="document-icon">📋</div>
                        <h4>Provider Agreement</h4>
                        <p>Signed participation agreement</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-secondary">Download</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">🏛️</div>
                        <h4>License Certificate</h4>
                        <p>Current childcare license</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-primary">Update</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">📄</div>
                        <h4>W-9 Form</h4>
                        <p>Tax identification form</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-secondary">Download</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">💰</div>
                        <h4>Current Tuition Rates</h4>
                        <p>Rate schedule document</p>
                        <div class="document-status">⏳ Update Required</div>
                        <button class="btn btn-primary">Upload</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">📖</div>
                        <h4>Parent Handbook</h4>
                        <p>Current parent handbook</p>
                        <div class="document-status">✅ On File</div>
                        <button class="btn btn-secondary">View</button>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">🛡️</div>
                        <h4>Insurance Certificate</h4>
                        <p>Liability insurance certificate</p>
                        <div class="document-status">⚠️ Expires Soon</div>
                        <button class="btn btn-primary">Update</button>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Monthly Reports</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Report Type</th>
                                <th>Period</th>
                                <th>Generated Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Attendance Report</td>
                                <td>February 2024</td>
                                <td>2024-03-01</td>
                                <td><span class="status status-approved">Complete</span></td>
                                <td><button class="btn btn-secondary btn-sm">Download</button></td>
                            </tr>
                            <tr>
                                <td>Billing Summary</td>
                                <td>February 2024</td>
                                <td>2024-03-01</td>
                                <td><span class="status status-approved">Complete</span></td>
                                <td><button class="btn btn-secondary btn-sm">Download</button></td>
                            </tr>
                            <tr>
                                <td>Enrollment Report</td>
                                <td>February 2024</td>
                                <td>2024-03-01</td>
                                <td><span class="status status-approved">Complete</span></td>
                                <td><button class="btn btn-secondary btn-sm">Download</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Document Upload</h3>
                <div class="upload-section">
                    <div class="form-group">
                        <label for="document-type">Document Type</label>
                        <select id="document-type" class="form-control">
                            <option value="">Select document type...</option>
                            <option value="license">License Update</option>
                            <option value="insurance">Insurance Certificate</option>
                            <option value="rates">Tuition Rates</option>
                            <option value="handbook">Parent Handbook</option>
                            <option value="attendance">Attendance Log</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="document-file">Choose File</label>
                        <input type="file" id="document-file" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="document-notes">Notes (Optional)</label>
                        <textarea id="document-notes" class="form-control" rows="3"></textarea>
                    </div>
                    <button class="btn btn-primary">Upload Document</button>
                </div>
            </div>
        `;
    },

    renderSettings() {
        const provider = this.currentProvider;

        return `
            <div class="form-section">
                <h3>Provider Information</h3>
                <form id="provider-settings-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="provider-name">Provider Name</label>
                            <input type="text" id="provider-name" name="providerName" value="${provider.name}">
                        </div>
                        <div class="form-group">
                            <label for="license-number">License Number</label>
                            <input type="text" id="license-number" name="licenseNumber" value="${provider.licenseNumber}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="provider-address">Address</label>
                        <input type="text" id="provider-address" name="providerAddress" value="${provider.address}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="provider-phone">Phone</label>
                            <input type="tel" id="provider-phone" name="providerPhone" value="${provider.phone}">
                        </div>
                        <div class="form-group">
                            <label for="provider-email">Email</label>
                            <input type="email" id="provider-email" name="providerEmail" value="${provider.email}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="provider-type">Provider Type</label>
                            <select id="provider-type" name="providerType">
                                <option value="licensed_center" ${provider.providerType === 'licensed_center' ? 'selected' : ''}>Licensed Center</option>
                                <option value="licensed_home" ${provider.providerType === 'licensed_home' ? 'selected' : ''}>Licensed Home</option>
                                <option value="registered_ministry" ${provider.providerType === 'registered_ministry' ? 'selected' : ''}>Registered Ministry</option>
                                <option value="school_based" ${provider.providerType === 'school_based' ? 'selected' : ''}>School-based Program</option>
                                <option value="other" ${provider.providerType === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="capacity">Licensed Capacity</label>
                            <input type="number" id="capacity" name="capacity" value="${provider.capacity}">
                        </div>
                    </div>
                </form>
            </div>

            <div class="form-section">
                <h3>Contact Information</h3>
                <div class="contacts-grid">
                    <div class="contact-card">
                        <h4>Director</h4>
                        <input type="text" class="form-control" value="${provider.contacts.director}">
                        <input type="email" class="form-control mt-2" placeholder="Email">
                        <input type="tel" class="form-control mt-2" placeholder="Phone">
                    </div>
                    <div class="contact-card">
                        <h4>Billing Contact</h4>
                        <input type="text" class="form-control" value="${provider.contacts.billing}">
                        <input type="email" class="form-control mt-2" placeholder="Email">
                        <input type="tel" class="form-control mt-2" placeholder="Phone">
                    </div>
                    <div class="contact-card">
                        <h4>Assistant Director</h4>
                        <input type="text" class="form-control" placeholder="Name">
                        <input type="email" class="form-control mt-2" placeholder="Email">
                        <input type="tel" class="form-control mt-2" placeholder="Phone">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Weekly Rates</h3>
                <div class="rates-settings">
                    ${Object.entries(provider.weeklyRates).map(([ageGroup, rate]) => `
                        <div class="rate-setting">
                            <label for="${ageGroup}-rate">${ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)} Rate</label>
                            <div class="input-group">
                                <span class="input-addon">$</span>
                                <input type="number" id="${ageGroup}-rate" name="${ageGroup}Rate" value="${rate}" step="0.01">
                                <span class="input-addon">per week</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="form-section">
                <h3>Program Settings</h3>
                <div class="program-settings">
                    <div class="setting-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Accept Tri-Share applications
                        </label>
                    </div>
                    <div class="setting-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Accept Co-Share applications
                        </label>
                    </div>
                    <div class="setting-group">
                        <label class="checkbox-label">
                            <input type="checkbox"> Automatic billing submission
                        </label>
                        <p class="setting-description">Automatically submit monthly billing on the last day of each month</p>
                    </div>
                    <div class="setting-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Email notifications
                        </label>
                        <p class="setting-description">Receive email notifications for payments, enrollments, and updates</p>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Integration Settings</h3>
                <div class="integration-settings">
                    <div class="integration-card">
                        <h4>Brightwheel Integration</h4>
                        <p>Connect your Brightwheel account for automatic attendance tracking</p>
                        <button class="btn btn-primary">Connect</button>
                    </div>
                    <div class="integration-card">
                        <h4>Procare Integration</h4>
                        <p>Connect your Procare system for seamless billing</p>
                        <button class="btn btn-primary">Connect</button>
                    </div>
                    <div class="integration-card">
                        <h4>QuickBooks Integration</h4>
                        <p>Sync payments and invoices with your QuickBooks account</p>
                        <button class="btn btn-secondary">Connected</button>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-success" onclick="ProviderPortal.saveSettings()">Save Changes</button>
                <button type="button" class="btn btn-secondary">Cancel</button>
            </div>
        `;
    },

    bindEvents() {
        // Navigation between sections
        document.querySelectorAll('.provider-nav button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Select all checkbox functionality
        const selectAllCheckbox = document.getElementById('select-all');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const childCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
                childCheckboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
            });
        }
    },

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.provider-nav button').forEach(btn => {
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
        document.querySelectorAll('.provider-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`provider-${sectionName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    submitBilling() {
        NEIECCPortal.showNotification('Monthly billing submitted successfully! Payment will be processed within 5-7 business days.', 'success');
    },

    saveDraft() {
        NEIECCPortal.showNotification('Billing saved as draft', 'info');
    },

    saveSettings() {
        NEIECCPortal.showNotification('Provider settings saved successfully', 'success');
    }
};