# ✦ AnimaType

**Find your anime twin soul through MBTI personality matching. Powered by AI, featuring 200+ iconic anime characters.**

![AnimaType Banner](https://img.shields.io/badge/MBTI-16%20Types-8b5cf6) ![AI Powered](https://img.shields.io/badge/AI-Groq-10b981) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000)

---

## 🌟 Features

- **MBTI Personality Test** - 15-question comprehensive personality assessment
- **AI-Powered Matching** - Groq AI analyzes your responses to find your perfect anime match
- **200+ Anime Characters** - From popular series like Naruto, Attack on Titan, Death Note, and more
- **Dark Glassmorphic UI** - Beautiful anime-themed design with smooth animations
- **Instagram Story Export** - Download your result card optimized for Instagram stories (1080x1920px)
- **Secure & Private** - API keys stored securely in environment variables, no data collection

---

## 🎯 How It Works

1. **Enter Your Info** - Name, age, and basic preferences
2. **MBTI Assessment** - Answer 15 personality questions with slider inputs
3. **Genre Selection** - Choose your favorite anime genres
4. **Soul Resonance** - Answer 3 open-ended questions about your personality
5. **AI Matching** - Groq AI analyzes your profile and finds your anime counterpart
6. **Get Results** - View your character match with personality breakdown
7. **Share** - Download your result as an Instagram-ready story card

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for local development)
- Vercel account (for deployment)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sandesh-Pol/files.git
   cd files
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   ```

3. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

4. **Run development server**
   ```bash
   vercel dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📦 Deploy to Vercel

### Option 1: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable: `GROQ_API_KEY`
6. Deploy!

### Setting Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Your Groq API key from [console.groq.com](https://console.groq.com)
   - **Environments:** Select Production, Preview, and Development
4. Click "Save"
5. Redeploy your project

---

## 🗂️ Project Structure

```
animatype/
├── api/
│   └── match.js              # Serverless function for Groq API proxy
├── public/
│   ├── images/               # Character images (200x200px recommended)
│   ├── app.html              # Multi-step quiz application
│   ├── app.js                # Application logic
│   ├── index.html            # Landing page
│   ├── landing.js            # Landing page interactions
│   └── style.css             # All styles (dark glassmorphic theme)
├── .env                      # Environment variables (not in git)
├── .gitignore                # Git ignore rules
├── config.example.js         # Example config documentation
├── package.json              # Node.js configuration
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

---

## 🖼️ Adding Character Images

Character images are stored in `public/images/`. The app automatically loads images based on character names returned by the AI.

### Naming Convention

Images must follow the slug format (lowercase with underscores):

```
Naruto Uzumaki  → naruto_uzumaki.png
Light Yagami    → light_yagami.png
Levi Ackerman   → levi_ackerman.png
L Lawliet       → l_lawliet.png
```

### Image Requirements

- **Size:** 200x200px or larger (square)
- **Format:** PNG or JPG
- **Content:** Character face clearly visible
- **Fallback:** If image not found, shows 🌸 emoji

### Suggested Characters to Add

Popular MBTI matches: Naruto, Light Yagami, Levi, Rem, Gojo, Mikasa, Kakashi, L Lawliet, Senku, Violet Evergarden, Tanjiro, Nezuko, Itachi, Erwin, Armin, Historia, Hisoka, Killua, Gon, Lelouch, Edward Elric, Spike Spiegel, Saitama, Zero Two, and more!

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Groq API (Llama 3.3 70B)
- **Deployment:** Vercel
- **Image Capture:** html2canvas

---

## 🔒 Security

- ✅ API key stored in environment variables (never exposed to client)
- ✅ Serverless function acts as secure proxy
- ✅ No user data collection or storage
- ✅ CORS protection on API endpoints
- ✅ Input validation on all requests

---

## 🎨 Customization

### Changing Colors

Edit CSS variables in `public/style.css`:

```css
:root {
  --violet: #8b5cf6;
  --violet-bright: #a78bfa;
  --magenta: #ec4899;
  --cyan: #22d3ee;
  --emerald: #10b981;
  --amber: #f59e0b;
}
```

### Modifying AI Prompt

Edit the `buildPrompt` function in `api/match.js` to customize how characters are matched.

### Adjusting MBTI Questions

Edit the `mbtiQuestions` array in `public/app.js`.

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add more character images
- Improve the AI matching algorithm
- Enhance the UI/UX
- Fix bugs
- Add new features

---

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check [Groq API Documentation](https://console.groq.com/docs)
- Check [Vercel Documentation](https://vercel.com/docs)

---

## 📸 Screenshots

### Landing Page
Clean, anime-themed landing with glassmorphic design.

### Personality Test
Interactive slider-based MBTI questionnaire with real-time progress tracking.

### Results Card
Beautiful character match with personality traits, description, and soul resonance percentage.

### Instagram Story Export
Download results optimized for Instagram stories (1080x1920px).

---

**Built with ✦ by the AnimaType team**

Repository: [github.com/Sandesh-Pol/files](https://github.com/Sandesh-Pol/files)
