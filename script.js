// Global variables for app state
let currentPage = 'starter';
let breathingInterval = null;
let isBreathing = false;
let currentAudioPlaying = null;
let currentBreathingPattern = 'basic';
let currentAffirmation = '';
let isUserLoggedIn = false;
let moodStreak = 0;
let selectedRating = 0;

// Affirmations array
const affirmations = [
    "You are enough.",
    "This moment matters.",
    "You have the strength to overcome any challenge.",
    "Your feelings are valid and important.",
    "You are worthy of love and happiness.",
    "Every breath you take is a gift.",
    "You are exactly where you need to be.",
    "Your journey is unique and beautiful.",
    "You have the power to create positive change.",
    "You are resilient and capable.",
    "Your presence makes a difference in the world.",
    "You deserve peace and tranquility.",
    "You are growing stronger every day.",
    "Your thoughts and feelings matter.",
    "You are surrounded by infinite possibilities.",
    "You have everything within you to succeed.",
    "You are a work of art in progress.",
    "Your heart knows the way forward.",
    "You are worthy of all good things.",
    "You radiate positive energy and light."
];

// Breathing patterns configuration
const breathingPatterns = {
    basic: {
        name: 'Basic Breathing',
        description: 'Inhale for 4 seconds, hold for 2, exhale for 4, hold for 2',
        inhale: 4,
        hold1: 2,
        exhale: 4,
        hold2: 2
    },
    box: {
        name: 'Box Breathing',
        description: 'Inhale, hold, exhale, and hold - each for 4 seconds',
        inhale: 4,
        hold1: 4,
        exhale: 4,
        hold2: 4
    },
    calm: {
        name: '4-7-8 Calming',
        description: 'Inhale for 4 seconds, hold for 7, exhale for 8',
        inhale: 4,
        hold1: 7,
        exhale: 8,
        hold2: 1
    }
};

// Wellness tips content
const wellnessTips = {
    stress: [
        {
            title: "Deep Breathing Technique",
            content: "Practice the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and reduces stress hormones.",
            highlight: "Try this technique whenever you feel overwhelmed - it works in just 60 seconds!"
        },
        {
            title: "Progressive Muscle Relaxation",
            content: "Tense and release different muscle groups starting from your toes up to your head. Hold tension for 5 seconds, then release and notice the contrast.",
            highlight: "This technique helps identify where you hold stress in your body."
        },
        {
            title: "Mindful Breaks",
            content: "Take 5-minute breaks every hour. Step away from work, stretch, or simply observe your surroundings without judgment.",
            highlight: "Short breaks actually improve productivity and reduce stress accumulation."
        }
    ],
    sleep: [
        {
            title: "Sleep Hygiene Basics",
            content: "Keep your bedroom cool (60-67°F), dark, and quiet. Use blackout curtains and consider a white noise machine or earplugs.",
            highlight: "Your bedroom environment significantly impacts sleep quality."
        },
        {
            title: "Digital Sunset",
            content: "Stop using screens 1-2 hours before bedtime. Blue light suppresses melatonin production, making it harder to fall asleep.",
            highlight: "Try reading a book or practicing gentle stretches instead."
        },
        {
            title: "Consistent Sleep Schedule",
            content: "Go to bed and wake up at the same time every day, even on weekends. This strengthens your circadian rhythm.",
            highlight: "Consistency is more important than the exact number of hours slept."
        }
    ],
    mindfulness: [
        {
            title: "Present Moment Awareness",
            content: "Practice the 5-4-3-2-1 grounding technique: Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
            highlight: "This technique quickly brings you back to the present moment."
        },
        {
            title: "Mindful Walking",
            content: "Take a 10-minute walk focusing only on the sensation of your feet touching the ground and your breath.",
            highlight: "Walking meditation combines physical activity with mindfulness practice."
        },
        {
            title: "Gratitude Practice",
            content: "Write down three things you're grateful for each day. Focus on specific details rather than general statements.",
            highlight: "Gratitude practice rewires your brain to notice positive experiences."
        }
    ],
    anxiety: [
        {
            title: "Challenge Anxious Thoughts",
            content: "Ask yourself: Is this thought realistic? What would I tell a friend in this situation? What's the worst that could actually happen?",
            highlight: "Questioning anxious thoughts reduces their power over you."
        },
        {
            title: "Grounding Through Senses",
            content: "When anxiety rises, engage your senses: Hold an ice cube, smell essential oils, or listen to calming music.",
            highlight: "Sensory grounding pulls you out of anxious thoughts and into your body."
        },
        {
            title: "Accept Uncertainty",
            content: "Practice saying 'I don't know what will happen, and that's okay.' Anxiety often stems from trying to control the uncontrollable.",
            highlight: "Acceptance of uncertainty reduces the fuel that feeds anxiety."
        }
    ]
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    initializeApp();
    setupMobileNavigation();
    setupLoginForm();
    loadMoodHistory();
    loadJournalEntries();
    loadProfileData();
    displayRandomAffirmation();
    loadFavoriteAffirmations();
    showWellnessCategory('stress');
});

/**
 * Check if user is logged in
 */
function checkUserLogin() {
    const userData = localStorage.getItem('minibreak_user');
    if (userData) {
        isUserLoggedIn = true;
        currentPage = 'home';
    } else {
        isUserLoggedIn = false;
        currentPage = 'starter';
    }
}

/**
 * Set up login form submission
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

/**
 * Handle user login/registration
 */
