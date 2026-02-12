'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

// Note: metadata export doesn't work in client components
// This page is client-side due to form state management

export default function ContactPage() {
    const t = useTranslations('contact');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // TODO: API endpoint'e form verisi gönderilecek
            // const response = await fetch('/api/contact', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData),
            // });

            // Simulated success
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="pt-28 pb-16">
            <div className="container-custom">
                <div className="mx-auto max-w-2xl">
                    {/* Page Header */}
                    <div className="mb-12 text-center">
                        <h1 className="heading-1">{t('title')}</h1>
                        <p className="mt-4 text-lg text-neutral-300">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-panel p-6 md:p-8">
                        {status === 'success' ? (
                            <div className="py-8 text-center" aria-live="polite">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/20 border border-accent-500/30">
                                    <svg className="h-8 w-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="heading-3">{t('form.success')}</h2>
                                <p className="mt-2 text-neutral-400">
                                    {t('form.successDesc')}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStatus('idle')}
                                    className="btn-primary mt-6"
                                >
                                    {t('form.newMessage')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                                        {t('form.name')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="glass-panel block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder={t('form.namePlaceholder')}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                                        {t('form.email')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="glass-panel block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder={t('form.emailPlaceholder')}
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white">
                                        {t('form.subject')} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="glass-panel block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    >
                                        <option value="">{t('form.subjectPlaceholder')}</option>
                                        <option value="project">{t('form.subjectOptions.project')}</option>
                                        <option value="collaboration">{t('form.subjectOptions.collaboration')}</option>
                                        <option value="question">{t('form.subjectOptions.question')}</option>
                                        <option value="other">{t('form.subjectOptions.other')}</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
                                        {t('form.message')} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="glass-panel block w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder={t('form.messagePlaceholder')}
                                    />
                                </div>

                                {/* Error message */}
                                {status === 'error' && (
                                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300" aria-live="polite">
                                        {t('form.error')}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            {t('form.sending')}
                                        </span>
                                    ) : (
                                        t('form.submit')
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        <div className="glass-panel p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10 border border-primary-500/30">
                                <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-white">{t('info.email')}</h3>
                            <a href="mailto:bugraakin01@gmail.com" className="mt-1 text-primary-400 hover:text-primary-300 transition-colors">
                                bugraakin01@gmail.com
                            </a>
                        </div>
                        <div className="glass-panel p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-500/10 border border-secondary-500/30">
                                <svg className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-white">{t('info.location')}</h3>
                            <p className="mt-1 text-neutral-400">{t('info.locationValue')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
