
import { GoogleGenAI } from "@google/genai";

export const askCoffeeAssistant = async (prompt: string) => {
  try {
    // Guidelines: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah 'Barista AI Kowawa'. Ramah, premium, dan ahli kopi. Gunakan Bahasa Indonesia. Bantu pengguna memilih menu atau beri informasi tentang kopi.",
        temperature: 0.7,
      },
    });

    return response.text || "Ada lagi yang bisa saya bantu tentang menu Kowawa?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, koneksi asisten AI sedang terganggu. Ada yang bisa saya bantu secara manual?";
  }
};
