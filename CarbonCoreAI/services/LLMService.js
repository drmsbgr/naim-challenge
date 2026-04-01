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
