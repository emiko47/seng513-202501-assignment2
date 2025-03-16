

function Quiz () {


    const username = "";
    const score = 0;
    const difficulty = "";
    const category = "";

    const currentQuestion = "";
    const index = 0;

}



function fetchQuestions(category, difficulty) {
    const url = "https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple";

    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true); // true makes the request asynchronous

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            // Success: parse JSON and log to console
            const data = JSON.parse(xhr.responseText);
            console.log("Questions fetched:", data);
        } else {
            // Server returned an error status.
            console.error("Server returned an error:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        // Network error handling
        console.error("Network error occurred.");
    };

    xhr.timeout = 5000; // 5 seconds timeout (optional but recommended)

    xhr.ontimeout = function() {
        console.error("Request timed out.");
    };

    xhr.send();
}

