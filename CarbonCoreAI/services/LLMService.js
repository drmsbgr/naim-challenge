import { GoogleGenerativeAI } from '@google/generative-ai';
import { grammarSpec } from '../utils/grammarSpec';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ EXPO_PUBLIC_GEMINI_API_KEY bulunamadı! LLM çağrıları çalışmayacaktır.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "DUMMY_KEY");

// Model konfigürasyonu
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
  systemInstruction: `Sen NAIM Carbon Core Oracle'sın. Turkish-based 'Carbon' programlama dili için özel tasarlanmış bir kod asistanısın.

GÖREV:
- Kullanıcının algoritma/kod veya dilbilgisi (grammar) ile ilgili sorularına YALNIZCA Carbon dilinin sözdizimini kullanarak cevap ver.
- Eğer kod çıktısı vereceksen, kodlarını mutlaka üçlü backtick karbon blogu içinde ver: \`\`\`carbon ... \`\`\` 
- Açıklamalarını öz, kısa ve TÜRKÇE yap. 
- API limitlerini korumak için gereksiz uzatmalardan kaçın.

CARBON DİL KURALLARI AŞAĞIDADIR:
---
${grammarSpec}
---`
});

// Chat oturumunu tutacağız
let chatSession = null;

export const initChat = () => {
  chatSession = model.startChat({
    history: [],
  });
};

export const sendMessageToLLM = async (userText) => {
  if (!chatSession) {
    initChat();
  }

  try {
    const result = await chatSession.sendMessage(userText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("LLM Error:", error);
    return "Sistem hatası: " + error.message;
  }
};

export const simulateRuntime = async (carbonCode) => {
  try {
    const runtimeModel = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Sen bir CIL (.NET Common Intermediate Language) Derleyici ve Çalıştırıcı simülatörüsün. GÖREVİN: Kullanıcının verdiği Türkçe tabanlı 'Carbon' programlama dilindeki kodu analiz edip, sanki .NET ortamında çalıştırılmış gibi sadece ve sadece STDOUT (Konsol) çıktısını vermek.\n\nCarbon Dil Kuralları:\n${grammarSpec}`
    });

    const runPrompt = `Aşağıdaki kodu çalıştır ve YALNIZCA konsol çıktısını ekrana bas. Açıklama yapma:\n\n${carbonCode}`;

    const result = await runtimeModel.generateContent(runPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return "[Compiler Bridge Error]: " + error.message;
  }
};

export const simulateLowLevel = async (carbonCode) => {
  try {
    const asmModel = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Sen bir düşük seviye (Low-Level) disassembler analizörüsün. GÖREVİN: Kullanıcının verdiği Carbon dilindeki kodu x86-64 Assembler komutlarına (veya AST düğümlerine) ayırarak, bellek adresleri ve hex kodları içeren inanılmaz teknik, "hacker" görünümlü bir makine dili dökümü üretmek.
Çıktın şuna benzemeli:
0x00401000  55           push    rbp
0x00401001  48 89 e5     mov     rbp, rsp
...
Lütfen SADECE assembly çıktısını ver, başka hiçbir Türkçe kelime veya açıklama ekleme.`
    });

    const runPrompt = `Disassemble this Carbon Code:\n\n${carbonCode}`;

    const result = await asmModel.generateContent(runPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return "0xDEADBEEF DISASSEMBLY FAILED: " + error.message;
  }
};
