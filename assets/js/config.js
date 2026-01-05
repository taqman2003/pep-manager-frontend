/**
 * ============================================
 * CONFIG.JS - CONFIGURATION
 * ============================================
 * Chứa tất cả config constants cho frontend
 */

const CONFIG = {
    // Backend API URL
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbxZhjz0mCP3Unrgy32gxtlHOeS81T5ikdyBEV4B-b_ay0f5MVXZWiKvSYyKgHUbCXYqOw/exec',
    
    // Local Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'pep_token',
        USER: 'pep_user',
        REMEMBER_EMAIL: 'pep_remember_email'
    },
    
    // Session Settings
    SESSION: {
        TIMEOUT_WARNING: 5 * 60 * 1000, // Cảnh báo 5 phút trước khi hết hạn
        EXPIRY_HOURS: 24 // 24 giờ (phải match với backend)
    },
    
    // Password Requirements
    PASSWORD: {
        MIN_LENGTH: 8,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBER: true,
        DEFAULT: 'Mitalab@2025' // Password mặc định (cho change password modal)
    },
    
    // UI Settings
    UI: {
        TOAST_DURATION: 3000, // 3 giây
        DEBOUNCE_DELAY: 500, // 500ms cho search
        ANIMATION_DURATION: 300 // 300ms
    },
    
    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 20,
        PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
    }
};

console.log('✅ CONFIG loaded');