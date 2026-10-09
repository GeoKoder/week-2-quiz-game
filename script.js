// ==========================================================================
// QuizMaster - Core Interactive Game Engine & State Machine
// Features: Category Selection, Countdown Timer, Sound Effects (Web Audio),
// Animated Transitions, Answer Review Mode, and Persistent High Scores.
// ==========================================================================

// --------------------------------------------------------------------------
// 1. Game State Variables
// --------------------------------------------------------------------------

// Active quiz configuration
let activeCategoryId = "kenya-trivia";  // ID of selected category ('kenya-trivia', 'technology', 'science')
let activeCategoryName = "Kenya Trivia"; // Display name of current category
let currentDifficulty = "medium";        // Difficulty level ('easy', 'medium', 'hard')
let currentCategoryQuestions = [];       // Array of 10 questions for the active category
let currentQuestionIndex = 0;           // Index of the question currently being answered (0 to 9)
let score = 0;                           // Running score count of correct answers (0 to 10)
let usersAnswers = [];                   // Log of user answers and outcomes for the review screen

// Timer configuration
const DIFFICULTY_SETTINGS = {
    easy: { timeLimit: 20, multiplier: 1.0, label: "Easy (20s)" },
    medium: { timeLimit: 15, multiplier: 1.5, label: "Medium (15s)" },
    hard: { timeLimit: 10, multiplier: 2.0, label: "Hard (10s)" }
};
let timerInterval = null;                // Reference to active setInterval for timer countdown
let timeLeft = 15;                       // Current seconds remaining for active question
let isAnswerLocked = false;              // Lock flag preventing double-clicking answers
let soundEnabled = true;                 // Toggle state for sound effects (stored in localStorage)
let previousScreenBeforeLeaderboard = 'start-screen'; // Back-navigation history helper

// --------------------------------------------------------------------------
// 2. DOM Elements Cache
// --------------------------------------------------------------------------

// Screen containers
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');
const highscoresScreen = document.getElementById('highscores-screen');

// Topbar utility controls
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');
const topbarHighscoresBtn = document.getElementById('topbar-highscores-btn');

// Start / Category Selection elements
const categoriesGrid = document.getElementById('categories-grid');
const diffButtons = document.querySelectorAll('.diff-btn');
const previousScoreDisp = document.getElementById('previous-score');

// Quiz Screen elements
const activeCategoryBadge = document.getElementById('active-category-badge');
const runningScoreBadge = document.getElementById('running-score-badge');
const timerDisplay = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const difficultyIndicator = document.getElementById('difficulty-indicator');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons');
const feedbackToast = document.getElementById('feedback-toast');

