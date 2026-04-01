# 📱 MOBILE.md — NAIM Evolution Log

> This file is your autoresearch log. Every iteration gets documented here.
> No log = no lift. No lift = no weight.

---

## 🧬 Identity

**NAIM Name:** `Carbon Core AI`  
**Crew:** `drmsbgr`  
**App Concept:** `Carbon programlama dilinde Türkçe sözdizimi denetimi yapan, kod örnekleri üreten ve .NET mimarisi üzerine teknik dökümantasyon sağlayan agentic mobil asistan.`  
**Starting Tool:** `Antigravity`

---

## 📊 Scoreboard

| Metric            | Value |
| ----------------- | ----- |
| Total Iterations  | 6     |
| Total Weight (kg) | 95    |
| Total Time (min)  | 85    |
| Failed Attempts   | 0     |

---

## 🔁 Iterations

---

### 🏋️ Iteration 1

| Field     | Value                                                      |
| --------- | ---------------------------------------------------------- |
| Feature   | `Ana Ekran (Shell) — Home Screen UI`                       |
| Weight    | `5 kg`                                                     |
| Tool Used | `Stitch MCP + Antigravity`                                 |
| Time      | `15 min`                                                   |
| Attempts  | `1`                                                        |
| Status    | ✅ Success                                                  |

**Prompt given to AI:**

```
Stitch üzerinde tasarladığım Carbon Core AI ana ekranını (Shell) React Native kullanarak hayata geçirmeni istiyorum. Tasarım dosyasını/ekran görüntüsünü referans al. knowledge/grammar.md içindeki Carbon görsel kimliğine sadık kal. 15 dakikan başladı, süreyi tut ve bitince MOBILE.md dosyasını güncelle!
```

**What happened:**

