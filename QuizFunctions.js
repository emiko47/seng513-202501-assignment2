
// Part 1: Quiz Logic.
//The functions here define the Quiz class, which includes a constructor, a start method, a questionGenerator method, and a displayQuestion method.
//The Quiz class also includes a checkAnswer method that checks if the selected answer is correct and increments the score accordingly.

class Quiz {
    constructor() {
        this.questions = [];//quiz object will beninitiated with an array of question objects ( question object included question itself and answers)
        this.score = 0;//global score variable
        this.questionIterator = null; // Generator instance
        this.userAnswers = []; // Store user answers
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

        this.showFinalResults();
        
    }




    displayQuestion(index) {
        const question = this.questions[index];
        document.getElementById("question_here").innerHTML = question.text;

        // Clear previous buttons
        const options = [...question.choices];
        document.querySelectorAll("#quiz button").forEach((btn, idx) => {
            btn.style.display = idx < options.length ? "inline-block" : "none";
            btn.innerText = options[idx] || "";
            btn.disabled = false; 
            btn.onclick = () => this.checkAnswer.call(this, [options[idx], question.correctAnswer]);
        });

        document.getElementById("next").style.display = "none"; // Hide at the start of each question

    }



    checkAnswer(selected, correctAnswer) {
        var feedbackElement = document.createElement("div");
        feedbackElement.style.fontWeight = "bold";
        feedbackElement.style.marginTop = "10px";
        feedbackElement.style.padding = "5px";
        feedbackElement.style.borderRadius = "5px";
        feedbackElement.style.display = "inline-block";
        
        if (selected === correctAnswer) {
            this.score++;
            feedbackElement.style.color = "green";
            feedbackElement.style.backgroundColor = "#d4edda";  
            feedbackElement.innerText = "✅ Correct!";
        } else {
            feedbackElement.style.color = "red";
            feedbackElement.style.backgroundColor = "#f8d7da"; 
            feedbackElement.innerText = "❌ Incorrect! The correct answer is: " + correctAnswer;
        }
        
        // Append feedback message below the question
        var questionContainer = document.getElementById("question_here");
        questionContainer.appendChild(feedbackElement);

        // Save user's answer for review at the end of the quiz
        this.userAnswers.push({
            question: questionContainer.innerText,
            selected: selected,
            correctAnswer: correctAnswer
        });

        // Disable all answer buttons to prevent multiple selections
             var answerButtons = document.querySelectorAll("#quiz button");
            for (var i = 0; i < answerButtons.length; i++) {
                 answerButtons[i].disabled = true;
            }

        // Display the "Next" button after answering
            document.getElementById("next").style.display = "inline-block";

        // Update and display the current score
        document.getElementById("score_display").innerText = "Score: " + this.score;

        }
    
    
    showFinalResults() {
    var reviewContainer = document.createElement("div");
    var resultHeading = document.createElement("h3");
    resultHeading.innerText = "Review Your Answers:";
    reviewContainer.appendChild(resultHeading);

    // Loop through each user's answer and generate review content
    for (var i = 0; i < this.userAnswers.length; i++) {
        var questionReview = document.createElement("p");
        var questionText = document.createElement("strong");
        questionText.innerText = "Q" + (i + 1) + ": " + this.userAnswers[i].question;
        
        var userAnswer = document.createElement("span");
        userAnswer.style.color = (this.userAnswers[i].selected === this.userAnswers[i].correctAnswer) ? "green" : "red";
        userAnswer.innerHTML = "<br>Your Answer: " + this.userAnswers[i].selected;

        var correctAnswer = document.createElement("span");
        correctAnswer.innerHTML = "<br>Correct Answer: " + this.userAnswers[i].correctAnswer;

        // Append question details
        questionReview.appendChild(questionText);
        questionReview.appendChild(userAnswer);
        questionReview.appendChild(correctAnswer);
        
        reviewContainer.appendChild(questionReview);
        reviewContainer.appendChild(document.createElement("hr"));
    }

    // Final score display
    var finalScore = document.createElement("h2");
    finalScore.innerText = "Quiz Complete! Your final score is: " + this.score;
    reviewContainer.appendChild(finalScore);

    // Replace the quiz container with the final review
    var quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "";  // Clear previous content
    quizContainer.appendChild(reviewContainer);
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

document.addEventListener("DOMContentLoaded", function () {
    let nextButton = document.getElementById("next");
    if (nextButton) {
        nextButton.addEventListener("click", function () {
            if (!quiz.questionIterator) {
                return; // Exit early if quiz is not initialized
            }
    
            var nextQuestion = quiz.questionIterator.next(); // Move to the next question
            
            if (nextQuestion.done) { 
                quiz.showFinalResults(); // Show final review when quiz is done
            } else {
                nextButton.style.display = "none"; // Hide "Next" button again until an answer is chosen
            }
        });
    }
    
});
