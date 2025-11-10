// Question Bank Application
class QuestionBank {
    constructor() {
        this.paper2Questions = [];
        this.multipleChoiceQuestions = [];
        this.allQuestions = [];
        this.currentTab = 'paper2';
        this.currentFilter = 'all';
        this.searchTerm = '';

        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.displayQuestions();
    }

    async loadQuestions() {
        try {
            // Load Paper 2 questions
            const paper2Response = await fetch('Topic D paper 2.md');
            if (!paper2Response.ok) throw new Error('Failed to load Paper 2 questions');
            const paper2Text = await paper2Response.text();
            this.paper2Questions = this.parsePaper2Questions(paper2Text);

            // Load Multiple Choice questions
            const mcResponse = await fetch('Topic D multiple choice.md');
            if (!mcResponse.ok) throw new Error('Failed to load Multiple Choice questions');
            const mcText = await mcResponse.text();
            this.multipleChoiceQuestions = this.parseMultipleChoiceQuestions(mcText);

            // Combine all questions
            this.allQuestions = [
                ...this.paper2Questions.map(q => ({ ...q, type: 'paper2' })),
                ...this.multipleChoiceQuestions.map(q => ({ ...q, type: 'multiple-choice' }))
            ];

            console.log(`Loaded ${this.paper2Questions.length} Paper 2 questions`);
            console.log(`Loaded ${this.multipleChoiceQuestions.length} Multiple Choice questions`);
            console.log(`Total: ${this.allQuestions.length} questions`);

            document.getElementById('loading').style.display = 'none';
            document.getElementById('questions-container').style.display = 'block';

        } catch (error) {
            console.error('Error loading questions:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            document.getElementById('error-message').textContent = error.message;
        }
    }

    parsePaper2Questions(text) {
        const questions = [];
        // Split by question numbers (#### followed by number and period)
        const questionMatches = text.split(/####\s+(\d+)\./);

        // Start from index 1 (skip header), process in pairs
        for (let i = 1; i < questionMatches.length; i += 2) {
            const questionNumber = questionMatches[i];
            const questionContent = questionMatches[i + 1];

            if (questionContent && questionContent.trim()) {
                // Split question from answer
                const parts = questionContent.split(/Question \d+ Answers/);
                const questionText = parts[0] ? parts[0].trim() : '';
                const answerText = parts[1] ? parts[1].trim() : '';

                if (questionText) {
                    questions.push({
                        number: parseInt(questionNumber),
                        question: questionText,
                        answer: answerText,
                        topic: this.detectTopic(questionText)
                    });
                }
            }
        }

        return questions;
    }

    parseMultipleChoiceQuestions(text) {
        const questions = [];
        // Split by question number at start of line
        const lines = text.split('\n');
        let currentQuestion = null;
        let questionText = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check if line starts with a number (question number)
            const questionMatch = line.match(/^(\d+)\s+(.+)/);

            if (questionMatch) {
                // Save previous question if exists
                if (currentQuestion !== null && questionText) {
                    questions.push({
                        number: currentQuestion,
                        question: questionText.trim(),
                        topic: this.detectTopic(questionText),
                        type: 'multiple-choice'
                    });
                }

                // Start new question
                currentQuestion = parseInt(questionMatch[1]);
                questionText = questionMatch[2];
            } else if (currentQuestion !== null) {
                // Continue building current question
                questionText += '\n' + line;
            }
        }

        // Add last question
        if (currentQuestion !== null && questionText) {
            questions.push({
                number: currentQuestion,
                question: questionText.trim(),
                topic: this.detectTopic(questionText),
                type: 'multiple-choice'
            });
        }

        return questions;
    }

    detectTopic(text) {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('gravit') || lowerText.includes('orbit') ||
            lowerText.includes('kepler') || lowerText.includes('planet')) {
            return 'gravitational';
        }
        if (lowerText.includes('electric') || lowerText.includes('charge') ||
            lowerText.includes('potential') || lowerText.includes('field strength')) {
            return 'electric';
        }
        if (lowerText.includes('magnetic') || lowerText.includes('flux') ||
            lowerText.includes('wire') || lowerText.includes('current')) {
            return 'magnetic';
        }
        if (lowerText.includes('induc') || lowerText.includes('emf') ||
            lowerText.includes('faraday') || lowerText.includes('lenz')) {
            return 'induction';
        }

        return 'general';
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                this.currentTab = button.dataset.tab;
                this.displayQuestions();
            });
        });

        // Search
        document.getElementById('search').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.displayQuestions();
        });

        // Topic filter
        document.getElementById('topic-filter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.displayQuestions();
        });
    }

    displayQuestions() {
        const container = document.getElementById('questions-container');

        // Determine which questions to show based on current tab
        let questionsToShow = [];
        if (this.currentTab === 'paper2') {
            questionsToShow = this.paper2Questions;
        } else if (this.currentTab === 'multiple-choice') {
            questionsToShow = this.multipleChoiceQuestions;
        } else {
            questionsToShow = this.allQuestions;
        }

        // Apply filters
        questionsToShow = questionsToShow.filter(q => {
            // Topic filter
            if (this.currentFilter !== 'all' && q.topic !== this.currentFilter) {
                return false;
            }

            // Search filter
            if (this.searchTerm && !q.question.toLowerCase().includes(this.searchTerm)) {
                return false;
            }

            return true;
        });

        // Update count
        const totalCount = this.currentTab === 'paper2' ? this.paper2Questions.length :
                          this.currentTab === 'multiple-choice' ? this.multipleChoiceQuestions.length :
                          this.allQuestions.length;
        document.getElementById('question-count').textContent =
            `Showing ${questionsToShow.length} of ${totalCount} questions`;

        // Render questions
        container.innerHTML = questionsToShow.map((q, index) => this.renderQuestion(q, index)).join('');

        // Add toggle listeners for answers
        document.querySelectorAll('.toggle-answer').forEach(button => {
            button.addEventListener('click', (e) => {
                const answer = e.target.nextElementSibling;
                const isVisible = answer.style.display === 'block';
                answer.style.display = isVisible ? 'none' : 'block';
                e.target.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
            });
        });
    }

    renderQuestion(question, index) {
        const typeLabel = question.type === 'paper2' ? 'Paper 2' : 'Multiple Choice';
        const topicBadge = this.getTopicBadge(question.topic);

        // Convert markdown to HTML using marked.js
        const questionHtml = marked.parse(question.question);
        const answerHtml = question.answer ? marked.parse(question.answer) : '';

        return `
            <div class="question-card" data-question-id="${index}">
                <div class="question-header">
                    <div class="question-meta">
                        <span class="question-number">Question ${question.number}</span>
                        <span class="question-type ${question.type}">${typeLabel}</span>
                        ${topicBadge}
                    </div>
                </div>
                <div class="question-content">
                    ${questionHtml}
                </div>
                ${question.answer ? `
                    <div class="answer-section">
                        <button class="toggle-answer">Show Answer</button>
                        <div class="answer-content" style="display: none;">
                            ${answerHtml}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getTopicBadge(topic) {
        const topicLabels = {
            'gravitational': 'Gravitational Fields',
            'electric': 'Electric Fields',
            'magnetic': 'Magnetic Fields',
            'induction': 'EM Induction',
            'general': 'General'
        };

        return `<span class="topic-badge ${topic}">${topicLabels[topic] || topic}</span>`;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuestionBank();
});
