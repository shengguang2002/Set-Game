/*
 * Name: Hanyang Yu
 * Date: April 27, 2023
 * Section: CSE 154 AF
 * TA: Donovan Kong && Sonia Saitawdekar
 * This is the JS to implement the Card Game to the set.html.
 * It is a game that the player can select cards for certian rules,
 * if they success, they will receive 1 count as credit.
 * There are different time length and difficulty provided.
 */
"use strict";
(function() {
  let timerId = null;
  let remainingSeconds = null;

  window.addEventListener("load", init);

  function init() {
    id('start-btn').addEventListener('click', toggleViews);
	id('start-btn').addEventListener('click', startTimer);
	id('start-btn').addEventListener('click', generateCards);
	id('refresh-btn').addEventListener('click', generateCards);
	id('back-btn').addEventListener('click', toggleViews);
	id('back-btn').addEventListener('click', reset);
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
	let attributes = [];
	for (let i = 0; i < selected.length; i++) {
	  attributes.push(selected[i].id.split("-"));
	}
	for (let i = 0; i < attributes[0].length; i++) {
	  let diff = attributes[0][i] !== attributes[1][i] &&
	  attributes[1][i] !== attributes[2][i] &&
	  attributes[0][i] !== attributes[2][i];
	  let same = attributes[0][i] === attributes[1][i] &&
	  attributes[1][i] === attributes[2][i];
	  if (!(same || diff)) {
		return false;
	  }
	}
	return true;
  }

  function reset() {
	endGame();
	qs("#refresh-btn").disabled = false;
	let setCount = id('set-count');
	setCount.textContent = 0;
  }

  function generateCards() {
	clearBoard();
	const board = id("board");
	const CARD_NUM = 12;
	let whetherEasy = difficultyCheck();
	for (let i = 0; i < CARD_NUM; i++) {
	  const card = generateUniqueCard(whetherEasy);
	  board.appendChild(card);
	}
  }

  function clearBoard() {
	const board = id('board');
	board.innerHTML = '';
  }


  function generateRandomAttributes(isEasy) {
	const STYLE = ['solid', 'outline', 'striped'];
	const SHAPE = ['diamond', 'oval', 'squiggle'];
	const COLOR = ['green', 'purple', 'red'];
	const COUNT = [1, 2, 3];
	let styleIndex = isEasy ? 0 : Math.floor(Math.random() * STYLE.length);
	let shapeIndex = Math.floor(Math.random() * SHAPE.length);
	let colorIndex = Math.floor(Math.random() * COLOR.length);
	let countIndex = Math.floor(Math.random() * COUNT.length);
	return [STYLE[styleIndex], SHAPE[shapeIndex], COLOR[colorIndex], COUNT[countIndex]];
  }

  function generateUniqueCard(isEasy) {
	let cardId = generateUniqueCardId(isEasy);
	let [style, shape, color, count] = cardId.split('-');
	let card = document.createElement("div");
	card.id = cardId;
	card.classList.add("card");
	card.addEventListener("click", cardSelected);
	for (let i = 0; i < count; i++) {
      let img = document.createElement("img");
	  img.src = `img/${style}-${shape}-${color}.png`;
	  img.alt = cardId;
	  card.appendChild(img);
	}
	return card;
  }

  function generateUniqueCardId(isEasy) {
	let unique = false;
	let cardId;
	while (!unique) {
	  let attributes = generateRandomAttributes(isEasy);
	  cardId = attributes.join('-');
	  if (!document.getElementById(cardId)) {
		unique = true;
	  }
	}
	return cardId;
  }

  function toggleViews() {
	id('game-view').classList.toggle('hidden');
	id('menu-view').classList.toggle('hidden');
  }

  function startTimer() {
	remainingSeconds = qs("#menu-view article select").value;
	printTImer();
	timerId = setInterval(advanceTimer, 1000);
  }

  function advanceTimer() {
	remainingSeconds--;
	printTImer();
	if (remainingSeconds == 0) {
      endGame();
	}
  }

  function printTImer() {
	let minutes = Math.floor(remainingSeconds / 60);
	let seconds = remainingSeconds % 60;
	qs("#time").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function endGame() {
	clearInterval(timerId);
	timerId = null;
	document.querySelector("#back-btn").addEventListener("click", () => {
	  qs("#refresh-btn").disabled = true;
	  let cards = qsa('.card');
	  for (let i = 0; i < cards.length; i++) {
		cards[i].removeEventListener('click', cardSelected);
		cards[i].classList.remove("selected");
	  }
	});
  }

  function cardSelected() {
	this.classList.toggle("selected");
	let selectedCards = Array.from(qsa(".card.selected"));
	if (selectedCards.length === 3) {
	  if (isASet(selectedCards)) {
	    successSelection(selectedCards);
	  } else {
		failureselection(selectedCards);
	  }
	  setTimeout(() => {
		for (let i = 0; i < selectedCards.length; i++) {
		  selectedCards[i].classList.remove("selected");
		}
	  }, 1000);
	}
  }

  function difficultyCheck() {
	console.log("ez?");
	let difficultyOption = qsa("#menu-view input:checked").value;
	return difficultyOption === "easy";
  }

  function successSelection(selectedCards) {
	for (let i = 0; i < selectedCards.length; i++) {
	  selectedCards[i].classList.add("hide-imgs");
	  let whetherEasy = difficultyCheck();
	  let newCard = generateUniqueCard(whetherEasy);
	  newCard.innerHTML = `<p>SET!</p>${newCard.innerHTML}`;
	  selectedCards[i].parentNode.replaceChild(newCard, selectedCards[i]);
	  setTimeout(() => {
	    newCard.classList.remove("hide-imgs");
	    newCard.removeChild(newCard.querySelector("p"));
	  }, 1000);
	}
	let setCount = id('set-count');
	setCount.textContent += 1;
  }

  function failureselection(selectedCards) {
	for (let i = 0; i < selectedCards.length; i++) {
	  selectedCards[i].classList.add("hide-imgs");
	  selectedCards[i].innerHTML = `<p>Not a Set</p>${selectedCards[i].innerHTML}`;
	  setTimeout(() => {
		selectedCards[i].classList.remove("hide-imgs");
		selectedCards[i].removeChild(selectedCards[i].querySelector("p"));
	  }, 1000);
	}
  }

  function id(idName) {
	return document.getElementById(idName);
  }

  function qsa(query) {
	return document.querySelectorAll(query);
  }

  function qs(query) {
    return document.querySelector(query);
  }
})();