/**
 * ============================================
 * API.JS - API CLIENT
 * ============================================
 * Xử lý tất cả HTTP requests đến backend
 */

const API = {
    
    /**
     * Make POST request to backend
     * @param {string} action - Action name (e.g., 'login', 'getProjects')
     * @param {object} params - Request parameters
     * @param {string} token - Session token (optional)
     * @return {Promise<object>} - API response
     */
    async request(action, params = {}, token = null) {
        try {
            // a) Chuẩn bị request body
            const requestBody = {
                action: action,
                params: params
            };
            
            // b) Thêm token nếu có
            if (token) {
                requestBody.token = token;
            }
            
            console.log(`📤 API Request: ${action}`, requestBody);
            
            // c) Gửi POST request
            const response = await fetch(CONFIG.API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                mode: 'cors' // Apps Script Web App requires CORS
            });
            
            // d) Check HTTP status
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }
            
            // e) Parse JSON response
            const data = await response.json();
            
            console.log(`📥 API Response: ${action}`, data);
            
            // f) Check success
            if (!data.success) {
                // API returned success: false
                throw new Error(data.error || 'Unknown API error');
            }
            
            return data;
            
        } catch (error) {
            console.error(`❌ API Error (${action}):`, error);
            
            // g) Xử lý các loại error khác nhau
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
            }
            
            if (error.message.includes('NetworkError')) {
                throw new Error('Lỗi mạng. Vui lòng thử lại.');
            }
            
            // Throw error gốc
            throw error;
        }
    },
    
    /**
     * Login API
     * @param {string} email
     * @param {string} password
     * @return {Promise<object>} - {success, token, user, mustChangePassword}
     */
    async login(email, password) {
        return await this.request('login', {
            email: email,
            password: password
        });
    },
    
    /**
     * Logout API
     * @param {string} token
     * @return {Promise<object>}
     */
    async logout(token) {
        return await this.request('logout', {}, token);
    },
    
    /**
     * Change Password API
     * @param {string} token
     * @param {string} oldPassword
     * @param {string} newPassword
     * @return {Promise<object>} - {success, token} (new token)
     */
    async changePassword(token, oldPassword, newPassword) {
        return await this.request('changePassword', {
            oldPassword: oldPassword,
            newPassword: newPassword
        }, token);
    },
    
    /**
     * Get Dashboard API
     * @param {string} token
     * @return {Promise<object>}
     */
    async getDashboard(token) {
        return await this.request('getDashboard', {}, token);
    },
    
    /**
     * Get Projects API
     * @param {string} token
     * @param {object} filters - Optional filters
     * @return {Promise<object>}
     */
    async getProjects(token, filters = {}) {
        return await this.request('getProjects', filters, token);
    },
    
    /**
     * Get Project By ID API
     * @param {string} token
     * @param {string} projectId
     * @return {Promise<object>}
     */
    async getProjectById(token, projectId) {
        return await this.request('getProjectById', {
            projectId: projectId
        }, token);
    },
    
    /**
     * Create Project API
     * @param {string} token
     * @param {object} projectData
     * @return {Promise<object>}
     */
    async createProject(token, projectData) {
        return await this.request('createProject', projectData, token);
    },
    
    /**
     * Update Project API
     * @param {string} token
     * @param {string} projectId
     * @param {object} projectData
     * @return {Promise<object>}
     */
    async updateProject(token, projectId, projectData) {
        return await this.request('updateProject', {
            projectId: projectId,
            ...projectData
        }, token);
    },
    
    /**
     * Delete Project API
     * @param {string} token
     * @param {string} projectId
     * @return {Promise<object>}
     */
    async deleteProject(token, projectId) {
        return await this.request('deleteProject', {
            projectId: projectId
        }, token);
    },
    
    /**
     * Get Tasks API
     * @param {string} token
     * @param {object} filters - Optional filters
     * @return {Promise<object>}
     */
    async getTasks(token, filters = {}) {
        return await this.request('getTasks', filters, token);
    },
    
    /**
     * Get Task By ID API
     * @param {string} token
     * @param {string} taskId
     * @return {Promise<object>}
     */
    async getTaskById(token, taskId) {
        return await this.request('getTaskById', {
            taskId: taskId
        }, token);
    },
    
    /**
     * Create Task API
     * @param {string} token
     * @param {object} taskData
     * @return {Promise<object>}
     */
    async createTask(token, taskData) {
        return await this.request('createTask', taskData, token);
    },
    
    /**
     * Update Task API
     * @param {string} token
     * @param {string} taskId
     * @param {object} taskData
     * @return {Promise<object>}
     */
    async updateTask(token, taskId, taskData) {
        return await this.request('updateTask', {
            taskId: taskId,
            ...taskData
        }, token);
    },
    
    /**
     * Delete Task API
     * @param {string} token
     * @param {string} taskId
     * @return {Promise<object>}
     */
    async deleteTask(token, taskId) {
        return await this.request('deleteTask', {
            taskId: taskId
        }, token);
    },
    
    /**
     * Get Users API (Admin only)
     * @param {string} token
     * @return {Promise<object>}
     */
    async getUsers(token) {
        return await this.request('getUsers', {}, token);
    },
    
    /**
     * Create User API (Admin only)
     * @param {string} token
     * @param {object} userData
     * @return {Promise<object>}
     */
    async createUser(token, userData) {
        return await this.request('createUser', userData, token);
    },
    
    /**
     * Update User API (Admin only)
     * @param {string} token
     * @param {string} userId
     * @param {object} userData
     * @return {Promise<object>}
     */
    async updateUser(token, userId, userData) {
        return await this.request('updateUser', {
            userId: userId,
            ...userData
        }, token);
    },
    
    /**
     * Delete User API (Admin only)
     * @param {string} token
     * @param {string} userId
     * @return {Promise<object>}
     */
    async deleteUser(token, userId) {
        return await this.request('deleteUser', {
            userId: userId
        }, token);
    }
};

console.log('✅ API loaded');