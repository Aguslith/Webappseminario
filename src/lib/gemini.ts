import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function askAssistant(prompt: string, userProfile?: any) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Please add it to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  let userContext = "";
  if (userProfile) {
    userContext = `\nContexto del usuario:
    - Nombre: ${userProfile.nombre}
    - Peso: ${userProfile.peso}kg
    - Altura: ${userProfile.altura}cm
    - Alergias/Intolerancias: ${userProfile.alergias.length > 0 ? userProfile.alergias.join(", ") : "Ninguna"}.
    SI EL USUARIO INTENTA REGISTRAR ALGO QUE CONTENGA SUS ALERGIAS, DEBES ADVERTIRLE EXPLÍCITAMENTE.`;
  }

  const systemPrompt = `Eres un asistente de nutrición inteligente llamado "BioCoach". 
  Tu objetivo es ayudar al usuario a registrar su comida y darle consejos nutricionales.
  Cuando el usuario te diga lo que comió, debes intentar identificar los ingredientes y estimar las calorías y macros (proteínas, carbohidratos, grasas).
  Responde de forma amable, profesional y concisa.${userContext}
  Si el usuario dice algo como "Comí una pizza", responde con una estimación nutricional y pregúntale si quiere registrarla.`;

  const result = await model.generateContent([systemPrompt, prompt]);
  const response = await result.response;
  return response.text();
}
