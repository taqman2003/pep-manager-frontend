/**
 * ============================================
 * UTILS.JS - UTILITY FUNCTIONS
 * ============================================
 * Helper functions dùng chung trong app
 */

const Utils = {
    
    /**
     * Show/hide element
     * @param {string} elementId - ID của element
     * @param {boolean} show - true = show, false = hide
     */
    toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            if (show) {
                element.classList.remove('d-none');
            } else {
                element.classList.add('d-none');
            }
        }
    },
    
    /**
     * Show error alert
     * @param {string} elementId - ID của alert element
     * @param {string} message - Error message
     */
    showError(elementId, message) {
        const alertElement = document.getElementById(elementId);
        const messageElement = document.getElementById(elementId + 'Message');
        
        if (alertElement && messageElement) {
            messageElement.textContent = message;
            alertElement.classList.remove('d-none');
            
            // Auto hide sau 5 giây
            setTimeout(() => {
                alertElement.classList.add('d-none');
            }, 5000);
        }
    },
    
    /**
     * Hide error alert
     * @param {string} elementId - ID của alert element
     */
    hideError(elementId) {
        const alertElement = document.getElementById(elementId);
        if (alertElement) {
            alertElement.classList.add('d-none');
        }
    },
    
    /**
     * Toggle button loading state
     * @param {string} buttonId - ID của button
     * @param {boolean} loading - true = loading, false = normal
     */
    toggleButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        const textSpan = button.querySelector('.btn-text');
        const spinnerSpan = button.querySelector('.btn-spinner');
        
        if (loading) {
            button.disabled = true;
            if (textSpan) textSpan.classList.add('d-none');
            if (spinnerSpan) spinnerSpan.classList.remove('d-none');
        } else {
            button.disabled = false;
            if (textSpan) textSpan.classList.remove('d-none');
            if (spinnerSpan) spinnerSpan.classList.add('d-none');
        }
    },
    
    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @return {object} - {valid, strength, score, messages}
     */
    validatePassword(password) {
        const result = {
            valid: false,
            strength: 'weak',
            score: 0,
            messages: [],
            requirements: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false
            }
        };
        
        // Check length
        if (password.length >= CONFIG.PASSWORD.MIN_LENGTH) {
            result.requirements.length = true;
            result.score += 25;
        } else {
            result.messages.push(`Mật khẩu phải có ít nhất ${CONFIG.PASSWORD.MIN_LENGTH} ký tự`);
        }
        
        // Check uppercase
        if (/[A-Z]/.test(password)) {
            result.requirements.uppercase = true;
            result.score += 25;
        } else {
            result.messages.push('Mật khẩu phải có ít nhất 1 chữ HOA (A-Z)');
        }
        
        // Check lowercase
        if (/[a-z]/.test(password)) {
            result.requirements.lowercase = true;
            result.score += 25;
        } else {
            result.messages.push('Mật khẩu phải có ít nhất 1 chữ thường (a-z)');
        }
        
        // Check number
        if (/[0-9]/.test(password)) {
            result.requirements.number = true;
            result.score += 25;
        } else {
            result.messages.push('Mật khẩu phải có ít nhất 1 số (0-9)');
        }
        
        // Determine strength
        if (result.score >= 100) {
            result.strength = 'strong';
            result.valid = true;
        } else if (result.score >= 75) {
            result.strength = 'medium';
        } else {
            result.strength = 'weak';
        }
        
        return result;
    },
    
    /**
     * Format date string to Vietnamese format
     * @param {string} isoDateString - ISO date string
     * @return {string} - Formatted date (DD/MM/YYYY HH:mm)
     */
    formatDate(isoDateString) {
        if (!isoDateString) return '';
        
        const date = new Date(isoDateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
    
    /**
     * Debounce function
     * @param {function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @return {function} - Debounced function
     */
    debounce(func, delay = CONFIG.UI.DEBOUNCE_DELAY) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - 'success', 'error', 'warning', 'info'
     */
    showToast(message, type = 'success') {
        // Tạo toast element (sẽ implement Toast component sau)
        console.log(`[TOAST - ${type.toUpperCase()}] ${message}`);
        alert(message); // Temporary - sẽ replace bằng toast component
    },
    
    /**
     * Safely parse JSON
     * @param {string} jsonString - JSON string
     * @param {any} defaultValue - Default value if parse fails
     * @return {any} - Parsed object or default value
     */
    safeJSONParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('JSON parse error:', error);
            return defaultValue;
        }
    }
};

console.log('✅ Utils loaded');