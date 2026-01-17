# Makefile for Next.js Portfolio Project
# Automates development, testing, and deployment tasks

.PHONY: help install dev build start lint test clean type-check sanity

# Default target
help:
	@echo "Available commands:"
	@echo "  install        Install dependencies for all workspaces"
	@echo "  dev            Start Next.js development server"
	@echo "  build          Build Next.js for production"
	@echo "  start          Start production server"
	@echo "  lint           Run ESLint"
	@echo "  type-check     Run TypeScript type checking"
	@echo "  test           Run Playwright tests"
	@echo "  clean          Clean build artifacts and caches"
	@echo "  sanity-dev     Start Sanity Studio development server"

# Development setup
install:
	npm install
	cd nextjs-app && npm install
	cd portfolio && npm install
	@echo "✅ Dependencies installed"

# Development server
dev:
	cd nextjs-app && npm run dev

# Production build
build:
	cd nextjs-app && npm run build

# Start production server
start:
	cd nextjs-app && npm run start

# Linting
lint:
	cd nextjs-app && npm run lint

# Type checking
type-check:
	cd nextjs-app && npm run type-check

# Testing
test:
	cd nextjs-app && npm run test

test-ui:
	cd nextjs-app && npm run test:ui

test-headed:
	cd nextjs-app && npm run test:headed

# Lighthouse
lighthouse:
	cd nextjs-app && npm run lighthouse

# Sanity Studio
sanity-dev:
	cd portfolio && npm run dev

# Cleanup
clean:
	@echo "🧹 Cleaning build artifacts..."
	cd nextjs-app && rm -rf .next out node_modules/.cache
	@echo "✅ Cleanup complete"

clean-all:
	@echo "🧹 Cleaning all artifacts and node_modules..."
	rm -rf node_modules
	cd nextjs-app && rm -rf .next out node_modules
	cd portfolio && rm -rf node_modules
	@echo "✅ Full cleanup complete"

# Quality checks
check: lint type-check
	@echo "✅ All quality checks passed!"

# Format code
format:
	cd nextjs-app && npm run format

format-check:
	cd nextjs-app && npm run format:check