function handleLogin() {
    const name = document.getElementById('user-name').value;
    const dob = document.getElementById('user-dob').value;
    const occupation = document.getElementById('user-occupation').value;
    const email = document.getElementById('user-email').value;
    const wellnessGoal = document.getElementById('user-wellness-goal').value;
    
    // Calculate age from date of birth
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    // Save user data
    const userData = {
        name,
        dob,
        age,
        occupation,
        email,
        wellnessGoal,
        joinDate: new Date().toISOString(),
        activeDays: 1
    };
    
    localStorage.setItem('minibreak_user', JSON.stringify(userData));
    isUserLoggedIn = true;
    
    // Show success message and redirect to home
    alert(`Welcome to MiniBreak, ${name}! Your wellness journey begins now.`);
    showPage('home');
}

/**
 * Initialize the application
 */
function initializeApp() {
    // Show appropriate page based on login status
    if (isUserLoggedIn) {
        showPage('home');
    } else {
        showPage('starter');
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize localStorage if it doesn't exist
    if (!localStorage.getItem('minibreak_moods')) {
        localStorage.setItem('minibreak_moods', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('minibreak_journals')) {
        localStorage.setItem('minibreak_journals', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('minibreak_favorites')) {
        localStorage.setItem('minibreak_favorites', JSON.stringify([]));
    }
    
    console.log('MiniBreak app initialized successfully');
}

/**
 * Select breathing pattern
 * @param {string} pattern - The breathing pattern to select
 */
function selectBreathingPattern(pattern) {
    // Stop current breathing if active
    if (isBreathing) {
        stopBreathing();
    }
    
    currentBreathingPattern = pattern;
    
    // Update pattern buttons
    const patternBtns = document.querySelectorAll('.pattern-btn');
    patternBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update description
    const description = document.getElementById('pattern-description');
    if (description) {
        const patternInfo = breathingPatterns[pattern];
        description.innerHTML = `
            <h4>${patternInfo.name}</h4>
            <p>${patternInfo.description}</p>
        `;
    }
}

/**
 * Toggle favorite affirmation
 */
function toggleFavoriteAffirmation() {
    if (!currentAffirmation) return;
    
    const favorites = JSON.parse(localStorage.getItem('minibreak_favorites') || '[]');
    const favoriteBtn = document.getElementById('favorite-affirmation');
    
    const existingIndex = favorites.findIndex(fav => fav.text === currentAffirmation);
    
    if (existingIndex > -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        favoriteBtn.textContent = '❤️ Save as Favorite';
        favoriteBtn.classList.remove('favorited');
    } else {
        // Add to favorites
        favorites.push({
            text: currentAffirmation,
            date: new Date().toISOString(),
            id: Date.now()
        });
        favoriteBtn.textContent = '💖 Favorited';
        favoriteBtn.classList.add('favorited');
    }
    
    localStorage.setItem('minibreak_favorites', JSON.stringify(favorites));
    loadFavoriteAffirmations();
}

/**
 * Load and display favorite affirmations
 */
function loadFavoriteAffirmations() {
    const favoriteList = document.getElementById('favorite-list');
    if (!favoriteList) return;
    
    const favorites = JSON.parse(localStorage.getItem('minibreak_favorites') || '[]');
    
    if (favorites.length === 0) {
        favoriteList.innerHTML = '<p>No favorite affirmations yet. Save some by clicking the heart button!</p>';
        return;
    }
    
    const favoritesHTML = favorites.map(favorite => `
        <div class="favorite-item">
            <div class="favorite-text">"${favorite.text}"</div>
            <button class="remove-favorite" onclick="removeFavorite(${favorite.id})" title="Remove from favorites">✕</button>
        </div>
    `).join('');
    
    favoriteList.innerHTML = favoritesHTML;
}

/**
 * Remove favorite affirmation
 * @param {number} id - The ID of the favorite to remove
 */
function removeFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('minibreak_favorites') || '[]');
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('minibreak_favorites', JSON.stringify(updatedFavorites));
    loadFavoriteAffirmations();
}

/**
 * Show wellness category content
 * @param {string} category - The wellness category to show
 */
function showWellnessCategory(category) {
    // Update active button
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the correct button
    categoryBtns.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category.toLowerCase())) {
            btn.classList.add('active');
        }
    });
    
    // Get content for category
    const content = wellnessTips[category] || [];
    const wellnessContent = document.getElementById('wellness-content');
    
    if (!wellnessContent) return;
    
    const contentHTML = content.map(tip => `
        <div class="wellness-tip">
            <h4>${tip.title}</h4>
            <p>${tip.content}</p>
            <div class="wellness-highlight">
                <p>${tip.highlight}</p>
            </div>
        </div>
    `).join('');
    
    wellnessContent.innerHTML = contentHTML;
}

/**
 * Edit user profile
 */
function editProfile() {
    const userData = JSON.parse(localStorage.getItem('minibreak_user') || '{}');
    
    const newName = prompt('Enter your name:', userData.name || '');
    if (newName !== null && newName.trim()) {
        userData.name = newName.trim();
    }
    
    const newOccupation = prompt('Enter your occupation:', userData.occupation || '');
    if (newOccupation !== null && newOccupation.trim()) {
        userData.occupation = newOccupation.trim();
    }
    
    const newEmail = prompt('Enter your email:', userData.email || '');
    if (newEmail !== null) {
        userData.email = newEmail.trim();
    }
    
    localStorage.setItem('minibreak_user', JSON.stringify(userData));
    loadProfileData();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentAudioPlaying) {
            stopAllAudio();
        }
    });
    
    // Add breathing exercise keyboard support
    document.addEventListener('keydown', function(e) {
        if (currentPage === 'breathing' && e.key === ' ') {
            e.preventDefault();
            toggleBreathing();
        }
    });
}

