// select elements
const countSpan = document.querySelector('.count span');
const bulletsContainer = document.querySelector('.bullets');
const bulletsSpans = document.querySelector('.bullets .spans');
const quizArea = document.querySelector('.quiz-area');
const answersArea = document.querySelector('.answers-area');
const submitButton = document.querySelector('.submit-button');
const results = document.querySelector('.results');
const countdown = document.querySelector('.countdown');

let current = 0;
let rightAnswer = 0;
let countdownInterval;

const fetchData = async () => {
  const response = await fetch('app/json/questions.json');
  const data = await response.json();
  let questionsCount = data.length;

  createBullets(questionsCount);
  showData(data[current], questionsCount);

  // countTimer
  countTimer(60, questionsCount);

  submitButton.addEventListener('click', () => {
    if (current < questionsCount) {
      // check answer
      let trueAnswer = data[current].right_answer;
      current++;
      checkAnswer(trueAnswer, questionsCount);

      // remove current question and answers
      quizArea.innerHTML = '';
      answersArea.innerHTML = '';

      // show next question data
      showData(data[current], questionsCount);

      // handle bullets classes
      handleBullets();

      // countTimer
      clearInterval(countdownInterval);
      countTimer(60, questionsCount);
      
    }

    // show results
    showResults(questionsCount);
  });
};
fetchData();

const createBullets = (num) => {
  countSpan.innerHTML = num;
  // create spans bullets
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement('span');
    if (i === 0) { 
      bullet.className = 'on';
    }
    bulletsSpans.appendChild(bullet);
  };
};

const showData = (data, qCount) => {
  if (current < qCount) {
    //create question title
    let questionTitle = document.createElement('h2');
    let questionText = document.createTextNode(data.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    // create question answers
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement('div');
      mainDiv.className = 'answer';

      let radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = 'questions';
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = data[`answer_${i}`];

      let radioLabel = document.createElement('label');
      radioLabel.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(data[`answer_${i}`]);
      radioLabel.appendChild(labelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(radioLabel);
      answersArea.appendChild(mainDiv);
    };
  };
};

const checkAnswer = (rAnswer, qCount) => {
  let answers = document.getElementsByName('questions');
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) { 
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    };
  }

  if (chosenAnswer === rAnswer) { 
    rightAnswer++;
  };
}

const handleBullets = () => {
  let bullets = document.querySelectorAll('.bullets .spans span');
  let arraySpans = Array.from(bullets);

  arraySpans.forEach((span, index) => {
    if (index === current) {
      span.className = 'on';
    };
  });
  
};

const showResults = (count) => {
  if (current === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsContainer.remove();
    
    if (rightAnswer === count) {
      results.innerHTML = `<span class="perfect">Perfect</span> Answered ${rightAnswer} from ${count}`
    } else if (rightAnswer > (count / 2) && rightAnswer < count) {
      results.innerHTML = `<span class="good">Good</span> Answered ${rightAnswer} from ${count}`
    } else {
      results.innerHTML = `<span class="bad">Bad</span> Answered ${rightAnswer} from ${count}`
    }
  };
};

const countTimer = (duration, count) => {
  if (current < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
    
      countdown.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
};