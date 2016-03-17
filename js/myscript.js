(function(){
	'use strict';

	var source_words = [
		{'en': '00 was so biside', 'ja': '00 ひどく取り乱した' },
		{'en': '01 scarcely', 'ja': '01 ほとんど〜できなかった' },
		{'en': '02 tell fact from fiction', 'ja': '02 現実と虚構の区別' },
		{'en': '03 novel', 'ja': '03 小説' },
		{'en': '04 gift (for) poetry', 'ja': '04 詩の才能' },
		{'en': '05 however', 'ja': '05 どんなに〜でも' },
	];

	var words = source_words;
	var card = document.getElementById('card');
	var cardFront = document.getElementById('card-front');
	var cardBack = document.getElementById('card-back');
	var btn_next = document.getElementById('btn_next');
	var btn_back = document.getElementById('btn_back');
	var btn_role = document.getElementById('btn_role');
	var reverse = document.getElementById('reverse');

	// 現在の表カードの位置番号
	var front_card = 0;
	// 現在の裏カードの位置番号
	var back_card = 0;


	// カード初期表示
	initial_set();

	card.addEventListener('click', function() {
		flip();
	});
	btn_role.addEventListener('click', function() {
		flip();
	});

	btn_next.addEventListener('click', function() {
		nextCard();
	});
	btn_back.addEventListener('click', function() {
		backCard();
	});
	// リバース機能
	reverse.addEventListener('click', function() {
		reverse_set();
	});

	// カードの初期表示処理
	function initial_set() {
		cardFront.innerHTML  = words[front_card]['en'];
		cardBack.innerHTML = words[back_card]['ja'];
	}

	// カードをすすめる
	function forward() {
		cardFront.innerHTML  = words[++front_card]['en'];
		cardBack.innerHTML = words[++back_card]['ja'];
		card.removeEventListener('transitionend', forward);
	}
	// カードを戻す
	function backward() {
		cardFront.innerHTML  = words[--front_card]['en'];
		cardBack.innerHTML = words[--back_card]['ja'];
		card.removeEventListener('transitionend', backward);
	}

	// ページ進める処理判断
	function nextCard() {
		var current_num = front_card;
		if ( ++current_num >= words.length) {
			return;
		}
		if (card.className === 'open') {
			// トランジション処理完了後に進む
			card.addEventListener('transitionend', forward);
			flip();
		} else {
			forward();
		}
	}

	// ページを戻す処理判断
	function backCard() {
		var current_num = back_card;
		if (--current_num < 0 ) {
			return;
		}
		if (card.className === 'open') {
			// トランジション処理完了後に戻る
			card.addEventListener('transitionend', backward);
			flip();
		} else {
			backward();
		}
	}

	// ページをめくる処理
	function flip() {
		card.className = card.className === '' ? 'open' : '';
	}

	// ショートカット割当て
	window.addEventListener('keyup', function(e) {
		// console.log(e.keyCode);
		if (e.keyCode === 70) {
			flip();
		} else if (e.keyCode === 78) {
			nextCard();
		} else if (e.keyCode === 66) {
			backCard();
		}
	});

	// リバース機能
	function reverse_set() {
		if( $("#reverse").attr("value") === "off") {// オフ→オン
			$("#reverse").attr("value", "on");
			words = source_words.reverse();
			front_card = 0;
			back_card = 0;
			initial_set();
			if (card.className === 'open') {
				flip();
			}
		} else if( $("#reverse").attr("value") === "on")  {// オン→オフ
			$("#reverse").attr("value", "off");
			words = source_words.reverse();
			front_card = 0;
			back_card = 0;
			initial_set();
			if (card.className === 'open') {
				card.addEventListener('transitionend', backward);
				flip();
			}
		}
	}

	// チェックマーク機能
	// $("#checkmark").click(function() {
	// 	$("#checkmark").attr("class","fa fa-check-square-o fa-lg");
	// });
	// $("#checkmark").click(function() {
	// 	if ($("#checkmark").attr(class) = 'fa-square-0')) {
	// 		$("#checkmark").attr("class","fa fa-check-square-o fa-lg");
	// 	} else {
	// 		return;
	// 	}
	// 	});

	// ランダム機能
	// function shuffleCard() {
	// 	var num = Math.floor(Math.random() * words.length);
	// 	cardFront.innerHTML = words[num]['en'];
	// 	cardBack.innerHTML = words[num]['ja'];
	// 	card.removeEventListener('transitionend', setCard);
	// }


})();
