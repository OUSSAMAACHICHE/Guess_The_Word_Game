// Setting game name
let gameName = 'Guess The Word';
document.title = gameName;
document.getElementsByTagName('h1')[0].innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} Created by <span>Ouss_Ach</span> `;

// Setting game options 
let triesCount = 5;
let lettersCount = 5;
let currentTry = 1;
let numberOfHints = 2;

// manage words 
let wordsGuess = '';
const words = ["Happy", "Amber", "Funny", "Beach", "Fable", "Magic", "Could", "Smile", "Grace"];
// random number with words
wordsGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

console.log(wordsGuess);
// get hint span element
const hintElement = document.querySelector('.hint span');
hintElement.innerHTML = numberOfHints;
const hintButton = document.querySelector('.hint');
hintButton.onclick = getHint;




function generateInput() {

	let inputContainer = document.querySelector('.inputs');

	for (let i = 1; i <= triesCount; i++) {
		const div = document.createElement('div');
		div.classList.add(`try-${i}`);
		div.innerHTML = `<span>Try ${i}</span>`;

		// check current input
		if (i !== 1) div.classList.add('hidden');

		for (let j = 1; j <= lettersCount; j++) {
			const input = document.createElement('input');
			input.type = "text";
			input.id = `guess-${i}-letter-${j}`;
			input.setAttribute('maxLength', '1');

			div.appendChild(input);
		}

		// append div to container
		inputContainer.appendChild(div);
	}
	// focus current input
	inputContainer.children[0].children[1].focus();

	// hidden all inputs except first one
	const hiddenInputs = document.querySelectorAll('.hidden input');
	hiddenInputs.forEach(input => input.disabled = true)

	// Select inputs 
	let inputs = document.querySelectorAll('input');
	inputs.forEach((e, index) => {
		// Convert inputs to Uppercase
		e.addEventListener('input', function () {
			this.value = this.value.toUpperCase();
			let nextInput = inputs[index + 1];
			if (nextInput) nextInput.focus();
		});

		e.addEventListener('keydown', function (event) {
			// console.log(event.key)
			let currentIndex = Array.from(inputs).indexOf(event.target);
			// if press ArrowRight button
			if (event.key === "ArrowRight") {

				let nextInput = currentIndex + 1;
				if (nextInput < inputs.length) inputs[nextInput].focus();
			}
			// if press ArrowLeft button
			if (event.key === "ArrowLeft") {

				let prevInput = currentIndex - 1;
				if (prevInput >= 0) inputs[prevInput].focus();
			}
		});
	});
}

let guessButton = document.querySelector('.check');
guessButton.addEventListener('click', handlGuesses);

function handlGuesses() {
	let sucessGuess = true;

	for (let i = 1; i <= lettersCount; i++) {
		const inputField = document.getElementById(`guess-${currentTry}-letter-${i}`);

		// get letter of the word
		let wordLetter = wordsGuess[i - 1];
		let inputLetter = inputField.value.toLowerCase();
		// logic of guess letters 
		if (inputLetter === wordLetter && inputLetter !== '') {
			inputField.classList.add('in-place');

		} else if (wordsGuess.indexOf(inputLetter) !== -1 && inputLetter !== '') {
			inputField.classList.add('not-in-place');
			sucessGuess = false;
		} else {
			inputField.classList.add('no');
			sucessGuess = false;
		}
	}

	// check if user win or lose
	if (sucessGuess) {

		// if user win 
		const tryDiv = document.querySelector(`.try-${currentTry}`);
		tryDiv.classList.add('hidden');
		let inputGuess = document.querySelectorAll(`.try-${currentTry} input`);
		// disabled input & button & hint
		inputGuess.forEach(input => input.disabled = true);
		guessButton.disabled = true;
		document.querySelector('.hint').disabled = true;

		// message 
		const message = document.querySelector('.message');
		message.innerHTML = `You Win After <span>${currentTry > 1 ? currentTry + ' Tries': currentTry + ' Try'}</span> The Word Is : <span>${wordsGuess}</span> `;

		// check if use hints or not
		if(numberOfHints === 2) {
			message.innerHTML = `You Win The Word Is <span>${wordsGuess}</span><p>Good job You Didnt use any hint</p>`;
		}

	} else {
		// if user lose
		const tryDiv = document.querySelector(`.try-${currentTry}`);
		tryDiv.classList.add('hidden');
		const allInputsTry = document.querySelectorAll(`.try-${currentTry} input`);
		allInputsTry.forEach(input => input.disabled = true);

		
		if(currentTry < triesCount) {
			// increase try
			currentTry++;

			const nextTryInput = document.querySelectorAll(`.try-${currentTry} input`);
			nextTryInput.forEach(input => input.disabled = false);
	
			document.querySelector(`.try-${currentTry}`).classList.remove('hidden');

			nextTryInput[0].focus();

		} else {
			const wrongMsg = document.querySelector('.message');
			wrongMsg.innerHTML = `You Lose The Word Is <span>${wordsGuess}</span><p>You need more focus</p>`;
			guessButton.disabled = true;
			document.querySelector('.hint').disabled = true;
		}
	}
}

// get hint function 
function getHint() {

	if(numberOfHints > 0) {
		numberOfHints--;
		hintElement.innerHTML = numberOfHints;
	}

	if(numberOfHints === 0) {
		document.querySelector('.hint').disabled = true;
	}

	let enabledInputs = document.querySelectorAll('input:not([disabled])');
	let emptyEnabledInputs = Array.from(enabledInputs).filter(input => input.value === '');

	if(emptyEnabledInputs.length > 0) {
		// get random index
		let randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
		let randomEmptyInput = emptyEnabledInputs[randomIndex];

		// let randomLetter = wordsGuess[Math.floor(Math.random() * wordsGuess.length)].toUpperCase();
		let indexToFill = Array.from(enabledInputs).indexOf(randomEmptyInput);
		
		randomEmptyInput.value = wordsGuess[indexToFill].toUpperCase();

		console.log(indexToFill)

		
	}
}

function handleBackSpace(event) {

	const enabledInputs = document.querySelectorAll('input:not([disabled])');

	let currentIndex = Array.from(enabledInputs).indexOf(document.activeElement);

	console.log(event.key);

	if(event.key === "Backspace"){

		if(currentIndex > 0) {
			
			const currentInput = enabledInputs[currentIndex];
			const prevInput = enabledInputs[currentIndex - 1];
			prevInput.focus();
			currentInput.value = '';
			prevInput.value = '';
			
		}


	}

}

document.addEventListener('keydown', handleBackSpace);


window.onload = function () {
	generateInput();
}
