# 📚 PROJE BİLGİLERİ & REHBER

Bu doküman, portföy projesinin yapısı, teknolojileri ve her kurulumun neden gerekli olduğunu açıklar.

---

## 🎯 Proje Özeti

**Next.js tabanlı profesyonel portföy sitesi**

- **Framework:** Next.js 14+ (App Router)
- **Database/CMS:** Sanity (Headless CMS)
- **Hosting:** Vercel
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Analytics:** Google Analytics 4, Vercel Analytics
- **Error Tracking:** Sentry
- **Email:** Resend

---

## 🏗️ Proje Yapısı

```
PORTFOLIO-SITE/
├── src/
│   ├── app/           # Next.js app router (sayfalar)
│   ├── components/    # Reusable React bileşenleri
│   ├── lib/          # Utility fonksiyonları
│   ├── sanity/       # Sanity CMS konfigürasyonu
│   ├── types/        # TypeScript tipleri
│   └── styles/       # Global CSS
├── public/           # Statik dosyalar
├── tests/            # Test dosyaları
├── .github/          # GitHub Actions
├── vercel.json       # Vercel konfigürasyonu
├── next.config.ts    # Next.js konfigürasyonu
├── tailwind.config.ts # Tailwind konfigürasyonu
└── tsconfig.json     # TypeScript konfigürasyonu
```

---

## 📖 Her Kurulumun Neden Gerekli Olduğu

### 1. 🔐 Sanity CMS - İçerik Yönetimi

**Ne İşe Yarar:**
- Blog yazılarını, projeleri ve profil bilgilerini yönetmek
- Kod yazmadan içeriği güncellemek
- Admin panelinde tüm verileri kontrol etmek

**Neden Gerekli:**
- Siteyi dinamik tutmak (içerik değiştiğinde yeniden deploy gerek yok)
- Gelen mesajları takip etmek
- Kullanıcı dostu arayüz ile içerik editlemek

**Olmadan Ne Olur:**
- İçerik güncellemek için kod değiştirmek gerekir ❌
- Siteyi yeniden build ve deploy etmek gerekir ❌

---

### 2. 📧 Resend Email - İletişim Formu

**Ne İşe Yarar:**
- İletişim formundan gelen mesajları email olarak almak
- Ziyaretçi mesajlarına otomatik bildirim

**Neden Gerekli:**
- Yeni mesaj geldiğinde anında haberdar olmak
- İş teklifleri, sorular vb. önemli mesajları kaçırmamak
- Müşteri iletişimini yönetmek

**Olmadan Ne Olur:**
- Mesajlar Sanity'de depolanır ama email bildirimi gelmez ❌
- Yeni mesajı fark etmeyebilirsiniz ❌

---

### 3. 📊 Google Analytics 4 - Ziyaretçi Takibi

**Ne İşe Yarar:**
- Kaç kişi ziyaret ediyor
- Hangi sayfalar popüler
- Ziyaretçiler nereden geliyor
- Cihaz ve tarayıcı bilgileri

**Neden Gerekli:**
- Site trafiğini anlamak
- En ilgi çeken içeriği bulmak
- SEO stratejisini iyileştirmek
- İş tekliflerinin kaynağını bilmek

**Olmadan Ne Olur:**
- Siteye kim ziyaret ediyor hiç bilemezsiniz ❌
- Hangi içeriğin başarılı olduğunu bilemezsiniz ❌

---

### 4. 🚨 Sentry - Hata Takibi

**Ne İşe Yarar:**
- Sitede hata oluştuğunda otomatik bildirim
- Hatanın nerede oluştuğunu ve neyi kırdığını görmek
- Session replay ile hata anını tekrar görmek

**Neden Gerekli:**
- Kullanıcı hatayı fark etmeden siz bilirsiniz
- Hataları hızlıca düzeltmek
- Sitenin istikrarını izlemek
- Production problemlerini debug etmek

**Olmadan Ne Olur:**
- Kullanıcılar hata yaşasa bile siz bilemezsiniz ❌
- Siteniz kırık bile olsa fark etmeyebilirsiniz ❌

---

### 5. 🚀 Vercel - Hosting & Deployment

