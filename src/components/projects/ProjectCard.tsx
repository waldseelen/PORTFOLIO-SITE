import { cn } from '@/lib/utils';
import type { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const delay = (index % 3) * 100;

    return (
        <Link
            href={`/projects/${project.slug.current}`}
            className={cn(
                'card group cursor-pointer',
                'opacity-0 animate-fade-up',
                delay === 100 && 'animate-delay-100',
                delay === 200 && 'animate-delay-200'
            )}
        >
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {project.mainImage?.asset?.url ? (
                    <Image
                        src={project.mainImage.asset.url}
                        alt={project.mainImage.alt || project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <svg
                            className="h-12 w-12 text-neutral-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <h3 className="heading-3 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {project.title}
            </h3>

            {project.excerpt && (
                <p className="mt-2 line-clamp-2 text-neutral-600 dark:text-neutral-400">
                    {project.excerpt}
                </p>
            )}

            {project.technologies && project.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 4 && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                            +{project.technologies.length - 4}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="mb-4 aspect-video rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-2 h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-2 h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-6 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>
        </div>
    );
}
