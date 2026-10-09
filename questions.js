// ==========================================================================
// Quiz Master - Questions Dataset
// Contains 30 curated questions across 3 distinct categories (10 questions each)
// Data model follows the required specification:
// { question: string, answers: string[], correct: number, category: string, difficulty: string }
// ==========================================================================

// Category metadata definitions used for rendering category cards and headers
const quizCategories = [
  {
    id: "kenya-trivia",
    name: "Kenya Trivia",
    icon: "🇰🇪",
    description: "Explore Kenya's rich history, iconic landmarks, athletics, and vibrant culture.",
    questionCount: 10
  },
  {
    id: "technology",
    name: "Technology",
    icon: "💻",
    description: "Test your skills in web development, programming languages, and modern tech.",
    questionCount: 10
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    description: "Journey through physics, chemistry, biology, and the mysteries of the cosmos.",
    questionCount: 10
  }
];

// Full questions database (10 questions per category = 30 total)
const quizQuestions = [
  // --------------------------------------------------------------------------
  // Category 1: Kenya Trivia (10 Questions)
  // --------------------------------------------------------------------------
  {
    question: "What is the highest mountain in Kenya?",
    answers: ["Mount Kilimanjaro", "Mount Kenya", "Mount Elgon", "Mount Longonot"],
    correct: 1, // Mount Kenya
    category: "kenya-trivia",
    difficulty: "easy"
  },
  {
    question: "Which lake borders Kenya, Uganda, and Tanzania?",
    answers: ["Lake Turkana", "Lake Naivasha", "Lake Victoria", "Lake Baringo"],
    correct: 2, // Lake Victoria
    category: "kenya-trivia",
    difficulty: "easy"
  },
  {
    question: "In which year did Kenya gain independence from Britain?",
    answers: ["1960", "1963", "1964", "1970"],
    correct: 1, // 1963
    category: "kenya-trivia",
    difficulty: "easy"
  },
  {
    question: "What is the official currency of Kenya?",
    answers: ["Kenyan Dollar", "Kenyan Pound", "Kenyan Shilling", "Kenyan Franc"],
    correct: 2, // Kenyan Shilling
    category: "kenya-trivia",
    difficulty: "easy"
  },
  {
    question: "Which Kenyan runner holds the world record for the fastest official marathon?",
    answers: ["Eliud Kipchoge", "Kelvin Kiptum", "Paul Tergat", "David Rudisha"],
    correct: 1, // Kelvin Kiptum (2:00:35 at Chicago 2023)
    category: "kenya-trivia",
    difficulty: "medium"
  },
  {
    question: "What is the name of Kenya's national legislative building located in Nairobi?",
    answers: ["State House", "Parliament House", "Supreme Court", "City Hall"],
    correct: 1, // Parliament House
    category: "kenya-trivia",
    difficulty: "medium"
  },
  {
    question: "Which national park is located closest to Nairobi's central business district?",
    answers: ["Nairobi National Park", "Amboseli National Park", "Tsavo East", "Hell's Gate"],
    correct: 0, // Nairobi National Park (only wildlife park within a capital city)
    category: "kenya-trivia",
    difficulty: "easy"
  },
  {
    question: "What is the literal meaning of Kenya's national motto 'Harambee'?",
    answers: ["Peace and Liberty", "Pulling together", "Forward ever", "Unity in diversity"],
    correct: 1, // Pulling together
    category: "kenya-trivia",
    difficulty: "medium"
  },
  {
    question: "Which Kenyan county is famously celebrated as the 'Home of Champions'?",
    answers: ["Uasin Gishu County", "Nandi County", "Elgeyo-Marakwet County", "Nakuru County"],
    correct: 1, // Nandi County
    category: "kenya-trivia",
    difficulty: "hard"
  },
  {
    question: "What is M-Pesa?",
    answers: [
      "A digital crypto token",
      "A mobile money transfer and financing service by Safaricom",
      "An e-commerce delivery network",
      "A government tax filing application"
    ],
    correct: 1, // A mobile money transfer service by Safaricom
    category: "kenya-trivia",
    difficulty: "easy"
  },

  // --------------------------------------------------------------------------
  // Category 2: Technology (10 Questions)
  // --------------------------------------------------------------------------
  {
    question: "What does the acronym HTML stand for in web development?",
    answers: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Management Language"
    ],
    correct: 0, // Hyper Text Markup Language
    category: "technology",
    difficulty: "easy"
  },
  {
    question: "Which programming language is predominantly used to create dynamic interactivity on websites?",
    answers: ["Python", "JavaScript", "C++", "PHP"],
    correct: 1, // JavaScript
    category: "technology",
    difficulty: "easy"
  },
  {
    question: "What does CSS stand for?",
    answers: [
      "Computer Style Sheets",
      "Creative Style System",
      "Cascading Style Sheets",
      "Color and Syntax Standard"
    ],
    correct: 2, // Cascading Style Sheets
    category: "technology",
    difficulty: "easy"
  },
  {
    question: "Which network protocol is used to encrypt communication between a web browser and a website?",
    answers: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correct: 2, // HTTPS
    category: "technology",
    difficulty: "easy"
  },
  {
    question: "Which browser Web Storage API persists key-value data across page reloads and browser restarts?",
    answers: [
      "sessionStorage",
      "localStorage",
      "memoryCache",
      "cookieJar"
    ],
    correct: 1, // localStorage
    category: "technology",
    difficulty: "medium"
  },
  {
    question: "In Git version control, which command creates a new branch and immediately switches to it?",
    answers: ["git branch -new", "git checkout -b", "git merge --create", "git init --branch"],
    correct: 1, // git checkout -b
    category: "technology",
    difficulty: "medium"
  },
  {
    question: "What data structure operates under the First-In, First-Out (FIFO) principle?",
    answers: ["Stack", "Queue", "Tree", "Hash Map"],
    correct: 1, // Queue
    category: "technology",
    difficulty: "medium"
  },
  {
    question: "Which JavaScript array method adds one or more elements to the end of an array and returns its new length?",
    answers: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0, // push()
    category: "technology",
    difficulty: "medium"
  },
  {
    question: "What does API stand for in software engineering?",
    answers: [
      "Automated Programming Instruction",
      "Application Programming Interface",
      "Advanced Process Integration",
      "App Protocol Identifier"
    ],
    correct: 1, // Application Programming Interface
    category: "technology",
    difficulty: "easy"
  },
  {
    question: "Which company originally engineered and open-sourced the popular React JavaScript library?",
    answers: ["Google", "Meta (Facebook)", "Microsoft", "Amazon"],
    correct: 1, // Meta (Facebook)
    category: "technology",
    difficulty: "hard"
  },

  // --------------------------------------------------------------------------
  // Category 3: Science (10 Questions)
  // --------------------------------------------------------------------------
  {
    question: "What is the chemical symbol for the element Gold on the periodic table?",
    answers: ["Ag", "Au", "Fe", "Gd"],
    correct: 1, // Au (from Latin Aurum)
    category: "science",
    difficulty: "easy"
  },
  {
    question: "Which planet in our solar system is known as the 'Red Planet' due to iron oxide on its surface?",
    answers: ["Venus", "Mars", "Jupiter", "Mercury"],
    correct: 1, // Mars
    category: "science",
    difficulty: "easy"
  },
  {
    question: "Which cellular organelle is often referred to as the 'powerhouse of the cell'?",
    answers: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"],
    correct: 2, // Mitochondria
    category: "science",
    difficulty: "easy"
  },
  {
    question: "What is the approximate speed of light when traveling through a vacuum?",
    answers: ["150,000 km/s", "300,000 km/s", "500,000 km/s", "1,000,000 km/s"],
    correct: 1, // ~300,000 km/s (299,792 km/s)
    category: "science",
    difficulty: "medium"
  },
  {
    question: "Which gas do green plants primarily absorb from the air to perform photosynthesis?",
    answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Methane"],
    correct: 1, // Carbon Dioxide
    category: "science",
    difficulty: "easy"
  },
  {
    question: "What is the hardest naturally occurring mineral on Earth?",
    answers: ["Quartz", "Topaz", "Diamond", "Corundum"],
    correct: 2, // Diamond (10 on Mohs scale)
    category: "science",
    difficulty: "easy"
  },
  {
    question: "How many bones are typically found in the adult human skeleton?",
    answers: ["186", "206", "226", "246"],
    correct: 1, // 206
    category: "science",
    difficulty: "medium"
  },
  {
    question: "What is the most abundant gas in Earth's atmosphere by volume?",
    answers: ["Oxygen (~21%)", "Nitrogen (~78%)", "Carbon Dioxide (~0.04%)", "Argon (~0.93%)"],
    correct: 1, // Nitrogen (~78%)
    category: "science",
    difficulty: "medium"
  },
  {
    question: "What is the neutral pH value of pure water at 25 degrees Celsius?",
    answers: ["5", "7", "9", "12"],
    correct: 1, // 7
    category: "science",
    difficulty: "easy"
  },
  {
    question: "Which fundamental physical force governs the motion of planets, stars, and galaxies across space?",
    answers: ["Electromagnetism", "Strong Nuclear Force", "Gravity", "Weak Nuclear Force"],
    correct: 2, // Gravity
    category: "science",
    difficulty: "hard"
  }
];

// Provide helper utility to retrieve questions by category ID
function getQuestionsByCategory(categoryId) {
  return quizQuestions.filter(q => q.category === categoryId);
}