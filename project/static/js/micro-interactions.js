/**
 * Micro-Interactions Module
 * =========================
 * Alpine.js ile güçlendirilmiş mikro-etkileşimler.
 * Magnetic button, spotlight, morphing animasyonları içerir.
 */

// Alpine.js data components
document.addEventListener('alpine:init', () => {

    /**
     * Magnetic Button Effect
     * Fare pozisyonuna göre buton hafifçe hareket eder
     */
    Alpine.data('magneticButton', () => ({
        x: 0,
        y: 0,
        isHovering: false,
        strength: 0.3, // Çekim gücü (0-1)

        init() {
            this.$el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        },

        handleMouseMove(e) {
            if (!this.isHovering) return;

            const rect = this.$el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.x = (e.clientX - centerX) * this.strength;
            this.y = (e.clientY - centerY) * this.strength;

            this.$el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        },

        handleMouseEnter() {
            this.isHovering = true;
        },

        handleMouseLeave() {
            this.isHovering = false;
            this.x = 0;
            this.y = 0;
            this.$el.style.transform = 'translate(0, 0)';
        }
    }));

    /**
     * Spotlight Card Effect
     * Fare pozisyonunda parlak ışık efekti
     */
    Alpine.data('spotlightCard', () => ({
        spotlightX: '50%',
        spotlightY: '50%',
        isActive: false,

        handleMouseMove(e) {
            const rect = this.$el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.spotlightX = `${x}%`;
            this.spotlightY = `${y}%`;

            this.$el.style.setProperty('--spotlight-x', this.spotlightX);
            this.$el.style.setProperty('--spotlight-y', this.spotlightY);
        },

        handleMouseEnter() {
            this.isActive = true;
        },

        handleMouseLeave() {
            this.isActive = false;
        }
    }));

    /**
     * Morphing Button
     * Tıklandığında şekil değiştiren buton
     */
    Alpine.data('morphButton', () => ({
        state: 'idle', // idle, loading, success, error
        originalText: '',

        init() {
            this.originalText = this.$el.textContent.trim();
        },

        async handleClick() {
            if (this.state === 'loading') return;

            this.state = 'loading';
            this.$el.classList.add('is-loading');

            // Simulate action (replace with actual action)
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.state = 'success';
            this.$el.classList.remove('is-loading');
            this.$el.classList.add('is-success');

            // Reset after 2 seconds
            setTimeout(() => {
                this.state = 'idle';
                this.$el.classList.remove('is-success');
            }, 2000);
        }
    }));

    /**
     * Parallax Element
     * Scroll'a göre paralaks hareket
     */
    Alpine.data('parallax', (speed = 0.5) => ({
        offset: 0,

        init() {
            this.updateOffset();
            window.addEventListener('scroll', () => this.updateOffset(), { passive: true });
        },

        updateOffset() {
            const rect = this.$el.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -speed;

            this.offset = rate;
            this.$el.style.transform = `translateY(${this.offset}px)`;
        }
    }));

    /**
     * Counter Animation
     * Sayı animasyonu (görünüme girdiğinde)
     */
    Alpine.data('counter', (target = 0, duration = 2000) => ({
        current: 0,
        target: target,

        init() {
            this.animate();
        },

        animate() {
            const startTime = performance.now();
            const startValue = this.current;

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);

                this.current = Math.round(startValue + (this.target - startValue) * easeOut);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        }
    }));

    /**
     * Typewriter Effect
     * Metin yazma animasyonu
     */
    Alpine.data('typewriter', (text = '', speed = 50) => ({
        displayText: '',
        fullText: text,
        index: 0,

        init() {
            this.type();
        },

        type() {
            if (this.index < this.fullText.length) {
                this.displayText += this.fullText.charAt(this.index);
                this.index++;
                setTimeout(() => this.type(), speed);
            }
        }
    }));

    /**
     * Reveal on Scroll
     * Scroll ile görünür olma animasyonu
     */
    Alpine.data('reveal', (delay = 0) => ({
        isVisible: false,

        init() {
            setTimeout(() => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                this.isVisible = true;
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.1 }
                );

                observer.observe(this.$el);
            }, delay);
        }
    }));

    /**
     * Infinite Scroll
     * HTMX ile sonsuz scroll
     */
    Alpine.data('infiniteScroll', () => ({
        page: 1,
        loading: false,
        hasMore: true,

        loadMore() {
            if (this.loading || !this.hasMore) return;

            this.loading = true;
            this.page++;

            // HTMX will handle the actual loading
            // This just manages the state
        },

        onLoaded(hasMore) {
            this.loading = false;
            this.hasMore = hasMore;
        }
    }));
});

/**
 * View Transitions API Helper
 * Sayfa geçişlerini yönetir
 */
const ViewTransitions = {
    /**
     * Navigate with view transition
     */
    async navigate(url) {
        if (!document.startViewTransition) {
            window.location.href = url;
            return;
        }

        const transition = document.startViewTransition(async () => {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update main content
            const newContent = doc.querySelector('#main-content');
            const oldContent = document.querySelector('#main-content');

            if (newContent && oldContent) {
                oldContent.replaceWith(newContent);
            }

            // Update title
            document.title = doc.title;

            // Update URL
            history.pushState({}, '', url);
        });

        await transition.finished;
    },

    /**
     * Setup click handlers for internal links
     */
    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-view-transition]');
            if (!link) return;

            e.preventDefault();
            this.navigate(link.href);
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ViewTransitions.init();
});

/**
 * HTMX Integration
 * HTMX olaylarını dinle ve view transitions ile entegre et
 */
document.addEventListener('htmx:beforeSwap', (e) => {
    // Add view transition class
    e.detail.target.style.viewTransitionName = 'page-content';
});

document.addEventListener('htmx:afterSwap', (e) => {
    // Re-initialize Alpine components
    if (window.Alpine) {
        Alpine.initTree(e.detail.target);
    }

    // Scroll to top smoothly
    if (e.detail.target.id === 'main-content') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/**
 * Intersection Observer for lazy loading and animations
 */
const LazyObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger HTMX lazy load if present
                if (entry.target.hasAttribute('hx-trigger') &&
                    entry.target.getAttribute('hx-trigger').includes('revealed')) {
                    htmx.trigger(entry.target, 'revealed');
                }
            }
        });
    },
    { threshold: 0.1, rootMargin: '50px' }
);

// Observe all lazy elements
document.querySelectorAll('[data-lazy], [data-animate]').forEach(el => {
    LazyObserver.observe(el);
});