- Stitch MCP ile "Carbon Core Obsidian" tasarım sistemi ve ana ekran tasarlandı (dark mode, #DC2626 kırmızı aksan, Inter font).
- React Native (Expo) projesi oluşturuldu: `CarbonCoreAI/App.js`
- Stitch tasarımına birebir sadık UI: Top Bar (logo + online status + settings), Hero Section (pulsing red orb animasyonu + büyük başlık), 3 hızlı aksiyon kartı (Yeni Sohbet, Kod Üret, Analiz), Chat Input ve Bottom Navigation.
- Web preview ile doğrulandı — tasarım ve kod mükemmel eşleşiyor.

**Screenshot:** `assets/iteration1_home_screen.png`

**Commit:** `[NAIM: Carbon Core AI] Added Home Screen Shell - 5kg`

---

### 🏋️ Iteration 2

| Field     | Value |
| --------- | ----- |
| Feature   | `Multi-Screen Navigation (Tab Navigator)` |
| Weight    | `15 kg` |
| Tool Used | `Antigravity` |
| Time      | `10 min` |
| Attempts  | `1` |
| Status    | ✅ Success |

**Prompt given to AI:**

```
Planı uygula. (Faz 1 - Iteration 2: Navigation)
```

**What happened:**

- `@react-navigation/native` ve alt bağımlılıkları yüklendi.
- `App.js` refactor edilerek `HomeScreen` bileşene ayrıldı ve `History`, `Projects`, `Profile` placeholder ekranları eklendi.
- `Tab.Navigator` uygulamaya entegre edildi. Mevcut tasarımda olan bottom nav bar tamamen `tabBar` component olarak bağlandı ve aktif sekmenin (Home vs History) algılanması (focused) sağlandı.

**Screenshot:** `assets/iteration2_history_tab.png`

**Commit:** `[NAIM: Carbon Multi-Screen Navigation - 15kg]`

---

### 🏋️ Iteration 3

| Field     | Value |
| --------- | ----- |
| Feature   | `Sohbet Ekranı: Text Input → Output` |
| Weight    | `10 kg` |
| Tool Used | `Antigravity` |
| Time      | `15 min` |
| Attempts  | `1` |
| Status    | ✅ Success |

**Prompt given to AI:**

```
Planı uygula. (Faz 1 - Iteration 3: Chat Screen)
```

**What happened:**

- `@react-navigation/native-stack` paketi kurularak `HomeStack` eklendi.
- Uygulama içinde Stack -> Tab hiyerarşisi sağlandı, böylece hem navigation bar korundu hem de "Yeni Sohbet" ekranı push yapılarak açıldı.
- `ChatScreen` bileşeni eklendi:
  - Geri butonu.
  - Scroll edilebilir mesaj bubble listesi (`FlatList`).
  - Klavye duyarlı (`KeyboardAvoidingView`) yeni sohbet giriş `ChatInput` bileşeni.
- Ana ekrandaki "Yeni Sohbet", "Kod Üret", "Analiz" veya input'a basınca sohbet ekranına geçiş yapılması yönlendirildi.
- Kullanıcı girişine cevap gelen statik mock AI akışı oluşturuldu.

**Screenshot:** `assets/iteration3_chat_screen.png`

**Commit:** `[NAIM: Carbon Core AI] Added Chat Screen and Message Flow - 10kg`

---

### 🏋️ Iteration 4

| Field     | Value |
| --------- | ----- |
| Feature   | `Carbon Syntax Highlighting` |
| Weight    | `15 kg ⭐` (Core Special) |
| Tool Used | `Antigravity` |
| Time      | `15 min` |
| Attempts  | `1` |
| Status    | ✅ Success |

**Prompt given to AI:**

```
Planı uygula. (Faz 1 - Iteration 4: Carbon Syntax Highlighting)
```

**What happened:**

- Düzenli ifadeler (regex) tabanlı custom tokenizer oluşturuldu.
- `grammar.md` dosyasına göre: `tanıt`, `eğer`, `yazdır` vb. anahtar kelimeler ile sayılar, string literal'leri ve comment'ler ayrıştırıldı.
- `CarbonHighlighter` bileşeni (`CarbonCoreAI/components/CarbonHighlighter.js`) oluşturuldu. Farklı token grupları için farklı renk hedefleri eklendi.
- `App.js` icerisindeki `ChatScreen` guncellenerek, gelen message da `isCode: true` varsa, mesajın içi bu SyntaxHighlighter tarafından oluşturulacak hale getirildi. 
- İlk test, componentin başarılı şekilde Dark Mode IDE temasında çalıştığını kanıtladı. 

**Screenshot:** `assets/iteration4_syntax_highlight.png`

**Commit:** `[NAIM: Carbon Core AI] Added Carbon Syntax Highlighting - 15kg`

---

### 🏋️ Iteration 5

| Field     | Value |
| --------- | ----- |
| Feature   | `AI Motoru (LLM) & Grammar Oracle Bağlantısı` |
| Weight    | `20 kg` |
| Tool Used | `Antigravity + Google Gemini API` |
| Time      | `15 min` |
| Attempts  | `1` |
| Status    | ✅ Success |

**Prompt given to AI:**

```
adını güncelle, hızlı modeli kullan ve ücretsiz için ayrılan sınırı aşmayacak şekilde ayarla
```

**What happened:**

- `.env` içerisindeki key, React Native ortamında erişilebilmesi için `EXPO_PUBLIC_GEMINI_API_KEY` olarak güncellendi.
- `grammar.md` dosyası okunarak `utils/grammarSpec.js` içerisine gömüldü. Bu string, System Instruction olarak kullanıldı.
- `@google/generative-ai` kütüphanesi yüklenip `gemini-2.5-flash` modeli ile `services/LLMService.js` yazıldı. Chat geçmişi `startChat` ile entegre edildi.
- `App.js` içerisinde "Düşünüyor..." yüklenme animasyonu eklendi, modelin döndürdüğü kod blokları `CarbonHighlighter` içerisinden sorunsuzca ve doğru renklerle geçecek şekilde entegre edildi!
- Local ortamda baştan sonra mock olmayan gerçek AI sohbeti ("1'den 5'e kadar döngü kur") sorulup test edildi. 

**Screenshot:** `assets/iteration5_llm_response.png`

**Commit:** `[NAIM: Carbon Core AI] Added Real Gemini LLM Integration - 20kg`

---

### 🏋️ Iteration 6

| Field     | Value |
| --------- | ----- |
| Feature   | `Core UI Tabs & Interpreter Bridge Simülatörü` |
| Weight    | `30 kg` |
| Tool Used | `Antigravity` |
| Time      | `15 min` |
| Attempts  | `1` |
| Status    | ✅ Success |

**Prompt given to AI:**

```
UI güncellemelerini yapalım ve carbon özelindeki güncellemeleri eklemeye başlayalım. (Sohbet baloncuğunun altında console, uzantı .carbon olsun)
```

**What happened:**

- `HistoryScreen`, `ProjectsScreen`, ve `ProfileScreen` isimli 3 ana sekme arayüzü tam fonksiyonel mock verilerle (kaydedilmiş Carbon dosyaları ve eski oturumlar) kodlandı.
- Sohbet ekranındaki kod bloklarının altına "▶ Çalıştır" butonu entegre edildi.
- `LLMService.js` içerisinde bir `simulateRuntime` fonksiyonu yazıldı. Bu fonksiyon Gemini'a `System Instruction` olarak Carbon dil kurallarını verip ondan bir CIL/Derleyici gibi davranmasını istedi.
- Üretilen konsol çıktıları doğrudan sohbetin altında güzel bir terminal siyahlığında gösterildi. 

**Screenshot:** `assets/phase3_interpreter_bridge.png`

**Commit:** `[NAIM: Carbon Core AI] Added Phase 3 General UI & Interpreter Bridge - 30kg`

---

## 🧠 Reflection (fill at the end)

**Hardest part:**

>

**What AI did well:**

>

**Where AI failed:**

>

**If I started over, I would:**

>

**Best feature I built:**

>

**Biggest surprise:**

>