// Results Screen elements
const letterGradeDisp = document.getElementById('letter-grade');
const finalScoreDisp = document.getElementById('final-score');
const scorePercentageDisp = document.getElementById('score-percentage');
const messageDisp = document.getElementById('message');
const statCorrectCount = document.getElementById('stat-correct-count');
const statIncorrectCount = document.getElementById('stat-incorrect-count');
const statTimeoutCount = document.getElementById('stat-timeout-count');
const saveScoreCard = document.getElementById('save-score-card');
const saveScoreForm = document.getElementById('save-score-form');
const playerNameInput = document.getElementById('player-name-input');
const saveScoreBtn = document.getElementById('save-score-btn');
const saveScoreMsg = document.getElementById('save-score-msg');
const resultsMiniScores = document.getElementById('results-mini-scores');
const reviewBtn = document.getElementById('review-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const chooseCategoryBtn = document.getElementById('choose-category-btn');
const viewAllHighscoresBtn = document.getElementById('view-all-highscores-btn');

// Review Screen elements
const cardContainer = document.getElementById('card-container');
const resultsBtn = document.getElementById('results-btn');
const reviewHomeBtn = document.getElementById('review-home-btn');
const reviewSubtitle = document.getElementById('review-subtitle');

// High Scores Screen elements
const highscoresTableBody = document.getElementById('highscores-table-body');
const emptyScoresState = document.getElementById('empty-scores-state');
const filterTabButtons = document.querySelectorAll('.filter-tab-btn');
const closeHighscoresBtn = document.getElementById('close-highscores-btn');
const clearHighscoresBtn = document.getElementById('clear-highscores-btn');

// Confetti canvas element
const confettiCanvas = document.getElementById('confetti-canvas');

// --------------------------------------------------------------------------
// 3. Web Audio API Synthesizer (Pure Vanilla Sound Effects)
// Zero external file dependencies - 100% reliable offline and on GitHub Pages
// --------------------------------------------------------------------------
let audioCtx = null;

// Initialize or resume the audio context on first user interaction
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Sound synthesizers for the four required sound types
const SoundManager = {
    // Play upbeat two-tone chime when user selects the correct answer
    playCorrect() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // First note (E5)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0.15, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.25);

            // Second higher note (A5)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880.0, now + 0.1);
            gain2.gain.setValueAtTime(0.2, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.4);
        } catch (e) {
            console.warn("Web Audio error:", e);
        }
    },

    // Play buzz tone when user selects an incorrect answer
    playWrong() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.3);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {
            console.warn("Web Audio error:", e);
        }
    },

    // Play subtle clock tick when countdown is in the final 5 seconds
    playTick() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {
            console.warn("Web Audio error:", e);
        }
    },

    // Play complete fanfare melody on quiz completion
    playFanfare() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const noteDur = 0.12;

            notes.forEach((freq, idx) => {
                const now = ctx.currentTime + (idx * noteDur);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (idx === 3 ? 0.45 : 0.18));
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + (idx === 3 ? 0.45 : 0.18));
            });
        } catch (e) {
            console.warn("Web Audio error:", e);
        }
    }
};

// Toggle sound on/off and persist setting
function initSoundToggle() {
    const saved = localStorage.getItem('quizMasterSound');
    if (saved !== null) {
        soundEnabled = saved === 'true';
    }
    updateSoundIcon();

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('quizMasterSound', soundEnabled.toString());
            updateSoundIcon();
            if (soundEnabled) {
                SoundManager.playTick();
            }
        });
    }
}

function updateSoundIcon() {
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    if (soundToggleBtn) {
        soundToggleBtn.title = soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects';
    }
}

// --------------------------------------------------------------------------
// 4. Screen Transition Manager
// Hides all screens and displays only the target screen
// --------------------------------------------------------------------------
function showScreen(screenToShow) {
    const screens = [startScreen, quizScreen, resultsScreen, reviewScreen, highscoresScreen];
    screens.forEach(s => {
        if (s) s.style.display = 'none';
    });
    if (screenToShow) {
        screenToShow.style.display = 'flex';
        // Scroll to top of window for seamless screen change on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --------------------------------------------------------------------------
// 5. Category Selection & Setup
// --------------------------------------------------------------------------

// Set up difficulty buttons click listeners
function initDifficultySelector() {
    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');
            currentDifficulty = btn.getAttribute('data-difficulty') || 'medium';
        });
    });
}

// Set up category cards click listeners
function initCategoryCards() {
    const categoryButtons = document.querySelectorAll('.start-category-btn, .category-card');
    categoryButtons.forEach(el => {
        el.addEventListener('click', (event) => {
            // Find category id from target or closest card
            const catCard = event.target.closest('[data-category]');
            if (!catCard) return;
            const categoryId = catCard.getAttribute('data-category');
            selectCategoryAndStart(categoryId);
        });
    });
}

