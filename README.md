# 📣 UNH Cheer — Media Vault & Coach Collaboration Hub

A modern, responsive web application and content management system designed for **UNH Cheerleading**. Built to organize video clips (tumbling, backflips, stunts, pyramids, baskets, and game day chants), collaborate with the head coach on clip reviews, plan social media drops, and maintain a full events calendar.

Hosted on **Netlify** with video assets streamed from cloud object storage (AWS S3, Cloudflare R2, Supabase Storage, or Netlify Blobs).

---

## 🌟 Key Features

### 1. 🎬 Organized Video Library & Clips Vault
- **Skill Categorization**: Tag clips by stunt type:
  - *Tumbling & Flips* (Standing Back Tucks, Roundoff Handsprings, Full Twists)
  - *Stunts & Partner Stunting* (Coed Extensions, Libs, Heel Stretches, Arabesques)
  - *Pyramids* (2-1-2 Sequences, Full-up Transitions)
  - *Basket Tosses* (Kick Fulls, Toe Touch Cradles)
  - *Game Day & Chants* (Sideline Cheers, Megaphones, Band Dances)
  - *Halftime Routines & Conditioning Drills*
- **Rich Metadata**: Filter by Athlete names, aspect ratio (`9:16` vertical reels/shorts vs `16:9`), duration, review status, and custom tags (`#backflip`, `#tumbling`, `#level4`).
- **Instant Search**: Real-time search across titles, skills, athletes, tags, and coach comments.

### 2. 🔍 Slow-Motion Technique Player
- **0.5x, 0.75x, 1.0x, 1.25x Playback**: Essential for cheer coaches and athletes to analyze tumbling rotation, set height, body alignment, and landing mechanics.
- **Continuous Loop Mode**: Seamlessly loop backflips and stunt sequences for close review.

### 3. 🤝 Head Coach Collaboration Queue
- **Decision Statuses**:
  - `Needs Review` (In coaching queue)
  - `Coach Approved` (Technique verified)
  - `Ready to Post` (Staged for social media)
  - `Needs Retake` (Coaching notes provided for next practice)
  - `Posted` (Live on social channels)
- **1-5 Star Execution Rating**: Quantify stunt and tumbling execution quality.
- **Direct Coaching Notes**: Leave precise feedback for athletes and videographers.

### 4. 📅 Team Calendar & Content Drops
- Track upcoming **Game Days**, **Practices**, **Competitions / Showcases**, and scheduled **Social Drops**.
- Link specific video clips directly to upcoming game days and events.

### 5. 📱 Social Media Staging & Captions
- Draft captions with pre-populated UNH hashtags:
  `#UNHCheer #ChargerPride #CollegeCheer #Tumbling #Backflip`
- Track multi-platform targets (TikTok, Instagram Reels, YouTube Shorts, X/Twitter).
- One-click "Copy Caption" and "Mark as Live".

### 6. 🗄️ Cloud Storage Bucket Integration
- Direct MP4 streaming from **Cloudflare R2** (recommended: zero egress fees), **AWS S3**, **Supabase**, or **Netlify Blobs**.
- In-app URL validator to verify that your bucket MP4 links stream properly.
- Set a default bucket base URL (e.g. `https://pub-xxx.r2.dev/unh-cheer`) so you can type clean short paths like `tumbling/backflip.mp4`.

### 7. 💾 Local Persistence & One-Click Backup
- Automatically saves state to `localStorage`.
- One-click **Backup (Export JSON)** and **Restore (Import JSON)** to share library updates with the head coach.

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Clone repository & enter directory
cd unh-cheer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

### Building for Production
```bash
npm run build
```

---

## 🌐 Deploying to Netlify

This project includes a pre-configured `netlify.toml` file ready for instant deployment.

### Option 1: Via Netlify CLI
```bash
# Preview deploy
netlify deploy

# Production deploy
netlify deploy --prod --dir=dist
```

### Option 2: Via Git & Netlify Dashboard
1. Push this repository to GitHub:
   ```bash
   gh repo create unh-cheer --public --source=. --remote=origin --push
   ```
2. Log into [Netlify](https://app.netlify.com).
3. Click **"Add new site"** → **"Import an existing project"** → Select `unh-cheer`.
4. Netlify will auto-detect the build settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**!

---

## 🗂️ Recommended Bucket Structure

When uploading your clips to your bucket (S3, Cloudflare R2, etc.):
```text
unh-cheer-vault/
├── tumbling/
│   ├── 2026-11-standing-back-tuck.mp4
│   └── 2026-11-full-twist-jordan.mp4
├── stunts/
│   ├── 2026-11-partner-tictoc.mp4
│   └── 2026-11-lib-extension.mp4
├── pyramids/
│   └── 2026-11-nca-sequence.mp4
├── baskets/
│   └── 2026-11-kick-full.mp4
└── gameday/
    └── 2026-11-fight-song-sideline.mp4
```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Netlify
