// Morse code dictionary
const morseCode = {
    // Letters
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 
    'Z': '--..',
    
    // Numbers
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', 
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
    '8': '---..', '9': '----.',
    
    // Punctuation
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', 
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', 
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', 
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', 
    '$': '...-..-', '@': '.--.-.', ' ': '/'
};

// DOM Elements
const elements = {
    inputText: document.getElementById('inputText'),
    outputText: document.getElementById('outputText'),
    translateBtn: document.getElementById('translateBtn'),
    clearBtn: document.getElementById('clearBtn'),
    playBtn: document.getElementById('playBtn'),
    copyBtn: document.getElementById('copyBtn'),
    sampleBtn: document.getElementById('sampleBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    helpBtn: document.getElementById('helpBtn'),
    toMorseRadio: document.getElementById('toMorse'),
    fromMorseRadio: document.getElementById('fromMorse'),
    speedSlider: document.getElementById('speedSlider'),
    speedValue: document.getElementById('speedValue'),
    inputCount: document.getElementById('inputCount'),
    outputCount: document.getElementById('outputCount'),
    historyList: document.getElementById('historyList'),
    themeToggle: document.getElementById('themeToggle'),
    themeLabel: document.getElementById('themeLabel'),
    helpModal: document.getElementById('helpModal'),
    closeModal: document.querySelector('.close'),
    referenceGrid: document.getElementById('referenceGrid'),
    morseReference: document.getElementById('morseReference')
};

// App State
const state = {
    history: JSON.parse(localStorage.getItem('morseHistory')) || [],
    currentSpeed: 10,
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// Initialize the app
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI state
    updateSpeedDisplay();
    updateCharacterCounts();
    togglePlayButton();
    renderMorseReference();
    loadHistory();
    applyTheme();
    
    // Set initial theme
    elements.themeToggle.checked = state.darkMode;
}

// Set up all event listeners
function setupEventListeners() {
    // Translation controls
    elements.translateBtn.addEventListener('click', translate);
    elements.clearBtn.addEventListener('click', clearFields);
    elements.playBtn.addEventListener('click', playMorse);
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.sampleBtn.addEventListener('click', loadSampleText);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
    elements.helpBtn.addEventListener('click', () => elements.helpModal.style.display = 'block');
    elements.closeModal.addEventListener('click', () => elements.helpModal.style.display = 'none');
    
    // Input handling
    elements.inputText.addEventListener('input', handleInput);
    elements.toMorseRadio.addEventListener('change', togglePlayButton);
    elements.fromMorseRadio.addEventListener('change', togglePlayButton);
    
    // Speed control
    elements.speedSlider.addEventListener('input', updateSpeed);
    
    // Theme toggle
    elements.themeToggle.addEventListener('change', toggleTheme);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.helpModal) {
            elements.helpModal.style.display = 'none';
        }
    });
}

// Handle input changes
function handleInput() {
    updateCharacterCounts();
    togglePlayButton();
}

// Update character count displays
function updateCharacterCounts() {
    const inputLength = elements.inputText.value.length;
    elements.inputCount.textContent = `${inputLength} character${inputLength !== 1 ? 's' : ''}`;
    
    const outputLength = elements.outputText.value.length;
    elements.outputCount.textContent = `${outputLength} character${outputLength !== 1 ? 's' : ''}`;
}

// Toggle Play button based on translation direction
function togglePlayButton() {
    elements.playBtn.disabled = elements.fromMorseRadio.checked || !elements.inputText.value.trim();
}

// Update speed display and state
function updateSpeed() {
    state.currentSpeed = parseInt(elements.speedSlider.value);
    updateSpeedDisplay();
}

// Update speed value display
function updateSpeedDisplay() {
    elements.speedValue.textContent = `${state.currentSpeed} WPM`;
}

// Main translation function
function translate() {
    const text = elements.inputText.value.trim();
    
    if (!text) {
        showToast('Please enter some text to translate', 'warning');
        return;
    }
    
    let result;
    const direction = elements.toMorseRadio.checked ? 'toMorse' : 'fromMorse';
    
    if (direction === 'toMorse') {
        result = textToMorse(text);
    } else {
        result = morseToText(text);
    }
    
    elements.outputText.value = result;
    updateCharacterCounts();
    addToHistory(text, result, direction);
    showToast('Translation complete!', 'success');
}

// Convert text to Morse code
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || char; // Return original char if not found
    }).join(' ');
}

// Convert Morse code to text
function morseToText(morse) {
    return morse.split(' ').map(code => {
        return reverseMorseCode[code] || code; // Return original code if not found
    }).join('');
}

// Create reverse Morse code lookup
const reverseMorseCode = {};
for (const key in morseCode) {
    reverseMorseCode[morseCode[key]] = key;
}

