# 🚀 NEXT.JS PORTFOLIO - KALAN GÖREVLER

Bu doküment, tamamlanmamış görevleri ve eksik özellikleri listeler.

---

## 📋 TAMAMLANMAMIŞ GÖREVLER

### 📅 FAZ 2: ADMIN & TAM DENETİM MERKEZİ (SANITY STUDIO)

#### Görev 2.4: 📥 Gelen Kutusu (Contact Inbox)
- [ ] **Notifications:** Yeni mesaj geldiğinde browser notification (opsiyonel).

---

### 📅 FAZ 3: PREMIUM ÖZELLİKLER

#### Görev 3.3: 📱 Progressive Web App (PWA) Geliştirmeleri
- [ ] **Push Notifications:** Yeni blog yazısı veya proje eklendiğinde bildirim (opsiyonel).

#### Görev 3.5: 💬 Blog Yorum Sistemi
- [ ] **Moderation:** Yorumların admin panelinden onaylanması.

---

### 📅 FAZ 7: TEST & KALİTE GÜVENCESİ (QA)

#### Görev 7.1: 🧪 Otomatik Testler
- [ ] **Visual Regression Tests:** Chromatic veya Percy ile görsel değişiklik takibi.
  - (Opsiyonel - third-party servis gerektirir)

#### Görev 7.2: ♿ Erişilebilirlik (Accessibility)
- [ ] **Screen Reader Testi:** NVDA/JAWS ile test edilmesi.
  - (Manuel test gerektirir)

---

### 📅 FAZ 8: CI/CD & OTOMATİZASYON

- [ ] **Changelog Generation:** Otomatik changelog oluşturma (Conventional Commits ile).
  - (Gelecek iterasyonda eklenebilir)

---

### 📅 FAZ 9: ENVIRONMENT & DEPLOYMENT

- [ ] **Lighthouse Performans Analizi:**
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90
  - (Lighthouse CI workflow eklendi - .github/workflows/lighthouse.yml)
- [ ] **Backup Stratejisi:** Sanity verilerinin düzenli yedeklenmesi.
  - (Sanity'nin kendi backup özelliği kullanılabilir)

---

### 📅 FAZ 10: DOKÜMANTASYON

**Amaç:** Projenin sürdürülebilirliğini sağlamak.
**Tahmini Süre:** 2-3 gün

- [ ] **README.md:** Proje kurulumu, kullanım ve katkıda bulunma rehberi.
- [ ] **API Documentation:** Tüm API endpoint'lerinin dokümantasyonu (Swagger/OpenAPI).
- [ ] **Component Documentation:** Storybook veya benzeri tool ile component dokümantasyonu.
- [ ] **Code Comments:** Kritik fonksiyonlarda açıklayıcı yorumlar.
- [ ] **Maintenance Guide:** Düzenli bakım görevleri (dependency updates, security patches).

---

## 📊 ÖZET

### Kalan Görevler: 11 adet

| Kategori | Görev Sayısı |
|----------|--------------|
| Admin Panel | 1 |
| PWA | 1 |
| Yorum Sistemi | 1 |
| Test & QA | 2 |
| CI/CD | 1 |
| Deployment | 2 |
| Dokümantasyon | 5 |

---

## ✅ PRODUCTION HAZIRLIK LİSTESİ

### Kritik Görevler
- [ ] Lighthouse Performans Analizi (Performance, Accessibility, Best Practices, SEO > 90)
- [ ] README.md ve API dokümantasyonu tamamlanması

### Opsiyonel Özellikler
- [ ] Browser notifications (mesaj bildirimleri)
- [ ] Push notifications (PWA)
- [ ] Visual regression tests
- [ ] Screen reader testleri
- [ ] Yorum moderasyonu
- [ ] Changelog generation
- [ ] Backup stratejisi
- [ ] Component documentation (Storybook)

---
# Sanity Project ID
NEXT_PUBLIC_SANITY_PROJECT_ID=dm8h1ap8

# Sanity Dataset
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity Write Token (Editor - NextJS Write)
SANITY_API_WRITE_TOKEN=[skzQiKKhMnSyPgColIPiw2ZUtfw4ADIPEyQuoWIfSOxfWQ6BduX2B9PyaicDlfowouzyV6XMxxv0KUhBjDtWWOnhvEVFFKZsyPge4JFz2kTJYLlQpzINkmGM0QT4YNzuNfqzBe5sio86HqrfopqJwMVJgMFVPKQkmvSGzng00h5sW29C0wGN]

# Sanity Read Token (Viewer - NextJS Read) - Opsiyonel
SANITY_API_READ_TOKEN=[sk1tU7qJ02st5VdPP5f2cf4ltyNIHFjVoJd6CPAbCKrdNoSQlZAyqW6Xe2AaWTcP0lPlppSIHV4T0QwRApbtXt74Vpt4d7jXyJfWJ0OobJeCmZieLhYzYYspIQrIj2XIzc39nt4fbM8lz54yil4tp1vg4fPVG28mtO02pCoAZOSSwm3rtaXw]





