# ✨ For You - Encouraging Study Partner Website

A minimalist, premium, and heartfelt web application built to provide encouragement and motivation for a special someone during their study sessions or hard-working days.

## 🌟 Features

- **🎨 "Less is More" Aesthetic**: Clean glassmorphism design with soft, dynamic background elements for a calm and focused atmosphere.
- **💌 Randomized Encouragement**: A curated collection of meaningful quotes in both **Thai** and **English**, specifically focused on study and perseverance.
- **💖 Special Encouragement Mode**: A dedicated "Special" button that triggers:
  - A beautiful **Heart Confetti Explosion** ❤️
  - Deeply emotional and sweet personal messages.
  - An **Automatic Call Trigger** to bridge the distance instantly.
- **📸 Global Image Gallery**: Users can upload their own cute images which are saved to **Supabase Storage**. The gallery syncs in real-time pulling from the **Supabase Database**, so you both see the updates instantly. Features a responsive masonry grid layout with transparent glassmorphism design.
- **✨ Smooth Interactions**: Fluid transitions and micro-animations powered by Framer Motion.
- **📱 Responsive Design**: Optimized for a premium experience on both Desktop and Mobile devices.

## 🛠️ Technology Stack

- **Framework**: [React](https://reactjs.org/) (Vite)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Vanilla CSS with Modern Glassmorphism & Responsive Grid
- **Typography**: Google Fonts (Inter, Mitr, Sarabun)
- **Backend & Storage**: [Supabase](https://supabase.com) (Database, Auth, and Storage)
- **Deployment**: Configured for Single Page Application (SPA) deployment on **Vercel**.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project with a `gallery` public storage bucket and an `images` table.

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

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to see the magic.

5. **Environment Variables**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## ☁️ Deployment (Vercel)

This project contains a `vercel.json` file designed to run the React app as a seamless Single Page Application (SPA).
1. Push the code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. **Important:** Before deploying, go to Settings > Environment Variables in Vercel and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Vercel will automatically detect Vite and build the project.

## 📂 Project Structure

- `src/App.jsx`: Main logic, state management, image uploads, and animations.
- `src/index.css`: Core design system, glassmorphism styling, and responsive masonry gallery.
- `src/data/quotes.json`: The database of heart-warming quotes.
- `vercel.json`: Vercel routing configuration for SPA compatibility.

---

Built with ❤️ for someone special By TIM1Zk_
