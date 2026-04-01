# Carbon Dil Bilgisi Spesifikasyonu (Grammar Specification)

<p align="center">
  <img src="https://img.shields.io/badge/Versiyon-1.2-green" alt="Version">
  <img src="https://img.shields.io/badge/Sözdizimi-Türkçe-red" alt="Syntax">
  <img src="https://img.shields.io/badge/.NET_Runtime-8.0+-blue" alt=".NET">
</p>

> **Carbon**, Türkçe sözdizimli, .NET Runtime üzerinde yüksek performansla çalışan modern bir programlama dilidir.
> Bu döküman, dilin resmi sözdizimi (grammar) referansıdır.

---

## İçindekiler

1. [Lexical Structure (Sözcüksel Yapı)](#1-lexical-structure-sözcüksel-yapı)
2. [Syntax Rules — EBNF (Sözdizimi Kuralları)](#2-syntax-rules--ebnf-sözdizimi-kuralları)
3. [Data Types (Veri Tipleri)](#3-data-types-veri-tipleri)
4. [Control Flow (Kontrol Akışı)](#4-control-flow-kontrol-akışı)
5. [Performans Mimarisi](#5-performans-mimarisi)
6. [Doğru ve Yanlış Kod Örnekleri (Agent Knowledge Base)](#6-doğru-ve-yanlış-kod-örnekleri-agent-knowledge-base)

---

## 1. Lexical Structure (Sözcüksel Yapı)

Carbon kaynak kodu, Lexer tarafından aşağıdaki token kategorilerine ayrılır:

### 1.1 Boşluk ve Yorumlar

Boşluk karakterleri (`\t`, `\n`, `\r`, `' '`) tokenlar arasında ayırıcıdır ve Parser'a iletilmez.

```
// Tek satır yorum
/* Çok satırlı
   yorum bloğu */
```

### 1.2 Anahtar Kelimeler (Keywords)

Carbon'un en belirgin özelliği **tamamen Türkçe anahtar kelimelerdir**. Türkçe karakter içeren kelimeler için ASCII alternatifleri de kabul edilir (ör. `eğer` / `eger`).

#### Değişken & Akış Kontrol

| Anahtar Kelime | Alternatif | Karşılığı   | Açıklama                   |
| -------------- | ---------- | ----------- | -------------------------- |
| `tanıt`        | `tanit`    | `let / var` | Değişken tanımlama         |
| `eğer`         | `eger`     | `if`        | Koşul ifadesi              |
| `değilse`      | `degilse`  | `else`      | Alternatif dal             |
| `iken`         | —          | `while`     | While döngüsü              |
| `her`          | —          | `for`       | For döngüsü                |
| `herbiri`      | —          | `foreach`   | Foreach döngüsü            |
| `içinden`      | —          | `in`        | Foreach iterasyon kelimesi |
| `dön`          | —          | `return`    | Değer döndürme             |
| `çıkış`        | `cikis`    | `exit`      | Programdan çıkış           |
| `fırlat`       | `firlat`   | `throw`     | Hata fırlatma              |

#### Tip Sistemi

| Anahtar Kelime | Alternatif  | Karşılığı       | Açıklama        |
| -------------- | ----------- | --------------- | --------------- |
| `tamsayı`      | `tamsayi`   | `int`           | Tam sayı tipi   |
| `ondalık`      | `ondalik`   | `decimal/float` | Ondalıklı sayı  |
| `metin`        | —           | `string`        | Karakter dizisi |
| `mantıksal`    | `mantiksal` | `bool`          | Mantıksal tip   |
| `liste`        | —           | `List<T>`       | Liste/dizi tipi |
| `sözlük`       | `sozluk`    | `Dictionary`    | Sözlük tipi     |
| `boş`          | —           | `void`          | Boş dönüş tipi  |

#### OOP & Modülerlik

| Anahtar Kelime | Alternatif | Karşılığı      | Açıklama                     |
| -------------- | ---------- | -------------- | ---------------------------- |
| `sınıf`        | `sinif`    | `class`        | Sınıf tanımı                 |
| `arayüz`       | `arayuz`   | `interface`    | Arayüz tanımı                |
| `kategorik`    | —          | `enum`         | Numaralandırma               |
| `yeni`         | —          | `new`          | Nesne oluşturma              |
| `bu`           | —          | `this`         | Mevcut örnek referansı       |
| `görünür`      | —          | `public`       | Genel erişim belirteci       |
| `özel`         | —          | `private`      | Özel erişim belirteci        |
| `statik`       | —          | `static`       | Statik üye                   |
| `paket`        | —          | `package`      | Paket tanımlama              |
| `kullan`       | —          | `using/import` | Paket içe aktarma            |
| `oku`          | —          | `get`          | Getter erişimcisi            |
| `yaz`          | —          | `set`          | Setter erişimcisi            |
| `değer`        | —          | `value`        | Setter içindeki atanan değer |

#### Literal & Mantıksal

| Anahtar Kelime | Karşılığı | Açıklama       |
| -------------- | --------- | -------------- |
| `doğru`        | `true`    | Boolean doğru  |
| `yanlış`       | `false`   | Boolean yanlış |
| `ve`           | `&&`      | Mantıksal VE   |
| `veya`         | `\|\|`    | Mantıksal VEYA |

### 1.3 Operatörler ve Semboller

#### Aritmetik Operatörler

| Token               | Sembol | Açıklama                     |
| ------------------- | ------ | ---------------------------- |
| `PLUS_TOKEN`        | `+`    | Toplama / string birleştirme |
| `MINUS_TOKEN`       | `-`    | Çıkarma                      |
| `ASTERISK_TOKEN`    | `*`    | Çarpma                       |
| `SLASH_TOKEN`       | `/`    | Bölme                        |
| `PLUS_PLUS_TOKEN`   | `++`   | Artırma (postfix)            |
| `MINUS_MINUS_TOKEN` | `--`   | Azaltma (postfix)            |

#### Karşılaştırma Operatörleri

| Token                         | Sembol | Açıklama   |
| ----------------------------- | ------ | ---------- |
| `IS_EQUAL_TOKEN`              | `==`   | Eşitlik    |
| `IS_NOT_EQUAL_TOKEN`          | `!=`   | Eşitsizlik |
| `LESS_THAN_TOKEN`             | `<`    | Küçüktür   |
| `GREATER_THAN_TOKEN`          | `>`    | Büyüktür   |
| `LESS_OR_EQUAL_THAN_TOKEN`    | `<=`   | Küçük eşit |
| `GREATER_OR_EQUAL_THAN_TOKEN` | `>=`   | Büyük eşit |

#### Atama & Özel

| Token               | Sembol | Açıklama                 |
| ------------------- | ------ | ------------------------ |
| `EQUALS_TOKEN`      | `=`    | Atama                    |
| `ARROW_TOKEN`       | `=>`   | Lambda / expression body |
| `EXCLAMATION_TOKEN` | `!`    | Mantıksal değil (prefix) |

#### Ayırıcılar (Delimiters)

| Token                 | Sembol | Açıklama                   |
| --------------------- | ------ | -------------------------- |
| `SEMICOLON_TOKEN`     | `;`    | Deyim sonu                 |
| `COMMA_TOKEN`         | `,`    | Parametre / eleman ayırıcı |
| `DOT_TOKEN`           | `.`    | Üye erişimi                |
| `COLON_TOKEN`         | `:`    | Arayüz/kalıtım ayırıcı     |
| `LEFT_PAREN_TOKEN`    | `(`    | Sol parantez               |
| `RIGHT_PAREN_TOKEN`   | `)`    | Sağ parantez               |
| `LEFT_BRACE_TOKEN`    | `{`    | Sol süslü parantez         |
| `RIGHT_BRACE_TOKEN`   | `}`    | Sağ süslü parantez         |
| `LEFT_BRACKET_TOKEN`  | `[`    | Sol köşeli parantez        |
| `RIGHT_BRACKET_TOKEN` | `]`    | Sağ köşeli parantez        |

### 1.4 Operatör Önceliği (Yüksekten → Düşüğe)

| Öncelik | Operatörler          | Açıklama         |
| ------- | -------------------- | ---------------- |
| 6       | `*`, `/`             | Çarpma, Bölme    |
| 5       | `+`, `-`             | Toplama, Çıkarma |
| 4       | `<`, `<=`, `>`, `>=` | Karşılaştırma    |
| 3       | `==`, `!=`           | Eşitlik          |
| 2       | `ve`, `&&`           | Mantıksal VE     |
| 1       | `veya`, `\|\|`       | Mantıksal VEYA   |

### 1.5 Literaller

```
// Sayısal literaller
42          → tamsayı (INTEGER_KEYWORD)
3.14        → ondalık (DECIMAL_KEYWORD)

// Metin literalleri
"Merhaba"   → string (STRING_TOKEN)

// Interpolated string
$"Ad: {ad}, Yaş: {yaş}"  → INTERPOLATED_STRING_TOKEN

// Boolean literalleri
doğru       → TRUE_KEYWORD
yanlış      → FALSE_KEYWORD

// Liste literali
[1, 2, 3]   → ARRAY_EXPRESSION
```

### 1.6 Tanımlayıcılar (Identifiers)

Türkçe karakter desteği dahil; harf veya `_` ile başlar, harf, rakam veya `_` ile devam eder:

```
isim, sayaç, _geçici, öğrenci, ilkDeğer, toplamSayı2
```

> **Desteklenen Türkçe Karakterler:** `ı, ş, ç, ğ, ö, ü, İ, Ş, Ç, Ğ, Ö, Ü`

### 1.7 Kaçış Dizileri (Escape Sequences)

| Dizi | Anlamı      |
| ---- | ----------- |
| `\n` | Yeni satır  |
| `\t` | Tab         |
| `\r` | Satır başı  |
| `\"` | Çift tırnak |
| `\\` | Ters taksim |

---

## 2. Syntax Rules — EBNF (Sözdizimi Kuralları)

Aşağıdaki kurallar, Carbon dilinin formal grameri EBNF notasyonunda tanımlar.

### 2.1 Program Yapısı

```ebnf
CompilationUnit     = { ImportDirective } [ PackageDeclaration ] { MemberDeclaration } EOF ;

ImportDirective     = "kullan" IDENTIFIER ";" ;
PackageDeclaration  = "paket" IDENTIFIER ";" ;

MemberDeclaration   = { Modifier } ( ClassDeclaration
                                    | InterfaceDeclaration
                                    | EnumDeclaration
                                    | FunctionDeclaration
                                    | PropertyDeclaration )
                    | Statement ;
```

### 2.2 Deyimler (Statements)

```ebnf
Statement           = VariableDeclaration
                    | IfStatement
                    | WhileStatement
                    | ForStatement
                    | ForeachStatement
                    | BlockStatement
                    | ReturnStatement
                    | ThrowStatement
                    | ExpressionStatement ;

VariableDeclaration = ( "tanıt" IDENTIFIER "=" Expression ";" )
                    | ( Type IDENTIFIER [ "=" Expression ] ";" ) ;

IfStatement         = "eğer" "(" Expression ")" ( BlockStatement | Statement )
                      [ "değilse" ( BlockStatement | IfStatement | Statement ) ] ;

WhileStatement      = "iken" "(" Expression ")" ( BlockStatement | Statement ) ;

ForStatement        = "her" "(" [ VarDeclOrExpr ] ";" [ Expression ] ";" [ Expression ] ")"
                      ( BlockStatement | Statement ) ;

ForeachStatement    = "herbiri" "(" Expression "içinden" ( "tanıt" | Type ) IDENTIFIER ")"
                      ( BlockStatement | Statement ) ;

BlockStatement      = "{" { Statement } "}" ;

ReturnStatement     = "dön" [ Expression ] ";" ;

ThrowStatement      = "fırlat" "(" Expression ")" ";" ;

ExpressionStatement = Expression ";" ;
```

### 2.3 İfadeler (Expressions)

```ebnf
Expression          = Assignment ;

Assignment          = BinaryExpression [ "=" Expression ] ;

BinaryExpression    = UnaryExpression { BinaryOperator UnaryExpression } ;

UnaryExpression     = ( "!" | "+" | "-" ) UnaryExpression
                    | PostfixExpression ;

PostfixExpression   = PrimaryExpression { PostfixOp } ;

PostfixOp           = "." IDENTIFIER                         (* üye erişimi *)
                    | "[" Expression "]"                     (* indeks erişimi *)
                    | "(" [ ArgumentList ] ")"               (* fonksiyon çağrısı *)
                    | "++"                                   (* artırma *)
                    | "--" ;                                 (* azaltma *)

PrimaryExpression   = NUMBER | STRING | INTERPOLATED_STRING
                    | "doğru" | "yanlış"
                    | IDENTIFIER
                    | "bu"
                    | NewExpression
                    | ArrayLiteral
                    | ParenthesizedOrLambda ;

ParenthesizedOrLambda = "(" Expression ")"                   (* gruplandırma *)
                      | LambdaExpression ;

LambdaExpression    = "(" [ ParameterList ] ")" "=>" ( BlockStatement | Expression ) ;

NewExpression       = "yeni" ( IDENTIFIER | "liste" | "sözlük" )
                      [ "<" TypeList ">" ] "(" [ ArgumentList ] ")"
                      [ CollectionInit | DictionaryInit ] ;

ArrayLiteral        = "[" [ Expression { "," Expression } ] "]" ;

ArgumentList        = Expression { "," Expression } ;

BinaryOperator      = "+" | "-" | "*" | "/" | "==" | "!=" | "<" | ">"
                    | "<=" | ">=" | "ve" | "veya" ;
```

### 2.4 Tip Bildirimler (Type Declarations)

```ebnf
ClassDeclaration    = { Modifier } "sınıf" IDENTIFIER
                      [ PrimaryConstructor ]
                      [ ":" InterfaceList ]
                      "{" { ClassMember } "}" ;

PrimaryConstructor  = "(" [ Parameter { "," Parameter } ] ")" ;

InterfaceList       = IDENTIFIER { "," IDENTIFIER } ;

ClassMember         = { Modifier } ( ConstructorDecl | MethodDecl | PropertyDecl ) ;

ConstructorDecl     = IDENTIFIER "(" [ ParameterList ] ")" BlockStatement ;
                    (* IDENTIFIER burada sınıf adı ile aynı olmalıdır *)

MethodDecl          = ReturnType IDENTIFIER "(" [ ParameterList ] ")"
                      ( BlockStatement | "=>" Expression ";" ) ;

PropertyDecl        = Type IDENTIFIER ( "=" Expression ";"
                                      | "=>" Expression ";"
                                      | "{" { AccessorDecl } "}"
                                      | ";" ) ;

AccessorDecl        = ( "oku" | "yaz" ) ( "=>" Expression ";"
                                        | BlockStatement
                                        | ";" ) ;

InterfaceDeclaration = "arayüz" IDENTIFIER "{"
                        { ReturnType IDENTIFIER "(" [ ParameterList ] ")" ";" }
                       "}" ;

EnumDeclaration     = { Modifier } "kategorik" IDENTIFIER
                      ( "{" IDENTIFIER { "," IDENTIFIER } "}" | ";" ) ;
```

### 2.5 Ortak Kurallar

```ebnf
Modifier            = "görünür" | "özel" | "statik" ;

Type                = "tamsayı" | "ondalık" | "metin" | "mantıksal"
                    | "boş" | "liste" | "sözlük" | IDENTIFIER ;

ReturnType          = Type ;

Parameter           = [ Type ] IDENTIFIER ;

ParameterList       = Parameter { "," Parameter } ;

TypeList            = Type { "," Type } ;

CollectionInit      = "{" Expression { "," Expression } "}" ;

DictionaryInit      = "{" DictEntry { "," DictEntry } "}" ;

DictEntry           = "[" Expression "]" "=" Expression ;
```

---

## 3. Data Types (Veri Tipleri)

### 3.1 İlkel (Primitive) Tipler

| Carbon Tipi | .NET Karşılığı                       | Boyut    | Örnek             |
| ----------- | ------------------------------------ | -------- | ----------------- |
| `tamsayı`   | `System.Double` (tamsayı alt kümesi) | 8 byte   | `42`              |
| `ondalık`   | `System.Double`                      | 8 byte   | `3.14`            |
| `metin`     | `System.String`                      | Değişken | `"Merhaba"`       |
| `mantıksal` | `System.Boolean`                     | 1 byte   | `doğru`, `yanlış` |

### 3.2 Koleksiyon Tipleri

| Carbon Tipi       | .NET Karşılığı               | Sözdizimi                                     |
| ----------------- | ---------------------------- | --------------------------------------------- |
| `liste` (literal) | `List<object>`               | `[1, 2, 3]`                                   |
| `liste` (typed)   | `List<object>`               | `yeni liste<tamsayı>() { 1, 2, 3 }`           |
| `sözlük`          | `Dictionary<object, object>` | `yeni sözlük<metin, tamsayı>() { ["a"] = 1 }` |

#### Liste Yerleşik Özellikleri ve Metotları

```carbon
tanıt dizi = [10, 20, 30];
dizi.uzunluk;             // 3       — Eleman sayısı
dizi.boşMu;               // yanlış  — Boş kontrolü
dizi.ekle(40);             // [10, 20, 30, 40]
dizi.çıkar(20);            // [10, 30, 40]
dizi.temizle();            // []
```

#### Metin Yerleşik Özellikleri ve Metotları

```carbon
tanıt ad = "carbon";
ad.uzunluk;                // 6
ad.boşMu;                  // yanlış
ad.büyükYap();             // "CARBON"
ad.küçükYap();             // "carbon"
```

### 3.3 Kullanıcı Tanımlı Tipler

```carbon
// Sınıf — nesne şablonu
sınıf Araç(metin marka, tamsayı yıl) {
    metin Marka = marka;
    tamsayı Yıl = yıl;
}

// Arayüz — sözleşme
arayüz IÇalıştırılabilir {
    boş Çalıştır();
}

// Enum — sabit küme
kategorik Renk { Kırmızı, Yeşil, Mavi }
```

### 3.4 Özel Tipler

| Tip          | Açıklama                                            |
| ------------ | --------------------------------------------------- |
| Lambda       | `(x, y) => x + y` — Birinci sınıf fonksiyon nesnesi |
| `boş` (void) | Değer döndürmeyen fonksiyonlar için                 |

---

## 4. Control Flow (Kontrol Akışı)

### 4.1 Koşullu İfadeler — `eğer` / `değilse`

```carbon
eğer (sıcaklık > 30) {
    yazdır("Hava sıcak!");
} değilse eğer (sıcaklık > 15) {
    yazdır("Hava ılık.");
} değilse {
    yazdır("Hava soğuk.");
}
```

> **Zincirleme:** `değilse eğer` yapısı ile çoklu dallanma desteklenir.

### 4.2 Döngüler

#### `her` — For Döngüsü

```carbon
her (tanıt i = 0; i < 10; i++) {
    yazdır(i);
}
```

#### `iken` — While Döngüsü

```carbon
tanıt sayaç = 0;
iken (sayaç < 5) {
    yazdır(sayaç);
    sayaç++;
}
```

#### `herbiri` — Foreach Döngüsü

```carbon
tanıt isimler = ["Ali", "Veli", "Ayşe"];
herbiri (isimler içinden tanıt isim) {
    yazdır(isim);
}
```

### 4.3 Fonksiyon Tanımı ve Çağrısı

```carbon
// Blok gövdeli fonksiyon
görünür tamsayı Topla(tamsayı a, tamsayı b) {
    dön a + b;
}

// Expression-bodied fonksiyon
görünür tamsayı Çarp(tamsayı a, tamsayı b) => a * b;

// Lambda ifadesi
tanıt kareAl = (x) => x * x;
yazdır(kareAl(5));  // 25
```

### 4.4 Hata Yönetimi — `fırlat`

```carbon
eğer (değer < 0) {
    fırlat("Değer negatif olamaz!");
}
```

### 4.5 Paket & Modül Sistemi

```carbon
// math_utils.carbon
paket MatematikAraçları;

görünür sınıf Hesaplayıcı {
    görünür tamsayı Faktöriyel(tamsayı n) {
        eğer (n <= 1) { dön 1; }
        dön n * Faktöriyel(n - 1);
    }
}
```

```carbon
// main.carbon
kullan MatematikAraçları;

tanıt h = yeni Hesaplayıcı();
yazdır(h.Faktöriyel(5));  // 120
```

### 4.6 Nesne Yönelimli Akış

```carbon
// Arayüz tanımı
arayüz IŞekil {
    ondalık AlanHesapla();
}

// Sınıf - arayüz uygulaması
görünür sınıf Dikdörtgen : IŞekil {
    görünür ondalık Genişlik = 0;
    görünür ondalık Yükseklik = 0;

    görünür ondalık AlanHesapla() {
        dön Genişlik * Yükseklik;
    }
}

// Çok biçimlilik (Polymorphism)
IŞekil şekil = yeni Dikdörtgen();
şekil.Genişlik = 5;
şekil.Yükseklik = 3;
yazdır(şekil.AlanHesapla());  // 15
```

### 4.7 Kapsülleme (Encapsulation) — Getter / Setter

```carbon
sınıf Kişi {
    görünür metin Ad { oku; yaz; }

    özel tamsayı yaş;
    görünür tamsayı Yaş {
        oku => yaş;
        yaz {
            eğer (değer < 0) {
                fırlat("Yaş negatif olamaz.");
            }
            yaş = değer;
        }
    }

    // Expression-bodied property (read-only)
    görünür metin Bilgi => $"{Ad} ({Yaş})";
}
```

---

## 5. Performans Mimarisi

Carbon, **yorumlanan (interpreted)** bir dil olmasına rağmen, .NET Runtime üzerindeki mimarisi sayesinde performans açısından güçlü bir altyapı sunar:

| Özellik              | Detay                                                        |
| -------------------- | ------------------------------------------------------------ |
| **Runtime**          | .NET 8.0+ (CLR üzerinde çalışır)                             |
| **Bellek Yönetimi**  | .NET GC (Garbage Collector) ile otomatik                     |
| **Scope Zinciri**    | `CarbonScope` ile hiyerarşik, parent-child kapsam zincirleme |
| **Modül Sistemi**    | Reflection tabanlı otomatik modül keşfi ve yükleme           |
| **Tip Kontrolü**     | Derleme/parse zamanı + çalışma zamanı hibrit kontrol         |
| **String İşleme**    | `StringBuilder` tabanlı, zero-copy interpolation parsing     |
| **Sayısal İşlemler** | `System.Double` (IEEE 754) — donanım hızında kayan nokta     |
| **Lexer Tasarımı**   | Tek-geçişli (single-pass), karakter-bazlı tarama             |
| **Parser Tasarımı**  | Recursive descent, öncelik tabanlı ikili ifade çözümlemesi   |
| **Koleksiyonlar**    | .NET `List<T>` ve `Dictionary<K,V>` doğrudan kullanımı       |

### Performans Yaklaşımı

```
Kaynak Kod (.carbon)
        │
        ▼
   ┌─────────┐    Tek geçişli, Türkçe karakter destekli
   │  Lexer   │───▶ Token dizisi
   └─────────┘
        │
        ▼
   ┌─────────┐    Recursive Descent Parser
   │  Parser  │───▶ AST (Abstract Syntax Tree)
   └─────────┘
        │
        ▼
   ┌───────────┐  Tree-walking evaluator
   │ Evaluator  │───▶ .NET Runtime üzerinde yürütme
   └───────────┘
        │
        ▼
   ┌───────────┐  Reflection ile otomatik kayıt
   │  Runtime   │───▶ Yerleşik modüller (matematik, konsol, dosya, vb.)
   │  Modules   │
   └───────────┘
```

---

## Yerleşik Runtime Modülleri

Carbon, standart kütüphane fonksiyonlarını **Türkçe isimli modüller** aracılığıyla sunar:

| Modül       | Erişim                    | Açıklama                  |
| ----------- | ------------------------- | ------------------------- |
| `konsol`    | `konsol.yazdır(...)`      | Konsol I/O işlemleri      |
| `matematik` | `matematik.karekök(...)`  | Matematiksel fonksiyonlar |
| `metin`     | `metin.büyükHarf(...)`    | String işlemleri          |
| `liste`     | `liste.sırala(...)`       | Liste işlemleri           |
| `dosya`     | `dosya.oku(...)`          | Dosya okuma/yazma         |
| `tarih`     | `tarih.şimdi()`           | Tarih/saat işlemleri      |
| `json`      | `json.çözümle(...)`       | JSON parse/serialize      |
| `düzenli`   | `düzenli.eşleştir(...)`   | Regex işlemleri           |
| `sözlük`    | `sözlük.anahtarlar(...)`  | Dictionary işlemleri      |
| `grafik`    | `grafik.çubukGrafik(...)` | Konsol grafikleri         |
| `ağ`        | `ağ.getir(...)`           | HTTP istekleri            |

### Yerleşik Genel Fonksiyonlar

| Fonksiyon               | Açıklama                       | Örnek                           |
| ----------------------- | ------------------------------ | ------------------------------- |
| `yazdır(değer)`         | Konsola yazıp satır atlar      | `yazdır("Merhaba!");`           |
| `girdi(mesaj)`          | Kullanıcıdan metin okur        | `tanıt ad = girdi("Adınız: ");` |
| `tip(nesne)`            | Nesnenin tip adını döndürür    | `yazdır(tip(42));` → `"Sayı"`   |
| `sayıya_çevir(str)`     | Metni sayıya dönüştürür        | `sayıya_çevir("42")` → `42`     |
| `donustur(veri, sınıf)` | Veriyi sınıf nesnesine çevirir | `donustur(json, Kullanıcı)`     |

---

## 6. Doğru ve Yanlış Kod Örnekleri (Agent Knowledge Base)

> Bu bölüm, AI agentların Carbon kodu üretirken yapması gereken ve **yapmaması gereken** kalıpları öğrenmesi için tasarlanmıştır. Her örnekte doğru (✅) ve yanlış (❌) kullanım yan yana gösterilir.

---

### 6.1 Değişken Tanımlama

**✅ DOĞRU — `tanıt` anahtar kelimesi ile:**

```carbon
tanıt isim = "Ahmet";
tanıt yaş = 25;
tanıt aktif = doğru;
tanıt notlar = [90, 85, 70];
```

**❌ YANLIŞ — `var`, `let`, `int`, `string` gibi İngilizce anahtar kelimeler:**

```carbon
// HATA: Carbon'da 'var', 'let' gibi İngilizce kelimeler yoktur!
var isim = "Ahmet";          // ❌ Tanınmaz — tanıt kullan
let yaş = 25;                // ❌ Tanınmaz — tanıt kullan
int sayı = 10;               // ❌ Tanınmaz — tamsayı kullan
string ad = "Ali";           // ❌ Tanınmaz — metin kullan
bool durum = true;           // ❌ true/false yok — doğru/yanlış kullan
```

**✅ DOĞRU — Explicit tip ile tanımlama:**

```carbon
metin ad = "Ali";
tamsayı sayı = 42;
ondalık pi = 3.14;
mantıksal durum = doğru;
```

**❌ YANLIŞ — Tip eşleşmezliği:**

```carbon
metin x = 42;                // ❌ HATA: metin tipine sayı atanamaz
tamsayı y = "selam";         // ❌ HATA: tamsayı tipine metin atanamaz
```

---

### 6.2 Noktalı Virgül Zorunluluğu

**✅ DOĞRU — Her deyim `;` ile biter:**

```carbon
tanıt x = 10;
yazdır(x);
tanıt y = x + 5;
```

**❌ YANLIŞ — Noktalı virgül eksik:**

```carbon
tanıt x = 10                 // ❌ HATA: ';' bekleniyordu
yazdır(x)                    // ❌ HATA: ';' bekleniyordu
```

---

### 6.3 Koşul İfadeleri

**✅ DOĞRU — `eğer` / `değilse` kullanımı:**

```carbon
tanıt not = 75;

eğer (not >= 90) {
    yazdır("Pekiyi");
} değilse eğer (not >= 70) {
    yazdır("İyi");
} değilse eğer (not >= 50) {
    yazdır("Geçer");
} değilse {
    yazdır("Kaldı");
}
```

**❌ YANLIŞ — İngilizce `if`/`else` kullanımı:**

```carbon
if (not >= 50) {              // ❌ HATA: 'if' tanınmaz — eğer kullan
    print("Geçti");           // ❌ HATA: 'print' tanınmaz — yazdır kullan
} else {                      // ❌ HATA: 'else' tanınmaz — değilse kullan
    print("Kaldı");
}
```

**❌ YANLIŞ — Koşulda parantez eksik:**

```carbon
eğer not >= 50 {              // ❌ HATA: Koşul '(' ')' içinde olmalı
    yazdır("Geçti");
}
```

**✅ DOĞRU — Mantıksal operatörler Türkçe:**

```carbon
eğer (not >= 50 ve devam == doğru) {
    yazdır("Başarılı");
}

eğer (not < 30 veya devam == yanlış) {
    yazdır("Başarısız");
}

eğer (!projeTeslim) {
    yazdır("Proje teslim edilmedi!");
}
```

**❌ YANLIŞ — `&&` ve `||` operatörleri YOK:**

```carbon
// Carbon'da && ve || tokenleri tanımlı DEĞİLDİR
// Bunlar Lexer tarafından tokenize edilmez
eğer (x > 0 && y > 0) { }    // ❌ HATA: && tanınmaz — ve kullan
eğer (x > 0 || y > 0) { }    // ❌ HATA: || tanınmaz — veya kullan
```

---

### 6.4 Döngüler

**✅ DOĞRU — `her` (for) döngüsü:**

```carbon
her (tanıt i = 0; i < 10; i++) {
    yazdır(i);
}
```

**❌ YANLIŞ — İngilizce `for` kelimesi:**

```carbon
for (tanıt i = 0; i < 10; i++) {  // ❌ HATA: 'for' tanınmaz — her kullan
    yazdır(i);
}
```

**✅ DOĞRU — `iken` (while) döngüsü:**

```carbon
tanıt sayaç = 0;
iken (sayaç < 5) {
    yazdır(sayaç);
    sayaç++;
}
```

**❌ YANLIŞ — İngilizce `while`:**

```carbon
while (sayaç < 5) {           // ❌ HATA: 'while' tanınmaz — iken kullan
    yazdır(sayaç);
}
```

**✅ DOĞRU — `herbiri` (foreach) döngüsü:**

```carbon
tanıt meyveler = ["Elma", "Armut", "Kiraz"];

// Doğru sözdizimi: koleksiyon + içinden + tanıt + değişken
herbiri (meyveler içinden tanıt meyve) {
    yazdır(meyve);
}
```

**❌ YANLIŞ — `foreach` kullanımı veya yanlış sözdizimi:**

```carbon
foreach (tanıt meyve in meyveler) {   // ❌ Tamamen yanlış
    yazdır(meyve);
}

// Doğru sıralama: (COLLECTION içinden tanıt VARIABLE)
herbiri (tanıt meyve içinden meyveler) {  // ❌ HATA: Sıralama yanlış
    yazdır(meyve);
}
```

---

### 6.5 Fonksiyon Tanımlama

**✅ DOĞRU — Sınıf içi metot (modifier + dönüş tipi + isim):**

```carbon
sınıf Hesaplayıcı {
    // Blok gövdeli metot
    görünür tamsayı Topla(tamsayı a, tamsayı b) {
        dön a + b;
    }

    // Expression-bodied metot
    görünür tamsayı Çarp(tamsayı a, tamsayı b) => a * b;

    // Void metot
    görünür boş Selamla() {
        yazdır("Merhaba!");
    }
}
```

**❌ YANLIŞ — `function`, `func`, `def`, `return` gibi İngilizce kelimeler:**

```carbon
function Topla(a, b) {        // ❌ HATA: 'function' tanınmaz
    return a + b;             // ❌ HATA: 'return' tanınmaz — dön kullan
}

def Selamla() {               // ❌ HATA: 'def' tanınmaz
    print("Merhaba!");        // ❌ HATA: 'print' tanınmaz — yazdır kullan
}
```

**❌ YANLIŞ — Dönüş tipi belirtilmemiş metot:**

```carbon
sınıf Test {
    görünür Topla(tamsayı a, tamsayı b) {  // ❌ HATA: Dönüş tipi eksik
        dön a + b;
    }
}
```

**✅ DOĞRU — Lambda ifadesi:**

```carbon
tanıt kareAl = (x) => x * x;
tanıt topla = (a, b) => a + b;

// Blok gövdeli lambda
tanıt işle = (x) => {
    tanıt sonuç = x * 2;
    dön sonuç;
};

yazdır(kareAl(5));    // 25
yazdır(topla(3, 4));  // 7
```

---

### 6.6 Sınıf Tanımlama

**✅ DOĞRU — Basit sınıf:**

```carbon
sınıf Araba {
    görünür metin Marka;
    görünür metin Model;
    görünür tamsayı Yıl;

    görünür metin Bilgi() {
        dön $"{Marka} {Model} ({Yıl})";
    }
}

tanıt arabam = yeni Araba();
arabam.Marka = "Togg";
arabam.Model = "T10X";
arabam.Yıl = 2024;
yazdır(arabam.Bilgi());
```

**❌ YANLIŞ — İngilizce `class`, `new`, `public`:**

```carbon
class Araba {                 // ❌ HATA: 'class' tanınmaz — sınıf kullan
    public metin Marka;       // ❌ HATA: 'public' tanınmaz — görünür kullan
}

tanıt a = new Araba();        // ❌ HATA: 'new' tanınmaz — yeni kullan
```

**✅ DOĞRU — Primary constructor ile sınıf:**

```carbon
görünür sınıf Öğrenci(metin ad, tamsayı yaş) {
    metin Ad = ad;
    tamsayı Yaş = yaş;

    görünür metin Bilgi() {
        dön $"{Ad} - {Yaş} yaşında";
    }
}

tanıt öğr = yeni Öğrenci("Ali", 20);
yazdır(öğr.Bilgi());
```

**✅ DOĞRU — Geleneksel constructor:**

```carbon
sınıf Kişi {
    görünür metin Ad;
    görünür metin Soyad;

    // Constructor: Sınıf adıyla aynı isimde metot
    Kişi(metin ad, metin soyad) {
        bu.Ad = ad;
        bu.Soyad = soyad;
    }

    görünür metin TamAd => $"{Ad} {Soyad}";
}

tanıt kişi = yeni Kişi("Ali", "Veli");
yazdır(kişi.TamAd);
```

**❌ YANLIŞ — Constructor'da `this` kullanımı:**

```carbon
sınıf Test {
    görünür metin Ad;

    Test(metin ad) {
        this.Ad = ad;         // ❌ HATA: 'this' tanınmaz — bu kullan
    }
}
```

---

### 6.7 Arayüz (Interface) ve Kalıtım

**✅ DOĞRU — Arayüz tanımı ve uygulaması:**

```carbon
arayüz IHayvan {
    metin SesCikar();
}

sınıf Köpek : IHayvan {
    görünür metin SesCikar() {
        dön "Hav hav!";
    }
}

sınıf Kedi : IHayvan {
    görünür metin SesCikar() {
        dön "Miyav!";
    }
}

// Çok biçimlilik (Polymorphism)
tanıt hayvanlar = [yeni Köpek(), yeni Kedi()];
herbiri (hayvanlar içinden tanıt hayvan) {
    yazdır(hayvan.SesCikar());
}

// Tip ile tanımlama
IHayvan h = yeni Köpek();
yazdır(h.SesCikar());
```

**❌ YANLIŞ — İngilizce `interface`:**

```carbon
interface IHayvan {           // ❌ HATA: 'interface' tanınmaz — arayüz kullan
    metin SesCikar();
}
```

**❌ YANLIŞ — Arayüz metotlarında gövde:**

```carbon
arayüz IHayvan {
    metin SesCikar() {        // ❌ HATA: Arayüz metotlarında gövde olmaz
        dön "Ses";            //    Sadece imza tanımlanır: metin SesCikar();
    }
}
```

---

### 6.8 Getter / Setter (Kapsülleme)

**✅ DOĞRU — Otomatik getter/setter:**

```carbon
sınıf Ürün {
    görünür metin Ad { oku; yaz; }
    görünür ondalık Fiyat { oku; yaz; }
}
```

**✅ DOĞRU — Özel getter/setter ile doğrulama:**

```carbon
sınıf Kişi {
    özel tamsayı yaş;

    görünür tamsayı Yaş {
        oku => yaş;
        yaz {
            eğer (değer < 0) {
                fırlat("Yaş negatif olamaz.");
            }
            yaş = değer;
        }
    }
}
```

**❌ YANLIŞ — İngilizce `get`/`set`/`value`:**

```carbon
sınıf Test {
    özel tamsayı x;
    görünür tamsayı X {
        get => x;             // ❌ HATA: 'get' tanınmaz — oku kullan
        set {                 // ❌ HATA: 'set' tanınmaz — yaz kullan
            x = value;        // ❌ HATA: 'value' tanınmaz — değer kullan
        }
    }
}
```

**✅ DOĞRU — Expression-bodied property (read-only):**

```carbon
sınıf Dikdörtgen {
    görünür ondalık Genişlik = 0;
    görünür ondalık Yükseklik = 0;

    // Hesaplanmış, salt okunur property
    görünür ondalık Alan => Genişlik * Yükseklik;
}
```

---

### 6.9 String Interpolation

**✅ DOĞRU — `$"..."` ile string interpolation:**

```carbon
tanıt ad = "Ali";
tanıt yaş = 25;
yazdır($"Merhaba {ad}, yaşın {yaş}.");
yazdır($"{ad}'in gelecek yıl yaşı: {yaş + 1}");
```

**❌ YANLIŞ — `$` olmadan süslü parantez:**

```carbon
yazdır("Merhaba {ad}");      // ❌ Bu literal metin olarak basılır, interpolation YAPILMAZ
                              //    Çıktı: Merhaba {ad}   (değişken çözümlenmez)
```

**❌ YANLIŞ — Template literal veya f-string sözdizimi:**

```carbon
yazdır(`Merhaba ${ad}`);     // ❌ HATA: Backtick ve ${} sözdizimi yoktur
yazdır(f"Merhaba {ad}");     // ❌ HATA: f-string yoktur — $"..." kullan
```

---

### 6.10 Yazdırma ve Girdi

**✅ DOĞRU — `yazdır` ve `girdi` fonksiyonları:**

```carbon
yazdır("Merhaba Dünya!");
yazdır(42);
yazdır([1, 2, 3]);
yazdır($"Sonuç: {10 + 20}");

tanıt isim = girdi("Adınızı girin: ");
yazdır($"Hoş geldin, {isim}!");
```

**❌ YANLIŞ — İngilizce `print`, `println`, `console.log`, `input`:**

```carbon
print("Merhaba");             // ❌ HATA: 'print' tanınmaz — yazdır kullan
println("Merhaba");           // ❌ HATA: 'println' tanınmaz
console.log("Merhaba");       // ❌ HATA: console.log yoktur
System.out.println("Merhaba"); // ❌ HATA: Java sözdizimi yoktur

tanıt x = input("Gir: ");    // ❌ HATA: 'input' tanınmaz — girdi kullan
```

---

### 6.11 Enum (Kategorik) Tanımlama

**✅ DOĞRU:**

```carbon
kategorik Renk { Kırmızı, Yeşil, Mavi }
kategorik Yön { Kuzey, Güney, Doğu, Batı }
```

**❌ YANLIŞ — İngilizce `enum`:**

```carbon
enum Renk { Kırmızı, Yeşil, Mavi }   // ❌ HATA: 'enum' tanınmaz — kategorik kullan
```

---

### 6.12 Modül Kullanımı

**✅ DOĞRU — Runtime modüllerine erişim:**

```carbon
// Matematik modülü
yazdır(matematik.pi);
yazdır(matematik.karekök(16));
yazdır(matematik.üs(2, 10));

// Metin modülü
yazdır(metin.büyükHarf("carbon"));
yazdır(metin.uzunluk("merhaba"));
yazdır(metin.içerir("merhaba dünya", "dünya"));

// Liste modülü
tanıt sayılar = [5, 2, 8, 1, 9];
yazdır(liste.sırala(sayılar));
yazdır(liste.uzunluk(sayılar));
yazdır(liste.enBüyük(sayılar));

// Konsol modülü
konsol.renkliYaz("Kırmızı metin", "kırmızı");
konsol.temizle();
konsol.başlık("Benim Programım");

// Tarih modülü
tanıt şimdi = tarih.şimdi();
yazdır(tarih.formatla(şimdi, "dd.MM.yyyy"));

// Dosya modülü
tanıt içerik = dosya.oku("dosya.txt");
```

**❌ YANLIŞ — Modüllere İngilizce isimle erişim:**

```carbon
Math.sqrt(16);                // ❌ HATA: Math yoktur — matematik kullan
Console.WriteLine("test");    // ❌ HATA: Console yoktur — yazdır veya konsol kullan
String.toUpper("test");       // ❌ HATA: String yoktur — metin kullan
```

---

### 6.13 Paket ve İçe Aktarma

**✅ DOĞRU — Paket tanımlama ve kullanma:**

```carbon
// dosya: modeller.carbon
paket Modeller;

görünür sınıf Kullanıcı(metin ad, tamsayı yaş) {
    metin Ad = ad;
    tamsayı Yaş = yaş;

    görünür metin Bilgi() {
        dön $"{Ad} ({Yaş})";
    }
}
```

```carbon
// dosya: main.carbon
kullan Modeller;

tanıt k = yeni Kullanıcı("Ali", 25);
yazdır(k.Bilgi());
```

**❌ YANLIŞ — İngilizce `import`, `using`, `package`:**

```carbon
import Modeller;              // ❌ HATA: 'import' tanınmaz — kullan kullan
using Modeller;               // ❌ HATA: 'using' tanınmaz — kullan kullan
package Modeller;             // ❌ HATA: 'package' tanınmaz — paket kullan
```

**❌ YANLIŞ — `kullan` dosyanın başında olmalı:**

```carbon
tanıt x = 10;
kullan Modeller;              // ❌ HATA: 'kullan' deyimleri dosyanın en başında olmalı
```

---

### 6.14 Sözlük (Dictionary) Kullanımı

**✅ DOĞRU — Sözlük oluşturma:**

```carbon
tanıt notlar = yeni sözlük<metin, tamsayı>() {
    ["Ali"] = 90,
    ["Veli"] = 85,
    ["Ayşe"] = 95
};

yazdır(notlar["Ali"]);        // 90
```

**❌ YANLIŞ — Nesne literal sözdizimi (JSON tarzı):**

```carbon
tanıt notlar = {"Ali": 90, "Veli": 85};   // ❌ HATA: Bu sözdizimi yoktur
tanıt notlar = {Ali: 90, Veli: 85};       // ❌ HATA: JavaScript tarzı nesne yoktur
```

---

### 6.15 Erişim Belirteçleri

**✅ DOĞRU — `görünür` ve `özel`:**

```carbon
sınıf BankaHesabı {
    görünür metin SahibiAdı;
    özel ondalık bakiye;

    görünür ondalık Bakiye {
        oku => bakiye;
    }

    görünür boş ParaYatır(ondalık miktar) {
        eğer (miktar > 0) {
            bakiye = bakiye + miktar;
        }
    }
}

tanıt hesap = yeni BankaHesabı();
hesap.SahibiAdı = "Ali";
hesap.ParaYatır(1000);
yazdır(hesap.Bakiye);         // 1000
// hesap.bakiye = 999;        // ❌ Çalışma zamanı hatası: 'özel' üyeye erişim engellendi
```

**❌ YANLIŞ — İngilizce erişim belirteçleri:**

```carbon
sınıf Test {
    public metin Ad;          // ❌ HATA: 'public' tanınmaz — görünür kullan
    private tamsayı x;        // ❌ HATA: 'private' tanınmaz — özel kullan
    static tamsayı y;         // ❌ HATA: 'static' tanınmaz — statik kullan
}
```

---

### 6.16 Hata Fırlatma

**✅ DOĞRU — `fırlat` ile hata fırlatma:**

```carbon
eğer (miktar < 0) {
    fırlat("Miktar negatif olamaz!");
}
```

**❌ YANLIŞ — İngilizce `throw` veya parantez eksik:**

```carbon
throw "Hata mesajı";          // ❌ HATA: 'throw' tanınmaz — fırlat kullan

fırlat "Hata mesajı";        // ❌ HATA: fırlat parantez gerektirir
                              //    Doğrusu: fırlat("Hata mesajı");
```

---

### 6.17 Tam Program Örnekleri

#### ✅ Doğru — Hesap Makinesi

```carbon
// hesap_makinesi.carbon — Basit bir hesap makinesi

sınıf HesapMakinesi {
    görünür ondalık Topla(ondalık a, ondalık b) => a + b;
    görünür ondalık Çıkar(ondalık a, ondalık b) => a - b;
    görünür ondalık Çarp(ondalık a, ondalık b) => a * b;

    görünür ondalık Böl(ondalık a, ondalık b) {
        eğer (b == 0) {
            fırlat("Sıfıra bölme hatası!");
        }
        dön a / b;
    }
}

tanıt hm = yeni HesapMakinesi();
yazdır($"10 + 5 = {hm.Topla(10, 5)}");
yazdır($"10 - 5 = {hm.Çıkar(10, 5)}");
yazdır($"10 * 5 = {hm.Çarp(10, 5)}");
yazdır($"10 / 5 = {hm.Böl(10, 5)}");
```

#### ✅ Doğru — Öğrenci Yönetim Sistemi

```carbon
// ogrenci_yonetim.carbon

arayüz IBilgiVerilebilir {
    metin BilgiAl();
}

görünür sınıf Öğrenci : IBilgiVerilebilir {
    görünür metin Ad { oku; yaz; }
    görünür metin Soyad { oku; yaz; }
    görünür tamsayı Numara { oku; yaz; }

    özel tamsayı not;
    görünür tamsayı Not {
        oku => not;
        yaz {
            eğer (değer < 0 veya değer > 100) {
                fırlat("Not 0-100 arasında olmalıdır.");
            }
            not = değer;
        }
    }

    görünür metin Durum => eğer (Not >= 50) { dön "Geçti"; } değilse { dön "Kaldı"; };

    görünür metin BilgiAl() {
        dön $"{Numara} - {Ad} {Soyad}: {Not} ({Durum})";
    }
}

tanıt öğrenciler = [
    yeni Öğrenci(),
    yeni Öğrenci()
];

öğrenciler[0].Ad = "Ali";
öğrenciler[0].Soyad = "Yılmaz";
öğrenciler[0].Numara = 101;
öğrenciler[0].Not = 85;

öğrenciler[1].Ad = "Ayşe";
öğrenciler[1].Soyad = "Kara";
öğrenciler[1].Numara = 102;
öğrenciler[1].Not = 45;

herbiri (öğrenciler içinden tanıt öğr) {
    yazdır(öğr.BilgiAl());
}
```

#### ❌ Yanlış — Aynı Programın Hatalı Versiyonu

```carbon
// ❌ HATALI VERSİYON — Birden fazla hata içerir

import Modeller;                        // ❌ kullan olmalı

class Öğrenci {                         // ❌ sınıf olmalı
    public string Ad;                   // ❌ görünür metin olmalı
    private int not;                    // ❌ özel tamsayı olmalı

    public int Not {                    // ❌ görünür tamsayı olmalı
        get => not;                     // ❌ oku olmalı
        set {                           // ❌ yaz olmalı
            if (value < 0) {            // ❌ eğer (değer < 0) olmalı
                throw "Hata"            // ❌ fırlat("Hata"); olmalı
            }
            not = value                 // ❌ değer olmalı, ; eksik
        }
    }
}

var öğr = new Öğrenci()                 // ❌ tanıt + yeni + ; eksik
öğr.Ad = "Ali"                          // ❌ ; eksik
println(öğr.Ad)                         // ❌ yazdır olmalı, ; eksik
```

---

### 6.18 Özet: Anahtar Kelime Eşleştirme Tablosu

Agentlar için hızlı referans — diğer dillerden Carbon'a çeviri tablosu:

| Diğer Diller                        | Carbon Karşılığı | Kategori  |
| ----------------------------------- | ---------------- | --------- |
| `var` / `let` / `const`             | `tanıt`          | Değişken  |
| `if`                                | `eğer`           | Koşul     |
| `else`                              | `değilse`        | Koşul     |
| `for`                               | `her`            | Döngü     |
| `while`                             | `iken`           | Döngü     |
| `foreach` / `for...of` / `for...in` | `herbiri`        | Döngü     |
| `in`                                | `içinden`        | Döngü     |
| `return`                            | `dön`            | Fonksiyon |
| `class`                             | `sınıf`          | OOP       |
| `interface`                         | `arayüz`         | OOP       |
| `enum`                              | `kategorik`      | OOP       |
| `new`                               | `yeni`           | OOP       |
| `this`                              | `bu`             | OOP       |
| `public`                            | `görünür`        | Erişim    |
| `private`                           | `özel`           | Erişim    |
| `static`                            | `statik`         | Erişim    |
| `void`                              | `boş`            | Tip       |
| `int` / `number`                    | `tamsayı`        | Tip       |
| `float` / `double`                  | `ondalık`        | Tip       |
| `string`                            | `metin`          | Tip       |
| `bool` / `boolean`                  | `mantıksal`      | Tip       |
| `true`                              | `doğru`          | Literal   |
| `false`                             | `yanlış`         | Literal   |
| `&&` / `and`                        | `ve`             | Mantık    |
| `\|\|` / `or`                       | `veya`           | Mantık    |
| `print` / `console.log` / `println` | `yazdır`         | I/O       |
| `input` / `readline`                | `girdi`          | I/O       |
| `throw`                             | `fırlat`         | Hata      |
| `package` / `namespace`             | `paket`          | Modül     |
| `import` / `using` / `require`      | `kullan`         | Modül     |
| `get`                               | `oku`            | Property  |
| `set`                               | `yaz`            | Property  |
| `value` (setter)                    | `değer`          | Property  |

---

<p align="center">
  <b>Carbon</b> — Türkçe ile Kod Yaz! 🇹🇷<br>
  <i>Performanslı • Modern • Türkçe</i>
</p>
