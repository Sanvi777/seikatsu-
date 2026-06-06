生活 Seikatsu — Japan Settlement Guide

A full-stack web app that helps foreigners settle into Japan step by step.

🌐 Live Demo: seikatsu-three.vercel.app

✨ Features

🌸 12 Settlement Tasks — Ward office, health insurance, bank account, SIM card, and more
📝 Interactive Forms — Each task has a custom form to fill in your details
☁️ Cloud Sync — Progress saved to PostgreSQL database in Tokyo
👤 User Auth — Sign up / sign in with email
🗂️ Profile Page — Custom avatar, bio, and settlement stats
📋 Requests System — Submit tasks for admin approval
🤖 AI Assistant — Ask questions about Japan life powered by Groq LLaMA
🌐 Bilingual — English and Japanese (日本語) toggle
📱 Fully Responsive — Works on mobile and desktop
⛩️ Sakura UI — Falling cherry blossom petals animation

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) — hosted in Tokyo |
| Auth | Supabase Auth |
| AI | Groq API (LLaMA 3.3 70B) |
| Deployment | Vercel |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Sanvi777/seikatsu-.git
cd seikatsu-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Groq keys

# Run locally
npm run dev
```

---

## 🗄️ Database Schema

```sql
-- User progress tracking
create table user_progress (
  user_id uuid references auth.users,
  completed_tasks integer[]
);

-- Task form responses
create table task_responses (
  user_id uuid references auth.users,
  task_id integer,
  responses jsonb,
  completed boolean,
  status text -- pending, approved, rejected
);

-- User profiles
create table profiles (
  id uuid references auth.users,
  username text,
  bio text,
  avatar_url text
);
```

---

## 📸 Pages

| Page | Description |
|---|---|
| `/` | Home — task grid with progress tracking |
| `/task/[id]` | Task detail — custom form for each task |
| `/profile` | User profile with avatar and stats |
| `/requests` | View submitted tasks and approval status |

---

## 👩‍💻 Built By

**Sanvi Sharma** — Built as a portfolio project targeting Japan's tech industry.

- Demonstrates: Full-stack development, API integration, database design, UI/UX, deployment
- Relevant for: Japanese tech companies hiring foreign engineers

---

*生活 (Seikatsu) means "daily life" in Japanese 🌸*