**Ne İşe Yarar:**
- Sitenizi internete yayımlamak
- Otomatik deployment (GitHub'a push → canlıya al)
- CDN ile hızlı loading times
- Otomatik SSL/HTTPS

**Neden Gerekli:**
- Kodu bilgisayarınızda çalıştırmak yerine herkese açık hale getirmek
- Sürekli çalışan sunucu (24/7)
- Automatic backups ve security
- Custom domain desteği

**Olmadan Ne Olur:**
- Siteyi sadece kendi bilgisayarınızda açabilirsiniz ❌
- İnternet'te görülebilir değildir ❌

---

### 6. 🔑 GitHub Secrets - Güvenli Veri Saklama

**Ne İşe Yarar:**
- API Key'lerinizi güvenli şekilde saklamak
- GitHub Actions CI/CD'de bu bilgileri kullanmak
- Gizli bilgileri kodda göstermemek

**Neden Gerekli:**
- API Key'leri public repository'de göstermek = güvenlik riski ❌
- CI/CD pipeline'larda ihtiyaç duyulan bilgileri güvenli tutmak
- Automatic deployments'da secret'ları kullanabilmek

**Olmadan Ne Olur:**
- API Key'ler herkese görünür olur ❌
- Herkes sizin account'larınıza erişebilir ❌

---

### 7. 🛡️ NextAuth.js - Oturum Güvenliği

**Ne İşe Yarar:**
- Giriş/çıkış (authentication) sistemi
- Oturum bilgilerini şifrelemek
- Kullanıcı yetkilendirmesi

**Neden Gerekli:**
- Gelecekte admin paneline kimse istediği gibi giremesin
- Oturum verilerini güvenle saklamak
- Kullanıcı gizliliğini korumak

**Olmadan Ne Olur:**
- Herkes admin panelinize girip verileri değiştirebilir ❌
- Oturum verisi açık tutulur ❌

---

## 🔄 Kurulum Sırası

1. **Yerel Kurulum:**
   - Repository'yi clone et
   - `npm install` (dependencies yükle)
   - `.env.local` oluştur
   - `npm run dev` (local test)

2. **Dış Servisler Kurulumu (Paralel yapılabilir):**
   - Sanity CMS → API key al
   - Resend → Email API key al
   - Google Analytics → Tracking ID al
   - Sentry → DSN al
   - GitHub Secrets ekle

3. **Vercel Deploy:**
   - GitHub'a push et
   - Vercel'de projeyi import et
   - Environment variables ekle
   - Production URL'ni al

4. **Post-Deployment:**
   - Domain bağla
   - Analytics'i doğrula
   - Error tracking'i test et

---

## 🚀 Deployment Checklist

### Deployment Öncesi
- [ ] Tüm `.env.local` değişkenleri tanımlı
- [ ] `npm run build` hatasız çalışıyor
- [ ] `npm run type-check` hatasız
- [ ] Yerel test edildi
- [ ] Git'te tüm değişiklikler commit'lendi

### Vercel Deployment
- [ ] Vercel Environment Variables ayarlandı
- [ ] Build başarılı
- [ ] Production URL çalışıyor
- [ ] Tüm routes accessible

### Post-Deployment
- [ ] Analytics takip ediliyor
- [ ] Error tracking aktif
- [ ] Email notifications çalışıyor
- [ ] Domain configured
- [ ] HTTPS aktif
- [ ] Performance Lighthouse check

---

## 🛠️ Kullanılan Teknolojiler & Araçlar

| Kategori | Teknoloji | Amaç |
|----------|-----------|------|
| **Frontend** | Next.js 14+ | Web framework |
| | React 18+ | UI library |
| | TypeScript | Type safety |
| | Tailwind CSS | Styling |
| **Backend** | Next.js API Routes | Serverless functions |
| | Node.js | Runtime |
| **CMS** | Sanity | Headless CMS |
| **Database** | Sanity Studio | Document store |
| **Auth** | NextAuth.js | Authentication |
| **Hosting** | Vercel | Deployment & CDN |
| **Email** | Resend | Email service |
| **Analytics** | Google Analytics 4 | User tracking |
| | Vercel Analytics | Performance metrics |
| **Error Tracking** | Sentry | Error monitoring |
| **Testing** | Playwright | E2E testing |
| | Vitest | Unit testing |
| **CI/CD** | GitHub Actions | Automation |

---

## 📚 Önemli Dosyalar

| Dosya | Amaç |
|-------|------|
| `vercel.json` | Vercel deployment ayarları |
| `next.config.ts` | Next.js konfigürasyonu |
| `.env.example` | Environment variables şablonu |
| `.env.local` | Yerel ortam değişkenleri (git'te olmaz) |
| `sanity.config.ts` | Sanity CMS konfigürasyonu |
| `tsconfig.json` | TypeScript ayarları |
| `tailwind.config.ts` | Tailwind CSS ayarları |

---

## 🔗 Yararlı Linkler

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Sanity Dokümantasyonu](https://www.sanity.io/docs)
- [Vercel Dokümantasyonu](https://vercel.com/docs)
- [NextAuth.js Dokümantasyonu](https://next-auth.js.org)
- [Tailwind CSS Dokümantasyonu](https://tailwindcss.com/docs)

---

## ❓ Sık Sorulan Sorular

### S: Vercel olmadan deploy edebilir miyim?
**C:** Evet, Netlify, Railway, Render vb. alternatifler var. Ancak Vercel Next.js için en optimize edilmiş.

### S: Sanity olmadan başka CMS kullanabilir miyim?
**C:** Evet, Contentful, Strapi, Hygraph vb. kullanabilirsiniz. Ancak kod entegrasyonu değişecektir.

### S: Email servisi olarak Resend yerine başka birini kullanabilir miyim?
**C:** Evet, SendGrid, Mailgun, Amazon SES vb. kullanabilirsiniz.

### S: GitHub Secrets'ı atlayabilir miyim?
**C:** **Hayır!** API Key'lerinizi güvenliği tehlikeye atabilir. Vercel'de doğrudan Environment Variables kullanabilirsiniz.

---

## 📞 Destek & İletişim

Sorunlarla karşılaşırsanız:

1. [Sentry Dashboard](https://sentry.io) → Error tracking
2. [Vercel Logs](https://vercel.com) → Deployment logs
3. [Sanity Studio](https://manage.sanity.io) → Data validation
4. GitHub Issues → Bug reporting

---

**Son Güncelleme:** Ocak 2026