/**
 * Set up mobile navigation toggle
 */
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Show specific page and hide others
 * @param {string} pageId - The ID of the page to show
 */
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('fade-in');
        currentPage = pageId;
        
        // Update navigation active state
        updateNavigationState(pageId);
        
        // Page-specific initialization
        if (pageId === 'mood') {
            loadMoodHistory();
            updateMoodStreakDisplay();
            generateWeeklyMoodGraph();
            generateMoodBasedTips();
        } else if (pageId === 'journal') {
            loadJournalEntries();
        } else if (pageId === 'profile') {
            loadProfileData();
        } else if (pageId === 'affirmations') {
            displayRandomAffirmation();
        } else if (pageId === 'feedback') {
            loadFeedbackEntries();
        } else if (pageId === 'games') {
            initializeGames();
        }
        
        console.log(`Switched to ${pageId} page`);
    }
}

/**
 * Update navigation active state
 * @param {string} activePageId - The ID of the active page
 */
function updateNavigationState(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase() === activePageId) {
            link.classList.add('active');
        }
    });
}

/**
 * Select a mood and save it to localStorage
 * @param {string} mood - The mood identifier
 * @param {string} emoji - The mood emoji
 */
function selectMood(mood, emoji) {
    // Remove previous selection
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.target.closest('.mood-option').classList.add('selected');
    
    // Save mood to localStorage
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    const moodEntry = {
        mood: mood,
        emoji: emoji,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    moods.push(moodEntry);
    localStorage.setItem('minibreak_moods', JSON.stringify(moods));
    
    // Update all mood-related displays
    setTimeout(() => {
        loadMoodHistory();
        updateMoodStreakDisplay();
        generateWeeklyMoodGraph();
        generateMoodBasedTips();
    }, 500);
    
    console.log(`Mood selected: ${mood} ${emoji}`);
}

/**
 * Handle user registration form submission
 * @param {Event} event - The form submission event
 */
function handleUserRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        dob: formData.get('dob'),
        occupation: formData.get('occupation'),
        wellnessGoal: formData.get('wellness-goal'),
        joinDate: new Date().toISOString()
    };
    
    // Save user data to localStorage
    localStorage.setItem('minibreak_user', JSON.stringify(userData));
    
    // Set login status and redirect to home
    isUserLoggedIn = true;
    showPage('home');
    
    showNotification('Welcome to MiniBreak! Your wellness journey begins now.', 'success');
    console.log('User registered successfully:', userData.name);
}

/**
 * Load and display mood history from localStorage
 */
function loadMoodHistory() {
    const moodTimeline = document.getElementById('mood-timeline');
    if (!moodTimeline) return;
    
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    
    if (moods.length === 0) {
        moodTimeline.innerHTML = '<p>No mood entries yet. Select a mood above to get started!</p>';
        return;
    }
    
    // Sort moods by date (newest first) and take last 10
    const recentMoods = moods
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    
    const moodHTML = recentMoods.map(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="mood-entry">
                <span class="mood-entry-emoji">${entry.emoji}</span>
                <div>${entry.mood}</div>
                <div style="font-size: 0.7rem; color: #999;">${formattedDate}</div>
            </div>
        `;
    }).join('');
    
    moodTimeline.innerHTML = moodHTML;
}

/**
 * Save journal entry to localStorage
 */
function saveJournalEntry() {
    const journalInput = document.getElementById('journal-input');
    const entryText = journalInput.value.trim();
    
    if (!entryText) {
        alert('Please write something before saving!');
        return;
    }
    
    const journals = JSON.parse(localStorage.getItem('minibreak_journals') || '[]');
    const journalEntry = {
        id: Date.now(),
        text: entryText,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    journals.push(journalEntry);
    localStorage.setItem('minibreak_journals', JSON.stringify(journals));
    
    // Clear the input
    journalInput.value = '';
    
    // Reload journal entries
    loadJournalEntries();
    
    // Show success feedback
    const saveButton = document.getElementById('save-journal');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved! ✓';
    saveButton.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    
    setTimeout(() => {
        saveButton.textContent = originalText;
        saveButton.style.background = '';
    }, 2000);
    
    console.log('Journal entry saved successfully');
}

/**
 * Load and display journal entries from localStorage
 */
function loadJournalEntries() {
    const journalList = document.getElementById('journal-list');
    if (!journalList) return;
    
    const journals = JSON.parse(localStorage.getItem('minibreak_journals') || '[]');
    
    if (journals.length === 0) {
        journalList.innerHTML = '<p>No journal entries yet. Write your first entry above!</p>';
        return;
    }
    
    // Sort journals by date (newest first)
    const sortedJournals = journals.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const journalHTML = sortedJournals.map(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="journal-entry">
                <div class="journal-entry-date">${formattedDate}</div>
                <div class="journal-entry-text">${entry.text}</div>
            </div>
        `;
    }).join('');
    
    journalList.innerHTML = journalHTML;
}

/**
 * Toggle breathing exercise animation
 */