// Play Morse code as audio
function playMorse() {
    if (elements.fromMorseRadio.checked) return;
    
    const morse = elements.outputText.value;
    if (!morse) {
        showToast('No Morse code to play', 'warning');
        return;
    }
    
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        // Adjust timing based on WPM (words per minute)
        // Standard PARIS timing: 50 time units per word (PARIS = 10 time units)
        const dotLength = 1.2 / state.currentSpeed; // seconds
        
        let time = context.currentTime;
        
        for (const symbol of morse) {
            switch (symbol) {
                case '.':
                    playBeep(context, time, 600, dotLength);
                    time += dotLength;
                    break;
                case '-':
                    playBeep(context, time, 600, dotLength * 3);
                    time += dotLength * 3;
                    break;
                case ' ':
                    time += dotLength * 3; // Inter-character space (total 7 units)
                    break;
                case '/':
                    time += dotLength * 7; // Inter-word space (total 7 units)
                    break;
            }
            
            // Add space after each symbol
            time += dotLength;
        }
    } catch (error) {
        showToast('Audio playback failed', 'error');
        console.error('Audio error:', error);
    }
}

// Helper function to play a beep
function playBeep(context, startTime, frequency, duration) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    // Fade out to avoid clicks
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
}

// Clear input and output fields
function clearFields() {
    elements.inputText.value = '';
    elements.outputText.value = '';
    updateCharacterCounts();
    elements.inputText.focus();
    showToast('Fields cleared', 'success');
}

// Copy output to clipboard
function copyToClipboard() {
    if (!elements.outputText.value) {
        showToast('Nothing to copy', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(elements.outputText.value)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(err => {
            showToast('Failed to copy', 'error');
            console.error('Copy failed:', err);
        });
}

// Load sample text
function loadSampleText() {
    if (elements.toMorseRadio.checked) {
        elements.inputText.value = "Hello World! SOS";
    } else {
        elements.inputText.value = ".... . .-.. .-.. --- / .-- --- .-. .-.. -.. -.-.-- / ... --- ...";
    }
    updateCharacterCounts();
    togglePlayButton();
    showToast('Sample text loaded', 'success');
}

// History functions
function addToHistory(input, output, direction) {
    const timestamp = new Date().toLocaleString();
    const historyItem = {
        input,
        output,
        direction,
        timestamp
    };
    
    state.history.unshift(historyItem);
    if (state.history.length > 20) {
        state.history.pop();
    }
    
    saveHistory();
    renderHistoryItem(historyItem);
}

function renderHistoryItem(item) {
    const historyElement = document.createElement('div');
    historyElement.className = 'history-item';
    historyElement.innerHTML = `
        <div class="direction">${item.direction === 'toMorse' ? 'Text → Morse' : 'Morse → Text'} • ${item.timestamp}</div>
        <div class="content" title="${item.input} → ${item.output}">${truncate(item.input, 30)} → ${truncate(item.output, 30)}</div>
    `;
    
    historyElement.addEventListener('click', () => {
        elements.inputText.value = item.input;
        elements.outputText.value = item.output;
        elements.toMorseRadio.checked = item.direction === 'toMorse';
        elements.fromMorseRadio.checked = item.direction === 'fromMorse';
        updateCharacterCounts();
        togglePlayButton();
        showToast('History item loaded', 'success');
    });
    
    elements.historyList.prepend(historyElement);
}

function loadHistory() {
    elements.historyList.innerHTML = '';
    state.history.forEach(item => renderHistoryItem(item));
}

function clearHistory() {
    if (state.history.length === 0) {
        showToast('History is already empty', 'warning');
        return;
    }
    
    if (confirm('Are you sure you want to clear your translation history?')) {
        state.history = [];
        saveHistory();
        elements.historyList.innerHTML = '';
        showToast('History cleared', 'success');
    }
}

function saveHistory() {
    localStorage.setItem('morseHistory', JSON.stringify(state.history));
}

// Theme functions
function toggleTheme() {
    state.darkMode = elements.themeToggle.checked;
    localStorage.setItem('darkMode', state.darkMode);
    applyTheme();
}

function applyTheme() {
    if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeLabel.textContent = 'Light Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        elements.themeLabel.textContent = 'Dark Mode';
    }
}

// Morse reference chart
function renderMorseReference() {
    const categories = [
        { title: 'Letters', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
        { title: 'Numbers', chars: '0123456789' },
        { title: 'Punctuation', chars: '.,?\'!/()&:;=+-_"$@' }
    ];
    
    let html = '';
    
    categories.forEach(category => {
        html += `<div class="reference-category"><h5>${category.title}</h5><div class="reference-items">`;
        
        for (const char of category.chars) {
            html += `
                <div class="reference-item">
                    <div class="char">${char}</div>
                    <div class="code">${morseCode[char]}</div>
                </div>
            `;
        }
        
        html += '</div></div>';
    });
    
    elements.referenceGrid.innerHTML = html;
}

// Helper function to truncate text
function truncate(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);