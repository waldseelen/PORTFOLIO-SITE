/**
 * API Integration Tests
 * Tests all migrated API endpoints
 */

// Chat API Tests
console.log('🧪 Testing Chat API...');
const chatTests = [
    {
        name: 'POST /api/chat - Valid message',
        url: 'http://localhost:3000/api/chat',
        method: 'POST',
        body: { message: 'Hello' },
    },
    {
        name: 'POST /api/chat - Turkish greeting',
        url: 'http://localhost:3000/api/chat',
        method: 'POST',
        body: { message: 'Merhaba' },
    },
    {
        name: 'GET /api/chat/history - With session',
        url: 'http://localhost:3000/api/chat/history?session_id=test-123',
        method: 'GET',
    },
    {
        name: 'POST /api/chat/clear - Clear history',
        url: 'http://localhost:3000/api/chat/clear',
        method: 'POST',
        body: { session_id: 'test-123' },
    },
];

// Playground API Tests
console.log('🧪 Testing Playground API...');
const playgroundTests = [
    {
        name: 'GET /api/playground/languages - List languages',
        url: 'http://localhost:3000/api/playground/languages',
        method: 'GET',
    },
    {
        name: 'POST /api/playground/execute - Python code',
        url: 'http://localhost:3000/api/playground/execute',
        method: 'POST',
        body: {
            code: 'print("Hello, World!")',
            language: 'python',
        },
    },
    {
        name: 'POST /api/playground/execute - JavaScript code',
        url: 'http://localhost:3000/api/playground/execute',
        method: 'POST',
        body: {
            code: 'console.log("Hello, World!")',
            language: 'javascript',
        },
    },
];

// Analytics API Tests
console.log('🧪 Testing Analytics API...');
const analyticsTests = [
    {
        name: 'POST /api/analytics - Submit metrics',
        url: 'http://localhost:3000/api/analytics',
        method: 'POST',
        body: {
            type: 'page_view',
            metrics: { duration: 1500, page: '/blog' },
        },
    },
    {
        name: 'GET /api/analytics - Retrieve metrics',
        url: 'http://localhost:3000/api/analytics?limit=10',
        method: 'GET',
    },
    {
        name: 'GET /api/analytics/dashboard - Dashboard data',
        url: 'http://localhost:3000/api/analytics/dashboard',
        method: 'GET',
    },
];

// Health Check Tests
console.log('🧪 Testing Health API...');
const healthTests = [
    {
        name: 'GET /api/health - Main health check',
        url: 'http://localhost:3000/api/health',
        method: 'GET',
    },
    {
        name: 'GET /api/health/readiness - Readiness probe',
        url: 'http://localhost:3000/api/health/readiness',
        method: 'GET',
    },
    {
        name: 'GET /api/health/liveness - Liveness probe',
        url: 'http://localhost:3000/api/health/liveness',
        method: 'GET',
    },
];

// Search API Tests
console.log('🧪 Testing Search API...');
const searchTests = [
    {
        name: 'GET /api/search - Search query',
        url: 'http://localhost:3000/api/search?q=nextjs&limit=5',
        method: 'GET',
    },
    {
        name: 'GET /api/search/autocomplete - Autocomplete',
        url: 'http://localhost:3000/api/search/autocomplete?q=next',
        method: 'GET',
    },
    {
        name: 'GET /api/search/filters - Get filters',
        url: 'http://localhost:3000/api/search/filters',
        method: 'GET',
    },
];

// Blog API Tests
console.log('🧪 Testing Blog API...');
const blogTests = [
    {
        name: 'GET /api/blog - List posts',
        url: 'http://localhost:3000/api/blog?limit=5',
        method: 'GET',
    },
];

// Projects API Tests
console.log('🧪 Testing Projects API...');
const projectTests = [
    {
        name: 'GET /api/projects - List projects',
        url: 'http://localhost:3000/api/projects?limit=5',
        method: 'GET',
    },
];

// Contact API Tests
console.log('🧪 Testing Contact API...');
const contactTests = [
    {
        name: 'POST /api/contact - Valid submission',
        url: 'http://localhost:3000/api/contact',
        method: 'POST',
        body: {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message',
        },
    },
];

// GDPR API Tests
console.log('🧪 Testing GDPR API...');
const gdprTests = [
    {
        name: 'GET /api/gdpr/export - Export user data',
        url: 'http://localhost:3000/api/gdpr/export',
        method: 'GET',
    },
    {
        name: 'POST /api/gdpr/delete - Delete user data',
        url: 'http://localhost:3000/api/gdpr/delete',
        method: 'POST',
    },
];

const allTests = [
    ...chatTests,
    ...playgroundTests,
    ...analyticsTests,
    ...healthTests,
    ...searchTests,
    ...blogTests,
    ...projectTests,
    ...contactTests,
    ...gdprTests,
];

console.log(`\n📊 Total API Endpoints to Test: ${allTests.length}\n`);
console.log('Run these tests with: npm run dev (in nextjs-app folder)');
console.log('Then run: node test-api.js\n');

export { allTests };

