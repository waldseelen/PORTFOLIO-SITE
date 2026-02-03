# Tasarım Kılavuzu (PDF Paleti Uyumlu)

Bu doküman, PDF’den çıkarılan palete göre site genelindeki renk ve bileşen kullanım standartlarını özetler.

## Renk Paleti

| Rol | Hex | Kullanım |
| --- | --- | --- |
| Primary | #0ea5e9 | Ana butonlar, başlık vurguları, ana CTA |
| Primary Dark | #0284c7 | Hover, aktif durumlar |
| Secondary | #64748b | Gövde metinleri, nötr öğeler |
| Accent | #06b6d4 | Linkler, etkileşimli öğeler |
| Success | #10b981 | Başarı durumları |
| Warning | #f59e0b | Uyarı durumları |
| Error | #ef4444 | Hata durumları |
| Background Light | #ffffff | Açık tema arka plan |
| Background Dark | #0f172a | Koyu tema arka plan |
| Text Light | #1e293b | Açık tema ana metin |
| Text Dark | #f1f5f9 | Koyu tema ana metin |
| Border | #e2e8f0 | Açık tema kenarlık |
| Border Dark | #334155 | Koyu tema kenarlık |

## Tema Kuralları

- Açık tema: arka plan beyaz, metin koyu, vurgular primary.
- Koyu tema: arka plan slate koyu, metin açık, vurgular primary ve accent.
- Nötr alanlar ve placeholder’lar secondary skalasını kullanır.

## Bileşen Standartları

### Rozetler (Badge)

- badge: temel rozet görünümü.
- badge-primary: teknoloji/özellik etiketleri.
- badge-accent: kategori ve navigasyon etiketleri.
- badge-secondary: sayısal ek etiketler (+N) ve nötr rozetler.

### Kartlar

- Kart arka planları beyaz/koyu nötr.
- Görsel placeholder’lar secondary skalasından seçilir.

### Butonlar

- btn-primary: ana CTA
- btn-outline: ikincil CTA
- btn-secondary/btn-ghost: düşük öncelik aksiyonlar

## İçerik Hiyerarşisi (Mühendis Odaklı)

- Başlık + kısa açıklama
- 3 sütunlu özet blok (Odak / Yöntem / Çıktı ya da eşdeğeri)
- Detay içerik (kartlar, listeler)

## Notlar

- Bu kılavuz, extracted-colors.json paletine göre hazırlanmıştır.
- Yeni sayfa veya bileşenlerde aynı özet şablonu uygulanmalıdır.
