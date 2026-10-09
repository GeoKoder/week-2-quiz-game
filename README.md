# 🧠 QuizMaster — Interactive Web Quiz Application

QuizMaster is a responsive, feature-packed quiz game crafted with **HTML5, CSS3, and Vanilla JavaScript**. It features multi-category trivia (Kenya Trivia, Technology, and Science), countdown timers, real-time score tracking, grading, full question answer reviews, audio effects, confetti celebrations, and a persistent top-10 high score leaderboard.

---

## 🌐 Live Demo & Deployment

👉 **[Launch Live QuizMaster Demo](https://geokoder.github.io/week-2-quiz-game/)** 👈

---

## ✨ Features & Requirements Checklist

### 1. 🗂️ Category Selection Screen
- **3 Curated Categories (30 Questions Total)**:
  - 🇰🇪 **Kenya Trivia** (10 questions): Mount Kenya, Lake Victoria, 1963 Independence, Kenyan Shilling, Kelvin Kiptum, Parliament House, Nairobi National Park, Harambee, Nandi County, and M-Pesa.
  - 💻 **Technology** (10 questions): HTML, JavaScript, CSS, HTTPS, localStorage, Git commands, FIFO Queues, Array methods, APIs, and React origin.
  - 🔬 **Science** (10 questions): Periodic table symbols, Red Planet, Mitochondria, Speed of Light, Photosynthesis, Diamonds, Human Skeleton, Atmosphere composition, Water pH, and Gravity.
- Each category card displays its icon/emoji, title, "10 Questions" subtitle, description, and "Start Quiz" button.
- Topbar includes direct access to the **Hall of Fame High Scores** board and a **Sound Effects Toggle** button.

### 2. 🎮 Interactive Quiz Gameplay
- **Per-Question Visual Timer**: 15-second countdown timer (adjustable by difficulty) with countdown indicator and pulsating warning when $\le 5$ seconds remain.
- **Timer Warning Sounds**: Audio ticks during the final 5 seconds (via Web Audio API).
- **Auto-Advance on Timeout**: If the timer expires (0s), it counts as incorrect/timed out, highlights the correct answer in green, and advances to the next question.
- **Immediate Visual Feedback**:
  - Selected answer glows green if correct.
  - Selected answer glows red if incorrect, simultaneously illuminating the correct option in emerald green.
- **2-Second Answer Pause**: Enforces a 2-second pause after answering before automatically advancing to the next question.
- **2x2 Answer Grid**: Responsive 2x2 grid layout on desktop screens that smoothly collapses to a single stacked column on mobile.
- **Running Progress & Score Tracking**: Progress bar smoothly updates with current question index, running score header (e.g. `Score: 7 / 10`), and question counter (`Question 3 of 10`).

### 3. 📊 Results Screen & Grading
- **Letter Grade Classification**:
  - **A** (80–100%): Emerald holographic badge + victory fanfare + confetti burst
  - **B** (60–79%): Cyan badge + positive feedback
  - **C** (40–59%): Amber badge + practice encouragement
  - **F** (below 40%): Rose badge + motivational feedback
- **Comprehensive Score Breakdown**:
  - Total correct count
  - Total incorrect count
  - Total timed out count
- **Action Buttons**:
  - `📝 Review Answers`: Launch detailed question-by-question review mode.
  - `🔄 Play Again`: Immediately retry the same category.
  - `🧭 Choose Category`: Return to home category selection.
  - `🏆 View Leaderboard`: Open the full high scores leaderboard.

### 4. 📝 Answer Review Screen
- Inspect all 10 questions from your quiz run.
- Shows question prompt, user's answer (marked red if incorrect, green if correct), correct solution, and timeout status badges (`Correct`, `Incorrect`, or `Timed Out`).
- Quick navigation buttons back to the results screen or home categories.

### 5. 🏆 Top 10 High Score Board (localStorage)
- Persists top 10 scores in browser `localStorage`.
- Each high score entry tracks:
  - `name`: Player's custom username (prompted on Results screen)
  - `score`: Total correct questions
  - `total`: Total questions in quiz (10)
  - `category`: Category played (Kenya Trivia, Technology, Science)
  - `date`: Submission date (`YYYY-MM-DD`)
- Sorted in descending order (highest scores first).
- Filterable by category (`All Categories`, `Kenya Trivia`, `Technology`, `Science`).
- Mini preview of top scores for the current category displayed directly on the Results screen.
- Reset/clear leaderboard feature with user confirmation.

### 6. ⭐ Stretch Goals Included
- **Difficulty Levels (+10%)**:
  - 🌱 **Easy**: 20 seconds per question (1x multiplier)
  - ⚡ **Medium**: 15 seconds per question (1.5x multiplier)
  - 🔥 **Hard**: 10 seconds per question (2x multiplier)
- **Synthesized Sound Effects (+10%)**:
  - Correct answer chime
  - Incorrect answer buzz
  - Countdown warning tick (last 5s)
  - Completion fanfare
  - Built with the native **Web Audio API** (100% offline, zero audio file download errors, zero CORS issues, with sound mute toggle)
- **Animations (+10%)**:
  - Slide-in questions from right
  - Sequential fade-in of answer choices
  - Pulsing score badges and timer warning animations
  - Full-screen celebratory canvas confetti burst on Grade A and high scores

---

## 📁 Project Structure

```plaintext
week-2-quiz-game/
├── index.html       # Semantic HTML5 markup, screen views & accessibility tags
├── styles.css       # Design system, glassmorphism tokens, CSS Grid & keyframe animations
├── questions.js     # 30 curated questions across Kenya Trivia, Tech, and Science
├── script.js        # Game state engine, timer, Web Audio synthesizer & localStorage leaderboard
└── README.md        # Comprehensive documentation, requirements checklist & guides
```

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags (`<header>`, `<main>`, `<section>`, `<article>`), ARIA accessibility roles (`role="radiogroup"`, `role="group"`, `aria-live`).
- **CSS3 (Vanilla)**: Glassmorphic backdrops (`backdrop-filter`), CSS Grid & Flexbox, neon color tokens, custom keyframes (`cardEntrance`, `shake`, `popSuccess`, `timerPulse`).
- **JavaScript (Vanilla ES6+)**: State machine, interval timers, Web Audio API synthesis, HTML5 Canvas confetti, and `localStorage` persistence.

---

## 🚀 Running Locally

### Prerequisites
A modern browser (Google Chrome, Firefox, Safari, or Microsoft Edge).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/GeoKoder/quiz-app.git
   cd week-2-quiz-game
   ```
2. Open `index.html` directly in your browser:
   - Double-click `index.html` in your file explorer.
   - Or start a local development server:
     ```bash
     # Using Python
     python -m http.server 8000
     ```
   - Visit `http://localhost:8000` in your browser.

---

## 🚢 Deployment to GitHub Pages

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Complete QuizMaster with all 3 categories, timer, review, and high scores"
   git push origin main
   ```
2. Navigate to your GitHub repository -> **Settings** -> **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Set branch to `main` and folder to `/(root)`, then click **Save**.
5. Your live app will be published within 1–2 minutes!

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
