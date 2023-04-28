"use strict";
(function() {
	let timerId = null;
	let remainingSeconds = null;

	window.addEventListener("load", init);

	function init() {
		id('start-btn').addEventListener('click', toggleViews);
		id('start-btn').addEventListener('click', startTimer);
		id('start-btn').addEventListener('click', generateCards);
		id('back-btn').addEventListener('click', toggleViews);
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

	function generateCards() {
		for(let i = 0; i < 12; i++) {
			generateUniqueCard(isEasy);
		}
	}


	function generateRandomAttributes(isEasy) {
		const STYLE = ['solid', 'outline', 'striped'];
		const SHAPE = ['green', 'purple', 'red'];
		const COLOR = ['diamond', 'oval', 'squiggle'];
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
		for (let i = 0; i < parseInt(count, 10); i++) {
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
		let timeOption = qs("#menu-view article select").value;
		remainingSeconds = parseInt(timeOption, 10);
		printTImer();
		timerId = setInterval(advanceTimer, 1000);
	}

	function advanceTimer() {
		remainingSeconds--;
		printTImer();
		if (remainingSeconds === 0) {
		  endGame();
		}
	}

	function printTImer() {
		let minutes = Math.floor(remainingSeconds / 60);
		let seconds = remainingSeconds % 60;
		document.querySelector("#time").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}

	function endGame() {
		// 停止并清除计时器
		clearInterval(timer);

		// 禁用当前视图，直到点击“返回主界面”按钮
		document.querySelector("#back-btn").addEventListener("click", () => {
		  // 清除当前选择的卡片
		  // ...（这部分取决于您的 cardSelected() 实现）

		  // 禁用“刷新游戏板”按钮
		  document.querySelector("#refresh-btn").disabled = true;

		  // 禁用卡片点击功能
		  // ...（这部分取决于您的 cardSelected() 实现）
	});
	}

	function cardSelected() {
		this.classList.toggle("selected");
		let selectedCards = qsa(".card.selected");
		if (selectedCards.length === 3) {
		let cardIds = Array.from(selectedCards).map(card => card.id);

		if (isASet(cardIds)) {
			handleSet(selectedCards);
		} else {
			handleNotASet(selectedCards);
		}
		setTimeout(() => {
			selectedCards.forEach(card => {
			card.classList.remove("selected");
			});
		}, 1000);
		}
	}

	function isEasy() {
		let difficultyOption = qsa("#menu-view input:checked").value;
		return difficultyOption === "easy";
	}

	function handleSet(selectedCards) {
		selectedCards.forEach(card => {
			card.classList.add("hide-imgs");
			let newCard = generateUniqueCard(isEasy); // 根据您的游戏实现使用正确的参数
			newCard.innerHTML = `<p>SET!</p>${newCard.innerHTML}`;
			card.parentNode.replaceChild(newCard, card);

			setTimeout(() => {
			newCard.classList.remove("hide-imgs");
			newCard.removeChild(newCard.querySelector("p"));
			}, 1000);
		});

		// 增加找到的集合计数
		let setCount = document.querySelector("#set-count");
		setCount.textContent = parseInt(setCount.textContent, 10) + 1;
	}

	function handleNotASet(selectedCards) {
		selectedCards.forEach(card => {
		card.classList.add("hide-imgs");
		card.innerHTML = `<p>Not a Set</p>${card.innerHTML}`;
		setTimeout(() => {
		card.classList.remove("hide-imgs");
		card.removeChild(card.querySelector("p"));
		}, 1000);
	});
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
