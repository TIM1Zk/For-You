# ✨ For You - Encouraging Study Partner Website

A minimalist, premium, and heartfelt web application built to provide encouragement and motivation for a special someone during their study sessions or hard-working days.

---

## 🌟 Features

- **🎨 "Less is More" Aesthetic**: Clean glassmorphism design with soft, dynamic background elements (moving blobs) creating a calm and focused atmosphere.
- **💖 Dynamic Love Counter**: A heartwarming anniversary counter tracking elapsed time since **March 25, 2026**, featuring a large, vibrant gradient display.
  - **📅 Smart Time Scaling**: The counter dynamically scales from days to months and years as time passes.
  - **🕒 Local Time Accuracy**: Precision calculations ensure the counter increments exactly at **Midnight (00:00)** according to local Bangkok time, avoiding UTC offset delays.
  - **📸 Couple Avatar Cards**: Two interactive shared photo slots (`Me` & `You`). Uploading a photo updates it for everyone instantly using **Supabase Database & Storage**.
- **🎁 Anniversary Surprise Gift Box**: A cute, floating, and shaking gift box 🎁 that triggers:
  - **🎞️ Precious Memories Video**: A gorgeous responsive modal displaying a surprise anniversary YouTube video.
  - **✍️ Sweet Digital Letter**: A beautiful handwritten-style love letter expressing deep gratitude and appreciation.
- **💌 Heart-warming Encouragement**: A personalized quotes engine powered by a curated list of study & perseverance quotes.
  - **🥰 Affectionate Pronouns**: Quotes are updated with cute, intimate couple pronouns (`เค้า/คุณ`, `คนดีของเค้า`, `คนเก่ง`) under the sweet pen name **"ไอติมเองคับ <3"**.
  - **💝 Special Encouragement Mode**: A dedicated "Special" button that triggers a lovely **Heart Confetti Explosion** ❤️ and instantly initiates a phone call (`tel:0628632916`) to bridge the distance.
- **🖼️ Pinterest-style Gallery**: A gorgeous shared gallery redesigned into a responsive masonry layout:
  - **🏷️ Details & Control**: Each card has a clean hover overlay showing the uploader's name, precise Thai locale uploader timestamp (`th-TH`), and a delete button.
  - **🔍 Full-screen Blur Preview**: Click any image to view it in an elegant full-screen modal with background blur.
  - **💾 High-Res Download**: A dedicated button to save original, high-resolution uploaded images directly to the device.
- **🖤 Heart-text Outline Page**: A dedicated romantic room featuring a glowing heart shape composed entirely of the repeating text "ไอติมรักปุ้มนะ" on a pure black background. The heart beats/pulsates in real-time, matching modern interactive web aesthetics.
- **✨ Smooth Interactions**: Fluid page transitions, modal scales, and heart confetti animations powered by **Framer Motion** and **Canvas Confetti**.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React](https://reactjs.org/) (Vite)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Modern CSS3 (Glassmorphism, CSS Variables, Responsive Grids)
- **Typography**: Google Fonts (`Inter`, `Mitr`, `Sarabun`)
- **Database & Storage**: [Supabase](https://supabase.com) (PostgreSQL Database & Object Storage)
- **Deployment**: Single Page Application (SPA) configurations on [Vercel](https://vercel.com).

---

## 📂 Project Structure

```text
├── backend/
│   └── server.cjs         # Local dev/fallback Express server with Multer storage
├── src/
│   ├── assets/            # Project static assets
│   ├── data/
│   │   └── quotes.json    # Personalized encouraging quotes list
│   ├── App.css            # Component-specific styles
│   ├── App.jsx            # Core application layout, state, and Supabase integration
│   ├── index.css          # Main stylesheet containing variables, animations, and layouts
│   ├── main.jsx           # React app mount entry point
│   └── supabaseClient.js  # Supabase client setup
├── vercel.json            # Vercel SPA routing rewrites rules
├── vite.config.js         # Vite bundler configurations (with custom chunk size optimization)
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project with:
  - A public storage bucket named `gallery`
  - An `images` table matching the following schema:
    ```sql
    create table images (
      id bigint generated always as identity primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      name text not null,
      url text not null,
      timestamp text not null
    );
    ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TIM1Zk/For-You.git
   cd For-You
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access in Browser**
   Open `http://localhost:5173` in your browser.

---

## ☁️ Deployment (Vercel)

This project contains a `vercel.json` file configured for SPA routing.
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your production environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel Dashboard.
4. Deploy! Vercel automatically detects the Vite framework settings.

---

Built with ❤️ for someone special.
_Developed by TIM1Zk_
