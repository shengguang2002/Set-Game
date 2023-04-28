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
  const ONE_SECOND = 1000;
  let timerId = null;
  let remainingSeconds = null;

  window.addEventListener("load", init);

  /**
   *Initiate after window is loarded, creating different event listner for different bottom
   */
  function init() {
    id('start-btn').addEventListener('click', toggleViews);
    id('start-btn').addEventListener('click', startTimer);
    id('start-btn').addEventListener('click', generateCards);
    id('refresh-btn').addEventListener('click', generateCards);
    id('back-btn').addEventListener('click', toggleViews);
    id('back-btn').addEventListener('click', reset);
  }

  /**
   *Checks to see if the three selected cards make up a valid set. This is done by comparing each
   *of the type of attribute against the other two cards. If each four attributes for each card are
   *either all the same or all different, then the cards make a set. If not, they do not make a set
   *@param {DOMList} selected - list of all selected cards to check if a set.
   *@return {boolean} true if valid set false otherwise.
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

  /**
   * Resets the game settings when the "Back to Main" button is clicked.
   * Stops the game, enables the "Refresh Board" button, and resets the set count.
   */
  function reset() {
    endGame();
    qs("#refresh-btn").disabled = false;
    let setCount = id('set-count');
    setCount.textContent = 0;
  }

  /**
   * Generates cards for the game board.
   * Clears the board, determines the difficulty, and creates the specified number of cards.
   */
  function generateCards() {
    clearBoard();
    const board = id("board");
	qs("#refresh-btn").disabled = false;
    const CARD_NUM = 12;
    let whetherEasy = difficultyCheck();
    for (let i = 0; i < CARD_NUM; i++) {
      const card = generateUniqueCard(whetherEasy);
      board.appendChild(card);
    }
  }

  /**
   * Clears the game board by removing all inner content.
   */
  function clearBoard() {
    const board = id('board');
    board.innerHTML = '';
  }

  /**
   * Generates random attributes for a card based on the specified difficulty.
   * @param {boolean} isEasy - If true, the "Easy" difficulty is selected,
   * else "Standard" difficulty.
   * @return {Array} An array of randomly selected attributes for the card.
   */
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

  /**
   * Generates a unique card element based on the specified difficulty.
   * @param {boolean} isEasy - If true, the "Easy" difficulty is selected,
   * else "Standard" difficulty.
   * @return {HTMLElement} The card element with a unique ID and randomly selected attributes.
   */
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

  /**
   * Generates a unique card ID based on the specified difficulty.
   * @param {boolean} isEasy - If true, the "Easy" difficulty is selected,
   * else "Standard" difficulty.
   * @return {string} A unique card ID with randomly selected attributes.
   */
  function generateUniqueCardId(isEasy) {
    let unique = false;
    let cardId;
    while (!unique) {
      let attributes = generateRandomAttributes(isEasy);
      cardId = attributes.join('-');
      if (!id(cardId)) {
        unique = true;
      }
    }
    return cardId;
  }


  /**
   * Toggles the visibility of the game and menu views.
   */
  function toggleViews() {
    id('game-view').classList.toggle('hidden');
    id('menu-view').classList.toggle('hidden');
  }

  /**
   * Starts the game timer and updates the timer display.
   */
  function startTimer() {
    remainingSeconds = qs("#menu-view article select").value;
    printTImer();
    timerId = setInterval(advanceTimer, ONE_SECOND);
  }

  /**
   * Advances the game timer by decrementing the remaining seconds.
   */
  function advanceTimer() {
    remainingSeconds--;
    printTImer();
    if (remainingSeconds === 0) {
      endGame();
    }
  }

  /**
   * Updates the timer display with the current remaining time.
   * knowing the pedStart method to reach given length by: https://developer.mozilla.org/en-US/
   * docs/Web/JavaScript/Reference/Global_Objects/String/padStart
   */
  function printTImer() {
	const SEC_IN_MIN = 60;
    let minutes = Math.floor(remainingSeconds / SEC_IN_MIN);
    let seconds = remainingSeconds % SEC_IN_MIN;
    qs("#time").textContent = `0${String(minutes)}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Ends the game by clearing the timer, disabling the "Refresh Board" button,
   * and removing click event listeners.
   */
  function endGame() {
    clearInterval(timerId);
    timerId = null;
    qs("#refresh-btn").disabled = true;
    let cards = qsa('.card');
    for (let i = 0; i < cards.length; i++) {
      cards[i].removeEventListener('click', cardSelected);
      cards[i].classList.remove("selected");
    }
  }

  /**
   * Handles card selection by toggling the "selected" class and checking for valid sets.
   */
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
      }, ONE_SECOND);
    }
  }

  /**
   * Check whether the selected difficulty is east
   * @returns true if the selected mode is easy, false if not
   */
  function difficultyCheck() {
    let difficultyOption = qsa("#menu-view input:checked").value;
    console.log(difficultyOption);
    return difficultyOption === "easy";
  }

  /**
   * Do following move if the selected cards can be a set. Add up the count and show SET! on cards
   * @param {Array} selectedCards Array of card that are selected that are set
   */
  function successSelection(selectedCards) {
    let setCount = id('set-count');
    setCount.textContent = parseInt(setCount.textContent) + 1;
    for (let i = 0; i < selectedCards.length; i++) {
	  let whetherEasy = difficultyCheck();
      let newCard = generateUniqueCard(whetherEasy);
      selectedCards[i].parentNode.replaceChild(newCard, selectedCards[i]);
      newCard.classList.add("hide-imgs");
      snewCard.innerHTML = `<p>SET!</p>${selectedCards[i].innerHTML}`;
      resetCard(newCard);
    }
  }

  /**
   * Do following move if the selected cards cannot be a set. Show Not a Set on the cards
   * @param {Array} selectedCards: Array of card that are selected but are not set
   */
  function failureselection(selectedCards) {
    for (let i = 0; i < selectedCards.length; i++) {
      selectedCards[i].classList.add("hide-imgs");
      selectedCards[i].innerHTML = `<p>Not a Set</p>${selectedCards[i].innerHTML}`;
      resetCard(selectedCards[i]);
    }
  }

  /**
   * Reset the card that visibilize the images and remove all the paragraph in side the card
   * @param {div} card: A div object symbolizes the card in the game
   */
  function resetCard(card) {
    setTimeout(() => {
      card.classList.remove("hide-imgs");
      card.removeChild(card.querySelector("p"));
    }, ONE_SECOND);
  }

  /**
   * A function that simplify calling document.getElementById
   * @param {id} idName: An id name
   * @returns {Element} An Element object that classified as this id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * A function that simplify calling document.querySelectorAll
   * @param {selectors} query: A query of selector
   * @returns {NodeList} An Element object representing the all elements in the document
   * that matches the specified set of CSS selectors, or null is returned if there are no matches.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * A function that simplify calling document.querySelector
   * @param {selectors} query: A query of selectors
   * @returns {Element} An Element object representing the first element in the
   * document that matches the specified set of CSS selectors, or null is returned
   * if there are no matches.
   */
  function qs(query) {
    return document.querySelector(query);
  }
})();