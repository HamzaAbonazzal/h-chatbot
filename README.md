# Chatbot — Fullstack AI Chat App

> A simple, fast, full-stack AI chatbot with conversation history, search, dark mode, and RTL support. Built with Next.js, TypeScript, MongoDB, and a free AI provider.

<p align="center">
  <a href="README.ar.md">العربية</a> · <strong>English</strong>
</p>

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Features

- **AI Chat** — Talk to a large language model (Gemini, OpenRouter, Groq, etc.).
- **Persistent History** — Conversations and messages stored in MongoDB.
- **Conversation Management** — Create, rename, and delete conversations.
- **Full-Text Search** — Search across conversation titles and message content.
- **Dark / Light Mode** — Theme persists across reloads, no flash on load.
- **Responsive Design** — Works on desktop, tablet, and mobile.
- **RTL Support** — Fully optimized for Arabic and other right-to-left languages.
- **Retry on Failure** — Failed messages show a retry button instead of losing them.
- **Draft Conversations** — Empty chats are never saved to the database.
- **Toast Notifications** — Elegant UI feedback instead of browser `alert()`.
- **No Auth Required** — Uses an anonymous `clientId` stored in `localStorage`.

---

## Tech Stack

| Layer     | Technology                                                                                          |
| --------- | --------------------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)                                           |
| Language  | [TypeScript](https://www.typescriptlang.org/)                                                       |
| Styling   | [Sass](https://sass-lang.com/) (SCSS Modules)                                                       |
| Database  | [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/)                |
| AI        | [Google Gemini](https://ai.google.dev/) or [OpenRouter](https://openrouter.ai/) (OpenAI-compatible) |
| Hosting   | [Vercel](https://vercel.com/)                                                                       |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or Atlas)
- An API key from an AI provider (Gemini or OpenRouter)

### 1. Clone

```bash
git clone https://github.com/USERNAME/chatbot.git
cd chatbot
```

### 2. Install

```bash
npm install
```

### 3. Configure Environment

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/chatbot
AI_API_KEY=your_api_key_here
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
AI_MODEL=gemini-flash-latest
```

**Alternative — OpenRouter:**

```env
AI_API_KEY=sk-or-v1-xxxxx
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=deepseek/deepseek-chat-v3.1:free
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable      | Required | Description                             |
| ------------- | -------- | --------------------------------------- |
| `MONGODB_URI` | Yes      | MongoDB connection string.              |
| `AI_API_KEY`  | Yes      | API key for your AI provider.           |
| `AI_BASE_URL` | Yes      | OpenAI-compatible endpoint.             |
| `AI_MODEL`    | Yes      | Model name, e.g. `gemini-flash-latest`. |

---

## Project Structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ chat/route.ts                 # Send message + get AI reply
│  │  ├─ conversations/route.ts        # List / create conversations
│  │  ├─ conversations/[id]/route.ts   # Rename / delete conversation
│  │  ├─ conversations/[id]/messages/route.ts  # List messages
│  │  └─ search/route.ts               # Full-text search
│  ├─ globals.scss
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ChatWindow.tsx
│  ├─ ConversationItem.tsx
│  ├─ MessageBubble.tsx
│  ├─ MessageInput.tsx
│  ├─ Sidebar.tsx
│  ├─ ConfirmModal/
│  ├─ ThemeToggle/
│  ├─ Toast/
│  └─ icons/
├─ lib/
│  ├─ ai.ts                            # AI provider wrapper
│  ├─ clientId.ts                      # Anonymous user ID
│  ├─ mongodb.ts                       # Cached connection
│  └─ theme.ts                         # Theme persistence
├─ models/
│  ├─ Conversation.ts
│  └─ Message.ts
└─ types/
   └─ index.ts
```

---

## API Reference

All endpoints are under `/api`.

| Method | Endpoint                      | Description                              |
| ------ | ----------------------------- | ---------------------------------------- |
| GET    | `/conversations?clientId=...` | List conversations for a client.         |
| POST   | `/conversations`              | Create a new conversation.               |
| PATCH  | `/conversations/:id`          | Rename a conversation.                   |
| DELETE | `/conversations/:id`          | Delete conversation + its messages.      |
| GET    | `/conversations/:id/messages` | Get messages of a conversation.          |
| POST   | `/chat`                       | Send a message, get AI reply, save both. |
| GET    | `/search?clientId=...&q=...`  | Search titles and message content.       |

---

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add environment variables in Vercel:
   - `MONGODB_URI` — must be a remote MongoDB (e.g. Atlas). Local `127.0.0.1` won't work.
   - `AI_API_KEY`
   - `AI_BASE_URL`
   - `AI_MODEL`
4. Click **Deploy**.

### Database Note

Local MongoDB is fine for development, but Vercel cannot reach your `localhost`. Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available) for production.

---

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start development server.     |
| `npm run build` | Create production build.      |
| `npm run start` | Run production build locally. |
| `npm run lint`  | Run ESLint.                   |

---

## Security Notes

- No authentication — users are identified by an anonymous `clientId` in `localStorage`.
- All AI and database calls go through API routes; secrets never reach the browser.
- `.env.local` is gitignored — never commit your keys.
- For public production use, consider adding authentication (e.g. NextAuth) and rate limiting.

---

## License

MIT — free to use, modify, and distribute.

---

## Author

**Your Name**

- GitHub: [@USERNAME](https://github.com/USERNAME)
