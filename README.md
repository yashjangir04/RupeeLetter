# 📈 RupeeLetter: Financial AI Assistant

<div align="center">

![RupeeLetter Showcase](https://img.shields.io/badge/Status-Active-success.svg)
![React](https://img.shields.io/badge/Frontend-React-blue.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green.svg)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-orange.svg)
![Redis](https://img.shields.io/badge/Cache-Redis-red.svg)

**An AI-powered financial assistant built using Retrieval-Augmented Generation (RAG), semantic caching, and real-time financial intelligence.**

</div>

---

## ✨ Features

### 🧠 Retrieval-Augmented Generation (RAG)
RupeeLetter retrieves relevant financial context before generating responses, ensuring:
- Higher factual accuracy
- Reduced hallucinations
- Context-aware financial insights
- Source-grounded answers

---

### ⚡ Semantic Caching with Redis
An intelligent semantic caching layer powered by embeddings and cosine similarity.

#### Example Queries
- *"What did RBI do?"*
- *"Did the central bank change rates?"*

Both queries are recognized as semantically similar, allowing cached responses to be served instantly.

#### Benefits
- Faster responses
- Lower API costs
- Reduced inference latency
- Better scalability

---

### 📊 Paste & Analyze (Deep Dive)
Users can paste:
- Earnings reports
- Financial statements
- News articles
- Investor presentations

The assistant automatically extracts:
- Key financial insights
- Market sentiment
- Risks & opportunities
- Structured summaries

---

### 💾 Persistent Chat Memory
MongoDB stores:
- User sessions
- Chat history
- Financial context
- Cached embeddings

This enables seamless continuation of previous conversations.

---

### 🎨 Premium UI/UX
Modern responsive frontend with:
- Dark / Light theme engine
- Animated chat skeleton loaders
- Smooth CSS keyframe transitions
- Active session tracking
- Clean financial dashboard aesthetics

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Lucide React
- Custom CSS Animations
- Responsive UI Design

## Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Redis

## AI & Machine Learning

### Inference
- Groq API (`Llama-3.1-8b-instant`)

### Embeddings
- HuggingFace MiniLM
- Cosine Similarity Vector Search

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed and running:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

---

# 📦 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/rupeeletter.git
cd rupeeletter
```

---

## 2️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

### Create a `.env` file

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
REDIS_URL=your_redis_connection_string
```

### Start Backend Server

```bash
npm start
```

Backend will start at:

```bash
http://localhost:5000
```

---

## 3️⃣ Ingest Financial Data

Before using the chatbot, ingest the financial news/articles into the vector database.

Make a request to:

```bash
POST http://localhost:5000/api/ingest
```

You can use:
- Postman
- Thunder Client
- cURL

### Example using cURL

```bash
curl -X POST http://localhost:5000/api/ingest
```

This step:
- Fetches/stores financial articles
- Generates embeddings
- Populates MongoDB vector storage
- Prepares Redis semantic cache

⚠️ This step is required before asking financial questions.

---

## 4️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

### Start Frontend

```bash
npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

---

# 🧠 Architecture Flow

```text
User Query
    ↓
Semantic Cache Check (Redis)
    ↓
Cache Hit → Instant Response
    ↓
Cache Miss
    ↓
Vector Search in MongoDB
    ↓
Top Relevant Financial Chunks Retrieved
    ↓
Prompt + Context sent to Groq (Llama 3)
    ↓
AI Response Generated
    ↓
Save to MongoDB + Redis Cache
```

---

# ⚙️ How It Works

## 1. User Query
The user submits a financial question through the React interface.

## 2. Semantic Cache Check
The backend converts the query into embeddings and checks Redis for semantically similar queries using cosine similarity.

If similarity score > `0.85`:
✅ Cached response is returned instantly.

## 3. Vector Retrieval
If no cache hit occurs:
- MongoDB vector search retrieves top relevant financial chunks
- Relevant context is prepared for the LLM

## 4. AI Generation
The retrieved context + user query are sent to:
- **Groq API**
- **Llama-3.1-8b-instant**

A low-temperature prompt ensures factual, grounded responses.

## 5. Persistence & Caching
Generated responses are:
- Stored in MongoDB
- Added to Redis semantic cache
- Linked with session history

---

# 📂 Project Structure

```bash
rupeeletter/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── redisClient.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── vite.config.js
│   ├── README.md
│   └── package.json
│
├── package-lock.json
└── README.md
```

---

# 🔥 Future Improvements

- Real-time stock market integration
- Portfolio analysis dashboard
- Financial chart visualization
- Multi-language support
- Voice-enabled AI assistant
- Live market alerts

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to:
- Fork the repository
- Create a feature branch
- Submit a pull request

---

# 📝 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ If you like this project, consider giving it a star on GitHub!

</div>
