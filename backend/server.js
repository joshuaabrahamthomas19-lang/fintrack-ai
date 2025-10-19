import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
// FIX: Removed unused HarmCategory and HarmBlockThreshold imports.
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3001;

// --- Security Middleware ---
app.use(helmet());

// --- CORS Configuration ---
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const clientUrl = process.env.CLIENT_URL;
if (clientUrl) {
    allowedOrigins.push(clientUrl);
}

const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'production' && !clientUrl) {
    console.warn("WARNING: No CLIENT_URL set in production. CORS may block frontend requests.");
}

// --- Middleware ---
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// --- Database Setup ---
const adapter = new JSONFile('db.json');
const defaultData = { users: {} };
const db = new Low(adapter, defaultData);
await db.read();

// --- Gemini API Setup ---
// FIX: Correctly initialize GoogleGenAI with a named apiKey parameter.
const genAI = new GoogleGenAI({apiKey: process.env.API_KEY});

// --- JWT Middleware ---
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

// --- API Routes ---
app.post('/api/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    if (!db.data.users[username]) {
        db.data.users[username] = {
            transactions: [],
            goals: [],
            budget: { type: 'monthly', limit: 20000 },
            savings: 0,
            totalBalance: 0,
            currency: '₹',
            categories: ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Other'],
        };
        db.write();
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});

app.get('/api/check-auth', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
});

app.get('/api/data', authenticateToken, async (req, res) => {
    await db.read();
    const userData = db.data.users[req.user.username];
    res.json({ ...userData, username: req.user.username });
});

app.post('/api/data', authenticateToken, async (req, res) => {
    db.data.users[req.user.username] = { ...db.data.users[req.user.username], ...req.body };
    await db.write();
    res.sendStatus(200);
});

app.post('/api/parse-sms', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const fileContent = req.file.buffer.toString('utf8');
        const model = 'gemini-2.5-flash';

        const prompt = `
            Parse the following SMS messages to extract financial transactions.
            For each transaction, determine if it's a debit or credit, the amount, the merchant/source, a brief description, the date (in YYYY-MM-DD format), and a relevant category.
            Valid categories are: Food, Transport, Shopping, Utilities, Entertainment, Health, Salary, Rent, Groceries, Bills, Travel, Gifts, Other.
            If the date is not specified, use today's date: ${new Date().toISOString().split('T')[0]}.
            Return the result as a JSON object with a single key "transactions" which is an array of transaction objects.
            Each transaction object should have: type, amount, merchant, description, date, category.
            Do not include any transactions that are not financial (e.g., OTPs, alerts, marketing messages).
            If no financial transactions are found, return an empty "transactions" array.

            SMS Data:
            ---
            ${fileContent}
            ---
        `;

        const response = await genAI.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        if (!response.text) {
             throw new Error("The AI returned an empty response. The file might not contain recognizable transactions.");
        }

        const parsedJson = JSON.parse(response.text);
        res.json(parsedJson);

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to process file with AI. Please check the file content and try again.' });
    }
});


app.listen(port, () => {
    console.log(`FinTrack AI backend is running on http://localhost:${port}`);
});