// Start quiz with chosen category
function selectCategoryAndStart(categoryId) {
    activeCategoryId = categoryId;

    // Resolve category display name
    const foundCategory = (typeof quizCategories !== 'undefined')
        ? quizCategories.find(c => c.id === categoryId)
        : null;

    activeCategoryName = foundCategory ? foundCategory.name : "Quiz";

    // Filter questions strictly for this category
    if (typeof getQuestionsByCategory === 'function') {
        currentCategoryQuestions = getQuestionsByCategory(categoryId);
    } else if (Array.isArray(quizQuestions)) {
        currentCategoryQuestions = quizQuestions.filter(q => q.category === categoryId);
    } else {
        currentCategoryQuestions = [];
    }

    // Verify minimum 10 questions are available
    if (currentCategoryQuestions.length === 0) {
        console.error("No questions found for category:", categoryId);
        return;
    }

    // Initialize gameplay state
    startQuiz();
}

// --------------------------------------------------------------------------
// 6. Quiz Gameplay Core Loop
// --------------------------------------------------------------------------

// Resets gameplay state and loads first question
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    usersAnswers = [];
    isAnswerLocked = false;
    clearInterval(timerInterval);

    // Update header badges
    const catIcon = activeCategoryId === 'kenya-trivia' ? '🇰🇪' : (activeCategoryId === 'technology' ? '💻' : '🔬');
    if (activeCategoryBadge) {
        activeCategoryBadge.textContent = `${catIcon} ${activeCategoryName}`;
    }
    if (runningScoreBadge) {
        runningScoreBadge.textContent = `Score: 0 / ${currentCategoryQuestions.length}`;
    }
    if (difficultyIndicator) {
        difficultyIndicator.textContent = DIFFICULTY_SETTINGS[currentDifficulty].label;
    }

    // Show quiz screen
    showScreen(quizScreen);

    // Load first question
    loadQuestion();
}

