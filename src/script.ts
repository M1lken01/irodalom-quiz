const encodeStr = (decodedStr: string) => btoa(decodedStr);
type PuzzleItem = {
  question: string;
  secret: string;
  answer?: string;
  shift: number;
};
const puzzle: PuzzleItem[] = [
  { question: 'Guy de Maupassant elbeszélő költeménye, ami 1880-ban jelent meg, s ez hozta el számára a hírnevet.', secret: 'Z/ZtYvZj', shift: 3 },
  {
    question: 'Művészi irányzat. Képviselői tagadják a romantikus költői szerepeket, helyette a sorsszerűséget és az öncélú művészetet hirdették.',
    secret: 'cGFuYXNzeml6bXVz',
    shift: 1,
  },
  { question: 'Az ő műve volt a Bovaryné. Francia író.', secret: 'ZmxhdWJlcnQ=', shift: 3 },
  { question: 'Angol író, a Pickwick Klub és a Twist Oliver megalkotója.', secret: 'ZGlja2Vucw==', shift: 0 },
  {
    question: 'Az orosz realista írók műveinek hősei, akik valamilyen magasabb elhivatottság nélkül, üresen tengetik életüket.',
    secret: 'ZvZs9nNsZWdlcyBlbWJlcg==',
    shift: 6,
  },
  {
    question: 'Az ő műve volt az Anna Karenina. Thomas Mann szerint „a világirodalom legnagyobb társadalmi regényét”-írta meg.',
    secret: 'dG9sc3p0b2o=',
    shift: 2,
  },
  {
    question: 'Realista regény fő típusa. Az elért karrier következtében a hős személyisége eltorzul, feladja erkölcsi elveit.',
    secret: 'a2FycmllcnJlZ+lueQ==',
    shift: 1,
  },
  {
    question:
      'Szatirikus hangvételű mű, melynek hőse szegény csavargó, aki ügyessége és eszessége segítségével próbál boldogulni. Legfontossab formai jellegzetessége az egyes fejezetek kötetlen sorrendje.',
    secret: 'cGlrYXJlc3pr',
    shift: 1,
  },
  {
    question: 'Lev Nyikolajevics Tolsztoj orosz író egyik fő alkotása, kulcsfontosságú dokumentuma az orosz realista regény fejlődésének.',
    secret: 'aOFib3L6IOlzIGLpa2U=',
    shift: 4,
  },
  {
    question: 'A világirodalomban Flaubert mellett az ő életművében kezdődik el a hagyományos, klasszikus regényforma átalakulása.',
    secret: 'ZG9zenRvamV2c3praWo=',
    shift: 7,
  },
];
const decodeStr = (encodedStr: string) => atob(encodedStr);
puzzle.forEach((p) => (p.answer = decodeStr(p.secret)));
const decodedAnswers = puzzle.map((item) => decodeStr(item.secret));
const longestAnswer = Math.max(...decodedAnswers.map((obj) => obj.length));
const longestShift = Math.max(...puzzle.map((obj) => obj.shift));
const longestAnswerWithShift = Math.max(...puzzle.map((item) => (item.answer || '').length + (longestShift - item.shift) + 1));

const capitalizeFirstLetter = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const charInputClass = 'char-input';
const container = document.getElementById('char-input-container') as HTMLDivElement;
const questionContainer = document.getElementById('question-container') as HTMLOListElement;
const charInputFields = () => container.getElementsByClassName(charInputClass) as HTMLCollectionOf<HTMLInputElement>;
let chars = 0;

function moveCursor(event: KeyboardEvent, input: HTMLInputElement, index: number) {
  const { keyCode } = event;
  const backSpace = keyCode === 8 && input.value === '';
  cleanInput(input);
  if (keyCode === 13 && index === charInputFields().length - 1) {
    checkCode();
  } else if (backSpace || (input.value.length === input.maxLength && keyCode !== 8)) {
    const nextInput = charInputFields()[index + (backSpace ? -1 : keyCode === 37 ? -1 : 1)] as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
      cleanInput(nextInput);
    }
  }
}

const cleanInput = (elem: HTMLInputElement) => elem.classList.remove('red', 'green');

function clearInputs() {
  const inputs = Array.prototype.slice.call(charInputFields()) as HTMLInputElement[];
  for (const input of inputs) input.value = '';
  inputs[0]?.focus();
}

function checkCode() {
  const enteredCode = Array.from(charInputFields())
    .map((input) => input.value || ' ')
    .join('');
  const incorrect = findIncorrectIndexes(decodedAnswers.join(''), enteredCode);
  for (let i = 0; i < charInputFields().length; i++) {
    cleanInput(charInputFields()[i]);
    const state = incorrect.indexOf(i) > -1 ? 'red' : 'green';
    charInputFields()[i].classList.add(state);
  }
  const solution = Array.from(document.getElementsByClassName('main') as HTMLCollectionOf<HTMLInputElement>)
    .map((el) => el.value)
    .join('');
  if (!incorrect.length) alert(`Sikeresen teljesítetted a kvízt! Megoldas: "${capitalizeFirstLetter(solution)}"`);
  else alert(`Sikertelen! ${Math.round(((decodedAnswers.join('').length - incorrect.length) / decodedAnswers.join('').length) * 100)}%`);
}

function drawRow(index: number) {
  const answer = puzzle[index].answer || '';
  const label = document.createElement('label');
  label.innerText = `${index + 1}.`;
  container.appendChild(label);
  const question = document.createElement('li');
  question.innerText = puzzle[index].question;
  questionContainer.appendChild(question);
  if (puzzle[index].shift !== longestShift) {
    const shift = document.createElement('div');
    shift.style.gridColumn = ((longestShift - puzzle[index].shift || 0) + 1).toString();
    container.appendChild(shift);
  }
  for (let i = chars; i - chars < answer.length; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = debug ? answer[i - chars] : '';
    input.className = charInputClass;
    if (i - chars == puzzle[index].shift) input.classList.add('main');
    input.maxLength = 1;
    container.appendChild(input);
    input.addEventListener('keydown', (event) => moveCursor(event, input, i));
  }
  const br = document.createElement('div');
  br.classList.add('br');
  container.appendChild(br);
  chars += answer.length;
}

const findIncorrectIndexes = (correctStr: string, testStr: string): number[] =>
  [...correctStr].reduce(
    (acc: number[], char: string, index: number) =>
      removeAccents(char.toLocaleLowerCase()) !== removeAccents(testStr[index].toLocaleLowerCase()) ? [...acc, index] : acc,
    [],
  );

function init() {
  document.documentElement.style.setProperty('--puzzle-cols', longestAnswerWithShift.toString());
  for (let i = 0; i < puzzle.length; i++) {
    drawRow(i);
  }
}

const debug = 1;
init();
