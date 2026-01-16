# Go-Live Checklist

Bu checklist, Next.js uygulamasını production'a almadan önce kontrol edilmesi gereken tüm maddeleri içerir.

## 🔐 Güvenlik

- [ ] Tüm environment variables production değerleriyle ayarlandı
- [ ] HTTPS zorunlu kılındı
- [ ] Security headers doğrulandı (vercel.json veya next.config.js)
- [ ] CORS ayarları doğru yapılandırıldı
- [ ] API rate limiting aktif
- [ ] Sensitive data log'larda görünmüyor

## 🌐 DNS & Domain

- [ ] DNS kayıtları Vercel'e yönlendirildi
- [ ] SSL sertifikası otomatik yenileme aktif
- [ ] www redirect yapılandırıldı
- [ ] Canonical URL'ler doğru

## 📊 Analytics & Monitoring

- [ ] Google Analytics ID production'a eklendi
- [ ] Vercel Analytics aktif
- [ ] Error tracking (Sentry vb.) yapılandırıldı
- [ ] Uptime monitoring aktif

## 🚀 Performance

- [ ] Lighthouse Performance skoru ≥ 80
- [ ] Lighthouse Accessibility skoru ≥ 90
- [ ] Lighthouse Best Practices skoru ≥ 80
- [ ] Lighthouse SEO skoru ≥ 90
- [ ] Core Web Vitals yeşil
- [ ] Image optimization aktif
- [ ] Font optimization aktif

## 📱 PWA

- [ ] Service worker doğru çalışıyor
- [ ] Manifest.json geçerli
- [ ] Offline fallback çalışıyor
- [ ] App install prompt görünüyor (mobile)

## 🔍 SEO

- [ ] robots.txt doğru
- [ ] sitemap.xml oluşturuldu ve erişilebilir
- [ ] Open Graph meta etiketleri tüm sayfalarda var
- [ ] Twitter Card meta etiketleri var
- [ ] Structured data (JSON-LD) eklenmiş
- [ ] Google Search Console'a site eklendi

## 🧪 Testing

- [ ] E2E testler geçti
- [ ] Cross-browser test yapıldı (Chrome, Firefox, Safari)
- [ ] Mobile responsive test yapıldı
- [ ] Form validation çalışıyor
- [ ] 404 sayfası özelleştirildi
- [ ] 500 error handling çalışıyor

## 📝 Content

- [ ] Tüm placeholder içerikler kaldırıldı
- [ ] İletişim bilgileri güncel
- [ ] Sosyal medya linkleri doğru
- [ ] Legal sayfalar hazır (Gizlilik Politikası, KVKK vb.)

## 🔧 Infrastructure

- [ ] Vercel project settings gözden geçirildi
- [ ] Environment variables tümü eklendi
- [ ] Build ayarları doğru
- [ ] Custom domain bağlandı
- [ ] Preview deployments aktif

## 📦 Dependencies

- [ ] Tüm dependencies production-ready
- [ ] Security vulnerabilities tarandı (npm audit)
- [ ] Unused packages kaldırıldı

## 🔄 CI/CD

- [ ] GitHub Actions workflow çalışıyor
- [ ] Auto-deploy main branch'ten aktif
- [ ] Preview deployments PR'lar için aktif

---

## Deployment Sonrası

- [ ] Production URL erişilebilir
- [ ] Tüm sayfalar 200 döndürüyor
- [ ] API endpoints çalışıyor
- [ ] Analytics veri topluyor
- [ ] Contact form çalışıyor
- [ ] Social share önizlemesi doğru

## Acil Durum Planı

- [ ] Rollback prosedürü hazır
- [ ] Önceki stable sürüm tagged
- [ ] Team iletişim kanalları hazır
