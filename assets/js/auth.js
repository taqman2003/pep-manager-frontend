/**
 * ============================================
 * AUTH.JS - AUTHENTICATION LOGIC
 * ============================================
 * Xử lý login, logout, change password, session management
 */

const Auth = {
    
    /**
     * Khởi tạo authentication module
     */
    init() {
        console.log('🔐 Initializing Auth module...');
        
        // a) Bind event listeners
        this.bindLoginForm();
        this.bindPasswordToggles();
        this.bindChangePasswordForm();
        this.bindPasswordStrengthChecker();
        
        // b) Check existing session
        this.checkSession();
        
        console.log('✅ Auth module initialized');
    },
    
    /**
     * Bind login form submit
     */
    bindLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) {
            console.error('❌ Login form not found');
            return;
        }
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                Utils.showError('loginError', 'Vui lòng nhập đầy đủ email và mật khẩu');
                return;
            }
            
            Utils.hideError('loginError');
            Utils.toggleButtonLoading('loginButton', true);
            
            try {
                const response = await API.login(email, password);
                console.log('✅ Login successful:', response);
                
                this.saveSession(response.data.token, response.data.user);
                
                if (response.data.mustChangePassword) {
                    console.log('⚠️ Must change password');
                    Utils.toggleElement('loginView', false);
                    this.showChangePasswordModal(true);
                } else {
                    this.redirectToApp();
                }
                
            } catch (error) {
                console.error('❌ Login failed:', error);
                Utils.showError('loginError', error.message);
            } finally {
                Utils.toggleButtonLoading('loginButton', false);
            }
        });
    },
    
    /**
     * Bind password toggle buttons (show/hide password)
     */
    bindPasswordToggles() {
        const toggleLogin = document.getElementById('toggleLoginPassword');
        if (toggleLogin) {
            toggleLogin.addEventListener('click', () => {
                const passwordInput = document.getElementById('loginPassword');
                const icon = toggleLogin.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });
        }
        
        const toggleNew = document.getElementById('toggleNewPassword');
        if (toggleNew) {
            toggleNew.addEventListener('click', () => {
                const passwordInput = document.getElementById('newPassword');
                const icon = toggleNew.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });
        }
        
        const toggleConfirm = document.getElementById('toggleConfirmPassword');
        if (toggleConfirm) {
            toggleConfirm.addEventListener('click', () => {
                const passwordInput = document.getElementById('confirmPassword');
                const icon = toggleConfirm.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });
        }
    },
    
    /**
     * Bind change password form submit
     */
    bindChangePasswordForm() {
        const changePasswordForm = document.getElementById('changePasswordForm');
        
        if (!changePasswordForm) {
            console.error('❌ Change password form not found');
            return;
        }
        
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const oldPassword = CONFIG.PASSWORD.DEFAULT;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                Utils.showError('changePasswordError', 'Mật khẩu xác nhận không khớp');
                return;
            }
            
            const validation = Utils.validatePassword(newPassword);
            if (!validation.valid) {
                Utils.showError('changePasswordError', validation.messages.join(', '));
                return;
            }
            
            Utils.hideError('changePasswordError');
            Utils.toggleButtonLoading('changePasswordButton', true);
            
            try {
                const token = this.getToken();
                
                if (!token) {
                    throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
                }
                
                const response = await API.changePassword(token, oldPassword, newPassword);
                console.log('✅ Password changed successfully');
                
                this.saveSession(response.data.token, this.getUser());
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                if (modal) {
                    modal.hide();
                }
                
                Utils.showToast('Đổi mật khẩu thành công!', 'success');
                this.redirectToApp();
                
            } catch (error) {
                console.error('❌ Change password failed:', error);
                Utils.showError('changePasswordError', error.message);
            } finally {
                Utils.toggleButtonLoading('changePasswordButton', false);
            }
        });
    },
    
    /**
     * Bind password strength checker
     */
    bindPasswordStrengthChecker() {
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (!newPasswordInput) return;
        
        newPasswordInput.addEventListener('input', () => {
            const password = newPasswordInput.value;
            this.updatePasswordStrength(password);
            this.updatePasswordRequirements(password, confirmPasswordInput.value);
        });
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                const password = newPasswordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                this.updatePasswordRequirements(password, confirmPassword);
            });
        }
    },
    
    /**
     * Update password strength indicator
     */
    updatePasswordStrength(password) {
        const validation = Utils.validatePassword(password);
        
        const progressBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrengthText');
        
        if (!progressBar || !strengthText) return;
        
        progressBar.style.width = validation.score + '%';
        progressBar.setAttribute('aria-valuenow', validation.score);
        
        progressBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
        
        if (validation.strength === 'weak') {
            progressBar.classList.add('strength-weak');
            strengthText.textContent = 'Yếu';
            strengthText.className = 'text-danger';
        } else if (validation.strength === 'medium') {
            progressBar.classList.add('strength-medium');
            strengthText.textContent = 'Trung bình';
            strengthText.className = 'text-warning';
        } else if (validation.strength === 'strong') {
            progressBar.classList.add('strength-strong');
            strengthText.textContent = 'Mạnh';
            strengthText.className = 'text-success';
        }
    },
    
    /**
     * Update password requirements checklist
     */
    updatePasswordRequirements(password, confirmPassword) {
        const validation = Utils.validatePassword(password);
        
        const reqLength = document.getElementById('req-length');
        if (reqLength) {
            this.updateRequirementItem(reqLength, validation.requirements.length);
        }
        
        const reqUppercase = document.getElementById('req-uppercase');
        if (reqUppercase) {
            this.updateRequirementItem(reqUppercase, validation.requirements.uppercase);
        }
        
        const reqLowercase = document.getElementById('req-lowercase');
        if (reqLowercase) {
            this.updateRequirementItem(reqLowercase, validation.requirements.lowercase);
        }
        
        const reqNumber = document.getElementById('req-number');
        if (reqNumber) {
            this.updateRequirementItem(reqNumber, validation.requirements.number);
        }
        
        const reqMatch = document.getElementById('req-match');
        if (reqMatch) {
            const match = password && confirmPassword && password === confirmPassword;
            this.updateRequirementItem(reqMatch, match);
        }
        
        const submitButton = document.getElementById('changePasswordButton');
        if (submitButton) {
            const allValid = validation.valid && password === confirmPassword && password.length > 0;
            submitButton.disabled = !allValid;
        }
    },
    
    /**
     * Update single requirement item
     */
    updateRequirementItem(element, valid) {
        const icon = element.querySelector('i');
        
        if (valid) {
            element.classList.add('valid');
            icon.classList.remove('bi-x-circle', 'text-muted');
            icon.classList.add('bi-check-circle', 'text-success');
        } else {
            element.classList.remove('valid');
            icon.classList.remove('bi-check-circle', 'text-success');
            icon.classList.add('bi-x-circle', 'text-muted');
        }
    },
    
    /**
     * Show change password modal
     */
    showChangePasswordModal(isMandatory) {
        const modalElement = document.getElementById('changePasswordModal');
        
        if (!modalElement) {
            console.error('❌ Change password modal not found');
            return;
        }
        
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        Utils.hideError('changePasswordError');
        
        this.updatePasswordStrength('');
        this.updatePasswordRequirements('', '');
        
        const modal = new bootstrap.Modal(modalElement, {
            backdrop: isMandatory ? 'static' : true,
            keyboard: !isMandatory
        });
        
        modal.show();
    },
    
    /**
     * Save session to localStorage
     */
    saveSession(token, user) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
            console.log('💾 Session saved');
        } catch (error) {
            console.error('❌ Failed to save session:', error);
        }
    },
    
    /**
     * Get token from localStorage
     */
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    },
    
    /**
     * Get user from localStorage
     */
    getUser() {
        const userJson = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return Utils.safeJSONParse(userJson, null);
    },
    
    /**
     * Clear session (logout)
     */
    clearSession() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        console.log('🗑️ Session cleared');
    },
    
    /**
     * Check existing session
     */
    checkSession() {
        const token = this.getToken();
        const user = this.getUser();
        
        if (token && user) {
            console.log('✅ Existing session found:', user.email);
            this.redirectToApp();
        } else {
            console.log('ℹ️ No existing session, showing login');
            Utils.toggleElement('loginView', true);
            Utils.toggleElement('appView', false);
        }
    },
    
    /**
     * Redirect to app
     */
    redirectToApp() {
        console.log('➡️ Redirecting to app...');
        Utils.toggleElement('loginView', false);
        Utils.toggleElement('appView', true);
        
        if (window.App && typeof window.App.init === 'function') {
            window.App.init();
        }
    },
    
    /**
     * Logout user
     */
    async logout() {
        const token = this.getToken();
        
        if (token) {
            try {
                await API.logout(token);
                console.log('✅ Logout successful');
            } catch (error) {
                console.error('❌ Logout API failed:', error);
            }
        }
        
        this.clearSession();
        window.location.reload();
    }
};

console.log('✅ Auth loaded');