// Render the current question to the DOM
function loadQuestion() {
    // Guard: Check if questions finished
    if (currentQuestionIndex >= currentCategoryQuestions.length) {
        finishQuiz();
        return;
    }

    const currentQ = currentCategoryQuestions[currentQuestionIndex];
    isAnswerLocked = false;

    // Clear feedback toast
    if (feedbackToast) {
        feedbackToast.textContent = '';
        feedbackToast.className = 'feedback-toast';
    }

    // 1. Update Question Text with slide-in animation
    if (questionText) {
        questionText.textContent = currentQ.question;
        questionText.classList.remove('slide-in-right');
        // Force reflow to re-trigger slide-in animation
        void questionText.offsetWidth;
        questionText.classList.add('slide-in-right');
    }

    // 2. Clear previous answer buttons and create 4 options
    if (answerButtonsContainer) {
        answerButtonsContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        const optionsList = currentQ.answers || currentQ.options || [];

        optionsList.forEach((optionText, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn fade-in-up';
            btn.setAttribute('data-index', index);
            btn.style.animationDelay = `${index * 0.06}s`; // Sequential fade-in

            // Letter chip (A, B, C, D)
            const letterSpan = document.createElement('span');
            letterSpan.className = 'btn-letter';
            letterSpan.textContent = letters[index] || `${index + 1}`;

            // Text span
            const textSpan = document.createElement('span');
            textSpan.className = 'btn-text';
            textSpan.textContent = optionText;

            btn.appendChild(letterSpan);
            btn.appendChild(textSpan);

            // Add click listener
            btn.addEventListener('click', () => handleAnswerSelection(index));
            answerButtonsContainer.appendChild(btn);
        });
    }

    // 3. Update Progress Bar
    const progressPercent = ((currentQuestionIndex) / currentCategoryQuestions.length) * 100;
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }

    // 4. Update Question Counter & Score
    if (questionCounter) {
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentCategoryQuestions.length}`;
    }
    if (runningScoreBadge) {
        runningScoreBadge.textContent = `Score: ${score} / ${currentCategoryQuestions.length}`;
    }

    // 5. Start Countdown Timer
    startTimer();
}

// --------------------------------------------------------------------------
// 7. Answer Selection Handling
// Highlights chosen answer, shows correct answer, pauses 2 seconds
// --------------------------------------------------------------------------
function handleAnswerSelection(selectedIndex) {
    // Guard against rapid duplicate clicks
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    // Stop active timer immediately
    clearInterval(timerInterval);

    const currentQ = currentCategoryQuestions[currentQuestionIndex];
    const buttons = answerButtonsContainer.querySelectorAll('button');
    const isCorrect = selectedIndex === currentQ.correct;

    // Disable all answer buttons to lock input
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    // Highlight selected button and reveal correct button in green
    buttons.forEach(btn => {
        const btnIndex = parseInt(btn.getAttribute('data-index'), 10);
        if (btnIndex === currentQ.correct) {
            btn.classList.add('correct');
        } else if (btnIndex === selectedIndex) {
            btn.classList.add('wrong');
        }
    });

    // Provide audio feedback and update running score
    if (isCorrect) {
        score++;
        SoundManager.playCorrect();
        if (runningScoreBadge) {
            runningScoreBadge.textContent = `Score: ${score} / ${currentCategoryQuestions.length}`;
            runningScoreBadge.classList.add('pulse');
            setTimeout(() => runningScoreBadge.classList.remove('pulse'), 400);
        }
        if (feedbackToast) {
            feedbackToast.textContent = '✓ Correct! Excellent work.';
            feedbackToast.className = 'feedback-toast correct';
        }
    } else {
        SoundManager.playWrong();
        if (feedbackToast) {
            feedbackToast.textContent = '✕ Incorrect! Keep going.';
            feedbackToast.className = 'feedback-toast wrong';
        }
    }

    // Record complete question data for Review Mode
    const optionsList = currentQ.answers || currentQ.options || [];
    usersAnswers.push({
        question: currentQ.question,
        options: [...optionsList],
        selectedIndex: selectedIndex,
        correctIndex: currentQ.correct,
        isCorrect: isCorrect,
        timedOut: false
    });

    // REQUIREMENT: 2-second pause after answering before advancing to next question
    setTimeout(advanceToNextQuestion, 2000);
}

// --------------------------------------------------------------------------
// 8. Countdown Timer & Timeout Logic
// --------------------------------------------------------------------------
function startTimer() {
    clearInterval(timerInterval);

    // Set time limit based on selected difficulty
    const diffConfig = DIFFICULTY_SETTINGS[currentDifficulty] || DIFFICULTY_SETTINGS.medium;
    timeLeft = diffConfig.timeLimit;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        // Audio tick warning during final 5 seconds
        if (timeLeft <= 5 && timeLeft > 0) {
            SoundManager.playTick();
        }

        // Timer reaches zero
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    if (!timerDisplay) return;
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;

    if (timeLeft <= 5) {
        timerDisplay.classList.add('time-warning');
    } else {
        timerDisplay.classList.remove('time-warning');
    }
}

// Auto-advance when countdown timer reaches 0s
function handleTimeout() {
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    SoundManager.playWrong();

    const currentQ = currentCategoryQuestions[currentQuestionIndex];
    const buttons = answerButtonsContainer.querySelectorAll('button');

    // Disable all buttons and highlight the correct answer in green
    buttons.forEach(btn => {
        btn.disabled = true;
        const btnIndex = parseInt(btn.getAttribute('data-index'), 10);
        if (btnIndex === currentQ.correct) {
            btn.classList.add('correct');
        }
    });

    if (feedbackToast) {
        feedbackToast.textContent = '⏱️ Time expired!';
        feedbackToast.className = 'feedback-toast timeout';
    }

    // Record timeout in user's answer history
    const optionsList = currentQ.answers || currentQ.options || [];
    usersAnswers.push({
        question: currentQ.question,
        options: [...optionsList],
        selectedIndex: null,
        correctIndex: currentQ.correct,
        isCorrect: false,
        timedOut: true
    });

    // REQUIREMENT: 2-second pause before advancing
    setTimeout(advanceToNextQuestion, 2000);
}

// Advances index and loads next question or finishes quiz
function advanceToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentCategoryQuestions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// --------------------------------------------------------------------------
// 9. Results Screen & Grading Logic
// Grade brackets: A (80-100%), B (60-79%), C (40-59%), F (below 40%)
// --------------------------------------------------------------------------
function finishQuiz() {
    clearInterval(timerInterval);

    // Set progress bar to 100% on completion
    if (progressBar) {
        progressBar.style.width = '100%';
    }

    showScreen(resultsScreen);

    const totalQuestions = currentCategoryQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Calculate Breakdown: correct, incorrect, timed out
    let correctCount = 0;
    let incorrectCount = 0;
    let timeoutCount = 0;

    usersAnswers.forEach(ans => {
        if (ans.isCorrect) {
            correctCount++;
        } else if (ans.timedOut) {
            timeoutCount++;
        } else {
            incorrectCount++;
        }
    });

    // Determine Letter Grade and Motivational Feedback
    let grade = 'F';
    let gradeClass = 'grade-F';
    let feedback = "Don't be discouraged! Review the correct answers and give it another shot.";

    if (percentage >= 80) {
        grade = 'A';
        gradeClass = 'grade-A';
        feedback = "Exceptional performance! You have mastered this category!";
    } else if (percentage >= 60) {
        grade = 'B';
        gradeClass = 'grade-B';
        feedback = "Great job! A very solid performance with room for perfection.";
    } else if (percentage >= 40) {
        grade = 'C';
        gradeClass = 'grade-C';
        feedback = "Good attempt! Brush up on a few questions and you'll easily reach an A.";
    } else {
        grade = 'F';
        gradeClass = 'grade-F';
        feedback = "Challenging quiz! Take a look at the answers and try again.";
    }

    // Populate Results Screen DOM
    if (letterGradeDisp) {
        letterGradeDisp.textContent = grade;
        letterGradeDisp.className = `letter-grade ${gradeClass}`;
    }
    if (finalScoreDisp) {
        finalScoreDisp.textContent = `You scored ${score}/${totalQuestions}!`;
    }
    if (scorePercentageDisp) {
        scorePercentageDisp.textContent = `${percentage}% Accuracy • ${activeCategoryName}`;
    }
    if (messageDisp) {
        messageDisp.textContent = feedback;
    }

    // Populate detailed stat counters
    if (statCorrectCount) statCorrectCount.textContent = correctCount;
    if (statIncorrectCount) statIncorrectCount.textContent = incorrectCount;
    if (statTimeoutCount) statTimeoutCount.textContent = timeoutCount;

    // Reset high score save form
    if (playerNameInput) {
        playerNameInput.value = '';
        playerNameInput.disabled = false;
    }
    if (saveScoreBtn) {
        saveScoreBtn.disabled = false;
        saveScoreBtn.textContent = 'Save Score';
    }
    if (saveScoreMsg) {
        saveScoreMsg.textContent = '';
        saveScoreMsg.className = 'save-score-msg';
    }

    // Render mini leaderboard preview for this category
    renderCategoryMiniLeaderboard(activeCategoryName);

    // Trigger celebration fanfare and confetti for high achievements (Grade A or >= 80%)
    if (percentage >= 80) {
        SoundManager.playFanfare();
        triggerConfettiCelebration();
    }

    // Automatically update last score in home screen badge
    saveLastScoreRecord(score, totalQuestions, percentage, activeCategoryName);
}

// --------------------------------------------------------------------------
// 10. Answer Review Screen
// Detailed breakdown of each question, chosen answer, and solution
// --------------------------------------------------------------------------
function renderAnswerReview() {
    showScreen(reviewScreen);

    if (reviewSubtitle) {
        reviewSubtitle.textContent = `${activeCategoryName} • Final Score: ${score}/${currentCategoryQuestions.length}`;
    }

    if (!cardContainer) return;
    cardContainer.innerHTML = '';

    usersAnswers.forEach((ans, index) => {
        const card = document.createElement('div');
        card.className = 'review-card';

        // Header: Question number, title, and outcome badge
        const header = document.createElement('div');
        header.className = 'review-card-header';

        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${ans.question}`;

        const badge = document.createElement('span');
        badge.className = 'review-badge';

        if (ans.isCorrect) {
            badge.classList.add('correct');
            badge.textContent = 'Correct';
        } else if (ans.timedOut) {
            badge.classList.add('timeout');
            badge.textContent = 'Timed Out';
        } else {
            badge.classList.add('wrong');
            badge.textContent = 'Incorrect';
        }

        header.appendChild(title);
        header.appendChild(badge);
        card.appendChild(header);

        // Answers row: user's answer and solution
        const answerRow = document.createElement('div');
        answerRow.className = 'review-answer-row';

        const userAnsEl = document.createElement('div');
        userAnsEl.className = 'user-answer';

        if (ans.timedOut) {
            userAnsEl.classList.add('wrong');
            userAnsEl.textContent = '⏱️ Your Answer: No answer selected (Time Expired)';
        } else if (ans.isCorrect) {
            userAnsEl.classList.add('correct');
            userAnsEl.textContent = `✓ Your Answer: ${ans.options[ans.selectedIndex]}`;
        } else {
            userAnsEl.classList.add('wrong');
            userAnsEl.textContent = `✕ Your Answer: ${ans.options[ans.selectedIndex]}`;
        }
        answerRow.appendChild(userAnsEl);

        // If incorrect or timed out, display the correct answer
        if (!ans.isCorrect) {
            const correctAnsEl = document.createElement('div');
            correctAnsEl.className = 'correct-answer';
            correctAnsEl.textContent = `✓ Correct Answer: ${ans.options[ans.correctIndex]}`;
            answerRow.appendChild(correctAnsEl);
        }

        card.appendChild(answerRow);
        cardContainer.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// 11. High Scores & Leaderboard System (localStorage)
