'use client';

import { cn } from '@/lib/utils';
import type { Project } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                href={`/projects/${project.slug.current}`}
                className="group relative block h-full"
            >
                <div className={cn(
                    'glass-panel relative h-full overflow-hidden p-4',
                    'hover:shadow-[0_0_30px_rgba(112,0,255,0.15)]',
                    'border border-white/5 hover:border-secondary-500/30'
                )}>
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-secondary-500/20 to-primary-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Image Container */}
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-neutral-900/50">
                        {project.mainImage?.asset?.url ? (
                            <Image
                                src={project.mainImage.asset.url}
                                alt={project.mainImage.alt || project.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center border border-white/5 bg-[#0A0A0A]">
                                <svg
                                    className="h-12 w-12 text-neutral-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-[calc(100%-aspect-video-1rem)]">
                        <h3 className="heading-3 mb-2 text-xl font-bold text-white transition-colors group-hover:text-secondary-400">
                            {project.title}
                        </h3>

                        {project.excerpt && (
                            <p className="mb-4 line-clamp-2 text-sm text-neutral-400">
                                {project.excerpt}
                            </p>
                        )}

                        <div className="mt-auto">
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.slice(0, 4).map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono font-medium text-neutral-300 transition-colors group-hover:border-secondary-500/30 group-hover:text-secondary-300"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                        <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-neutral-400">
                                            +{project.technologies.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className="glass-panel animate-pulse p-4">
            <div className="mb-4 aspect-video rounded-lg bg-neutral-800/50" />
            <div className="mb-2 h-6 w-3/4 rounded bg-neutral-800/50" />
            <div className="mb-4 h-4 w-full rounded bg-neutral-800/50" />
            <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-neutral-800/50" />
                <div className="h-5 w-20 rounded bg-neutral-800/50" />
            </div>
        </div>
    );
}
