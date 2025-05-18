// List of keywords for subject inference
const subjectKeywords = {
  "Social": ["continent", "country", "capital", "latitude", "longitude", "climate", "region"],
  "Physics": ["temperature","heat", "wave","frequency", "sound","light",],
  "Chemistry": ["atom", "molecule", "reaction", "acid", "base"],
  "Mathematics": [  "number","prime","integer","rational","real","complex","sequence","series"]
};


function getSubject(question) {
  const lowerQ = question.toLowerCase();
  let bestSubject = "General";
  let highestScore = 0;

  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerQ.includes(keyword)) {
        score++;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestSubject = subject;
    }
  }

  return bestSubject;
}


function saveFlashcard(flashcard) {
  const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  flashcards.push(flashcard);
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function getFlashcardsByStudent(studentId) {
  const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  return flashcards.filter(f => f.student_id === studentId);
}


function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

document.getElementById('flashcard-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const studentId = document.getElementById('studentId').value.trim();
  const question = document.getElementById('question').value.trim();
  const answer = document.getElementById('answer').value.trim();

  if (!studentId || !question || !answer) {
    alert('Please fill all fields.');
    return;
  }

  const subject = getSubject(question);

  const newFlashcard = {
    student_id: studentId,
    question: question,
    answer: answer,
    subject: subject
  };

  saveFlashcard(newFlashcard);

  alert(`Flashcard added successfully: ${subject}`);
  document.getElementById('flashcard-form').reset();
});



document.getElementById('get-flashcards-btn').addEventListener('click', function() {
  const studentId = document.getElementById('studentId').value.trim();
  const limit = parseInt(document.getElementById('limit').value);

  if (!studentId) {
    alert('Please enter Student ID to retrieve flashcards.');
    return;
  }

  const allFlashcards = getFlashcardsByStudent(studentId);


shuffleArray(allFlashcards);

  

const selectedFlashcards = allFlashcards.slice(0, limit);


const container = document.getElementById('flashcards-container');
container.innerHTML = '';

  if (selectedFlashcards.length === 0) {
    container.innerHTML = '<p>No flashcards found for this student.</p>';
    return;
}

selectedFlashcards.forEach(f => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'flashcard';

cardDiv.innerHTML = `
      <h3>Subject: ${f.subject}</h3>
      <p><strong>Q:</strong> ${f.question}</p>
      <p><strong>A:</strong> ${f.answer}</p>
    `;
container.appendChild(cardDiv);
  });
});