// Stored key: 'quizMasterHighScores'
// Required entry schema: { name, score, total, category, date }
// --------------------------------------------------------------------------
const STORAGE_KEY_HIGHSCORES = 'quizMasterHighScores';
const STORAGE_KEY_LAST_SCORE = 'quizMasterLastScore';

// Get high scores array from localStorage (always returns array)
function getHighScores() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_HIGHSCORES);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn("Error reading high scores from localStorage:", e);
        return [];
    }
}

// Save high scores array to localStorage
function saveHighScores(scoresArray) {
    try {
        localStorage.setItem(STORAGE_KEY_HIGHSCORES, JSON.stringify(scoresArray));
    } catch (e) {
        console.warn("Error writing high scores to localStorage:", e);
    }
}

// Add a new entry to the leaderboard (keeps top 10 sorted descending)
function addHighScoreEntry(playerName, userScore, totalQuestions, categoryName) {
    const scores = getHighScores();

    // Format current date in YYYY-MM-DD
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const newEntry = {
        name: playerName.trim() || "Anonymous",
        score: userScore,
        total: totalQuestions,
        category: categoryName,
        date: dateStr
    };

    scores.push(newEntry);

    // Sort by score descending (highest first)
    scores.sort((a, b) => b.score - a.score);

    // Keep only top 10
    const top10 = scores.slice(0, 10);
    saveHighScores(top10);

    return top10;
}

