# IB Physics Topic D Question Bank

A web-based question bank for IB Physics Topic D (Gravitational Fields, Electric Fields, and Electromagnetic Induction) featuring all questions from Paper 1 and Paper 2.

## Features

- **120 Total Questions**: 20 Paper 2 questions + 100 Multiple Choice questions
- **Interactive Interface**: Toggle between question sets, search, and filter by topic
- **Show/Hide Answers**: Click to reveal answers for Paper 2 questions
- **Topic Filtering**: Filter questions by:
  - Gravitational Fields
  - Electric Fields
  - Magnetic Fields
  - Electromagnetic Induction
- **Search Functionality**: Search through questions by keywords
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Question Sources

- `Topic D paper 2.md` - 20 long-form Paper 2 exam questions with detailed answers
- `Topic D multiple choice.md` - 100 Multiple Choice questions

## How to Use

### Option 1: Open Locally

1. Download all files to a folder:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `Topic D paper 2.md`
   - `Topic D multiple choice.md`

2. Open `index.html` in a web browser (Chrome, Firefox, Safari, or Edge)

**Note**: Some browsers (especially Chrome) may block loading local files due to CORS policy. If questions don't load:

### Option 2: Use a Local Server

Run a simple HTTP server in the directory:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (with http-server):**
```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

### Option 3: Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select the branch to deploy
4. Your question bank will be available at: `https://[username].github.io/[repo-name]/`

## Navigation

- **Tabs**: Switch between Paper 2, Multiple Choice, or All Questions
- **Search**: Type keywords to filter questions
- **Topic Filter**: Select a specific topic area
- **Show Answer**: Click to reveal answers for Paper 2 questions

## Browser Requirements

- Modern web browser with JavaScript enabled
- Internet connection required for loading the Marked.js library (markdown parser)

## Files Structure

```
IB-practice-D.1-D.3/
├── index.html                    # Main HTML file
├── app.js                        # Question loading and display logic
├── styles.css                    # Styling
├── Topic D paper 2.md           # 20 Paper 2 questions
├── Topic D multiple choice.md   # 100 Multiple Choice questions
├── README.md                     # This file
└── [PDF files]                  # Reference materials
```

## Technical Details

- **Markdown Parsing**: Uses Marked.js library to render markdown content
- **Pure JavaScript**: No framework dependencies (vanilla JS)
- **Responsive CSS**: Mobile-friendly design
- **Topic Detection**: Automatic categorization based on question content

## Troubleshooting

**Questions not loading?**
- Make sure all markdown files are in the same directory as index.html
- Check browser console (F12) for error messages
- Try using a local server instead of opening the file directly

**Only 3 questions showing?**
- This issue has been fixed! The app now properly loads all 120 questions
- Clear your browser cache and reload

**Styling looks broken?**
- Ensure styles.css is in the same directory
- Check browser console for loading errors

## License

Educational use for IB Physics students.

## Questions?

All questions are from official IB Physics past papers and practice materials for Topic D (Fields).
