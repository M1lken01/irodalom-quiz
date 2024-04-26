const encodeStr = (decodedStr: string) => btoa(decodedStr);
type PuzzleItem = {
  question: string;
  secret: string;
  answer?: string;
  shift: number;
};
const puzzle: PuzzleItem[] = [
  { question: 'guy de mauoassant', secret: encodeStr('gömböc'), shift: 3 },
  { question: 'muveszi iranyzat', secret: encodeStr('panasszizmus'), shift: 1 },
  { question: 'Az ő műve volt a Bovarjné. Francia író', secret: encodeStr('flaubert'), shift: 3 },
  { question: 'andol iro, pickwick klub, es a twist oliver megalkotoja', secret: encodeStr('dickens'), shift: 0 },
  { question: 'az orosz realista irok', secret: encodeStr('fölösleges ember'), shift: 6 },
  { question: 'az o muve', secret: encodeStr('tolsztoj'), shift: 2 },
  {
    question: 'realista regeny fo tipusa. az elert karrier kovetkezteben a hos szemelyisege eltorzul, feladja erkolcsi elveit',
    secret: encodeStr('karrierregeny'),
    shift: 1,
  },
  {
    question:
      'szatorikus hangvetelu mu, melynek hoste szegeny csavargo, aki ugyessege es eszessege segitsegevel probal boldogulni. legfontossab formai jellegzetessege az egyes felzezetek kotetlen sorrendje',
    secret: encodeStr('pikareszk'),
    shift: 1,
  },
  //{ question: 'Hol játszódik Leo Tolstoy "Háború és béke"?', answer: encodeStr('oroszország'), shift: 0 },
  { question: 'lev nzekola jevics tolsztoj orosz iro', secret: encodeStr('haboru es beke'), shift: 4 },
  {
    question: 'A vilagirodalomban falubert mellett az o eletmuveben kezdodik el a hagyomanyos, klasszikus regenyforma atalakulasa.',
    secret: encodeStr('dosztojevszkij'),
    shift: 7,
  },
];
const decodeStr = (encodedStr: string) => atob(encodedStr);
puzzle.forEach((p) => (p.answer = decodeStr(p.secret)));
const decodedAnswers = puzzle.map((item) => decodeStr(item.secret));
const longestAnswer = Math.max(...decodedAnswers.map((obj) => obj.length));
const longestShift = Math.max(...puzzle.map((obj) => obj.shift));
const longestAnswerWithShift = Math.max(...puzzle.map((item) => (item.answer || '').length + (longestShift - item.shift) + 1));

const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const charInputClass = 'char-input';
const container = document.getElementById('char-input-container') as HTMLDivElement;
const questionContainer = document.getElementById('question-container') as HTMLOListElement;
const charInputFields = () => container.getElementsByClassName(charInputClass) as HTMLCollectionOf<HTMLInputElement>;
let chars = 0;

function moveCursor(event: KeyboardEvent, input: HTMLInputElement, index: number) {
  console.log(index);
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
  if (!incorrect.length) alert('Sikeresen teljesítetted a kvízt!'); // todo make finisher ig
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
  //container.appendChild(document.createElement('br'));
  const br = document.createElement('div');
  br.classList.add('br');
  //br.style.gridColumn = longestAnswerWithShift.toString();
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
  //container.style.gridTemplateColumns = `repeat(${longestAnswerWithShift}, auto)`;
  for (let i = 0; i < puzzle.length; i++) {
    drawRow(i);
  }
}

const debug = 1;
init();
