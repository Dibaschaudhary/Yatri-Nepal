# Yatri Nepal - Ride Hailing System

A nationwide ride-hailing platform for Nepal supporting Cars, Bikes, Auto-rickshaws, and E-rickshaws with AI-powered fare prediction.

## 🚀 Deployment Instructions

### 1. Create a Repository
Go to [GitHub](https://github.com) and create a new repository named `yatri-nepal`.

### 2. Push Code to GitHub
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yatri-nepal.git
git push -u origin main
```

### 3. API Key Security
This app uses the Google Gemini API. **Do not hardcode your API key.**
- **Local Dev**: Use a `.env` file.
- **Production**: If using Vercel or Netlify, add `API_KEY` to the **Environment Variables** section in your project settings.

## 🛠 Features
- **Master Admin Login**: Use phone `9800000000` to access the System Control terminal.
- **AI Estimations**: Real-time fare calculation using Gemini 3 Flash.
- **Nepal-Centric**: Built-in support for Ncell/Namaste carrier detection and local payment gateways (eSewa, Khalti, IME Pay).

## 📦 Tech Stack
- **React 19**
- **Tailwind CSS**
- **@google/genai** (Gemini API)
- **Recharts** (Admin Analytics)
