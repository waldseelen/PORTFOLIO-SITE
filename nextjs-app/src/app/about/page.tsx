import { siteConfig } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hakkımda',
    description: 'Full-Stack Developer olarak deneyimlerim ve yeteneklerim.',
};

export default function AboutPage() {
    const skills = {
        frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
        backend: ['Node.js', 'Python', 'Django', 'FastAPI', 'PostgreSQL'],
        tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Vercel'],
        other: ['Sanity CMS', 'GraphQL', 'REST API', 'CI/CD', 'Agile'],
    };

    const experiences = [
        {
            title: 'Senior Full-Stack Developer',
            company: 'Şirket Adı',
            period: '2022 - Günümüz',
            description: 'Modern web uygulamaları geliştirme, ekip liderliği ve mimari tasarım.',
        },
        {
            title: 'Full-Stack Developer',
            company: 'Şirket Adı',
            period: '2020 - 2022',
            description: 'E-ticaret platformları ve SaaS ürünleri geliştirme.',
        },
        {
            title: 'Frontend Developer',
            company: 'Şirket Adı',
            period: '2018 - 2020',
            description: 'React ve Vue.js ile kullanıcı arayüzleri tasarım ve geliştirme.',
        },
    ];

    return (
        <div className="section">
            <div className="container-custom">
                {/* Hero Section */}
                <div className="mb-16 grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                            {/* TODO: Gerçek resim eklenecek */}
                            <div className="flex h-full items-center justify-center text-neutral-400">
                                <svg className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary-100 dark:bg-primary-900/30" />
                    </div>

                    {/* Content */}
                    <div>
                        <h1 className="heading-1">Hakkımda</h1>
                        <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
                            Merhaba! Ben {siteConfig.author.name}, tutkulu bir Full-Stack Developer&apos;ım.
                            Modern web teknolojileri ile kullanıcı deneyimi odaklı, performanslı ve
                            erişilebilir uygulamalar geliştirmeyi seviyorum.
                        </p>
                        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                            5+ yıllık deneyimimle, startup&apos;lardan kurumsal şirketlere kadar birçok
                            farklı projede çalıştım. Sürekli öğrenmeye ve yeni teknolojileri keşfetmeye
                            açık biriyim.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                GitHub
                            </a>
                            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn-outline">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <section className="mb-16">
                    <h2 className="heading-2 mb-8">Yetenekler</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="card">
                            <h3 className="mb-4 text-lg font-semibold text-primary-600 dark:text-primary-400">
                                Frontend
                            </h3>
                            <ul className="space-y-2">
                                {skills.frontend.map((skill) => (
                                    <li key={skill} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                        <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="mb-4 text-lg font-semibold text-accent-600 dark:text-accent-400">
                                Backend
                            </h3>
                            <ul className="space-y-2">
                                {skills.backend.map((skill) => (
                                    <li key={skill} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                        <svg className="h-4 w-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                DevOps & Tools
                            </h3>
                            <ul className="space-y-2">
                                {skills.tools.map((skill) => (
                                    <li key={skill} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                        <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                Diğer
                            </h3>
                            <ul className="space-y-2">
                                {skills.other.map((skill) => (
                                    <li key={skill} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                        <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section>
                    <h2 className="heading-2 mb-8">Deneyim</h2>
                    <div className="space-y-8">
                        {experiences.map((exp, index) => (
                            <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-neutral-200 dark:before:bg-neutral-800">
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary-600" />

                                <div className="card">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                                {exp.title}
                                            </h3>
                                            <p className="text-primary-600 dark:text-primary-400">{exp.company}</p>
                                        </div>
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-neutral-600 dark:text-neutral-400">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