function toggleBreathing() {
    const breathingBtn = document.getElementById('breathing-btn');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    
    if (!isBreathing) {
        // Start breathing exercise
        isBreathing = true;
        breathingBtn.textContent = 'Stop';
        breathingBtn.classList.add('pulse');
        
        const pattern = breathingPatterns[currentBreathingPattern];
        let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold
        let phaseCounter = 0;
        
        const breathingCycle = () => {
            switch(phase) {
                case 0: // Inhale
                    breathingText.textContent = 'Inhale';
                    breathingCircle.classList.remove('exhale');
                    breathingCircle.classList.add('inhale');
                    phaseCounter++;
                    if (phaseCounter >= pattern.inhale) {
                        phase = 1;
                        phaseCounter = 0;
                    }
                    break;
                case 1: // Hold after inhale
                    breathingText.textContent = 'Hold';
                    phaseCounter++;
                    if (phaseCounter >= pattern.hold1) {
                        phase = 2;
                        phaseCounter = 0;
                    }
                    break;
                case 2: // Exhale
                    breathingText.textContent = 'Exhale';
                    breathingCircle.classList.remove('inhale');
                    breathingCircle.classList.add('exhale');
                    phaseCounter++;
                    if (phaseCounter >= pattern.exhale) {
                        phase = 3;
                        phaseCounter = 0;
                    }
                    break;
                case 3: // Hold after exhale
                    breathingText.textContent = 'Hold';
                    phaseCounter++;
                    if (phaseCounter >= pattern.hold2) {
                        phase = 0;
                        phaseCounter = 0;
                    }
                    break;
            }
        };
        
        breathingInterval = setInterval(breathingCycle, 1000);
        
    } else {
        // Stop breathing exercise
        stopBreathing();
    }
}

/**
 * Stop breathing exercise
 */
function stopBreathing() {
    isBreathing = false;
    clearInterval(breathingInterval);
    
    const breathingBtn = document.getElementById('breathing-btn');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    
    breathingBtn.textContent = 'Start';
    breathingBtn.classList.remove('pulse');
    breathingText.textContent = 'Click Start';
    breathingCircle.classList.remove('inhale', 'exhale');
}

/**
 * Generate audio context for nature sounds simulation
 */
function createNatureSound(type) {
    if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
        return null;
    }
    
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioCtx();
    
    let oscillator, gainNode, filter;
    
    switch(type) {
        case 'rain':
            // Create white noise for rain
            const bufferSize = 2 * audioContext.sampleRate;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const whiteNoise = audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            
            filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioContext.currentTime);
            
            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            
            whiteNoise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            return { source: whiteNoise, context: audioContext, gain: gainNode };
            
        case 'ocean':
            oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
            
            const lfo = audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
            
            const lfoGain = audioContext.createGain();
            lfoGain.gain.setValueAtTime(20, audioContext.currentTime);
            
            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            lfo.start();
            return { source: oscillator, context: audioContext, gain: gainNode, lfo: lfo };
            
        default:
            return null;
    }
}

/**
 * Toggle audio playback with fallback to generated sounds
 * @param {string} audioId - The ID of the audio element
 * @param {HTMLElement} button - The play button element
 */
function toggleAudio(audioId, button) {
    const audio = document.getElementById(audioId);
    
    if (!audio) {
        console.error('Audio element not found:', audioId);
        return;
    }
    
    // Stop any currently playing audio
    if (currentAudioPlaying && currentAudioPlaying !== audio) {
        if (currentAudioPlaying.generatedSound) {
            currentAudioPlaying.generatedSound.source.stop();
            currentAudioPlaying.generatedSound.context.close();
        } else {
            currentAudioPlaying.pause();
            currentAudioPlaying.currentTime = 0;
        }
        // Reset previous button
        const prevButton = document.querySelector('.play-btn.playing');
        if (prevButton) {
            prevButton.textContent = 'Play';
            prevButton.classList.remove('playing');
        }
    }
    
    if (audio.paused || !audio.isPlaying) {
        // Try to play the actual audio file first
        audio.loop = true;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                button.textContent = 'Stop';
                button.classList.add('playing');
                currentAudioPlaying = audio;
                audio.isPlaying = true;
                console.log(`Started playing: ${audioId}`);
            }).catch(error => {
                console.log('Regular audio failed, trying generated sound:', error);
                // Fallback to generated sound
                const soundType = audioId.replace('-audio', '');
                if (soundType === 'rain' || soundType === 'ocean') {
                    const generatedSound = createNatureSound(soundType);
                    if (generatedSound) {
                        generatedSound.source.start();
                        audio.generatedSound = generatedSound;
                        audio.isPlaying = true;
                        button.textContent = 'Stop';
                        button.classList.add('playing');
                        currentAudioPlaying = audio;
                        console.log(`Started generated sound: ${soundType}`);
                    } else {
                        button.textContent = 'Audio Unavailable';
                        setTimeout(() => {
                            button.textContent = 'Play';
                        }, 2000);
                    }
                } else {
                    button.textContent = 'Audio Unavailable';
                    setTimeout(() => {
                        button.textContent = 'Play';
                    }, 2000);
                }
            });
        }
    } else {
        // Stop playing
        if (audio.generatedSound) {
            audio.generatedSound.source.stop();
            audio.generatedSound.context.close();
            audio.generatedSound = null;
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
        audio.isPlaying = false;
        button.textContent = 'Play';
        button.classList.remove('playing');
        currentAudioPlaying = null;
        console.log(`Stopped playing: ${audioId}`);
    }
}

/**
 * Stop all audio playback
 */
function stopAllAudio() {
    const audioElements = document.querySelectorAll('audio');
    const playButtons = document.querySelectorAll('.play-btn');
    
    audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    
    playButtons.forEach(button => {
        button.textContent = 'Play';
        button.classList.remove('playing');
    });
    
    currentAudioPlaying = null;
}

