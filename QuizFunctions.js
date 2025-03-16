
// Part 1: Quiz Logic.
//The functions here define the Quiz class, which includes a constructor, a start method, a questionGenerator method, and a displayQuestion method.
//The Quiz class also includes a checkAnswer method that checks if the selected answer is correct and increments the score accordingly.

class Quiz {
    constructor() {
        this.questions = [];//quiz object will beninitiated with an array of question objects ( question object included question itself and answers)
        this.score = 0;//global score variable
        this.questionIterator = null; // Generator instance
    }

    async start(category, difficulty) {//this start funtction simply calls the fetchQuestions function and initializes the question generator.
        this.questions = await fetchQuestions(category, difficulty);
        if (this.questions.length === 0) {
            alert("No questions available. Please try again.");
            return;
        }

        console.log(this.questions);

        this.score = 0;
        this.questionIterator = this.questionGenerator(); // Initialize generator
        this.questionIterator.next(); // Start quiz
    }

    *questionGenerator() {//JS generator function that uses yield to call the displayQuestion method for each question in the quiz.
        for (let i = 0; i < this.questions.length; i++) {
            yield this.displayQuestion(i);
        }
        alert(`Quiz complete! Your final score is: ${this.score}`);
    }

    displayQuestion(index) {
        const question = this.questions[index];
        document.getElementById("question_here").innerHTML = question.text;

        // Clear previous buttons
        const options = [...question.choices];
        document.querySelectorAll("#quiz button").forEach((btn, idx) => {
            btn.style.display = idx < options.length ? "inline-block" : "none";
            btn.innerText = options[idx] || "";
            btn.onclick = () => this.checkAnswer(options[idx], question.correctAnswer);
        });
    }

    checkAnswer(selected, correctAnswer) {
        if (selected === correctAnswer) {
            this.score++;
        }
        this.questionIterator.next(); // Move to next question
    }
}

// Instantiate quiz globally
const quiz = new Quiz();

// ========================
// SECTION 2: Fetch Questions
// ========================
class Question {
    constructor(text, choices, correctAnswer) {
        this.text = text;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
    }
}

async function fetchQuestions(category, difficulty) {
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.map(q => 
            new Question(
                q.question, 
                [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5), 
                q.correct_answer
            )
        );
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}

// ========================
// SECTION 3: UI & Event Listeners
// ========================
function startQuiz() {
    console.log("Starting quiz...");
    const usernameInput = document.getElementById("username").value.trim();
    if (!usernameInput) {
        alert("Please enter a username before starting the quiz.");
        return;
    }
    window.username = usernameInput; // Store globally

    document.getElementById("quiz").style.display = "block";

    const category = document.getElementById("categories").value;
    const difficulty = document.getElementById("difficulties").value;
    quiz.start(category, difficulty);
}

// Attach event listener to start button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("start-btn").addEventListener("click", startQuiz);
});