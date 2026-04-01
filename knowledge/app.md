📱 Carbon Core AI — Uygulama Vizyonu (App Vision)
1. Temel Amaç (Purpose)

Carbon dilini öğrenmek isteyen geliştiricilere rehberlik etmek.

Türkçe anahtar kelimelerle (tanıt, eğer, iken) kod yazımını teşvik etmek.

Düşük seviyeli mimari (x86/ARM64) ile yüksek seviyeli kod arasında köprü kurmak.

2. Kullanıcı Hikayeleri (User Stories)

Öğrenci: "Sesli komutla bir Carbon döngüsü oluşturmak ve bunun nasıl çalıştığını anlamak istiyorum".

Geliştirici: "Yazdığım Carbon kodunun grammar.md kurallarına uyup uymadığını anlık denetlemek istiyorum".

Mimar: "Yazdığım kodun donanım seviyesindeki karşılığını analiz etmek istiyorum".

3. Teknik Mimari (Architecture)

UI/UX: Google Stitch ile tasarlanan, minimalist ve "Carbon Red" temalı React Native arayüzü.

Motor: knowledge/grammar.md dosyasını bağlam (context) olarak kullanan LLM entegrasyonu.

Döngü: NAIM metodolojisine sadık, 15 dakikalık iterasyonlarla evrilen yapı.

4. Kritik Fonksiyonlar (Core Functions)

Syntax Highlighting: Carbon kurallarına göre anlık renklendirme.

Auto-Documentation: İterasyonlar sonunda teknik rapor üretimi.

Stitch MCP Bridge: Tasarımın koda hızlı dönüşümü.