
import { GoogleGenAI } from "@google/genai";
import { blobToBase64 } from "../utils/audioUtils";
import { TranscriptSegment } from "../types";

const API_KEY = process.env.API_KEY;

// --- MERKEZİ SİSTEM TALİMATLARI ---
const PSYCHOLOGY_EXPERT_INSTRUCTION = `
ROL: 20 yıllık deneyime sahip Kıdemli Klinik Psikolog ve Süpervizörsün.
GÖREV: Psikologlara seans analizlerinde ve vaka formülasyonlarında rehberlik etmek.
ALAN: SADECE psikoloji ve sunulan seansın analizi hakkında konuş.
ETİK: Tanı koyma, ilaç önerme. Seans metnine sadık kal.
`;

const cleanJsonText = (text: string): string => {
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }
  return cleaned;
};

export const transcribeAudio = async (audioBlob: Blob, mimeType: string): Promise<TranscriptSegment[]> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const base64Data = await blobToBase64(audioBlob);
  // Using gemini-3-flash-preview as per guidelines for basic text/transcription tasks
  const modelId = "gemini-3-flash-preview"; 

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: `
              GÖREV: Bu ses kaydını dinle ve konuşmacıları (Psikolog ve Danışan) KESİN olarak ayırarak transkript et.
              
              KONUŞMACI AYRIMI (DIARIZATION) KURALLARI:
              - "P": Psikolog (Terapist). Profesyonel, soru soran, yansıtan kişi.
              - "D": Danışan. Duygularını ve olayları anlatan kişi.
              - Konuşmacı değiştiği an yeni bir JSON objesi oluştur.
              - "Hıhı", "Evet", "Anlıyorum" gibi kısa onaylamaları bile AYRI birer satır (P veya D olarak) yaz, önceki konuşma ile birleştirme.

              FORMAT: Sadece saf JSON array döndür. 
              [
                {
                  "id": 1,
                  "speaker": "P",
                  "text": "Merhaba, hoş geldiniz.",
                  "timestamp": "00:00"
                }
              ]
              
              Timestamp formatı: MM:SS
            `
          }
        ]
      },
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Transcription failed: Empty response.");

    const cleanedText = cleanJsonText(text);
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

export const generateSessionReport = async (transcriptText: string, approach: string = "Bütüncül"): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  // Using gemini-3-pro-preview for complex reasoning tasks
  const modelId = "gemini-3-pro-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{
          text: `
            ${PSYCHOLOGY_EXPERT_INSTRUCTION}
            
            GÖREV: Aşağıdaki seans transkriptini **${approach}** ekolü çerçevesinde analiz ederek resmi bir klinik rapor oluştur.
            
            BAŞLIKLAR:
            # Seans Analiz Raporu (${approach})
            ## 1. Klinik Özet
            ## 2. Duygu Durum ve Bilişsel Analiz
            ## 3. Öne Çıkan Klinik Temalar
            ## 4. Terapist İçin Öneriler

            Transkript:
            ${transcriptText}
          `
        }]
      },
      config: { temperature: 0.3 }
    });

    return response.text || "Rapor oluşturulamadı.";
  } catch (error) {
    console.error("Report error:", error);
    throw error;
  }
};

export const generateSupervisionCritique = async (transcriptText: string, approach: string): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const modelId = "gemini-3-pro-preview";

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [{
        text: `
          ${PSYCHOLOGY_EXPERT_INSTRUCTION}
          GÖREV: Seansı **${approach}** ekolüyle bir süpervizör olarak eleştir. Terapiste teknik geri bildirim ver.
          Metin: ${transcriptText}
        `
      }]
    },
    config: { temperature: 0.4 }
  });
  return response.text || "Analiz oluşturulamadı.";
};

export const chatWithSessionAI = async (transcriptText: string, history: any[], message: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const modelId = "gemini-3-pro-preview";

    const chat = ai.chats.create({
        model: modelId,
        history: [
            { role: 'user', parts: [{ text: `${PSYCHOLOGY_EXPERT_INSTRUCTION}\nTranskript:\n${transcriptText}` }] },
            { role: 'model', parts: [{ text: "Anlaşıldı. Bu seansla ilgili klinik sorularınızı yanıtlamaya hazırım." }] },
            ...history
        ],
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Cevap alınamadı.";
};

export const suggestChatQuestions = async (transcriptText: string): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Bu seans metni üzerinden terapistin sorması gereken 3 derin klinik soruyu madde madde yaz: " + transcriptText.substring(0, 5000)
    });
    return response.text?.split('\n').filter(q => q.trim().length > 5) || [];
}

export const generateBulkSupervision = async (sessions: any[], approach: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const modelId = "gemini-3-pro-preview";
    const context = sessions.map(s => `${s.date}: ${s.transcript}`).join('\n\n');
    const response = await ai.models.generateContent({
        model: modelId,
        contents: `Bu seanslar üzerinden ${approach} ekolüyle uzunlamasına analiz yap:\n${context}`
    });
    return response.text || "Analiz hatası.";
}

export const interpretPsychometricScale = async (scaleName: string, score: number, previousScores: any[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Ölçek: ${scaleName}, Puan: ${score}, Geçmiş: ${JSON.stringify(previousScores)}. Klinik yorum yap ve JSON (interpretation, recommendationDate) döndür.`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
};
