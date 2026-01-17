import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard';
import { getAllProjects } from '@/lib/data';
import type { Project } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projeler',
    description: 'Geliştirdiğim projeler ve çalışmalarım.',
};

// ISR with medium revalidation (6 hours)
export const revalidate = 21600;

export default async function ProjectsPage() {
    let projects: Project[] = [];

    try {
        projects = await getAllProjects();
    } catch (error) {
        console.error('Error fetching projects:', error);
    }

    // Fallback demo projects if no data from Sanity
    const demoProjects = [
        {
            _id: '1',
            title: 'E-Commerce Platform',
            slug: { current: 'e-commerce-platform' },
            excerpt: 'Modern bir e-ticaret platformu. Next.js, Stripe ve Sanity ile geliştirildi.',
            technologies: ['Next.js', 'TypeScript', 'Stripe', 'Sanity'],
            featured: true,
        },
        {
            _id: '2',
            title: 'Task Management App',
            slug: { current: 'task-management-app' },
            excerpt: 'Ekipler için gerçek zamanlı görev yönetim uygulaması.',
            technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
            featured: true,
        },
        {
            _id: '3',
            title: 'AI Content Generator',
            slug: { current: 'ai-content-generator' },
            excerpt: 'OpenAI API ile entegre içerik üretim aracı.',
            technologies: ['Python', 'FastAPI', 'OpenAI', 'React'],
            featured: false,
        },
        {
            _id: '4',
            title: 'Portfolio Website',
            slug: { current: 'portfolio-website' },
            excerpt: 'Kişisel portfolio sitesi. Next.js ve Sanity CMS ile geliştirildi.',
            technologies: ['Next.js', 'Tailwind CSS', 'Sanity', 'Vercel'],
            featured: false,
        },
    ] as Project[];

    const displayProjects = projects.length > 0 ? projects : demoProjects;

    return (
        <div className="section">
            <div className="container-custom">
                {/* Page Header */}
                <div className="mb-12 max-w-2xl">
                    <h1 className="heading-1">Projeler</h1>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                        Geliştirdiğim projeler ve çalışmalarım. Her proje farklı teknolojiler ve
                        çözümler içermektedir.
                    </p>
                </div>

                {/* Projects Grid */}
                {displayProjects.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayProjects.map((project, index) => (
                            <ProjectCard key={project._id} project={project} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <ProjectCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {projects.length === 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Demo içerik gösteriliyor. Sanity Studio&apos;dan gerçek projeler ekleyin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
