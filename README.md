# Morse Code Translator

# Morse Code Translator Pro

![Demo shot](https://github.com/user-attachments/assets/6677b797-e521-4454-bccb-02c33cc47b28)


A feature-rich web application for translating between text and Morse code with audio playback, translation history, and customizable settings.


## Features

### Core Functionality
- **Bidirectional Translation**:
  - Text to Morse code conversion
  - Morse code to text conversion
  - Supports all alphanumeric characters and common punctuation

- **Audio Playback**:
  - Real-time Morse code audio generation
  - Adjustable speed (5-20 WPM)
  - Accurate timing with PARIS standard (dot = 1 unit, dash = 3 units)

### Enhanced User Experience
- **Intuitive Interface**:
  - Clean, responsive design
  - Dark/light mode toggle
  - Font Awesome icons
  - Real-time character counting

- **Productivity Tools**:
  - Copy to clipboard
  - Sample text loading
  - Translation history with localStorage persistence
  - Built-in Morse code reference chart

- **Feedback System**:
  - Toast notifications
  - Error handling
  - Interactive help modal

## Demo

Try the live demo: [Morse Code Translator Pro Demo](https://your-demo-link.com)

## Installation

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/Mnelisi-Writes/Morse-Code-Translator.git
   cd morse-code-translator
   ```

2. Open in browser:
   - Simply open `index.html` in any modern browser
   - For development, use Live Server extension in VS Code

### Browser Requirements
- Chrome, Firefox, Edge, Safari (latest versions recommended)
- Web Audio API support required for playback

## Usage

### Basic Translation
1. Select direction: "Text to Morse" or "Morse to Text"
2. Enter text in the input area
3. Click "Translate" button
4. View results in output area

### Advanced Features
- **Audio Playback**:
  - Adjust speed slider (5-20 WPM)
  - Click "Play Morse" after translation

- **History**:
  - Previous translations saved automatically
  - Click to reload past translations
  - "Clear History" to remove all

- **Reference Chart**:
  - Built-in Morse code cheat sheet
  - Organized by letters, numbers, and punctuation

## API Reference

The application uses the following browser APIs:

### Web Audio API
- `AudioContext`
- `OscillatorNode`
- `GainNode`

### Web Storage API
- `localStorage` for persisting:
  - Translation history
  - User preferences (dark/light mode)

## Project Structure

```
morse-translator/
├── index.html          # Main application HTML
├── styles.css          # All styling and theming
├── script.js           # Core application logic
├── screenshot.png      # Application screenshot
├── README.md           # This documentation
└── LICENSE             # MIT License file
```

## Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Maintain consistent code style
- Add comments for complex logic
- Test changes thoroughly
- Update documentation when adding new features

