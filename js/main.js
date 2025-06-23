// Main application logic
class NEIECCPortal {
    constructor() {
        this.currentUser = null;
        this.currentPortal = 'landing';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
        this.showPortal('landing');
    }

    bindEvents() {
        // Portal selection
        document.querySelectorAll('.portal-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const portal = card.dataset.portal;
                this.showPortal(portal);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const role = link.dataset.role;
                if (role) {
                    this.showPortal(role);
                }
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    showPortal(portalName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page - handle both portal pages and results pages
        let targetPage;
        if (portalName === 'landing') {
            targetPage = document.getElementById('landing-page');
        } else if (portalName.includes('-results')) {
            // Handle results pages (provider-results, employer-results)
            targetPage = document.getElementById(portalName);
        } else {
            // Handle portal pages (employee-portal, etc.)
            targetPage = document.getElementById(`${portalName}-portal`);
        }
        
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show/hide logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (portalName === 'landing' || portalName.includes('-results')) {
            // Hide logout button on landing page and results pages (public pages)
            logoutBtn.style.display = 'none';
        } else {
            // Show logout button on portal pages (authenticated pages)
            logoutBtn.style.display = 'inline-block';
        }

        this.currentPortal = portalName;

        // Load portal-specific content
        this.loadPortalContent(portalName);
    }

    loadPortalContent(portalName) {
        switch (portalName) {
            case 'employee':
                if (window.EmployeePortal) {
                    window.EmployeePortal.init();
                }
                break;
            case 'employer':
                if (window.EmployerPortal) {
                    window.EmployerPortal.init();
                }
                break;
            case 'provider':
                if (window.ProviderPortal) {
                    window.ProviderPortal.init();
                }
                break;
            case 'admin':
                if (window.AdminPortal) {
                    window.AdminPortal.init();
                }
                break;
        }
    }

    loadUserData() {
        // Load user data from localStorage
        const userData = localStorage.getItem('neiecc_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveUserData(userData) {
        this.currentUser = userData;
        localStorage.setItem('neiecc_user', JSON.stringify(userData));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('neiecc_user');
        this.showPortal('landing');
    }

    async searchProviders() {
        const input = document.querySelector('.lookup-section .lookup-input');
        const searchTerm = input.value.trim();
        
        if (!searchTerm) {
            NEIECCPortal.showNotification('Please enter a city or zip code', 'warning');
            return;
        }

        try {
            // Load mock data
            const response = await fetch('./data/mock-data.json');
            const mockData = await response.json();
            
            // For demo purposes, show all providers with search term
            const results = this.generateProviderResults(mockData.providers, searchTerm);
            
            this.showProviderResults(results, `Child Care Providers - "${searchTerm}"`, true);
        } catch (error) {
            NEIECCPortal.showNotification('Error searching providers', 'error');
        }
    }

    async searchEmployers() {
        const input = document.querySelectorAll('.lookup-section .lookup-input')[1];
        const searchTerm = input.value.trim();
        
        if (!searchTerm) {
            NEIECCPortal.showNotification('Please enter a company name', 'warning');
            return;
        }

        try {
            // Load mock data
            const response = await fetch('./data/mock-data.json');
            const mockData = await response.json();
            
            // For demo purposes, show all employers with search term
            const results = this.generateEmployerResults(mockData.employers, searchTerm);
            
            this.showEmployerResults(results, `Participating Employers - "${searchTerm}"`);
        } catch (error) {
            NEIECCPortal.showNotification('Error searching employers', 'error');
        }
    }

    async browseAllProviders() {
        try {
            // Load mock data
            const response = await fetch('./data/mock-data.json');
            const mockData = await response.json();
            
            // Generate more providers for demo
            const results = this.generateProviderResults(mockData.providers);
            
            this.showProviderResults(results, 'All Participating Child Care Providers', false);
        } catch (error) {
            NEIECCPortal.showNotification('Error loading providers', 'error');
        }
    }

    async browseAllEmployers() {
        try {
            // Load mock data
            const response = await fetch('./data/mock-data.json');
            const mockData = await response.json();
            
            // Generate more employers for demo
            const results = this.generateEmployerResults(mockData.employers);
            
            this.showEmployerResults(results, 'All Participating Employers');
        } catch (error) {
            NEIECCPortal.showNotification('Error loading employers', 'error');
        }
    }

    generateProviderResults(baseProviders, searchTerm = null) {
        // Generate additional demo providers
        const additionalProviders = [
            {
                name: "Sunshine Kids Academy",
                address: "789 Oak Street",
                city: "Fort Wayne",
                zipCode: "46802",
                phone: "(260) 555-1003",
                website: "www.sunshinekids.com",
                providerType: "licensed_center",
                capacity: 90,
                ageGroups: ["infant", "toddler", "preschool"]
            },
            {
                name: "Rainbow Bridge Daycare",
                address: "456 Maple Ave",
                city: "Auburn",
                zipCode: "46706",
                phone: "(260) 555-1004",
                website: "www.rainbowbridge.org",
                providerType: "licensed_center",
                capacity: 60,
                ageGroups: ["toddler", "preschool", "school-age"]
            },
            {
                name: "Tiny Tots Family Care",
                address: "123 Pine Lane",
                city: "Huntington",
                zipCode: "46750",
                phone: "(260) 555-1005",
                website: "www.tinytots.net",
                providerType: "licensed_home",
                capacity: 14,
                ageGroups: ["infant", "toddler"]
            },
            {
                name: "Adventure Learning Center",
                address: "321 Elm Street",
                city: "Columbia City",
                zipCode: "46725",
                phone: "(260) 555-1006",
                website: "www.adventure-learning.com",
                providerType: "licensed_center",
                capacity: 110,
                ageGroups: ["infant", "toddler", "preschool", "school-age"]
            },
            {
                name: "Little Angels Preschool",
                address: "654 Cedar Drive",
                city: "Garrett",
                zipCode: "46738",
                phone: "(260) 555-1007",
                website: "www.littleangels.edu",
                providerType: "licensed_center",
                capacity: 45,
                ageGroups: ["preschool", "school-age"]
            }
        ];

        // Combine base providers with additional ones
        const allProviders = [...baseProviders, ...additionalProviders];
        
        // Add distance for demo purposes when searching
        return allProviders.map((provider, index) => ({
            ...provider,
            // Add missing fields for demo
            address: provider.address || `${Math.floor(Math.random() * 999) + 100} Sample St`,
            city: provider.city || "Fort Wayne",
            zipCode: provider.zipCode || "46802",
            website: provider.website || `www.${provider.name.toLowerCase().replace(/\s+/g, '')}.com`,
            distance: searchTerm ? `${(Math.random() * 10 + 1).toFixed(1)} mi` : null,
            ageGroups: provider.ageGroups || ["infant", "toddler", "preschool"]
        }));
    }

    generateEmployerResults(baseEmployers, searchTerm = null) {
        // Generate additional demo employers
        const additionalEmployers = [
            {
                name: "Fort Wayne Community Schools",
                address: "1200 S Clinton St, Fort Wayne, IN 46802",
                phone: "(260) 467-1000",
                programType: "tri-share",
                employeeCount: 2800,
                participatingEmployees: 156,
                industry: "Education"
            },
            {
                name: "Auburn Memorial Hospital",
                address: "401 E 7th St, Auburn, IN 46706",
                phone: "(260) 925-4600",
                programType: "co-share",
                employeeCount: 450,
                participatingEmployees: 34,
                industry: "Healthcare"
            },
            {
                name: "Steel Dynamics Inc",
                address: "7575 W Jefferson Blvd, Fort Wayne, IN 46804",
                phone: "(260) 969-3500",
                programType: "both",
                employeeCount: 1250,
                participatingEmployees: 87,
                industry: "Manufacturing"
            },
            {
                name: "Sweetwater Sound",
                address: "5501 US Hwy 30 W, Fort Wayne, IN 46818",
                phone: "(260) 432-8176",
                programType: "co-share",
                employeeCount: 1800,
                participatingEmployees: 123,
                industry: "Technology/Retail"
            },
            {
                name: "Parkview Health System",
                address: "11109 Parkview Plaza Dr, Fort Wayne, IN 46845",
                phone: "(260) 266-1000",
                programType: "tri-share",
                employeeCount: 3200,
                participatingEmployees: 234,
                industry: "Healthcare"
            }
        ];

        // Combine base employers with additional ones
        const allEmployers = [...baseEmployers, ...additionalEmployers];
        
        return allEmployers.map(employer => ({
            ...employer,
            // Add missing fields for demo
            industry: employer.industry || "Business Services",
            employeeCount: employer.employeeCount || Math.floor(Math.random() * 500) + 50,
            participatingEmployees: employer.participatingEmployees || Math.floor(Math.random() * 30) + 5
        }));
    }

    showProviderResults(providers, title, showDistance = false) {
        // Update page title and subtitle
        document.getElementById('provider-results-title').textContent = title;
        document.getElementById('provider-results-subtitle').textContent = 
            showDistance ? 'Providers near your search location' : 'All participating providers in the network';
        
        // Generate provider cards
        const grid = document.getElementById('provider-results-grid');
        grid.innerHTML = providers.map(provider => this.createProviderCard(provider, showDistance)).join('');
        
        // Show the results page
        this.showPortal('provider-results');
    }

    showEmployerResults(employers, title) {
        // Update page title and subtitle
        document.getElementById('employer-results-title').textContent = title;
        document.getElementById('employer-results-subtitle').textContent = 
            'Companies offering child care benefits to employees';
        
        // Generate employer cards
        const grid = document.getElementById('employer-results-grid');
        grid.innerHTML = employers.map(employer => this.createEmployerCard(employer)).join('');
        
        // Show the results page
        this.showPortal('employer-results');
    }

    createProviderCard(provider, showDistance = false) {
        const distanceHtml = showDistance && provider.distance ? 
            `<span class="provider-distance">${provider.distance}</span>` : '';
        
        const websiteHtml = provider.website ? 
            `<div class="provider-info-item">
                <i>🌐</i>
                <a href="http://${provider.website}" target="_blank">${provider.website}</a>
            </div>` : '';

        return `
            <div class="provider-card">
                <div class="provider-header">
                    <h3 class="provider-name">${provider.name}</h3>
                    ${distanceHtml}
                </div>
                <div class="provider-info">
                    <div class="provider-info-item">
                        <i>📍</i>
                        <span>${provider.address}, ${provider.city} ${provider.zipCode}</span>
                    </div>
                    <div class="provider-info-item">
                        <i>📞</i>
                        <a href="tel:${provider.phone}">${provider.phone}</a>
                    </div>
                    ${websiteHtml}
                    <div class="provider-info-item">
                        <i>👶</i>
                        <span>Ages: ${provider.ageGroups ? provider.ageGroups.join(', ') : 'All ages'}</span>
                    </div>
                    <div class="provider-info-item">
                        <i>🏫</i>
                        <span>Capacity: ${provider.capacity || 'Contact for info'} children</span>
                    </div>
                </div>
                <div class="provider-actions">
                    <button class="btn btn-primary" onclick="NEIECCPortal.showNotification('Contact info displayed above', 'info')">Contact</button>
                    <button class="btn btn-secondary" onclick="NEIECCPortal.showNotification('More details would be available in full system', 'info')">View Details</button>
                </div>
            </div>
        `;
    }

    createEmployerCard(employer) {
        const programTypeDisplay = employer.programType === 'both' ? 'Tri-Share & Co-Share' : 
                                 employer.programType === 'tri-share' ? 'Tri-Share' : 'Co-Share';
        
        return `
            <div class="employer-card">
                <div class="employer-header">
                    <h3 class="employer-name">${employer.name}</h3>
                    <span class="employer-program">${programTypeDisplay}</span>
                </div>
                <div class="employer-info">
                    <div class="employer-info-item">
                        <i>📍</i>
                        <span>${employer.address}</span>
                    </div>
                    <div class="employer-info-item">
                        <i>📞</i>
                        <a href="tel:${employer.phone}">${employer.phone}</a>
                    </div>
                    <div class="employer-info-item">
                        <i>🏢</i>
                        <span>Industry: ${employer.industry}</span>
                    </div>
                </div>
                <div class="employer-stats">
                    <div class="employer-stat">
                        <span class="employer-stat-number">${employer.employeeCount.toLocaleString()}</span>
                        <span class="employer-stat-label">Total Employees</span>
                    </div>
                    <div class="employer-stat">
                        <span class="employer-stat-number">${employer.participatingEmployees}</span>
                        <span class="employer-stat-label">Participating</span>
                    </div>
                    <div class="employer-stat">
                        <span class="employer-stat-number">${Math.round((employer.participatingEmployees / employer.employeeCount) * 100)}%</span>
                        <span class="employer-stat-label">Participation Rate</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 4px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#27ae60';
                break;
            case 'error':
                notification.style.backgroundColor = '#e74c3c';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f39c12';
                break;
            default:
                notification.style.backgroundColor = '#3498db';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(phone.replace(/\D/g, ''));
    }

    static validateRequired(value) {
        return value && value.toString().trim() !== '';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NEIECCPortal();
});

// Export for use by other modules
window.NEIECCPortal = NEIECCPortal;