import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// import { sanityFetch } from '@/sanity/client';
// import { projectBySlugQuery, projectSlugsQuery } from '@/sanity/queries';

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
    // TODO: Sanity entegrasyonunda bu kısım aktif edilecek
    // const slugs = await sanityFetch<string[]>({
    //   query: projectSlugsQuery,
    //   tags: [cacheTags.projects],
    // });
    // return slugs.map((slug) => ({ slug }));

    return [
        { slug: 'e-commerce-platform' },
        { slug: 'task-management-app' },
        { slug: 'ai-content-generator' },
        { slug: 'portfolio-website' },
    ];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    // TODO: Sanity'den proje verisi çekilecek
    const project = {
        title: `Project: ${slug}`,
        excerpt: 'Bu bir proje açıklamasıdır.',
    };

    if (!project) {
        return {
            title: 'Proje Bulunamadı',
        };
    }

    return {
        title: project.title,
        description: project.excerpt,
        openGraph: {
            title: project.title,
            description: project.excerpt,
            type: 'website',
        },
    };
}

// ISR with long revalidation (24 hours)
export const revalidate = 86400; // 24 hours

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { slug } = await params;

    // TODO: Sanity entegrasyonunda bu kısım aktif edilecek
    // const project = await sanityFetch({
    //   query: projectBySlugQuery,
    //   params: { slug },
    //   tags: [cacheTags.project(slug)],
    // });

    // Placeholder project for initial setup
    const project = {
        _id: '1',
        title: `Project: ${slug}`,
        slug: { current: slug },
        excerpt: 'Bu bir proje açıklamasıdır.',
        body: 'Bu alan Sanity PortableText ile doldurulacak.',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        githubUrl: 'https://github.com/username/project',
        liveUrl: 'https://project.example.com',
        featured: true,
    };

    if (!project) {
        notFound();
    }

    return (
        <div className="section">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm text-neutral-500">
                        <li>
                            <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-50">
                                Ana Sayfa
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/projects" className="hover:text-neutral-900 dark:hover:text-neutral-50">
                                Projeler
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-neutral-900 dark:text-neutral-50">{project.title}</li>
                    </ol>
                </nav>

                {/* Project Header */}
                <header className="mb-12">
                    <h1 className="heading-1">{project.title}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-neutral-600 dark:text-neutral-400">
                        {project.excerpt}
                    </p>

                    {/* Technologies */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {project.technologies?.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                Canlı Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline inline-flex items-center gap-2"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                GitHub
                            </a>
                        )}
                    </div>
                </header>

                {/* Project Image */}
                <div className="mb-12">
                    <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
                </div>

                {/* Project Content */}
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="prose-custom lg:col-span-2">
                        <h2>Proje Hakkında</h2>
                        <p>{project.body}</p>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Bu alan Sanity CMS entegrasyonu tamamlandığında PortableText komponenti ile
                            zengin içerik olarak render edilecektir.
                        </p>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="mb-4 text-lg font-semibold">Proje Detayları</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-neutral-500">Durum</dt>
                                    <dd className="mt-1 text-neutral-900 dark:text-neutral-50">Tamamlandı</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-neutral-500">Kategori</dt>
                                    <dd className="mt-1 text-neutral-900 dark:text-neutral-50">Web Uygulaması</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-neutral-500">Tarih</dt>
                                    <dd className="mt-1 text-neutral-900 dark:text-neutral-50">Ocak 2024</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
