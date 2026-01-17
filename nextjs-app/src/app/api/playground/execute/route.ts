/**
 * Code Playground Execution API Route
 * WARNING: This is a placeholder. Code execution requires sandboxing.
 *
 * Production Options:
 * 1. Use external services: Judge0, Piston, CodeSandbox API
 * 2. Use containers: Docker/Podman with resource limits
 * 3. Use Web Workers for browser-side execution (JavaScript only)
 *
 * Current: Returns simulated response for demo purposes
 */

import { NextRequest, NextResponse } from 'next/server';

interface ExecuteRequest {
    code: string;
    language: string;
    language_id?: string;
}

interface ExecuteResponse {
    success: boolean;
    output?: string;
    error?: string;
    execution_time?: number;
    memory_used?: number;
}

// Simulated code execution responses
const DEMO_OUTPUTS: { [key: string]: string } = {
    python: `Hello, World!
Execution time: 0.023s
Memory used: 2.4 MB`,
    javascript: `Hello, World!
Execution time: 0.015s
Memory used: 1.8 MB`,
    typescript: `Hello, World!
Compiled successfully
Execution time: 0.031s
Memory used: 3.2 MB`,
    java: `Hello, World!
Compiled: Main.java
Execution time: 0.125s
Memory used: 15.4 MB`,
    cpp: `Hello, World!
Compiled: main.cpp
Execution time: 0.008s
Memory used: 1.2 MB`,
    c: `Hello, World!
Compiled: main.c
Execution time: 0.007s
Memory used: 0.9 MB`,
    go: `Hello, World!
Execution time: 0.012s
Memory used: 2.1 MB`,
    rust: `Hello, World!
Compiled successfully
Execution time: 0.009s
Memory used: 1.5 MB`,
};

function getSimulatedOutput(language: string, code: string): string {
    const lang = language.toLowerCase();

    // Check for print/console.log statements
    if (code.includes('print(') || code.includes('console.log(') || code.includes('System.out.println(')) {
        return DEMO_OUTPUTS[lang] || 'Code executed successfully';
    }

    // Check for syntax errors (very basic)
    if (!code.trim()) {
        throw new Error('Empty code provided');
    }

    return DEMO_OUTPUTS[lang] || 'Code executed successfully';
}

export async function POST(request: NextRequest) {
    try {
        const body: ExecuteRequest = await request.json();
        const { code, language } = body;

        // Validate input
        if (!code || typeof code !== 'string' || code.trim() === '') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Code is required',
                },
                { status: 400 }
            );
        }

        if (!language || typeof language !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Language is required',
                },
                { status: 400 }
            );
        }

        // Simulate execution time
        const startTime = Date.now();

        // Get simulated output
        const output = getSimulatedOutput(language, code);

        const executionTime = Date.now() - startTime;

        const response: ExecuteResponse = {
            success: true,
            output,
            execution_time: executionTime,
            memory_used: Math.floor(Math.random() * 10) + 1, // Random MB between 1-10
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Code execution error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Execution failed',
                output: '',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Code Playground Execution API',
        warning: 'This is a demo endpoint. Real code execution requires proper sandboxing.',
        supported_languages: Object.keys(DEMO_OUTPUTS),
        methods: ['POST'],
        body: {
            code: 'string (required)',
            language: 'string (required)',
        },
        production_recommendations: [
            'Use Judge0 API (https://judge0.com/)',
            'Use Piston API (https://github.com/engineer-man/piston)',
            'Use CodeSandbox API',
            'Use Docker containers with resource limits',
            'Use WebAssembly for browser-side execution',
        ],
    });
}