/**
 * Display a random affirmation
 */
function displayRandomAffirmation() {
    const affirmationText = document.getElementById('affirmation-text');
    if (!affirmationText) return;
    
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const selectedAffirmation = affirmations[randomIndex];
    currentAffirmation = selectedAffirmation;
    
    // Add fade effect
    affirmationText.style.opacity = '0';
    
    setTimeout(() => {
        affirmationText.textContent = selectedAffirmation;
        affirmationText.style.opacity = '1';
        
        // Update favorite button state
        updateFavoriteButtonState();
    }, 200);
    
    console.log('Displayed affirmation:', selectedAffirmation);
}

/**
 * Update favorite button state based on current affirmation
 */
function updateFavoriteButtonState() {
    const favoriteBtn = document.getElementById('favorite-affirmation');
    if (!favoriteBtn || !currentAffirmation) return;
    
    const favorites = JSON.parse(localStorage.getItem('minibreak_favorites') || '[]');
    const isFavorite = favorites.some(fav => fav.text === currentAffirmation);
    
    if (isFavorite) {
        favoriteBtn.textContent = '💖 Favorited';
        favoriteBtn.classList.add('favorited');
    } else {
        favoriteBtn.textContent = '❤️ Save as Favorite';
        favoriteBtn.classList.remove('favorited');
    }
}

/**
 * Get next random affirmation
 */
function getNextAffirmation() {
    displayRandomAffirmation();
}

/**
 * Load and display profile data
 */
function loadProfileData() {
    const userData = JSON.parse(localStorage.getItem('minibreak_user') || '{}');
    
    // Update profile information
    const profileName = document.getElementById('profile-name');
    const profileAge = document.getElementById('profile-age');
    const profileOccupation = document.getElementById('profile-occupation');
    const profileGoal = document.getElementById('profile-goal');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileName) profileName.textContent = userData.name || 'Wellness Warrior';
    if (profileAge) profileAge.textContent = userData.age || '--';
    if (profileOccupation) profileOccupation.textContent = userData.occupation || '--';
    if (profileGoal) {
        const goalText = userData.wellnessGoal ? userData.wellnessGoal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '--';
        profileGoal.textContent = goalText;
    }
    if (profileEmail) profileEmail.textContent = userData.email || '--';
    
    loadMoodStats();
    loadJournalCount();
    loadFavoriteCount();
    loadActiveDays();
    loadRecentJournalsForProfile();
}

/**
 * Load favorite affirmations count
 */
function loadFavoriteCount() {
    const favoriteCountElement = document.getElementById('favorite-count');
    if (!favoriteCountElement) return;
    
    const favorites = JSON.parse(localStorage.getItem('minibreak_favorites') || '[]');
    favoriteCountElement.textContent = favorites.length;
}

/**
 * Load active days count
 */
function loadActiveDays() {
    const activeDaysElement = document.getElementById('active-days');
    if (!activeDaysElement) return;
    
    const userData = JSON.parse(localStorage.getItem('minibreak_user') || '{}');
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    const journals = JSON.parse(localStorage.getItem('minibreak_journals') || '[]');
    
    // Calculate unique days with activity
    const activityDates = new Set();
    
    // Add mood tracking dates
    moods.forEach(mood => {
        const date = new Date(mood.date).toDateString();
        activityDates.add(date);
    });
    
    // Add journal dates
    journals.forEach(journal => {
        const date = new Date(journal.date).toDateString();
        activityDates.add(date);
    });
    
    // Add join date
    if (userData.joinDate) {
        const joinDate = new Date(userData.joinDate).toDateString();
        activityDates.add(joinDate);
    }
    
    activeDaysElement.textContent = activityDates.size;
}

/**
 * Load mood statistics for profile page
 */
function loadMoodStats() {
    const moodStatsElement = document.getElementById('mood-stats');
    if (!moodStatsElement) return;
    
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    
    if (moods.length === 0) {
        moodStatsElement.innerHTML = '<p>No mood data yet. Start tracking your moods!</p>';
        return;
    }
    
    // Count each mood type
    const moodCounts = {};
    moods.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    // Create mood stats HTML
    const statsHTML = Object.entries(moodCounts).map(([mood, count]) => {
        const emoji = moods.find(m => m.mood === mood)?.emoji || '😊';
        return `
            <div class="mood-stat">
                ${emoji} ${mood}: ${count}
            </div>
        `;
    }).join('');
    
    moodStatsElement.innerHTML = statsHTML;
}

/**
 * Calculate and update mood streak
 */
function calculateMoodStreak() {
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    if (moods.length === 0) {
        moodStreak = 0;
        return 0;
    }

    // Sort moods by date (newest first)
    const sortedMoods = moods.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check each consecutive day
    for (let i = 0; i < sortedMoods.length; i++) {
        const moodDate = new Date(sortedMoods[i].date);
        moodDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today - moodDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
            streak++;
        } else if (daysDiff > streak) {
            break;
        }
    }
    
    moodStreak = streak;
    return streak;
}

/**
 * Update mood streak display
 */
function updateMoodStreakDisplay() {
    const streakCount = document.getElementById('mood-streak-count');
    const streakMessage = document.getElementById('streak-message');
    
    if (!streakCount || !streakMessage) return;
    
    const streak = calculateMoodStreak();
    streakCount.textContent = streak;
    
    // Display appropriate streak message
    if (streak === 0) {
        streakMessage.textContent = 'Start your streak today!';
    } else if (streak === 1) {
        streakMessage.textContent = 'Great start! 🌟';
    } else if (streak < 7) {
        streakMessage.textContent = `${streak}-Day Streak! Keep it up 🎉`;
    } else if (streak < 30) {
        streakMessage.textContent = `Amazing ${streak}-day streak! 🔥`;
    } else {
        streakMessage.textContent = `Incredible ${streak}-day streak! You're a mood tracking champion! 🏆`;
    }
}

