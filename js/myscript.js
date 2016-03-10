(function() {
	'use strict';

	var words = [
		{'en': 'was so biside', 'ja': 'ひどく取り乱した' },
		{'en': 'scarcely', 'ja': 'ほとんど〜できなかった' },
		{'en': 'tell fact from fiction', 'ja': '現実と虚構の区別' },
		{'en': 'novel', 'ja': '小説' },
		{'en': 'gift (for) poetry', 'ja': '詩の才能' }
	];

	var card = document.getElementById('card');
	var cardFront = document.getElementById('card-front');
	var cardBack = document.getElementById('card-back');
	var btn = document.getElementById('btn_next');
	card.addEventListener('click', function() {
		flip();
	});
	btn.addEventListener('click', function() {
		next();
	});

	function next() {
		if (card.className === 'open') {
			card.addEventListener('transitionend', setCard);
			flip();
		} else {
			setCard();
		}
	}

	function setCard() {
		var num = Math.floor(Math.random() * words.length);
		cardFront.innerHTML = words[num]['en'];
		cardBack.innerHTML = words[num]['ja'];
		card.removeEventListener('transitionend', setCard);
	}

	setCard();

// ショートカット割当て
	window.addEventListener('keyup', function(e) {
		// e.keyCode
		// f: 70
		// n: 78
		// console.log(e.keyCode);
		if (e.keyCode === 70) {
			flip();
		} else if (e.keyCode === 78) {
			next();
		}
	});

	function flip() {
		card.className = card.className === '' ? 'open' : '';
	}

})();
