// Load text file
const fs = require("fs");
let masterText = "";

function loadText(filePath) {
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		masterText = data;
	});
}

// Textual markov chain generator
class MarkovMachine {
	// Build markov machine; read in text.

	constructor(text) {
		let words = text.split(/[ \r\n]+/);
		this.words = words.filter((c) => c !== "");
		this.data = new Map();
		this.makeChains();
	}

	/** set markov chains:
	 *
	 *  for text of "the cat in the hat", chains will be
	 *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

	makeChains() {
		let prevWord = null;

		for (let word of this.words) {
			if (!this.data.has(word)) {
				this.data.set(word, []);
			} else {
			}

			if (prevWord) {
				this.addToConnections(prevWord, word);
			}

			prevWord = word;
		}

		// Adds null as an option for the last word in the input
		const lastWord = [...this.data.keys()][this.data.size - 1];
		this.addToConnections(lastWord, null);
	}

	// Returns random text from the chains

	makeText(numWords = 100) {
		let output = "";

		// Initialize currentWord to a random word from this.data
		const randomWordIndex = Math.floor(Math.random() * this.data.size);
		let currentWord = [...this.data.keys()][randomWordIndex];

		for (let i = 0; i < numWords; i++) {
			const optionsForNextWord = this.data.get(currentWord);
			const numberOfOptions = this.data.get(currentWord).length;
			const randomOption =
				optionsForNextWord[Math.floor(Math.random() * numberOfOptions)];

			// Exits if option chosen is null, signaling end.
			if (randomOption == null) {
				break;
			}

			// Changes currentWord to the word chosen and appends it to the output string
			currentWord = randomOption;
			output += `${randomOption} `;
		}

		output = output.trimEnd();

		if (output.slice(-1) != ".") {
			output += "...";
		}

		return output;
	}

	addToConnections(word, wordToAdd) {
		let tempArray = this.data.get(word);
		tempArray.push(wordToAdd);
		this.data.set(word, tempArray);
	}
}
