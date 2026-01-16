import { defineConfig } from 'vite';

/**
 * Vite Configuration - Optimized for Performance
 * ==============================================
 *
 * Optimizations included:
 * - Tree shaking enabled
 * - Code splitting for better caching
 * - Terser minification with advanced options
 * - Chunk size warnings for monitoring
 * - CSS code splitting
 * - Asset optimization
 */

export default defineConfig({
    plugins: [],

    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: true,
    },

    preview: {
        host: '0.0.0.0',
        port: 8080,
        allowedHosts: true,
    },

    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',

        // Advanced terser options for better minification
        terserOptions: {
            compress: {
                drop_console: true,      // Remove console.* in production
                drop_debugger: true,     // Remove debugger statements
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 2,               // Multiple compression passes
                dead_code: true,         // Remove unreachable code
                unused: true,            // Drop unused variables/functions
            },
            mangle: {
                safari10: true,          // Safari 10 compatibility
            },
            format: {
                comments: false,         // Remove all comments
            },
        },

        // Code splitting for better caching
        rollupOptions: {
            output: {
                // Asset file naming for cache busting
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];

                    if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(assetInfo.name)) {
                        return `assets/images/[name]-[hash].${ext}`;
                    }
                    if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
                        return `assets/fonts/[name]-[hash].${ext}`;
                    }
                    if (/\.css$/i.test(assetInfo.name)) {
                        return `assets/css/[name]-[hash].${ext}`;
                    }
                    return `assets/[name]-[hash].${ext}`;
                },
            },
        },

        // Chunk size warnings
        chunkSizeWarningLimit: 500,  // Warn for chunks > 500kb

        // CSS optimization
        cssCodeSplit: true,

        // Asset size limit for inlining
        assetsInlineLimit: 4096,    // Inline assets < 4kb as base64

        // Target modern browsers for smaller bundles
        target: 'es2020',
    },

    // Optimization options
    optimizeDeps: {
        include: [],
        exclude: [],
    },

    // Enable esbuild for faster builds in development
    esbuild: {
        legalComments: 'none',
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
})
