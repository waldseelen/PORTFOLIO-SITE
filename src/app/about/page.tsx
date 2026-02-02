import { FadeInUp } from '@/components/animations/MotionComponents';
import { siteConfig } from '@/lib/constants';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Hakkımda',
    description: 'Yapay Zeka, Siber Güvenlik ve Modern Web Teknolojileri üzerine çalışan Elektrik-Elektronik Mühendisliği öğrencisi.',
};

export default async function AboutPage() {
    const t = await getTranslations('about');
    const skills = {
        aiLlm: ['RAG Mimarisi', 'Doküman Embedding', 'Vektör Veritabanları', 'LORA/QLORA Fine-tuning', 'Prompt Mühendisliği'],
        cybersecurity: ['Fortigate Firewall (IPS, SSL VPN)', 'Penetrasyon Testleri (Burp Suite, SQLMap)', 'SOC Operasyonları (QRadar, CrowdStrike)', 'Linux Sistem Yönetimi'],
        software: ['Python', 'JavaScript', 'HTML/CSS', 'Supabase', 'REST API', 'Next.js'],
        tools: ['Git', 'Docker', 'Pipedream', 'VS Code', 'Jupyter'],
    };

    const experiences = [
        {
            title: 'Stajyer - SOC Operasyonları',
            company: 'Siber Güvenlik Firması',
            period: '2025 - Günümüz',
            description: 'QRadar SIEM ile güvenlik olay yönetimi, CrowdStrike EDR kullanımı ve tehdit analizi.',
        },
        {
            title: 'Yapay Zeka Araştırmacısı',
            company: 'Kişisel Projeler',
            period: '2024 - Günümüz',
            description: 'RAG mimarisi, LLM fine-tuning ve üretken yapay zeka uygulamaları geliştirme.',
        },
        {
            title: 'Elektrik-Elektronik Mühendisliği',
            company: 'Üniversite Eğitimi',
            period: '2021 - Devam Ediyor',
            description: 'Mühendislik temelleri, sinyal işleme ve gömülü sistemler üzerine eğitim.',
        },
    ];

    return (
        <div className="pt-28 pb-16">
            <div className="container-custom">
                <FadeInUp>
                    {/* Hero Section */}
                    <div className="glass-panel p-8 md:p-12 mb-12">
                        <div className="max-w-4xl">
                            <h1 className="heading-1 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-primary-400">
                                {t('title')}
                            </h1>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg text-neutral-300 leading-relaxed">
                                    {t('intro', { name: siteConfig.author.name })}
                                </p>
                                <p className="text-lg text-neutral-300 leading-relaxed mt-4">
                                    {t('bio')}
                                </p>
                            </div>

                            {/* Key Metrics */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-400 mb-1">{t('focus')}</h3>
                                    <p className="text-sm text-neutral-300">{t('focusDesc')}</p>
                                </div>
                                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-400 mb-1">{t('approach')}</h3>
                                    <p className="text-sm text-neutral-300">{t('approachDesc')}</p>
                                </div>
                                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-400 mb-1">{t('target')}</h3>
                                    <p className="text-sm text-neutral-300">{t('targetDesc')}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                    {t('githubProfile')}
                                </a>
                                <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                    {t('linkedIn')}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                        {/* AI & LLM */}
                        <div className="glass-panel p-6 hover:border-primary-500/30 transition-colors">
                            <h3 className="text-lg font-bold text-primary-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-500" />
                                {t('aiLlm')}
                            </h3>
                            <ul className="space-y-2">
                                {skills.aiLlm.map((skill) => (
                                    <li key={skill} className="text-sm text-neutral-400 flex items-start gap-2">
                                        <span className="text-primary-500/50 mt-1">›</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cyber Security */}
                        <div className="glass-panel p-6 hover:border-accent-500/30 transition-colors">
                            <h3 className="text-lg font-bold text-accent-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent-500" />
                                {t('cybersecurity')}
                            </h3>
                            <ul className="space-y-2">
                                {skills.cybersecurity.map((skill) => (
                                    <li key={skill} className="text-sm text-neutral-400 flex items-start gap-2">
                                        <span className="text-accent-500/50 mt-1">›</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Software */}
                        <div className="glass-panel p-6 hover:border-secondary-500/30 transition-colors">
                            <h3 className="text-lg font-bold text-secondary-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-secondary-500" />
                                {t('software')}
                            </h3>
                            <ul className="space-y-2">
                                {skills.software.map((skill) => (
                                    <li key={skill} className="text-sm text-neutral-400 flex items-start gap-2">
                                        <span className="text-secondary-500/50 mt-1">›</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tools */}
                        <div className="glass-panel p-6 hover:border-white/30 transition-colors">
                            <h3 className="text-lg font-bold text-neutral-200 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neutral-500" />
                                Araçlar
                            </h3>
                            <ul className="space-y-2">
                                {skills.tools.map((skill) => (
                                    <li key={skill} className="text-sm text-neutral-400 flex items-start gap-2">
                                        <span className="text-neutral-500/50 mt-1">›</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="glass-panel p-8">
                        <h2 className="heading-2 mb-8 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm">EXP</span>
                            {t('experience')}
                        </h2>
                        <div className="space-y-8">
                            {experiences.map((exp, index) => (
                                <div key={index} className="relative pl-8 border-l border-white/10 last:border-0 pb-8 last:pb-0">
                                    <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-[#030014]" />

                                    <div className="group">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                                {exp.title}
                                            </h3>
                                            <span className="text-xs font-mono py-1 px-2 rounded bg-white/5 text-neutral-400 border border-white/5">
                                                {exp.period}
                                            </span>
                                        </div>
                                        <p className="text-secondary-400 text-sm font-medium mb-2">{exp.company}</p>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeInUp>
            </div>
        </div>
    );
}
