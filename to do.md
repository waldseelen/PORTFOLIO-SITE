# 🛑 MANUEL KURULUMLAR & ENVIRONMENT VARIABLES

Bu doküman, portföy sitesinin çalışması için manuel olarak yapılması gereken tüm kurulumları listeler. Dış servislerden API key'ler alınması ve ortam değişkenlerinin tanımlanması gereklidir.

---

## 📋 YAPILACAKLAR LİSTESİ

### 1. 🔐 Sanity CMS Kurulumu 🔴 KRITIK

**Adres:** https://manage.sanity.io

#### 1.1 Write Token Oluşturma
- [ ] Sanity Dashboard'a giriş yapın
- [ ] **Settings** > **API** seçeneğine gidin
- [ ] **Tokens** tab'ına tıklayın
- [ ] **+ Add New Token** düğmesine basın
- [ ] Token adı olarak `"NextJS Write"` yazın
- [ ] Permissions: **Editor** seçin
- [ ] Token'ı kopyalayın ve `.env.local` dosyasına şu şekilde ekleyin:
  ```
  SANITY_API_WRITE_TOKEN=your_token_here
  ```

#### 1.2 Proje Bilgilerini Alma
- [ ] **Settings** > **General** seçeneğine gidin
- [ ] **Project ID** değerini kopyalayıp `.env.local`'a ekleyin:
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
  ```
- [ ] **Dataset Name** değerini (genellikle `production`) kopyalayıp `.env.local`'a ekleyin:
  ```
  NEXT_PUBLIC_SANITY_DATASET=production
  ```

#### 1.3 Read Token Oluşturma (Opsiyonel)
- [ ] **Tokens** tab'ında **+ Add New Token** düğmesine basın
- [ ] Token adı olarak `"NextJS Read"` yazın
- [ ] Permissions: **Viewer** seçin
- [ ] Token'ı kopyalayıp `.env.local`'a ekleyin:
  ```
  SANITY_API_READ_TOKEN=your_read_token
  ```

---

### 2. 📧 Email Servisi Kurulumu (Resend) 🔴 KRITIK

**Adres:** https://resend.com

#### 2.1 Resend Hesabı Oluşturma
- [ ] Resend'e kaydolun veya giriş yapın
- [ ] Email doğrulaması yapın

#### 2.2 API Key Alınması
- [ ] Dashboard'a gidin
- [ ] **API Keys** seçeneğine tıklayın
- [ ] **+ Create API Key** düğmesine basın
- [ ] Adı `"Production"` yapın
- [ ] Oluşan key'i kopyalayıp `.env.local`'a ekleyin:
  ```
  RESEND_API_KEY=your_resend_api_key
  ```

#### 2.3 Domain Doğrulaması
- [ ] **Domains** seçeneğine gidin
- [ ] **+ Add Domain** düğmesine basın
- [ ] Kendi domain'inizi ekleyin (örn: `portfolio.com`)
- [ ] DNS kayıtlarını ekleyin (Resend tarafından verilecek)
- [ ] Doğrulama tamamlansın

#### 2.4 Email Bildirimi Ayarı
- [ ] `.env.local`'a admin email'inizi ekleyin:
  ```
  ADMIN_EMAIL=your_email@example.com
  ```

---

### 3. 📊 Google Analytics 4 Kurulumu 🟡 ÖNEMLİ

**Adres:** https://analytics.google.com

#### 3.1 GA4 Property Oluşturma
- [ ] Google Analytics Dashboard'a gidin
- [ ] Yeni property oluşturun
- [ ] Property adı: `"Portfolio Site"`
- [ ] Web property type seçin
- [ ] İlgili bilgileri doldurun

#### 3.2 Measurement ID Alınması
- [ ] **Admin** > **Property Settings** seçin
- [ ] **Tracking ID** (G-XXXXXXXXXX) kopyalayın
- [ ] `.env.local`'a ekleyin:
  ```
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
  ```

#### 3.3 Google Search Console Bağlantısı
- [ ] Google Search Console (https://search.google.com/search-console) açın
- [ ] Property'yi ekleyin
- [ ] Domain doğrulaması yapın
- [ ] Analytics ile bağlantı kurun

---

### 4. 🚨 Sentry (Error Tracking) Kurulumu 🟡 ÖNEMLİ

**Adres:** https://sentry.io

#### 4.1 Sentry Hesabı ve Proje Oluşturma
- [ ] Sentry'ye kaydolun veya giriş yapın
- [ ] Yeni organization oluşturun: `"Your Name Portfolio"`
- [ ] Yeni proje oluşturun
- [ ] Platform olarak **Next.js** seçin

#### 4.2 DSN Bilgilerini Alma
- [ ] **Settings** > **Projects** > **Client Keys (DSN)** seçin
- [ ] DSN URL'sini kopyalayın (https://xxxxx@xxxxx.ingest.sentry.io/xxxxx)
- [ ] `.env.local`'a ekleyin:
  ```
  NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
  SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
  ```

#### 4.3 Auth Token Oluşturma
- [ ] **Settings** > **Auth Tokens** seçin
- [ ] **Create New Token** düğmesine basın
- [ ] `sentry:read`, `sentry:write`, `project:read`, `project:release` izinlerini seçin
- [ ] Token'ı kopyalayıp `.env.local`'a ekleyin:
  ```
  SENTRY_AUTH_TOKEN=your_auth_token
  SENTRY_ORG=your_org_name
  SENTRY_PROJECT=your_project_name
  ```

---

### 5. 🚀 Vercel Deployment Kurulumu 🔴 KRITIK

**Adres:** https://vercel.com

#### 5.1 Proje Import Etme
- [ ] Vercel Dashboard'a gidin
- [ ] **Add New** > **Project** seçin
- [ ] GitHub repositorynizi seçin
- [ ] Project ayarlarını yapılandırın

#### 5.2 Environment Variables Ekleme
- [ ] Proje ayarlarında **Settings** > **Environment Variables** seçin
- [ ] Aşağıdaki environment variable'ları ekleyin:

**Production, Preview, Development için:**
```
SANITY_API_WRITE_TOKEN=your_write_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_email@example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your_org_name
SENTRY_PROJECT=your_project_name
SENTRY_AUTH_TOKEN=your_auth_token
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### 5.3 Custom Domain Bağlama (Opsiyonel)
- [ ] **Settings** > **Domains** seçin
- [ ] Domain adınızı ekleyin
- [ ] DNS kayıtlarını yapılandırın
- [ ] Doğrulama tamamlansın

