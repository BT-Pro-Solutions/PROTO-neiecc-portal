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

        // Show selected page
        const targetPage = document.getElementById(`${portalName}-portal`) || document.getElementById('landing-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show/hide logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (portalName === 'landing') {
            logoutBtn.style.display = 'none';
        } else {
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
            
            // Filter providers by location
            const results = mockData.providers.filter(provider => 
                provider.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.zipCode.includes(searchTerm)
            );

            this.displaySearchResults('Participating Child Care Providers', results, 'provider');
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
            
            // Filter employers by name
            const results = mockData.employers.filter(employer => 
                employer.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            this.displaySearchResults('Participating Employers', results, 'employer');
        } catch (error) {
            NEIECCPortal.showNotification('Error searching employers', 'error');
        }
    }

    displaySearchResults(title, results, type) {
        // Create modal for results
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h3>${title}</h3>
                    <button class="search-modal-close" onclick="this.closest('.search-modal').remove()">&times;</button>
                </div>
                <div class="search-modal-body">
                    ${results.length === 0 ? 
                        '<p>No results found. Please try a different search term.</p>' :
                        results.map(item => this.formatSearchResult(item, type)).join('')
                    }
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        modal.querySelector('.search-modal-content').style.cssText = `
            background: white;
            border-radius: 8px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            margin: 20px;
            width: 100%;
        `;

        modal.querySelector('.search-modal-header').style.cssText = `
            padding: 1rem 2rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        modal.querySelector('.search-modal-close').style.cssText = `
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
        `;

        modal.querySelector('.search-modal-body').style.cssText = `
            padding: 2rem;
        `;

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    formatSearchResult(item, type) {
        if (type === 'provider') {
            return `
                <div class="search-result">
                    <h4>${item.name}</h4>
                    <p><strong>Address:</strong> ${item.address}, ${item.city} ${item.zipCode}</p>
                    <p><strong>Phone:</strong> ${item.phone}</p>
                    <p><strong>Type:</strong> ${item.providerType.replace(/_/g, ' ')}</p>
                    <p><strong>Capacity:</strong> ${item.capacity} children</p>
                    <p><strong>Ages Served:</strong> ${Object.keys(item.weeklyRates).join(', ')}</p>
                </div>
            `;
        } else if (type === 'employer') {
            return `
                <div class="search-result">
                    <h4>${item.name}</h4>
                    <p><strong>Industry:</strong> ${item.industry}</p>
                    <p><strong>Program:</strong> ${item.programType}</p>
                    <p><strong>Employees:</strong> ${item.totalEmployees}</p>
                    <p><strong>Participating Since:</strong> ${NEIECCPortal.formatDate(item.joinDate)}</p>
                </div>
            `;
        }
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