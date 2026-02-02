import { FadeInUp, StaggerChildren } from '@/components/animations/MotionComponents';
import { BlogCard, BlogCardSkeleton } from '@/components/blog/BlogCard';
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard';
import { getFeaturedPosts, getFeaturedProjects } from '@/lib/data';
import type { BlogPost, Project } from '@/types';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Suspense } from 'react';

// ISR: Revalidate every 6 hours
export const revalidate = 21600;

// Featured Projects Component
async function FeaturedProjects() {
    let projects: Project[] = [];
    const locale = await getLocale();

    try {
        projects = await getFeaturedProjects(4);
    } catch (error) {
        console.error('Error fetching featured projects:', error);
    }

    if (!projects || projects.length === 0) {
        // Demo Projects for Initial State
        const demoProjects: Project[] = locale === 'tr' ? [
            {
                _id: 'demo-1',
                title: 'RAG Tabanlı AI Asistanı',
                slug: { current: 'rag-ai-assistant' },
                excerpt: 'Kurumsal dokümanlar üzerinde soru-cevap yapabilen, LLM destekli akıllı asistan.',
                mainImage: { asset: { _id: '', url: '' } },
                technologies: ['Python', 'LangChain', 'OpenAI', 'Next.js'],
            },
            {
                _id: 'demo-2',
                title: 'Siber Güvenlik Dashboard',
                slug: { current: 'cybersec-dashboard' },
                excerpt: 'Gerçek zamanlı tehdit izleme ve analiz platformu. SOC operasyonları için tasarlandı.',
                mainImage: { asset: { _id: '', url: '' } },
                technologies: ['React', 'D3.js', 'Socket.io', 'Node.js'],
            }
        ] : [
            {
                _id: 'demo-1',
                title: 'RAG Based AI Assistant',
                slug: { current: 'rag-ai-assistant' },
                excerpt: 'LLM-powered smart assistant capable of Q&A on corporate documents.',
                mainImage: { asset: { _id: '', url: '' } },
                technologies: ['Python', 'LangChain', 'OpenAI', 'Next.js'],
            },
            {
                _id: 'demo-2',
                title: 'Cybersecurity Dashboard',
                slug: { current: 'cybersec-dashboard' },
                excerpt: 'Real-time threat monitoring and analysis platform. Designed for SOC operations.',
                mainImage: { asset: { _id: '', url: '' } },
                technologies: ['React', 'D3.js', 'Socket.io', 'Node.js'],
            }
        ];

        return (
            <StaggerChildren className="grid gap-6 md:grid-cols-2">
                {demoProjects.map((project, index) => (
                    <ProjectCard key={project._id} project={project} index={index} />
                ))}
            </StaggerChildren>
        );
    }

    return (
        <StaggerChildren className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
            ))}
        </StaggerChildren>
    );
}

// Featured Posts Component
async function FeaturedPosts() {
    let posts: BlogPost[] = [];
    const locale = await getLocale();

    try {
        posts = await getFeaturedPosts(3);
    } catch (error) {
        console.error('Error fetching featured posts:', error);
    }

    if (!posts || posts.length === 0) {
        // Demo Posts for Initial State
        const demoPosts: BlogPost[] = locale === 'tr' ? [
            {
                _id: 'demo-post-1',
                title: 'LLM Fine-Tuning Rehberi',
                slug: { current: 'llm-fine-tuning-guide' },
                excerpt: 'Açık kaynaklı modelleri kendi verilerinizle nasıl eğitebilirsiniz? Adım adım rehber.',
                mainImage: { asset: { _id: '', url: '' } },
                categories: [{ title: 'Yapay Zeka', slug: { current: 'ai' } }],
                author: { name: 'Buğra Akın', image: '' },
                publishedAt: new Date().toISOString(),
                body: []
            },
            {
                _id: 'demo-post-2',
                title: 'Modern Web Güvenliği',
                slug: { current: 'modern-web-security' },
                excerpt: 'Next.js uygulamalarında güvenlik en iyi pratikleri ve yaygın açıklardan korunma yöntemleri.',
                mainImage: { asset: { _id: '', url: '' } },
                categories: [{ title: 'Siber Güvenlik', slug: { current: 'security' } }],
                author: { name: 'Buğra Akın', image: '' },
                publishedAt: new Date().toISOString(),
                body: []
            }
        ] : [
            {
                _id: 'demo-post-1',
                title: 'LLM Fine-Tuning Guide',
                slug: { current: 'llm-fine-tuning-guide' },
                excerpt: 'How to train open-source models with your own data? Step-by-step guide.',
                mainImage: { asset: { _id: '', url: '' } },
                categories: [{ title: 'Artificial Intelligence', slug: { current: 'ai' } }],
                author: { name: 'Buğra Akın', image: '' },
                publishedAt: new Date().toISOString(),
                body: []
            },
            {
                _id: 'demo-post-2',
                title: 'Modern Web Security',
                slug: { current: 'modern-web-security' },
                excerpt: 'Security best practices and prevention methods for common vulnerabilities in Next.js apps.',
                mainImage: { asset: { _id: '', url: '' } },
                categories: [{ title: 'Cybersecurity', slug: { current: 'security' } }],
                author: { name: 'Buğra Akın', image: '' },
                publishedAt: new Date().toISOString(),
                body: []
            }
        ];

        return (
            <StaggerChildren className="space-y-6">
                {demoPosts.map((post, index) => (
                    <BlogCard key={post._id} post={post} index={index} />
                ))}
            </StaggerChildren>
        );
    }

    return (
        <StaggerChildren className="space-y-6">
            {posts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
            ))}
        </StaggerChildren>
    );
}

function ProjectsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
                <ProjectCardSkeleton key={i} />
            ))}
        </div>
    );
}

function PostsSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default async function HomePage() {
    const t = await getTranslations('home');
    const tCommon = await getTranslations('common');

    return (
        <>
            {/* Background Effects */}
            <div className="fixed inset-0 -z-50 bg-[#030014]">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-secondary-500/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container-custom pt-28 pb-24 md:pt-32 md:pb-32">
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left Column: Profile & Stats (Dashboard Side) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 lg:h-fit">
                        <FadeInUp className="space-y-6">
                            {/* Profile Card */}
                            <div className="glass-panel p-8 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 animate-pulse rounded-full bg-primary-500/20 blur-xl" />
                                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-primary-500/30 p-1">
                                        {/* Placeholder for Profile Image if not available */}
                                        <div className="h-full w-full rounded-full bg-neutral-800 flex items-center justify-center text-3xl font-bold text-neutral-500">
                                            MA
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-[#030014] bg-accent-500" />
                                </div>

                                <h1 className="heading-2 mb-2">Muhammed Buğra Akın</h1>
                                <p className="text-sm font-medium text-primary-400 mb-6">
                                    AI & Cybersecurity Engineer
                                </p>

                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">3+</div>
                                        <div className="text-xs text-neutral-500">{tCommon('yearsExp')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">20+</div>
                                        <div className="text-xs text-neutral-500">{tCommon('projects')}</div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center gap-4">
                                    <Link href="/contact" className="btn-primary flex-1">
                                        {t('hero.cta.secondary')}
                                    </Link>
                                    <Link href="/about" className="btn-secondary flex-1">
                                        {tCommon('profile')}
                                    </Link>
                                </div>
                            </div>

                            {/* Skills Mini-Card */}
                            <div className="glass-panel p-6">
                                <h3 className="mb-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('skills.title')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Python', 'RAG', 'Next.js', 'CyberSec', 'LLM', 'React', 'Tailwind'].map((skill) => (
                                        <span key={skill} className="rounded bg-white/5 px-2 py-1 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </FadeInUp>
                    </div>

                    {/* Right Column: Content Feed */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Hero / Intro Text */}
                        <FadeInUp delay={0.2} className="glass-panel p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500" />
                            <h2 className="heading-1 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                                &lt;System.Initialize /&gt;
                            </h2>
                            <p className="text-lg text-neutral-300 leading-relaxed">
                                {t('hero.description')}
                            </p>
                        </FadeInUp>

                        {/* Projects Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="heading-2 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary-500" />
                                    {t('featuredProjects.title')}
                                </h2>
                                <Link href="/projects" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                                    {t('featuredProjects.viewAll')} &rarr;
                                </Link>
                            </div>
                            <Suspense fallback={<ProjectsSkeleton />}>
                                <FeaturedProjects />
                            </Suspense>
                        </section>

                        {/* Blog/Articles Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="heading-2 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-secondary-500" />
                                    {t('featuredPosts.title')}
                                </h2>
                                <Link href="/blog" className="text-sm text-secondary-400 hover:text-secondary-300 transition-colors">
                                    {t('featuredPosts.viewAll')} &rarr;
                                </Link>
                            </div>
                            <Suspense fallback={<PostsSkeleton />}>
                                <FeaturedPosts />
                            </Suspense>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
