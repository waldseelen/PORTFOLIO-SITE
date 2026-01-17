'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Animation variants
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

export const slideInLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export const slideInRight: Variants = {
    hidden: {
        opacity: 0,
        x: 30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerContainerFast: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05,
        },
    },
};

// Hover animations
export const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 },
};

export const hoverLift = {
    y: -4,
    transition: { duration: 0.2 },
};

export const tapScale = {
    scale: 0.98,
};

// Page transition variants
export const pageTransition: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

// Components
interface MotionWrapperProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    variants?: Variants;
    once?: boolean;
}

export function FadeInUp({
    children,
    className,
    delay = 0,
    once = true
}: MotionWrapperProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-50px' }}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeIn({
    children,
    className,
    delay = 0,
    once = true
}: MotionWrapperProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-50px' }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        duration: 0.4,
                        delay,
                        ease: 'easeOut',
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function SlideIn({
    children,
    className,
    delay = 0,
    direction = 'left',
    once = true,
}: MotionWrapperProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
    const directionOffset = {
        left: { x: -30, y: 0 },
        right: { x: 30, y: 0 },
        up: { x: 0, y: -30 },
        down: { x: 0, y: 30 },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-50px' }}
            variants={{
                hidden: {
                    opacity: 0,
                    ...directionOffset[direction]
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({
    children,
    className,
    delay = 0,
    once = true
}: MotionWrapperProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-50px' }}
            variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                        duration: 0.4,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerChildren({
    children,
    className,
    staggerDelay = 0.1,
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.1,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Interactive card with hover effects
interface MotionCardProps {
    children: ReactNode;
    className?: string;
    href?: string;
}

export function MotionCard({ children, className }: MotionCardProps) {
    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Button with micro-interactions
export function MotionButton({
    children,
    className,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}

// Link with hover underline animation
export function MotionLink({
    children,
    className,
    href,
}: {
    children: ReactNode;
    className?: string;
    href: string;
}) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.02 }}
            className={className}
        >
            {children}
        </motion.a>
    );
}
