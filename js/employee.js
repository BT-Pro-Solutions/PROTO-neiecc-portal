// Employee Portal functionality
window.EmployeePortal = {
    currentApplication: null,
    mockData: null,

    async init() {
        await this.loadMockData();
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
        const container = document.getElementById('employee-portal');
        if (!container) return;

        container.innerHTML = `
            <div class="portal-header">
                <h2>Employee Portal</h2>
                <p>Apply for child care assistance and manage your enrollment</p>
            </div>

            <div class="employee-nav">
                <button class="btn btn-primary active" data-section="dashboard">Dashboard</button>
                <button class="btn btn-secondary" data-section="application">New Application</button>
                <button class="btn btn-secondary" data-section="status">Application Status</button>
                <button class="btn btn-secondary" data-section="documents">Documents</button>
            </div>

            <div id="employee-dashboard" class="employee-section active">
                ${this.renderDashboard()}
            </div>

            <div id="employee-application" class="employee-section">
                ${this.renderApplicationForm()}
            </div>

            <div id="employee-status" class="employee-section">
                ${this.renderApplicationStatus()}
            </div>

            <div id="employee-documents" class="employee-section">
                ${this.renderDocuments()}
            </div>
        `;
    },

    renderDashboard() {
        const userApplications = this.mockData.applications.filter(app => 
            app.employee.email === 'j.anderson@email.com' // Mock current user
        );

        return `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Applications</h3>
                    <div class="dashboard-number">${userApplications.length}</div>
                    <p>Total Applications</p>
                </div>
                <div class="dashboard-card">
                    <h3>Active Children</h3>
                    <div class="dashboard-number">${userApplications.reduce((sum, app) => sum + app.children.length, 0)}</div>
                    <p>Children Enrolled</p>
                </div>
                <div class="dashboard-card">
                    <h3>Monthly Savings</h3>
                    <div class="dashboard-number">${NEIECCPortal.formatCurrency(528)}</div>
                    <p>Your Savings</p>
                </div>
                <div class="dashboard-card">
                    <h3>Next Renewal</h3>
                    <div class="dashboard-number">45</div>
                    <p>Days Remaining</p>
                </div>
            </div>

            <div class="form-section">
                <h3>Recent Applications</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Children</th>
                                <th>Provider</th>
                                <th>Status</th>
                                <th>Date Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userApplications.map(app => {
                                const provider = this.mockData.providers.find(p => p.id === app.providerId);
                                return `
                                    <tr>
                                        <td>${app.id}</td>
                                        <td>${app.children.map(c => c.name).join(', ')}</td>
                                        <td>${provider ? provider.name : 'N/A'}</td>
                                        <td><span class="status status-${app.status.replace(/_/g, '-')}">${app.status.replace(/_/g, ' ')}</span></td>
                                        <td>${NEIECCPortal.formatDate(app.submittedDate)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Notifications</h3>
                <div class="notification-list">
                    <div class="notification-item">
                        <div class="notification-icon">📋</div>
                        <div class="notification-content">
                            <h4>Application Approved</h4>
                            <p>Your application for Emma and Liam has been approved and they are now participating in the Tri-Share program.</p>
                            <small>2 days ago</small>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">📅</div>
                        <div class="notification-content">
                            <h4>Renewal Reminder</h4>
                            <p>Your program renewal is due in 45 days. Please prepare your updated documents.</p>
                            <small>1 week ago</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderApplicationForm() {
        return `
            <form id="employee-application-form" class="application-form">
                <div class="form-section">
                    <h3>Household Income Information</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="annual-salary">Annual Salary (All Adults)</label>
                            <input type="number" id="annual-salary" name="annualSalary" required>
                        </div>
                        <div class="form-group">
                            <label for="family-size">Family Size</label>
                            <input type="number" id="family-size" name="familySize" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="num-adults">Number of Adults</label>
                            <input type="number" id="num-adults" name="numAdults" required>
                        </div>
                        <div class="form-group">
                            <label for="num-children">Number of Children</label>
                            <input type="number" id="num-children" name="numChildren" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pay-stubs">Upload Pay Stubs (2 recent for each adult)</label>
                        <input type="file" id="pay-stubs" name="payStubs" multiple accept=".pdf,.jpg,.png">
                    </div>
                    <div class="form-group">
                        <label for="additional-income">Additional Income (child support, disability, etc.)</label>
                        <textarea id="additional-income" name="additionalIncome" rows="3"></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Employer Verification</h3>
                    <div class="form-group">
                        <label for="employer">Select Your Employer</label>
                        <select id="employer" name="employer" required>
                            <option value="">Choose your employer...</option>
                            ${this.mockData.employers.map(emp => 
                                `<option value="${emp.id}">${emp.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div id="employer-details" class="employer-details hidden">
                        <!-- Employer details will be populated here -->
                    </div>
                </div>

                <div class="form-section">
                    <h3>Child Care Provider Details</h3>
                    <div class="form-group">
                        <label for="provider">Select Child Care Provider</label>
                        <select id="provider" name="provider" required>
                            <option value="">Choose your provider...</option>
                            ${this.mockData.providers.map(prov => 
                                `<option value="${prov.id}">${prov.name} - ${prov.address}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div id="provider-details" class="provider-details hidden">
                        <!-- Provider details will be populated here -->
                    </div>
                </div>

                <div class="form-section">
                    <h3>Child Information</h3>
                    <div id="children-container">
                        <div class="child-form">
                            <h4>Child 1</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="child-1-name">Child's Name</label>
                                    <input type="text" id="child-1-name" name="children[0][name]" required>
                                </div>
                                <div class="form-group">
                                    <label for="child-1-age">Age</label>
                                    <input type="number" id="child-1-age" name="children[0][age]" min="0" max="12" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="child-1-cost">Weekly Cost of Care</label>
                                <input type="number" id="child-1-cost" name="children[0][cost]" step="0.01" required>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="add-child" class="btn btn-secondary">Add Another Child</button>
                </div>

                <div class="form-section">
                    <h3>Agreements</h3>
                    <div class="agreements-list">
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="agreement1" required>
                                I agree to the Tri-Share/Co-Share Program Terms and Conditions
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="agreement2" required>
                                I consent to income verification and reporting requirements
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="agreement3" required>
                                I understand that false information may result in program termination
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-success">Submit Application</button>
                    <button type="button" class="btn btn-secondary" id="save-draft">Save as Draft</button>
                </div>
            </form>
        `;
    },

    renderApplicationStatus() {
        const userApplications = this.mockData.applications.filter(app => 
            app.employee.email === 'j.anderson@email.com'
        );

        return `
            <div class="form-section">
                <h3>Application Status</h3>
                ${userApplications.map(app => {
                    const provider = this.mockData.providers.find(p => p.id === app.providerId);
                    const employer = this.mockData.employers.find(e => e.id === app.employerId);
                    
                    return `
                        <div class="application-card">
                            <div class="application-header">
                                <h4>Application ${app.id}</h4>
                                <span class="status status-${app.status.replace(/_/g, '-')}">${app.status.replace(/_/g, ' ')}</span>
                            </div>
                            <div class="application-details">
                                <div class="detail-row">
                                    <strong>Submitted:</strong> ${NEIECCPortal.formatDate(app.submittedDate)}
                                </div>
                                <div class="detail-row">
                                    <strong>Employer:</strong> ${employer ? employer.name : 'N/A'}
                                </div>
                                <div class="detail-row">
                                    <strong>Provider:</strong> ${provider ? provider.name : 'N/A'}
                                </div>
                                <div class="detail-row">
                                    <strong>Program Type:</strong> ${app.programType}
                                </div>
                                <div class="detail-row">
                                    <strong>Children:</strong> ${app.children.map(c => `${c.name} (${c.age})`).join(', ')}
                                </div>
                                <div class="detail-row">
                                    <strong>Total Weekly Cost:</strong> ${NEIECCPortal.formatCurrency(app.totalWeeklyCost)}
                                </div>
                                ${app.totalSDC ? `
                                    <div class="detail-row">
                                        <strong>SDC Contribution:</strong> ${NEIECCPortal.formatCurrency(app.totalSDC)}/week
                                    </div>
                                ` : ''}
                                <div class="detail-row">
                                    <strong>Employer Contribution:</strong> ${NEIECCPortal.formatCurrency(app.totalEmployer)}/week
                                </div>
                                <div class="detail-row">
                                    <strong>Your Contribution:</strong> ${NEIECCPortal.formatCurrency(app.totalEmployee)}/week
                                </div>
                                ${app.notes ? `
                                    <div class="detail-row">
                                        <strong>Notes:</strong> ${app.notes}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderDocuments() {
        return `
            <div class="form-section">
                <h3>Required Documents</h3>
                <div class="documents-grid">
                    <div class="document-card">
                        <div class="document-icon">📄</div>
                        <h4>Pay Stubs</h4>
                        <p>Upload 2 recent pay stubs for each adult</p>
                        <button class="btn btn-primary">Upload</button>
                        <div class="document-status">✅ Uploaded</div>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">🏠</div>
                        <h4>Proof of Residence</h4>
                        <p>Utility bill or lease agreement</p>
                        <button class="btn btn-primary">Upload</button>
                        <div class="document-status">⏳ Pending</div>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">👶</div>
                        <h4>Child's Birth Certificate</h4>
                        <p>Official birth certificate for each child</p>
                        <button class="btn btn-primary">Upload</button>
                        <div class="document-status">✅ Uploaded</div>
                    </div>
                    <div class="document-card">
                        <div class="document-icon">📋</div>
                        <h4>Application Form</h4>
                        <p>Completed application form</p>
                        <button class="btn btn-secondary">Download</button>
                        <div class="document-status">✅ Complete</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Document History</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Document</th>
                                <th>Upload Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pay Stub - Adult 1</td>
                                <td>2024-01-10</td>
                                <td><span class="status status-approved">Approved</span></td>
                                <td><button class="btn btn-secondary">View</button></td>
                            </tr>
                            <tr>
                                <td>Pay Stub - Adult 2</td>
                                <td>2024-01-10</td>
                                <td><span class="status status-approved">Approved</span></td>
                                <td><button class="btn btn-secondary">View</button></td>
                            </tr>
                            <tr>
                                <td>Birth Certificate - Emma</td>
                                <td>2024-01-12</td>
                                <td><span class="status status-approved">Approved</span></td>
                                <td><button class="btn btn-secondary">View</button></td>
                            </tr>
                            <tr>
                                <td>Birth Certificate - Liam</td>
                                <td>2024-01-12</td>
                                <td><span class="status status-approved">Approved</span></td>
                                <td><button class="btn btn-secondary">View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Navigation between sections
        document.querySelectorAll('.employee-nav button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Employer selection
        const employerSelect = document.getElementById('employer');
        if (employerSelect) {
            employerSelect.addEventListener('change', (e) => {
                this.showEmployerDetails(e.target.value);
            });
        }

        // Provider selection
        const providerSelect = document.getElementById('provider');
        if (providerSelect) {
            providerSelect.addEventListener('change', (e) => {
                this.showProviderDetails(e.target.value);
            });
        }

        // Add child functionality
        const addChildBtn = document.getElementById('add-child');
        if (addChildBtn) {
            addChildBtn.addEventListener('click', () => {
                this.addChildForm();
            });
        }

        // Form submission
        const applicationForm = document.getElementById('employee-application-form');
        if (applicationForm) {
            applicationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitApplication();
            });
        }

        // Save draft
        const saveDraftBtn = document.getElementById('save-draft');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                this.saveDraft();
            });
        }
    },

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.employee-nav button').forEach(btn => {
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
        document.querySelectorAll('.employee-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`employee-${sectionName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    showEmployerDetails(employerId) {
        const employer = this.mockData.employers.find(emp => emp.id === employerId);
        const detailsContainer = document.getElementById('employer-details');
        
        if (!employer || !detailsContainer) return;

        detailsContainer.innerHTML = `
            <div class="employer-info">
                <h4>${employer.name}</h4>
                <p><strong>Address:</strong> ${employer.address}</p>
                <p><strong>Program Type:</strong> ${employer.programType}</p>
                ${employer.coShareType ? `<p><strong>Co-Share:</strong> ${employer.coShareType} - ${employer.coShareType === 'percentage' ? employer.coShareAmount + '%' : NEIECCPortal.formatCurrency(employer.coShareAmount) + '/week'}</p>` : ''}
            </div>
        `;
        detailsContainer.classList.remove('hidden');
    },

    showProviderDetails(providerId) {
        const provider = this.mockData.providers.find(prov => prov.id === providerId);
        const detailsContainer = document.getElementById('provider-details');
        
        if (!provider || !detailsContainer) return;

        detailsContainer.innerHTML = `
            <div class="provider-info">
                <h4>${provider.name}</h4>
                <p><strong>Address:</strong> ${provider.address}</p>
                <p><strong>Phone:</strong> ${provider.phone}</p>
                <p><strong>License:</strong> ${provider.licenseNumber}</p>
                <p><strong>Type:</strong> ${provider.providerType.replace(/_/g, ' ')}</p>
                <div class="weekly-rates">
                    <h5>Weekly Rates:</h5>
                    <ul>
                        ${Object.entries(provider.weeklyRates).map(([age, rate]) => 
                            `<li>${age}: ${NEIECCPortal.formatCurrency(rate)}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
        detailsContainer.classList.remove('hidden');
    },

    addChildForm() {
        const container = document.getElementById('children-container');
        const childCount = container.children.length;
        
        const childForm = document.createElement('div');
        childForm.className = 'child-form';
        childForm.innerHTML = `
            <h4>Child ${childCount + 1}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="child-${childCount}-name">Child's Name</label>
                    <input type="text" id="child-${childCount}-name" name="children[${childCount}][name]" required>
                </div>
                <div class="form-group">
                    <label for="child-${childCount}-age">Age</label>
                    <input type="number" id="child-${childCount}-age" name="children[${childCount}][age]" min="0" max="12" required>
                </div>
            </div>
            <div class="form-group">
                <label for="child-${childCount}-cost">Weekly Cost of Care</label>
                <input type="number" id="child-${childCount}-cost" name="children[${childCount}][cost]" step="0.01" required>
            </div>
            <button type="button" class="btn btn-danger remove-child">Remove Child</button>
        `;
        
        container.appendChild(childForm);

        // Add remove functionality
        childForm.querySelector('.remove-child').addEventListener('click', () => {
            childForm.remove();
        });
    },

    submitApplication() {
        // Collect form data
        const formData = new FormData(document.getElementById('employee-application-form'));
        
        // Basic validation
        if (!this.validateForm(formData)) {
            return;
        }

        // Simulate application submission
        NEIECCPortal.showNotification('Application submitted successfully! You will receive confirmation within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('employee-application-form').reset();
        
        // Show status section
        this.showSection('status');
    },

    saveDraft() {
        const formData = new FormData(document.getElementById('employee-application-form'));
        // Save to localStorage
        const draftData = Object.fromEntries(formData);
        localStorage.setItem('employee_application_draft', JSON.stringify(draftData));
        
        NEIECCPortal.showNotification('Application saved as draft', 'info');
    },

    validateForm(formData) {
        const requiredFields = ['annualSalary', 'familySize', 'numAdults', 'numChildren', 'employer', 'provider'];
        
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                NEIECCPortal.showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }

        // Check agreements
        if (!formData.get('agreement1') || !formData.get('agreement2') || !formData.get('agreement3')) {
            NEIECCPortal.showNotification('Please accept all required agreements', 'error');
            return false;
        }

        return true;
    }
};