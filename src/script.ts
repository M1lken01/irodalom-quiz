const puzzle = [
  { question: 'question is 1234', answer: 'MTIzNA==' },
  { question: 'question is asdf', answer: 'YXNkZg==' },
];
const encodeStr = (decodedStr: string) => btoa(decodedStr);
const decodeStr = (encodedStr: string) => atob(encodedStr);
const decodedAnswers = puzzle.map((item) => decodeStr(item.answer));
const codeEncoded = 'MTIzNA==';
const code = decodeStr(codeEncoded);

const charInputClass = 'char-input';
const container = document.getElementById('char-input-container') as HTMLDivElement;
const charInputFields = () => container.getElementsByClassName(charInputClass) as HTMLCollectionOf<HTMLInputElement>;
let chars = 0;

function moveCursor(event: KeyboardEvent, input: HTMLInputElement, index: number) {
  const { keyCode } = event;
  const backSpace = keyCode === 8 && input.value === '';
  if (keyCode === 13 && index === charInputFields().length - 1) {
    checkCode();
  } else if (backSpace || (input.value.length === input.maxLength && keyCode !== 8)) {
    const nextInput = charInputFields()[index + (backSpace ? -1 : 1)] as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }
}

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
    charInputFields()[i].classList.remove('red', 'green');
    const state = incorrect.indexOf(i) > -1 ? 'red' : 'green';
    charInputFields()[i].classList.add(state);
  }
  if (!incorrect.length) alert('Success!'); // todo make finisher ig
}

function drawRow(index: number) {
  const answer = decodeStr(puzzle[index].answer);
  const label = document.createElement('label');
  label.innerText = puzzle[index].question;
  container.appendChild(label);
  for (let i = chars; i - chars < answer.length; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = charInputClass;
    input.maxLength = 1;
    container.appendChild(input);
    input.addEventListener('keydown', (event) => moveCursor(event, input, i));
  }
  container.appendChild(document.createElement('br'));
  chars += answer.length;
}

const findIncorrectIndexes = (correctStr: string, testStr: string): number[] =>
  [...correctStr].reduce((acc: number[], char: string, index: number) => (char !== testStr[index] ? [...acc, index] : acc), []);

function init() {
  for (let i = 0; i < puzzle.length; i++) {
    drawRow(i);
  }
}

init();
