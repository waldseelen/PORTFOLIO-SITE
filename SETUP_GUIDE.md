# 🚀 SETUP GUIDE - Dependencies & Environment Variables

**Created:** January 17, 2026  
**Status:** ✅ Ready for Configuration

---

## 📦 DEPENDENCIES INSTALLATION

### ✅ Already Installed
```bash
next (15.1.0)
react (19.0.0)
typescript (5.7.0)
@sanity/client (6.24.0)
@serwist/next (PWA)
tailwindcss
next-sanity
next-auth (250 packages)
```

### ✅ Just Installed (Jan 17, 2026)
```
✅ algoliasearch              - Advanced search
✅ react-instantsearch       - Algolia UI components
✅ react-hook-form           - Form handling
✅ zod                       - Schema validation
✅ zustand                   - State management
✅ swr                       - Data fetching
✅ socket.io-client          - Real-time WebSockets
✅ dotenv-safe               - Environment validation
```

### 📝 Optional Installs
```bash
npm install stripe           # Payment processing
npm install sentry/nextjs    # Error tracking
npm install plausible-tracker # Privacy-focused analytics
```

---

## 🔑 ENVIRONMENT VARIABLES

### ✅ Created Files
- `nextjs-app/.env.local` - All variables with templates
- `nextjs-app/.env.example` - Reference template

### 📋 Environment Variables Required

#### Required for Core Functionality

**1. Sanity CMS**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```
→ Get from: https://sanity.io

**2. NextAuth Authentication**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your_secret_here>
```
→ Generate secret: `openssl rand -base64 32`

**3. OAuth Providers**

*GitHub:*
```
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```
→ Get from: https://github.com/settings/developers

*Google:*
```
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```
→ Get from: https://console.cloud.google.com

#### Optional Services

**Search - Algolia**
```
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key
```
→ Get from: https://www.algolia.com

**Email - Resend**
```
RESEND_API_KEY=your_resend_api_key
```
→ Get from: https://resend.com

**Analytics - Vercel**
```
VERCEL_ANALYTICS_ID=your_analytics_id
```
→ Auto-enabled on Vercel deployment

**Analytics - Google**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
→ Get from: https://analytics.google.com

#### Site Configuration
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Portfolio
SANITY_REVALIDATE_SECRET=your_secret
NODE_ENV=development
```

---

## 🔧 STEP-BY-STEP SETUP

### Step 1: Sanity Setup (10 minutes)

```bash
# 1. Go to https://sanity.io
# 2. Create new project
# 3. Copy Project ID
# 4. Create API token (with write access)
# 5. Paste into .env.local:

NEXT_PUBLIC_SANITY_PROJECT_ID=abc123def456
SANITY_API_TOKEN=sk_production_xxx
```

### Step 2: GitHub OAuth Setup (5 minutes)

```bash
# 1. Go to https://github.com/settings/developers
# 2. Click "New OAuth App"
# 3. Fill in details:
#    - App name: Portfolio
#    - Homepage URL: http://localhost:3000
#    - Callback URL: http://localhost:3000/api/auth/callback/github
# 4. Copy Client ID and Secret
# 5. Paste into .env.local:

GITHUB_ID=xxx
GITHUB_SECRET=xxx
```

### Step 3: Google OAuth Setup (5 minutes)

```bash
# 1. Go to https://console.cloud.google.com
# 2. Create new project or select existing
# 3. Go to Credentials
# 4. Create OAuth 2.0 Client IDs (Web application)
# 5. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google
#    - https://your-domain.com/api/auth/callback/google (for production)
# 6. Copy Client ID and Secret
# 7. Paste into .env.local:

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Step 4: Generate NextAuth Secret (1 minute)

```bash
# Generate secure secret
openssl rand -base64 32

# Result: copy and paste into NEXTAUTH_SECRET
NEXTAUTH_SECRET=xxx
```

### Step 5: Verify Setup (2 minutes)

```bash
# 1. Navigate to nextjs-app
cd nextjs-app

# 2. Start development server
npm run dev

# 3. Visit http://localhost:3000
# 4. Check console for Sanity errors
# 5. Test auth at /api/auth/signin
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] `.env.local` created with all variables
- [ ] Sanity credentials obtained and set
- [ ] GitHub OAuth credentials set
- [ ] Google OAuth credentials set
- [ ] NextAuth secret generated and set
- [ ] Development server runs without errors
- [ ] No "Sanity is not configured" warnings in logs
- [ ] Auth endpoints working at `/api/auth/signin`

---

## 🚀 AFTER SETUP

Once environment variables are configured:

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 📚 USEFUL LINKS

| Service | URL |
|---------|-----|
| Sanity | https://sanity.io |
| NextAuth.js | https://next-auth.js.org |
| GitHub OAuth | https://github.com/settings/developers |
| Google Cloud | https://console.cloud.google.com |
| Algolia | https://www.algolia.com |
| Resend | https://resend.com |
| Vercel | https://vercel.com |

---

**Next Step:** Fill in `.env.local` with your credentials and restart dev server! 🎉
