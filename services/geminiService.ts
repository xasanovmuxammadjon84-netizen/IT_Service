import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real environment, this should be handled securely.
// For this demo, we assume the environment variable is injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Menga quyidagi kompyuter xizmati yoki mahsuloti uchun qisqa, 
      jozibali va o'zbek tilida reklama matni yozib ber. 
      Maksimum 2 gap bo'lsin.
      
      Mahsulot nomi: ${productName}
      Kategoriya: ${category}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tavsif yaratishda xatolik yuz berdi. Iltimos qo'lda kiriting.";
  }
};