// Setup High Score Submission Form on Results Screen
function initHighScoreForm() {
    if (!saveScoreForm) return;

    saveScoreForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = playerNameInput.value.trim();
        if (!name) {
            if (saveScoreMsg) {
                saveScoreMsg.textContent = 'Please enter your name.';
                saveScoreMsg.className = 'save-score-msg error';
            }
            return;
        }

        // Add to persistent leaderboard
        addHighScoreEntry(name, score, currentCategoryQuestions.length, activeCategoryName);

        // Update form state
        playerNameInput.disabled = true;
        saveScoreBtn.disabled = true;
        saveScoreBtn.textContent = 'Saved!';
        if (saveScoreMsg) {
            saveScoreMsg.textContent = `✓ Score saved to leaderboard, ${name}!`;
            saveScoreMsg.className = 'save-score-msg success';
        }

        // Refresh mini-leaderboard on results screen
        renderCategoryMiniLeaderboard(activeCategoryName);

        // Sound chime
        SoundManager.playCorrect();
    });
}

// Render Top 5 scores for this category on Results Screen
function renderCategoryMiniLeaderboard(categoryName) {
    if (!resultsMiniScores) return;
    resultsMiniScores.innerHTML = '';

    const allScores = getHighScores();
    const filtered = allScores.filter(s => s.category.toLowerCase() === categoryName.toLowerCase());

    if (filtered.length === 0) {
        resultsMiniScores.innerHTML = '<div class="mini-score-item"><span>No scores saved yet for this category.</span></div>';
        return;
    }

    filtered.slice(0, 5).forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'mini-score-item';

        const playerSpan = document.createElement('span');
        playerSpan.className = 'mini-score-player';
        const rankIcon = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `#${index + 1}`));
        playerSpan.textContent = `${rankIcon} ${item.name}`;

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'mini-score-val';
        scoreSpan.textContent = `${item.score}/${item.total} (${item.date})`;

        row.appendChild(playerSpan);
        row.appendChild(scoreSpan);
        resultsMiniScores.appendChild(row);
    });
}