/**
 * Generate weekly mood graph
 */
function generateWeeklyMoodGraph() {
    const moodGraph = document.getElementById('mood-graph');
    const moodInsights = document.getElementById('mood-insights');
    
    if (!moodGraph || !moodInsights) return;
    
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    const today = new Date();
    const weekDays = [];
    
    // Generate past 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        weekDays.push(date);
    }
    
    // Create mood graph HTML
    let graphHTML = '';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const moodEmojis = {
        'happy': '😊',
        'sad': '😞',
        'anxious': '😰',
        'calm': '😌',
        'excited': '🤩',
        'tired': '😴'
    };
    
    weekDays.forEach(date => {
        const dayMoods = moods.filter(mood => {
            const moodDate = new Date(mood.date);
            return moodDate.toDateString() === date.toDateString();
        });
        
        const dayName = dayNames[date.getDay()];
        const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
        
        let emoji = '⚪'; // Default for no mood
        let moodName = 'No mood';
        
        if (dayMoods.length > 0) {
            // Get most recent mood for the day
            const latestMood = dayMoods[dayMoods.length - 1];
            emoji = latestMood.emoji;
            moodName = latestMood.mood;
        }
        
        graphHTML += `
            <div class="mood-day">
                <div class="mood-day-label">${dateLabel}</div>
                <div class="mood-day-emoji">${emoji}</div>
                <div class="mood-day-name">${dayName}</div>
            </div>
        `;
    });
    
    moodGraph.innerHTML = graphHTML;
    
    // Generate insights
    generateMoodInsights(moods, moodInsights);
}

/**
 * Generate mood insights
 */
function generateMoodInsights(moods, insightsElement) {
    if (moods.length === 0) {
        insightsElement.innerHTML = '<h4>Weekly Insights</h4><p>Start tracking your mood to see patterns and insights!</p>';
        return;
    }
    
    const recentMoods = moods.slice(-7); // Last 7 entries
    const moodCounts = {};
    
    recentMoods.forEach(mood => {
        moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });
    
    let insight = '';
    const mostCommon = Object.entries(moodCounts).reduce((a, b) => 
        moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    );
    
    if (mostCommon[0] === 'happy' || mostCommon[0] === 'excited') {
        insight = '🌟 You\'ve been feeling positive lately! Keep up the great energy.';
    } else if (mostCommon[0] === 'sad' || mostCommon[0] === 'anxious') {
        insight = '💙 It looks like you\'ve had some challenging days. Remember to be kind to yourself.';
    } else if (mostCommon[0] === 'calm') {
        insight = '🧘 You\'ve been maintaining a calm state of mind. Great work on your mindfulness!';
    } else {
        insight = '📊 Your mood patterns are unique to you. Keep tracking to understand yourself better.';
    }
    
    insightsElement.innerHTML = `
        <h4>Weekly Insights</h4>
        <p>${insight}</p>
        <p>Most frequent mood this week: <strong>${mostCommon[0]}</strong> (${mostCommon[1]} times)</p>
    `;
}

/**
 * Generate mood-based tips
 */
function generateMoodBasedTips() {
    const moodTipsElement = document.getElementById('mood-tips');
    if (!moodTipsElement) return;
    
    const moods = JSON.parse(localStorage.getItem('minibreak_moods') || '[]');
    
    if (moods.length === 0) {
        moodTipsElement.innerHTML = '<p>Start tracking your mood to get personalized wellness tips!</p>';
        return;
    }
    
    // Get recent moods to determine tips
    const recentMoods = moods.slice(-5);
    const moodCounts = {};
    
    recentMoods.forEach(mood => {
        moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });
    
    const tips = [];
    
    // Generate tips based on mood patterns
    if (moodCounts['anxious'] >= 2) {
        tips.push({
            title: 'Managing Anxiety',
            content: 'Try the 4-7-8 breathing technique or practice progressive muscle relaxation. Journaling can also help identify anxiety triggers.'
        });
    }
    
    if (moodCounts['sad'] >= 2) {
        tips.push({
            title: 'Lifting Your Spirits',
            content: 'Consider gentle movement, listening to uplifting music, or reaching out to a friend. Small acts of self-care can make a big difference.'
        });
    }
    
    if (moodCounts['tired'] >= 2) {
        tips.push({
            title: 'Boosting Energy',
            content: 'Prioritize sleep hygiene, take short breaks during the day, and ensure you\'re staying hydrated. Light exercise can also boost energy levels.'
        });
    }
    
    if (moodCounts['excited'] >= 2) {
        tips.push({
            title: 'Channeling Excitement',
            content: 'Use this positive energy for creative projects or physical activities. Remember to also include moments of calm to maintain balance.'
        });
    }
    
    // Default tips if no specific patterns
    if (tips.length === 0) {
        tips.push({
            title: 'General Wellness',
            content: 'Keep up your mood tracking! Regular self-reflection, mindfulness practices, and maintaining social connections support overall mental wellness.'
        });
    }
    
    const tipsHTML = tips.map(tip => `
        <div class="mood-tip-card">
            <h4>${tip.title}</h4>
            <p>${tip.content}</p>
        </div>
    `).join('');
    
    moodTipsElement.innerHTML = tipsHTML;
}

