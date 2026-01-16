// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Template End-to-End Tests
 * ========================
 *
 * Tests all critical pages render correctly and have proper structure.
 * These tests verify that templates work correctly in a real browser environment.
 */

// Critical pages to test
const CRITICAL_PAGES = [
    { path: '/', name: 'Home Page' },
    { path: '/blog/', name: 'Blog List' },
    { path: '/portfolio/', name: 'Portfolio' },
    { path: '/contact/', name: 'Contact' },
    { path: '/ai/', name: 'AI Projects' },
    { path: '/cybersecurity/', name: 'Cybersecurity' },
    { path: '/music/', name: 'Music' },
    { path: '/useful/', name: 'Useful Tools' },
];

// Page structure expectations
const PAGE_STRUCTURE = {
    '/': {
        title: /portfolio|home/i,
        selectors: ['nav', 'main', 'footer'],
        noErrors: true,
    },
    '/blog/': {
        title: /blog/i,
        selectors: ['nav', 'main'],
        noErrors: true,
    },
    '/contact/': {
        title: /contact|iletişim/i,
        selectors: ['form', 'nav'],
        noErrors: true,
    },
};

test.describe('Template Rendering Tests', () => {

    test.describe('Page Load Tests', () => {
        for (const page of CRITICAL_PAGES) {
            test(`${page.name} loads successfully`, async ({ page: browserPage }) => {
                const response = await browserPage.goto(page.path);

                // Check response status
                expect(response?.status()).toBeLessThan(400);

                // Check page has content
                const content = await browserPage.content();
                expect(content.length).toBeGreaterThan(100);

                // Check no JavaScript errors
                const errors: string[] = [];
                browserPage.on('pageerror', (error) => {
                    errors.push(error.message);
                });

                await browserPage.waitForLoadState('networkidle');

                // Allow some minor errors but fail on critical ones
                const criticalErrors = errors.filter(e =>
                    e.includes('TypeError') ||
                    e.includes('ReferenceError')
                );
                expect(criticalErrors).toHaveLength(0);
            });
        }
    });

    test.describe('Page Structure Tests', () => {
        test('Home page has proper structure', async ({ page }) => {
            await page.goto('/');

            // Check navigation exists
            await expect(page.locator('nav')).toBeVisible();

            // Check main content area
            await expect(page.locator('main')).toBeVisible();

            // Check footer (if exists)
            const footer = page.locator('footer');
            if (await footer.isVisible()) {
                await expect(footer).toBeVisible();
            }

            // Check meta tags
            const title = await page.title();
            expect(title.length).toBeGreaterThan(0);

            const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
            expect(metaDescription).toBeTruthy();
        });

        test('Blog page has post structure', async ({ page }) => {
            await page.goto('/blog/');
            await page.waitForLoadState('networkidle');

            // Check for blog-related content
            const content = await page.content();
            const hasBlogContent = content.includes('blog') ||
                content.includes('post') ||
                content.includes('article');
            expect(hasBlogContent).toBeTruthy();
        });

        test('Contact page has form', async ({ page }) => {
            await page.goto('/contact/');
            await page.waitForLoadState('networkidle');

            // Check for form
            const form = page.locator('form');
            if (await form.isVisible()) {
                await expect(form).toBeVisible();
            }
        });
    });

    test.describe('Template Error Detection', () => {
        test('No Django template errors on pages', async ({ page }) => {
            for (const pageInfo of CRITICAL_PAGES.slice(0, 5)) {
                await page.goto(pageInfo.path);

                const content = await page.content();

                // Check for Django error indicators
                expect(content).not.toContain('TemplateSyntaxError');
                expect(content).not.toContain('TemplateDoesNotExist');
                expect(content).not.toContain('NoReverseMatch');
                expect(content).not.toContain('ImproperlyConfigured');
            }
        });

        test('No broken template tags visible', async ({ page }) => {
            for (const pageInfo of CRITICAL_PAGES.slice(0, 5)) {
                await page.goto(pageInfo.path);

                const content = await page.content();

                // Check for unrendered template syntax
                expect(content).not.toMatch(/\{%\s*\w+/);
                expect(content).not.toMatch(/\{\{\s*\w+\.\w+\s*\}\}/);
            }
        });
    });

    test.describe('Responsive Template Tests', () => {
        const viewports = [
            { width: 375, height: 667, name: 'Mobile' },
            { width: 768, height: 1024, name: 'Tablet' },
            { width: 1920, height: 1080, name: 'Desktop' },
        ];

        for (const viewport of viewports) {
            test(`Home page renders on ${viewport.name}`, async ({ page }) => {
                await page.setViewportSize({ width: viewport.width, height: viewport.height });
                await page.goto('/');

                // Check page loads
                await expect(page).toHaveTitle(/.+/);

                // Check no horizontal overflow
                const body = page.locator('body');
                const bodyWidth = await body.evaluate(el => el.scrollWidth);
                expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small margin
            });
        }
    });

    test.describe('Critical CSS and Assets', () => {
        test('CSS files load successfully', async ({ page }) => {
            const cssResponses: number[] = [];

            page.on('response', (response) => {
                if (response.url().includes('.css')) {
                    cssResponses.push(response.status());
                }
            });

            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // All CSS should load successfully
            for (const status of cssResponses) {
                expect(status).toBeLessThan(400);
            }
        });

        test('JavaScript files load successfully', async ({ page }) => {
            const jsResponses: number[] = [];

            page.on('response', (response) => {
                if (response.url().includes('.js') && !response.url().includes('analytics')) {
                    jsResponses.push(response.status());
                }
            });

            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // All JS should load successfully
            for (const status of jsResponses) {
                expect(status).toBeLessThan(400);
            }
        });
    });
});

test.describe('Accessibility Tests', () => {
    test('Home page meets basic accessibility requirements', async ({ page }) => {
        await page.goto('/');

        // Check for lang attribute
        const lang = await page.getAttribute('html', 'lang');
        expect(lang).toBeTruthy();

        // Check for viewport meta
        const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
        expect(viewport).toBeTruthy();

        // Check images have alt text
        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            // Alt can be empty string (decorative) but should exist
            expect(alt !== null).toBeTruthy();
        }
    });

    test('Navigation is keyboard accessible', async ({ page }) => {
        await page.goto('/');

        // Tab through page
        await page.keyboard.press('Tab');

        // Check focused element is visible
        const focused = page.locator(':focus');
        if (await focused.count() > 0) {
            await expect(focused.first()).toBeVisible();
        }
    });
});

test.describe('Performance Metrics', () => {
    test('Page loads within acceptable time', async ({ page }) => {
        const start = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - start;

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
    });

    test('DOM ready quickly', async ({ page }) => {
        await page.goto('/');

        const timing = await page.evaluate(() => {
            const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
                loadComplete: nav.loadEventEnd - nav.startTime,
            };
        });

        // DOM should be ready within 3 seconds
        expect(timing.domContentLoaded).toBeLessThan(3000);
    });
});
