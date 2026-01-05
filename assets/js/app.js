/**
 * ============================================
 * APP.JS - MAIN APPLICATION LOGIC
 * ============================================
 * Xử lý main layout, navigation, user info display
 */

const App = {
    
    /**
     * Current user object
     */
    currentUser: null,
    
    /**
     * Current page
     */
    currentPage: 'dashboard',
    
    /**
     * Khởi tạo application
     */
    init() {
        console.log('🚀 Initializing App...');
        
        // a) Load user info
        this.loadUserInfo();
        
        // b) Bind navigation events
        this.bindNavigation();
        
        // c) Bind user dropdown events
        this.bindUserDropdown();
        
        // d) Bind sidebar toggle (mobile)
        this.bindSidebarToggle();
        
        // e) Load default page (dashboard)
        this.loadPage('dashboard');
        
        console.log('✅ App initialized');
    },
    
    /**
     * Load user info và hiển thị lên navbar
     */
    loadUserInfo() {
        this.currentUser = Auth.getUser();
        
        if (!this.currentUser) {
            console.error('❌ No user data found');
            Auth.logout();
            return;
        }
        
        console.log('👤 Current user:', this.currentUser);
        
        // a) Update navbar user info
        const navUserName = document.getElementById('navUserName');
        if (navUserName) {
            navUserName.textContent = this.currentUser.fullName;
        }
        
        const navUserRole = document.getElementById('navUserRole');
        if (navUserRole) {
            navUserRole.textContent = this.currentUser.role;
        }
        
        // b) Update dropdown user email
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        if (dropdownUserEmail) {
            dropdownUserEmail.textContent = this.currentUser.email;
        }
    },
    
    /**
     * Bind sidebar navigation click events
     */
    bindNavigation() {
        const menuLinks = document.querySelectorAll('.sidebar-menu-link');
        
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // a) Lấy page từ data-page attribute
                const page = link.getAttribute('data-page');
                
                if (!page) {
                    console.error('❌ No data-page attribute found');
                    return;
                }
                
                // b) Load page
                this.loadPage(page);
                
                // c) Update active state
                this.updateActiveMenuItem(link);
                
                // d) Close sidebar on mobile
                this.closeSidebarOnMobile();
            });
        });
    },
    
    /**
     * Update active menu item
     * @param {Element} clickedLink - Link element được click
     */
    updateActiveMenuItem(clickedLink) {
        // a) Remove active từ tất cả menu items
        const allMenuItems = document.querySelectorAll('.sidebar-menu-item');
        allMenuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // b) Add active vào clicked item
        const parentMenuItem = clickedLink.closest('.sidebar-menu-item');
        if (parentMenuItem) {
            parentMenuItem.classList.add('active');
        }
    },
    
    /**
     * Load page content
     * @param {string} page - Page name (dashboard, projects, tasks, users, etc.)
     */
    loadPage(page) {
        console.log(`📄 Loading page: ${page}`);
        
        this.currentPage = page;
        
        // a) Update breadcrumb
        this.updateBreadcrumb(page);
        
        // b) Get page content container
        const pageContent = document.getElementById('pageContent');
        
        if (!pageContent) {
            console.error('❌ Page content container not found');
            return;
        }
        
        // c) Show loading spinner
        pageContent.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Đang tải ${this.getPageTitle(page)}...</p>
            </div>
        `;
        
        // d) Load page content (simulate async - sẽ implement thật trong các bước sau)
        setTimeout(() => {
            this.renderPage(page);
        }, 500);
    },
    
    /**
     * Render page content
     * @param {string} page - Page name
     */
    renderPage(page) {
        const pageContent = document.getElementById('pageContent');
        
        if (!pageContent) return;
        
        // Tùy theo page, render content tương ứng
        switch (page) {
            case 'dashboard':
                pageContent.innerHTML = this.renderDashboardPlaceholder();
                break;
                
            case 'projects':
                pageContent.innerHTML = this.renderProjectsPlaceholder();
                break;
                
            case 'tasks':
                pageContent.innerHTML = this.renderTasksPlaceholder();
                break;
                
            case 'users':
                pageContent.innerHTML = this.renderUsersPlaceholder();
                break;
                
            case 'reports':
                pageContent.innerHTML = this.renderReportsPlaceholder();
                break;
                
            case 'settings':
                pageContent.innerHTML = this.renderSettingsPlaceholder();
                break;
                
            default:
                pageContent.innerHTML = this.render404();
        }
    },
    
    /**
     * Update breadcrumb
     * @param {string} page - Page name
     */
    updateBreadcrumb(page) {
        const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
        
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = this.getPageTitle(page);
        }
    },
    
    /**
     * Get page title
     * @param {string} page - Page name
     * @return {string} - Page title
     */
    getPageTitle(page) {
        const titles = {
            'dashboard': 'Dashboard',
            'projects': 'Projects',
            'tasks': 'Tasks',
            'users': 'Users',
            'reports': 'Reports',
            'settings': 'Settings'
        };
        
        return titles[page] || 'Unknown Page';
    },
    
    /**
     * Bind user dropdown events
     */
    bindUserDropdown() {
        // a) Logout button
        const logoutButton = document.getElementById('logoutButton');
        
        if (logoutButton) {
            logoutButton.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Confirm logout
                if (confirm('Bạn có chắc muốn đăng xuất?')) {
                    await Auth.logout();
                }
            });
        }
        
        // b) Change password link
        const changePasswordLink = document.getElementById('changePasswordLink');
        
        if (changePasswordLink) {
            changePasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Show change password modal (không bắt buộc)
                Auth.showChangePasswordModal(false);
            });
        }
    },
    
    /**
     * Bind sidebar toggle (mobile)
     */
    bindSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
            
            // Close sidebar khi click outside (mobile)
            document.addEventListener('click', (e) => {
                const isMobile = window.innerWidth < 992;
                
                if (isMobile && 
                    sidebar.classList.contains('show') &&
                    !sidebar.contains(e.target) &&
                    !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            });
        }
    },
    
    /**
     * Close sidebar on mobile after navigation
     */
    closeSidebarOnMobile() {
        const sidebar = document.getElementById('sidebar');
        const isMobile = window.innerWidth < 992;
        
        if (sidebar && isMobile && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    },
    
    // ============================================
    // PLACEHOLDER RENDERERS (Sẽ thay thế trong các bước sau)
    // ============================================
    
    /**
     * Render Dashboard placeholder
     */
    renderDashboardPlaceholder() {
        return `
            <div class="row g-4">
                <!-- Page Header -->
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 class="mb-1">
                                <i class="bi bi-speedometer2 text-primary"></i>
                                Dashboard
                            </h2>
                            <p class="text-muted mb-0">
                                Chào mừng trở lại, <strong>${this.currentUser.fullName}</strong>!
                            </p>
                        </div>
                        <div>
                            <span class="badge bg-primary">${this.currentUser.role}</span>
                            <span class="badge bg-secondary">${this.currentUser.department}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="text-primary">
                                    <i class="bi bi-folder fs-2"></i>
                                </div>
                                <div class="text-end">
                                    <h3 class="mb-0">12</h3>
                                    <small class="text-muted">Projects</small>
                                </div>
                            </div>
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-primary" style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="text-success">
                                    <i class="bi bi-check-circle fs-2"></i>
                                </div>
                                <div class="text-end">
                                    <h3 class="mb-0">45</h3>
                                    <small class="text-muted">Tasks Done</small>
                                </div>
                            </div>
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-success" style="width: 60%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="text-warning">
                                    <i class="bi bi-clock fs-2"></i>
                                </div>
                                <div class="text-end">
                                    <h3 class="mb-0">8</h3>
                                    <small class="text-muted">In Progress</small>
                                </div>
                            </div>
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-warning" style="width: 40%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="text-danger">
                                    <i class="bi bi-exclamation-triangle fs-2"></i>
                                </div>
                                <div class="text-end">
                                    <h3 class="mb-0">3</h3>
                                    <small class="text-muted">Overdue</small>
                                </div>
                            </div>
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-danger" style="width: 20%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Activities -->
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0">
                            <h5 class="mb-0">
                                <i class="bi bi-activity text-primary"></i>
                                Hoạt động gần đây
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Dashboard sẽ được implement ở Bước 6</strong>
                                <p class="mb-0 mt-2">
                                    Hiện tại đây là placeholder. Dashboard thật sẽ hiển thị:
                                </p>
                                <ul class="mb-0 mt-2">
                                    <li>My Projects (dựa theo dashboard type)</li>
                                    <li>My Tasks với status breakdown</li>
                                    <li>Upcoming deadlines</li>
                                    <li>Team performance (nếu là Manager/TL)</li>
                                    <li>Charts & visualizations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render Projects placeholder
     */
    renderProjectsPlaceholder() {
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="bi bi-folder text-primary"></i>
                                Projects
                            </h5>
                            <button class="btn btn-primary">
                                <i class="bi bi-plus-circle"></i>
                                New Project
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Projects page sẽ được implement ở Bước 7</strong>
                                <p class="mb-0 mt-2">
                                    Trang này sẽ hiển thị danh sách projects với:
                                </p>
                                <ul class="mb-0 mt-2">
                                    <li>Filter theo ProductGroup, Status, Lead</li>
                                    <li>Search by ProjectName, Objective</li>
                                    <li>Table view với sorting</li>
                                    <li>CRUD operations (Create, Edit, Delete)</li>
                                    <li>Manage members (add/remove users)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render Tasks placeholder
     */
    renderTasksPlaceholder() {
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="bi bi-check2-square text-primary"></i>
                                Tasks
                            </h5>
                            <button class="btn btn-primary">
                                <i class="bi bi-plus-circle"></i>
                                New Task
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Tasks page sẽ được implement ở Bước 8</strong>
                                <p class="mb-0 mt-2">
                                    Trang này sẽ hiển thị danh sách tasks với:
                                </p>
                                <ul class="mb-0 mt-2">
                                    <li>Filter theo Project, Status, Assignee</li>
                                    <li>Kanban board view (To-do, In Progress, Done)</li>
                                    <li>Gantt chart timeline view</li>
                                    <li>CRUD operations (Create, Edit, Delete)</li>
                                    <li>Update status với drag & drop</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render Users placeholder
     */
    renderUsersPlaceholder() {
        // Check permission
        if (!this.currentUser.permissions.canManageUsers) {
            return `
                <div class="row">
                    <div class="col-12">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body text-center py-5">
                                <i class="bi bi-shield-lock text-muted" style="font-size: 64px;"></i>
                                <h3 class="mt-3">Không có quyền truy cập</h3>
                                <p class="text-muted">
                                    Bạn không có quyền quản lý users. 
                                    Vui lòng liên hệ Admin nếu cần hỗ trợ.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="bi bi-people text-primary"></i>
                                Users Management
                            </h5>
                            <button class="btn btn-primary">
                                <i class="bi bi-person-plus"></i>
                                New User
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Users page sẽ được implement ở Bước 9</strong>
                                <p class="mb-0 mt-2">
                                    Trang này sẽ hiển thị danh sách users với:
                                </p>
                                <ul class="mb-0 mt-2">
                                    <li>Filter theo Role, Department, IsActive</li>
                                    <li>Search by FullName, Email</li>
                                    <li>Hierarchy tree view (reporting structure)</li>
                                    <li>CRUD operations (Create, Edit, Activate/Deactivate)</li>
                                    <li>Reset password (Admin only)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render Reports placeholder
     */
    renderReportsPlaceholder() {
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0">
                            <h5 class="mb-0">
                                <i class="bi bi-graph-up text-primary"></i>
                                Reports & Analytics
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                <strong>Reports page chưa được implement</strong>
                                <p class="mb-0 mt-2">
                                    Trang này sẽ được develop trong future phase. Dự kiến sẽ có:
                                </p>
                                <ul class="mb-0 mt-2">
                                    <li>Project completion rate charts</li>
                                    <li>Task performance metrics</li>
                                    <li>Team productivity reports</li>
                                    <li>Export to PDF/Excel</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render Settings placeholder
     */
    renderSettingsPlaceholder() {
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0">
                            <h5 class="mb-0">
                                <i class="bi bi-gear text-primary"></i>
                                Settings
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                <strong>Settings page chưa được implement</strong>
                                <p class="mb-0 mt-2">
                                    Trang này sẽ được develop trong future phase. Dự kiến sẽ có:
                                </p>
                                <ul class="mb-0 mt-2">
                                    <li>User profile settings</li>
                                    <li>Notification preferences</li>
                                    <li>System configurations (Admin only)</li>
                                    <li>MasterData management</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render 404 page
     */
    render404() {
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-exclamation-octagon text-danger" style="font-size: 64px;"></i>
                            <h3 class="mt-3">Page Not Found</h3>
                            <p class="text-muted">
                                Trang bạn tìm kiếm không tồn tại.
                            </p>
                            <button class="btn btn-primary" onclick="App.loadPage('dashboard')">
                                <i class="bi bi-house"></i>
                                Về Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

console.log('✅ App loaded');

// ============================================
// INITIALIZE WHEN DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 DOM Content Loaded');
    Auth.init();
});

console.log('✅ All scripts loaded');
