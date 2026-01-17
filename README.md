# Portfolio Next.js App

Modern portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and Sanity CMS.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Sanity CMS** for content management
- **ISR (Incremental Static Regeneration)** for optimal performance
- **PWA Support** with Serwist
- **On-demand Revalidation** via Sanity webhooks
- **SEO Optimized** with proper meta tags
- **Accessible** with WCAG guidelines in mind
- **Dark Mode** support (ready to implement)

## 📁 Project Structure

```
nextjs-app/
├── public/                 # Static files
│   ├── manifest.json       # PWA manifest
│   └── icons/              # App icons
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── contact/    # Contact form API
│   │   │   └── revalidate/ # Sanity webhook handler
│   │   ├── blog/           # Blog pages
│   │   │   ├── page.tsx    # Blog listing
│   │   │   └── [slug]/     # Blog post detail
│   │   ├── projects/       # Project pages
│   │   │   ├── page.tsx    # Projects listing
│   │   │   └── [slug]/     # Project detail
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── offline/        # Offline fallback page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── loading.tsx     # Loading UI
│   │   ├── error.tsx       # Error UI
│   │   └── not-found.tsx   # 404 page
│   ├── components/         # React components
│   │   └── layout/         # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/                # Utility functions
│   │   ├── utils.ts        # Helper functions
│   │   └── constants.ts    # Site configuration
│   ├── sanity/             # Sanity client & queries
│   │   ├── client.ts       # Sanity client setup
│   │   └── queries.ts      # GROQ queries
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind + custom styles
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   └── sw.ts               # Service Worker
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd nextjs-app
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Sanity project credentials.

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (usually `production`) |
| `SANITY_API_TOKEN` | Sanity API token (for write operations) |
| `SANITY_REVALIDATE_SECRET` | Secret for webhook verification |
| `NEXT_PUBLIC_SITE_URL` | Your production site URL |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata |

## 🔄 ISR & Revalidation

- **Default ISR:** 6-24 hours (configurable in `lib/constants.ts`)
- **On-demand Revalidation:** Configure a Sanity webhook to POST to `/api/revalidate`

### Sanity Webhook Setup

1. Go to Sanity Dashboard → Settings → Webhooks
2. Create new webhook with:
   - URL: `https://your-domain.com/api/revalidate`
   - Trigger: Create, Update, Delete
   - Secret: Your `SANITY_REVALIDATE_SECRET`

## 🌐 PWA Configuration

The app uses Serwist for PWA support:
- Offline fallback page
- Asset caching (images, fonts, scripts)
- Sanity CDN image caching

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript check
npm run format       # Format with Prettier
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Build and start:
```bash
npm run build
npm run start
```

## 📋 Next Steps

1. [ ] Set up Sanity Studio
2. [ ] Create content schemas
3. [ ] Add real content
4. [ ] Configure analytics
5. [ ] Add theme toggle
6. [ ] Implement search functionality

## 📄 License

MIT License - feel free to use for your own portfolio!