#### 5.4 Build & Deploy Ayarları
- [ ] **Build & Development Settings** seçin
- [ ] Build Command: `npm run build` ✓
- [ ] Output Directory: `.next` ✓
- [ ] Install Command: `npm ci` ✓

---

### 6. 🔑 GitHub Secrets (CI/CD) 🟡 ÖNEMLİ

**Adres:** https://github.com/[username]/PORTFOLIO-SITE/settings/secrets

#### 6.1 Gerekli Secrets Ekleme
- [ ] GitHub repository'nizin Settings > Secrets seçin
- [ ] Aşağıdaki secrets'ları ekleyin:

```
SANITY_API_WRITE_TOKEN
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
RESEND_API_KEY
SENTRY_AUTH_TOKEN
```

#### 6.2 Deploy Workflow Test
- [ ] Ana branch'e commit/push yapın
- [ ] GitHub Actions çalışmasını bekleyin
- [ ] Build başarılı olduğunu doğrulayın

---

### 7. 🛡️ NextAuth.js (Authentication) 🟡 ÖNEMLİ

**Adres:** Yerel ortamda

#### 7.1 NEXTAUTH_SECRET Oluşturma
- [ ] Terminalde şu komutu çalıştırın:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Çıktıyı kopyalayıp `.env.local`'a ekleyin:
  ```
  NEXTAUTH_SECRET=your_generated_secret
  NEXTAUTH_URL=http://localhost:3000
  ```
- [ ] Production'da:
  ```
  NEXTAUTH_URL=https://your-domain.com
  ```

---

## 📄 .env.local Şablonu

`.env.local` dosyasını oluşturup aşağıdaki bilgileri ekleyin:

```env
# Sanity CMS
SANITY_API_WRITE_TOKEN=your_write_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_email@example.com

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your_org_name
SENTRY_PROJECT=your_project_name
SENTRY_AUTH_TOKEN=your_auth_token

# NextAuth
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Vercel (Production)
# Production ortamında yukarıdaki değerleri Vercel Environment Variables'dan alır
```

---

## ✅ KONTROL LİSTESİ

Deployment öncesi tüm bu adımları tamamladığınızı doğrulayın:

### Yerel Ortamda
- [ ] `.env.local` dosyası oluşturuldu ve dolduruldu
- [ ] `npm run dev` başarıyla çalışıyor
- [ ] İletişim formu test edildi
- [ ] Arama fonksiyonu test edildi

### Production'da
- [ ] Vercel Environment Variables ayarlandı
- [ ] GitHub Secrets eklendi
- [ ] CI/CD workflow'u başarılı
- [ ] Custom domain bağlandı
- [ ] HTTPS aktif
- [ ] Analytics takip ediliyor
- [ ] Error tracking çalışıyor

---

## 🔗 HARİCİ BAĞLANTILAR

| Hizmet | URL | Durum |
|--------|-----|-------|
| Sanity CMS | https://manage.sanity.io | ✓ |
| Resend Email | https://resend.com | ✓ |
| Google Analytics | https://analytics.google.com | ✓ |
| Sentry | https://sentry.io | ✓ |
| Vercel | https://vercel.com | ✓ |
| GitHub | https://github.com | ✓ |

---

## 💡 İPUÇLARI

1. **Güvenlik:** API Key'leri asla commit etmeyin. `.env.local` dosyası `.gitignore`'a eklenmelidir.
2. **Test:** Her ortam değişkenini `.env.local` ile test ettikten sonra production'a geçin.
3. **Backup:** API Key'lerinizi güvenli bir yerde saklayın.
4. **Güncellemeler:** Servislerin güvenlik güncellemelerini takip edin.

---


