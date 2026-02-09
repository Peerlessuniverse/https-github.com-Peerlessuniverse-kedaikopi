
import { GoogleGenAI } from "@google/genai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const askCoffeeAssistant = async (prompt: string) => {
  try {
    // Ambil API Key secara dinamis dari Firestore agar bisa diatur dari Admin
    if (!db) return "Koneksi database terputus.";
    
    const settingsSnap = await getDoc(doc(db, "settings", "general"));
    const apiKey = settingsSnap.data()?.geminiApiKey;

    if (!apiKey) {
      return "Maaf, Barista AI belum dikonfigurasi dengan API Key. Silakan masukkan API Key di halaman Admin Settings.";
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Anda adalah 'Barista AI Kowawa'. Ramah, premium, dan ahli kopi. Gunakan Bahasa Indonesia. Bantu pengguna memilih menu atau beri informasi tentang kopi Nusantara.",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, koneksi Barista AI sedang terganggu. Ada yang bisa saya bantu secara manual?";
  }
};
