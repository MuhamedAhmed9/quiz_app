const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const settings = document.querySelector(".settings");
const difficulty = document.getElementById("difficulty-type");
const category = document.getElementById("cat");
const questionsNum = document.getElementById("q-count");
let scoreElement = document.createElement("h2");

startButton.addEventListener("click", startGame);

let shuffledQuestions = [],
  currentQuestionIndex,
  score = 0;

let questions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "4", correct: true },
      { text: "22", correct: false },
    ],
  },
  {
    question: "Who is the best YouTuber?",
    answers: [
      { text: "Web Dev Simplified", correct: false },
      { text: "Traversy Media", correct: false },
      { text: "Dev Ed", correct: true },
      { text: "Fun Fun Function", correct: false },
    ],
  },
  {
    question: "Is web development fun?",
    answers: [
      { text: "Kinda", correct: false },
      { text: "YES!!!", correct: true },
      { text: "Um no", correct: false },
      { text: "IDK", correct: false },
    ],
  },
  {
    question: "What is 4 * 2?",
    answers: [
      { text: "6", correct: false },
      { text: "8", correct: true },
    ],
  },
];

async function fetchQuestions() {
  questions = [];
  shuffledQuestions = [];
  const settings = {
    difficulty: difficulty.value,
    category: category.value,
    type: "multiple",
    amount: questionsNum.value,
  };
  let response = await fetch(
    `https://opentdb.com/api.php?amount=${settings.amount}&category=${settings.category}&difficulty=${settings.difficulty}&type=multiple`
  );
  let data = await response.json();
  let finalResults = data.results;
  // console.log(finalResults); //array of objects
  finalResults.forEach((q) => {
    let question = q.question;
    let answers = [];
    q.incorrect_answers.forEach((answer) => {
      answers.push({ text: answer, correct: false });
    });
    answers.splice(Math.floor(Math.random() * answers.length), 0, {
      text: q.correct_answer,
      correct: true,
    });
    questions.push({ question, answers });
  });
}

async function startGame() {
  settings.style.display = "none";
  await fetchQuestions();
  questionContainerElement.style.display = "block";
  scoreElement.remove();
  startButton.classList.add("hide");
  while (questions.length != 0) {
    shuffledQuestions.push(
      questions.splice(Math.floor(Math.random() * questions.length), 1)[0]
    );
  }
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
}

function setNextQuestion() {
  document.body.removeAttribute("class");
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

nextButton.addEventListener("click", () => {
  nextButton.classList.add("hide");
  currentQuestionIndex++;
  setNextQuestion();
});

function showQuestion(question) {
  answerButtonsElement.innerHTML = "";
  let index_num = 0;
  questionElement.innerHTML = question.question;
  question.answers.forEach((ans, idx) => {
    let button = document.createElement("button");
    button.innerText = ans.text;
    button.classList.add("btn");
    button.dataset.index = index_num + idx + 1;
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function selectAnswer(e) {
  if (
    shuffledQuestions[currentQuestionIndex].answers[
      e.currentTarget.dataset.index - 1
    ].correct == true
  ) {
    Array.from(answerButtonsElement.children).forEach((btn) => {
      if (btn != e.target) {
        btn.classList.add("wrong");
      }
      btn.removeEventListener("click", selectAnswer);
    });
    document.body.classList.add("correct");
    e.target.classList.add("correct");
    score++;
  } else {
    Array.from(answerButtonsElement.children).forEach((btn) => {
      btn.removeEventListener("click", selectAnswer);
      if (
        shuffledQuestions[currentQuestionIndex].answers[btn.dataset.index - 1]
          .correct == true
      ) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
    });
    document.body.classList.add("wrong");
  }
  if (currentQuestionIndex == shuffledQuestions.length - 1) {
    questionContainerElement.style.display = "none";
    scoreElement = document.createElement("h2");
    scoreElement.style.cssText = "text-align: center; margin: 30px 0;";
    scoreElement.innerHTML = `Your score is ${score}/${shuffledQuestions.length}`;
    questionContainerElement.after(scoreElement);
    nextButton.classList.add("hide");
    startButton.innerText = "Restart";
    startButton.classList.remove("hide");
    settings.style.display = "block";
  } else {
    nextButton.classList.remove("hide");
  }
}
