import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
    try {
        const slugs = await getAllProjectSlugs();
        return slugs.map((slug) => ({ slug }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
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

    let project;
    try {
        project = await getProjectBySlug(slug);
    } catch (error) {
        console.error('Error fetching project:', error);
        notFound();
    }

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
                {project.mainImage?.asset?.url ? (
                    <div className="mb-12">
                        <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-900/50 ring-1 ring-white/10">
                            <Image
                                src={project.mainImage.asset.url}
                                alt={project.mainImage.alt || project.title}
                                width={1200}
                                height={675}
                                className="w-full h-full object-cover"
                                quality={90}
                                priority
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-12">
                        <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-900/50 ring-1 ring-white/10 flex items-center justify-center">
                            <svg className="h-24 w-24 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Project Content */}
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="prose-custom lg:col-span-2">
                        <h2>Proje Hakkında</h2>
                        {project.body && Array.isArray(project.body) && project.body.length > 0 ? (
                            <PortableTextRenderer value={project.body} />
                        ) : (
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {project.excerpt || 'Proje açıklaması henüz eklenmedi.'}
                            </p>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="mb-4 text-lg font-semibold">Proje Detayları</h3>
                            <dl className="space-y-4">
                                {project.status && (
                                    <div>
                                        <dt className="text-sm font-medium text-neutral-500">Durum</dt>
                                        <dd className="mt-1 text-neutral-900 dark:text-neutral-50">
                                            {project.status === 'completed' && 'Tamamlandı'}
                                            {project.status === 'in-progress' && 'Devam Ediyor'}
                                            {project.status === 'archived' && 'Arşivlendi'}
                                        </dd>
                                    </div>
                                )}
                                {project.categories && project.categories.length > 0 && (
                                    <div>
                                        <dt className="text-sm font-medium text-neutral-500">Kategori</dt>
                                        <dd className="mt-1 text-neutral-900 dark:text-neutral-50">
                                            {project.categories.map(cat => cat.title).join(', ')}
                                        </dd>
                                    </div>
                                )}
                                {(project.startDate || project.endDate) && (
                                    <div>
                                        <dt className="text-sm font-medium text-neutral-500">Tarih</dt>
                                        <dd className="mt-1 text-neutral-900 dark:text-neutral-50">
                                            {project.startDate && new Date(project.startDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                                            {project.startDate && project.endDate && ' - '}
                                            {project.endDate && new Date(project.endDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                                        </dd>
                                    </div>
                                )}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div>
                                        <dt className="text-sm font-medium text-neutral-500">Teknolojiler</dt>
                                        <dd className="mt-2 flex flex-wrap gap-2">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono text-neutral-300"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
