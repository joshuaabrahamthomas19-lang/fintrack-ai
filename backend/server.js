import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());

// Startup checks for essential environment variables in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.CLIENT_URL) {
    console.error('FATAL ERROR: CLIENT_URL is not defined.');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
  }
}

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const defaultData = { users: {} };
const db = new Low(adapter, defaultData);
await db.read();

const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// Login or create user
app.post('/api/login', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined!');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    if (!db.data.users[username]) {
      db.data.users[username] = {
        transactions: [],
        categories: [
            { id: 'groceries', name: 'Groceries', type: 'expense' },
            { id: 'transport', name: 'Transport', type: 'expense' },
            { id: 'salary', name: 'Salary', type: 'income' },
        ],
        budgets: [],
        goals: [],
        balance: 0,
        settings: { theme: 'dark', currency: 'USD' }
      };
      await db.write();
    }
  
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user data
app.get('/api/user/data', authenticateToken, (req, res) => {
  const userData = db.data.users[req.user.username];
  if (userData) {
    res.json(userData);
  } else {
    res.status(404).json({ message: 'User data not found' });
  }
});

// Update user data
app.put('/api/user/data', authenticateToken, async (req, res) => {
  const { username } = req.user;
  db.data.users[username] = req.body;
  await db.write();
  res.json({ message: 'Data saved successfully' });
});

// Parse SMS
app.post('/api/parse-sms', [authenticateToken, upload.single('file')], async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const fileContent = req.file.buffer.toString('utf-8');

  try {
    const transactionSchema = {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: 'The date of the transaction in YYYY-MM-DD format.' },
            merchant: { type: Type.STRING, description: 'The name of the merchant or source of the transaction.' },
            amount: { type: Type.NUMBER, description: 'The transaction amount as a number.' },
            type: { type: Type.STRING, description: 'The type of transaction, either "income" or "expense".' },
        },
        required: ['date', 'merchant', 'amount', 'type'],
    };
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            transactions: {
                type: Type.ARRAY,
                items: transactionSchema
            },
            summary: {
                type: Type.STRING,
                description: 'A brief, friendly summary of the imported transactions.'
            }
        },
        required: ['transactions', 'summary']
    };

    const prompt = `Analyze the following SMS transaction history. Extract all financial transactions and provide a brief summary.
        Format the output as a JSON object that strictly follows this schema. Do not include any text outside of the JSON object.
        
        SMS Data:
        ---
        ${fileContent}
        ---`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });
    
    // The response.text is already a guaranteed JSON string due to responseSchema
    const parsedData = JSON.parse(response.text);

    res.json(parsedData);

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ message: 'Error processing file with AI. The file might be in an unsupported format.' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`FinTrack AI backend is running on http://localhost:${port}`);
});
