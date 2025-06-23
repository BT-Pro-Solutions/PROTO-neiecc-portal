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