/**
 * Select rating for feedback form
 */
function selectRating(rating) {
    selectedRating = rating;
    
    // Update UI to show selection
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    emojiButtons.forEach((btn, index) => {
        if (index + 1 === rating) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Update hidden input
    const ratingInput = document.getElementById('feedback-rating');
    if (ratingInput) {
        ratingInput.value = rating;
    }
}

/**
 * Handle feedback form submission
 */
function handleFeedbackSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const feedbackEntry = {
        id: Date.now(),
        name: formData.get('name'),
        rating: parseInt(formData.get('rating')),
        message: formData.get('message'),
        date: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingFeedback = JSON.parse(localStorage.getItem('minibreak_feedback') || '[]');
    existingFeedback.push(feedbackEntry);
    localStorage.setItem('minibreak_feedback', JSON.stringify(existingFeedback));
    
    // Reset form
    form.reset();
    selectedRating = 0;
    document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Refresh feedback display
    loadFeedbackEntries();
    
    // Show success message
    alert('Thank you for your feedback! Your input helps us improve MiniBreak.');
}

/**
 * Load and display feedback entries
 */
function loadFeedbackEntries() {
    const feedbackList = document.getElementById('feedback-list');
    if (!feedbackList) return;
    
    const feedback = JSON.parse(localStorage.getItem('minibreak_feedback') || '[]');
    
    if (feedback.length === 0) {
        feedbackList.innerHTML = '<p>No feedback yet. Be the first to share your thoughts!</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedFeedback = feedback.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const feedbackHTML = sortedFeedback.map(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        const ratingEmojis = ['😞', '😐', '🙂', '😊', '🤩'];
        const ratingEmoji = ratingEmojis[entry.rating - 1] || '😊';
        
        return `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div>
                        <span class="feedback-name">${entry.name}</span>
                        <span class="feedback-rating">${ratingEmoji}</span>
                    </div>
                    <span class="feedback-date">${date}</span>
                </div>
                <div class="feedback-message">${entry.message}</div>
            </div>
        `;
    }).join('');
    
    feedbackList.innerHTML = feedbackHTML;
}

/**
 * Load journal count for profile page
 */
function loadJournalCount() {
    const journalCountElement = document.getElementById('journal-count');
    if (!journalCountElement) return;
    
    const journals = JSON.parse(localStorage.getItem('minibreak_journals') || '[]');
    journalCountElement.textContent = journals.length;
}

/**
 * Load recent journals for profile page
 */
function loadRecentJournalsForProfile() {
    const profileJournalList = document.getElementById('profile-journal-list');
    if (!profileJournalList) return;
    
    const journals = JSON.parse(localStorage.getItem('minibreak_journals') || '[]');
    
    if (journals.length === 0) {
        profileJournalList.innerHTML = '<p>No journal entries yet.</p>';
        return;
    }
    
    // Get recent 3 entries
    const recentJournals = journals
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    const journalHTML = recentJournals.map(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        // Truncate long entries
        const truncatedText = entry.text.length > 100 
            ? entry.text.substring(0, 100) + '...' 
            : entry.text;
        
        return `
            <div class="journal-entry">
                <div class="journal-entry-date">${formattedDate}</div>
                <div class="journal-entry-text">${truncatedText}</div>
            </div>
        `;
    }).join('');
    
    profileJournalList.innerHTML = journalHTML;
}

/**
 * Clear all app data (for testing purposes)
 */
function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        localStorage.removeItem('minibreak_moods');
        localStorage.removeItem('minibreak_journals');
        
        // Reload current page data
        if (currentPage === 'mood') {
            loadMoodHistory();
        } else if (currentPage === 'journal') {
            loadJournalEntries();
        } else if (currentPage === 'profile') {
            loadProfileData();
        }
        
        console.log('All app data cleared');
    }
}

// Add some utility functions for better user experience

/**
 * Show notification message
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Set notification style based on type
    const colors = {
        success: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
        error: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    // Show notification
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
    }, 3000);
}

// =======================
// MINI GAMES FUNCTIONALITY
// =======================

// Memory Match Game Variables
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let memoryGameActive = false;

// Bubble Pop Game Variables
let bubbleScore = 0;
let bubbleTime = 0;
let bubbleGameActive = false;
let bubbleInterval = null;
let bubbleTimer = null;

// Peaceful symbols for memory game
const memorySymbols = ['🌸', '🌿', '🦋', '🌟', '🌙', '🌺', '🍃', '✨'];

/**
 * Initialize games when games page is shown
 */
function initializeGames() {
    console.log('Initializing Mini Games');
    startMemoryGame();
}

/**
 * Start a new Memory Match game
 */
function startMemoryGame() {
    console.log('Starting Memory Match game');
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    memoryGameActive = true;
    
    // Update stats display
    updateMemoryStats();
    
    // Create shuffled card array (each symbol appears twice)
    const cardSymbols = [...memorySymbols, ...memorySymbols];
    memoryCards = shuffleArray(cardSymbols);
    
    // Generate memory board
    const memoryBoard = document.getElementById('memory-board');
    if (!memoryBoard) return;
    
    memoryBoard.innerHTML = '';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.innerHTML = '<div class="memory-card-back">?</div>';
        card.onclick = () => flipMemoryCard(card, symbol);
        memoryBoard.appendChild(card);
    });
}

/**
 * Handle memory card flip
 * @param {HTMLElement} card - The card element clicked
 * @param {string} symbol - The symbol on the card
 */