// Render Full Leaderboard Modal / Screen with Category Filtering
function renderFullLeaderboard(filterCategory = 'all') {
    if (!highscoresTableBody) return;
    highscoresTableBody.innerHTML = '';

    const allScores = getHighScores();
    let displayList = allScores;

    if (filterCategory !== 'all') {
        const catObj = (typeof quizCategories !== 'undefined') ? quizCategories.find(c => c.id === filterCategory) : null;
        const targetName = catObj ? catObj.name.toLowerCase() : filterCategory.toLowerCase();
        displayList = allScores.filter(s => s.category.toLowerCase().includes(targetName));
    }

    if (displayList.length === 0) {
        if (emptyScoresState) emptyScoresState.style.display = 'block';
        return;
    }

    if (emptyScoresState) emptyScoresState.style.display = 'none';

    displayList.forEach((entry, index) => {
        const tr = document.createElement('tr');

        // Rank badge
        const tdRank = document.createElement('td');
        tdRank.className = `rank-col ${index < 3 ? `rank-${index + 1}` : ''}`;
        tdRank.textContent = index === 0 ? '🥇 1st' : (index === 1 ? '🥈 2nd' : (index === 2 ? '🥉 3rd' : `#${index + 1}`));

        // Player Name
        const tdPlayer = document.createElement('td');
        tdPlayer.className = 'player-col';
        tdPlayer.textContent = entry.name;

        // Category
        const tdCat = document.createElement('td');
        tdCat.textContent = entry.category;

        // Score
        const tdScore = document.createElement('td');
        tdScore.className = 'score-col';
        tdScore.textContent = `${entry.score}/${entry.total}`;

        // Date
        const tdDate = document.createElement('td');
        tdDate.className = 'date-col';
        tdDate.textContent = entry.date;

        tr.appendChild(tdRank);
        tr.appendChild(tdPlayer);
        tr.appendChild(tdCat);
        tr.appendChild(tdScore);
        tr.appendChild(tdDate);

        highscoresTableBody.appendChild(tr);
    });
}

// Setup Leaderboard filter tab buttons
function initLeaderboardTabs() {
    filterTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter') || 'all';
            renderFullLeaderboard(filter);
        });
    });

    if (clearHighscoresBtn) {
        clearHighscoresBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all high scores from this browser?")) {
                localStorage.removeItem(STORAGE_KEY_HIGHSCORES);
                renderFullLeaderboard('all');
            }
        });
    }
}

// Save recent score record for Home Screen display
function saveLastScoreRecord(lastScore, total, percentage, categoryName) {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const record = {
            score: lastScore,
            total: total,
            percentage: percentage,
            category: categoryName,
            date: dateStr
        };
        localStorage.setItem(STORAGE_KEY_LAST_SCORE, JSON.stringify(record));
        displayPreviousScore();
    } catch (e) {
        console.warn("Could not save last score:", e);
    }
}

