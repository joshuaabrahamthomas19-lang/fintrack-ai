import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "@/types";

// FIX: Initialize GoogleGenAI with apiKey from environment variables as per guidelines.
// In a Vite project, ensure VITE_API_KEY is set in your .env file.
// The key will be available as `import.meta.env.VITE_API_KEY`.
// However, the guidelines specify using process.env.API_KEY. We will follow that.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const parseTransactionsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: {
        type: Type.STRING,
        description: 'The date of the transaction in YYYY-MM-DD format.',
      },
      description: {
        type: Type.STRING,
        description: 'A brief description of the transaction.',
      },
      amount: {
        type: Type.NUMBER,
        description: 'The transaction amount. Use negative values for expenses and positive values for income.',
      },
      category: {
        type: Type.STRING,
        description: 'A suggested category for the transaction (e.g., "Food & Dining", "Transport", "Salary").',
      },
    },
    required: ['date', 'description', 'amount', 'category'],
  },
};

type ParsedTransaction = {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export const parseTransactionsFromText = async (text: string): Promise<Omit<Transaction, 'id' | 'type'>[]> => {
  try {
    // FIX: Use ai.models.generateContent for querying the model.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following financial statement text and extract all transactions. Assign a relevant category to each transaction. The output must be a valid JSON array. \n\nStatement:\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: parseTransactionsSchema,
      },
    });

    // FIX: Access the .text property directly to get the model's response.
    const jsonStr = response.text.trim();
    
    const parsedTransactions: ParsedTransaction[] = JSON.parse(jsonStr);

    if (Array.isArray(parsedTransactions)) {
        return parsedTransactions.map(t => ({
            ...t,
            type: t.amount >= 0 ? 'income' : 'expense',
            amount: Math.abs(t.amount) // Store amount as a positive number
        }));
    }
    return [];

  } catch (error) {
    console.error("Error parsing transactions with Gemini:", error);
    throw new Error("Failed to parse transactions. The AI model could not process the text. Please check the format of your statement.");
  }
};