function flipMemoryCard(card, symbol) {
    if (!memoryGameActive || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.innerHTML = symbol;
    flippedCards.push(card);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateMemoryStats();
        
        const [card1, card2] = flippedCards;
        const symbol1 = card1.dataset.symbol;
        const symbol2 = card2.dataset.symbol;
        
        if (symbol1 === symbol2) {
            // Match found!
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                updateMemoryStats();
                
                // Check if game is complete
                if (matchedPairs === memorySymbols.length) {
                    showNotification(`Congratulations! You completed the memory game in ${moves} moves!`, 'success');
                    memoryGameActive = false;
                }
                
                flippedCards = [];
            }, 500);
        } else {
            // No match, flip back
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerHTML = '<div class="memory-card-back">?</div>';
                card2.innerHTML = '<div class="memory-card-back">?</div>';
                flippedCards = [];
            }, 1000);
        }
    }
}

/**
 * Update memory game statistics display
 */
function updateMemoryStats() {
    const movesElement = document.getElementById('memory-moves');
    const pairsElement = document.getElementById('memory-pairs');
    
    if (movesElement) movesElement.textContent = moves;
    if (pairsElement) pairsElement.textContent = `${matchedPairs}/${memorySymbols.length}`;
}

/**
 * Start Bubble Pop game
 */
function startBubbleGame() {
    const bubbleBtn = document.getElementById('bubble-btn');
    
    if (!bubbleGameActive) {
        // Start game
        console.log('Starting Bubble Pop game');
        bubbleGameActive = true;
        bubbleScore = 0;
        bubbleTime = 0;
        
        // Update button and stats
        if (bubbleBtn) bubbleBtn.textContent = 'Stop';
        updateBubbleStats();
        
        // Start bubble generation and timer
        bubbleInterval = setInterval(createBubble, 1500);
        bubbleTimer = setInterval(() => {
            bubbleTime++;
            updateBubbleStats();
        }, 1000);
        
    } else {
        // Stop game
        stopBubbleGame();
    }
}

/**
 * Stop Bubble Pop game
 */
function stopBubbleGame() {
    console.log('Stopping Bubble Pop game');
    bubbleGameActive = false;
    
    // Clear intervals
    if (bubbleInterval) clearInterval(bubbleInterval);
    if (bubbleTimer) clearInterval(bubbleTimer);
    
    // Update button
    const bubbleBtn = document.getElementById('bubble-btn');
    if (bubbleBtn) bubbleBtn.textContent = 'Start';
    
    // Clear remaining bubbles
    const bubbleCanvas = document.getElementById('bubble-canvas');
    if (bubbleCanvas) {
        const bubbles = bubbleCanvas.querySelectorAll('.bubble');
        bubbles.forEach(bubble => bubble.remove());
    }
    
    // Show final score
    if (bubbleScore > 0) {
        showNotification(`Game Over! Final score: ${bubbleScore} bubbles in ${bubbleTime}s`, 'success');
    }
}

/**
 * Create a new bubble for the bubble pop game
 */
function createBubble() {
    if (!bubbleGameActive) return;
    
    const bubbleCanvas = document.getElementById('bubble-canvas');
    if (!bubbleCanvas) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size between 30-60px
    const size = Math.random() * 30 + 30;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    // Random position
    const maxLeft = bubbleCanvas.offsetWidth - size;
    bubble.style.left = Math.random() * maxLeft + 'px';
    bubble.style.bottom = '-' + size + 'px';
    
    // Random color
    const colors = [
        'rgba(255, 182, 193, 0.8)',
        'rgba(173, 216, 230, 0.8)',
        'rgba(144, 238, 144, 0.8)',
        'rgba(255, 218, 185, 0.8)',
        'rgba(221, 160, 221, 0.8)',
        'rgba(255, 255, 224, 0.8)'
    ];
    bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random animation duration
    const duration = Math.random() * 3 + 4; // 4-7 seconds
    bubble.style.animationDuration = duration + 's';
    
    // Add click handler
    bubble.onclick = () => popBubble(bubble);
    
    // Add to canvas
    bubbleCanvas.appendChild(bubble);
    
    // Remove bubble after animation ends
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, duration * 1000);
}

/**
 * Handle bubble pop
 * @param {HTMLElement} bubble - The bubble element clicked
 */
function popBubble(bubble) {
    if (!bubbleGameActive) return;
    
    // Add pop animation
    bubble.classList.add('bubble-pop');
    bubbleScore++;
    updateBubbleStats();
    
    // Remove bubble after animation
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 300);
}

/**
 * Update bubble game statistics display
 */
function updateBubbleStats() {
    const scoreElement = document.getElementById('bubble-score');
    const timeElement = document.getElementById('bubble-time');
    
    if (scoreElement) scoreElement.textContent = bubbleScore;
    if (timeElement) timeElement.textContent = bubbleTime + 's';
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}


    console.log('MiniBreak app initialized successfully');
    
    // Check if user is already registered
    const userData = localStorage.getItem('minibreak_user');
    if (userData) {
        isUserLoggedIn = true;
        showPage('home');
    } else {
        showPage('starter');
    }
    
    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleUserRegistration);
    }
    
    // Initialize feedback form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
    
    // Display initial affirmation
    displayRandomAffirmation();
    ;

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showPage,
        selectMood,
        saveJournalEntry,
        toggleBreathing,
        displayRandomAffirmation,
        clearAllData,
        selectRating,
        handleFeedbackSubmit
    };
}