// Display previous score badge on Home Screen if present
function displayPreviousScore() {
    if (!previousScoreDisp) return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY_LAST_SCORE);
        if (!raw) {
            previousScoreDisp.textContent = '';
            previousScoreDisp.style.display = 'none';
            return;
        }
        const data = JSON.parse(raw);
        if (data && typeof data.score !== 'undefined') {
            previousScoreDisp.textContent = `🎯 Recent Run: ${data.score}/${data.total} (${data.percentage}%) in ${data.category}`;
            previousScoreDisp.style.display = 'inline-flex';
        }
    } catch (e) {
        console.warn("Could not parse previous score:", e);
        previousScoreDisp.style.display = 'none';
    }
}

// --------------------------------------------------------------------------
// 12. Confetti Particle Animation (HTML5 Canvas)
// Lightweight particle physics burst without external library bloat
// --------------------------------------------------------------------------
function triggerConfettiCelebration() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#06b6d4', '#10b981', '#fbbf24', '#f43f5e'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 18,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10,
            alpha: 1,
            gravity: 0.35
        });
    }

    let frameId;
    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let activeCount = 0;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.vRot;
            p.alpha -= 0.01;

            if (p.alpha > 0) {
                activeCount++;
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (activeCount > 0) {
            frameId = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            cancelAnimationFrame(frameId);
        }
    }

    animate();
}

// --------------------------------------------------------------------------
// 13. Event Listeners & Navigation Routing
// --------------------------------------------------------------------------
function initEventListeners() {
    // Sound effects toggle
    initSoundToggle();

    // Difficulty selector buttons
    initDifficultySelector();

    // Category cards click handlers
    initCategoryCards();

    // High score save form
    initHighScoreForm();

    // High scores leaderboard tabs
    initLeaderboardTabs();

    // Topbar High Scores button
    if (topbarHighscoresBtn) {
        topbarHighscoresBtn.addEventListener('click', () => {
            // Track which screen opened the leaderboard for smart back button navigation
            previousScreenBeforeLeaderboard = startScreen.style.display !== 'none' ? 'start-screen' : 'results-screen';
            renderFullLeaderboard('all');
            showScreen(highscoresScreen);
        });
    }

    // Results screen navigation buttons
    if (reviewBtn) {
        reviewBtn.addEventListener('click', renderAnswerReview);
    }

    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            selectCategoryAndStart(activeCategoryId);
        });
    }

    if (chooseCategoryBtn) {
        chooseCategoryBtn.addEventListener('click', () => {
            showScreen(startScreen);
        });
    }

    if (viewAllHighscoresBtn) {
        viewAllHighscoresBtn.addEventListener('click', () => {
            previousScreenBeforeLeaderboard = 'results-screen';
            renderFullLeaderboard(activeCategoryId);
            showScreen(highscoresScreen);
        });
    }

    // Review screen back buttons
    if (resultsBtn) {
        resultsBtn.addEventListener('click', () => {
            showScreen(resultsScreen);
        });
    }

    if (reviewHomeBtn) {
        reviewHomeBtn.addEventListener('click', () => {
            showScreen(startScreen);
        });
    }

    // Close High Scores button
    if (closeHighscoresBtn) {
        closeHighscoresBtn.addEventListener('click', () => {
            if (previousScreenBeforeLeaderboard === 'results-screen') {
                showScreen(resultsScreen);
            } else {
                showScreen(startScreen);
            }
        });
    }

    // Window resize handler for confetti canvas
    window.addEventListener('resize', () => {
        if (confettiCanvas) {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
    });
}

// --------------------------------------------------------------------------
// 14. Initialization on Page Load
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    displayPreviousScore();
    console.log("QuizMaster initialized. 30 questions loaded across 3 categories.");
});