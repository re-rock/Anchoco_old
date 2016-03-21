(function() {
  'use strict';

  const source_words = [{
    'en': '00 was so biside',
    'ja': '00 ひどく取り乱した'
  }, {
    'en': '01 scarcely',
    'ja': '01 ほとんど〜できなかった'
  }, {
    'en': '02 tell fact from fiction',
    'ja': '02 現実と虚構の区別'
  }, {
    'en': '03 novel',
    'ja': '03 小説'
  }, {
    'en': '04 gift (for) poetry',
    'ja': '04 詩の才能'
  }, {
    'en': '05 however',
    'ja': '05 どんなに〜でも'
  }, ];


  const card = document.getElementById('card');
  const cardFront = document.getElementById('card-front');
  const cardBack = document.getElementById('card-back');
  const btn_next = document.getElementById('btn_next');
  const btn_back = document.getElementById('btn_back');
  const btn_role = document.getElementById('btn_role');
  const reverse = document.getElementById('reverse');
  const shuffle = document.getElementById('shuffle');

  let words = source_words.concat();
  let words_at_reverse = source_words.concat();
  let words_at_shuffle;


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
  // シャッフル機能
  shuffle.addEventListener('click', function() {
    shuffle_set();
  });

  // カードの初期表示処理

  function initial_set() {
    cardFront.innerHTML = words[front_card]['en'];
    cardBack.innerHTML = words[back_card]['ja'];
  }

  // カードをすすめる

  function forward() {
    cardFront.innerHTML = words[++front_card]['en'];
    cardBack.innerHTML = words[++back_card]['ja'];
    card.removeEventListener('transitionend', forward);
  }

  // カードを戻す

  function backward() {
    cardFront.innerHTML = words[--front_card]['en'];
    cardBack.innerHTML = words[--back_card]['ja'];
    card.removeEventListener('transitionend', backward);
  }

  // ページ進める処理判断

  function nextCard() {
    var current_num = front_card;

    // 最後のカード位置で進むボタンをおした時
    if (++current_num >= words.length) {
      front_card = -1;
      back_card = -1;
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

    //最初のカード位置で戻るボタンをおした時
    if (--current_num < 0) {
      front_card = words.length;
      back_card = words.length;
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

    // リバース機能オフ→オン
    if ($("#reverse").attr("value") === "off") {
      $("#reverse").attr("value", "on");

      // シャッフル機能オンの時
      if ($("#shuffle").attr("value") === "on") {
        words = words_at_shuffle.concat();
        words = words.reverse();
        words_at_reverse = words.concat();
        front_card = 0;
        back_card = 0;
        initial_set();
        if (card.className === 'open') {
          flip();
        }
        // シャッフル機能オフの時
      } else {
        words = source_words.concat();
        words = words.reverse();
        front_card = 0;
        back_card = 0;
        initial_set();
        if (card.className === 'open') {
          flip();
        }
      }

    } else { // リバース機能オン→オフ
      $("#reverse").attr("value", "off");

      // シャッフル機能オンの時
      if ($("#shuffle").attr("value") === "on") {
        words = words_at_shuffle.concat();
        front_card = 0;
        back_card = 0;
        if (card.className === 'open') {
          card.addEventListener('transitionend', backward);
          flip();
          initial_set();
        } else {
          initial_set();
        }

        // シャッフル機能オフの時
      } else {
        words = source_words.concat();
        front_card = 0;
        back_card = 0;
        if (card.className === 'open') {
          card.addEventListener('transitionend', backward);
          flip();
          initial_set();
        } else {
          initial_set();
        }
      }
    }
  }


  // シャッフル機能

  function shuffle_set() {
    if ($("#shuffle").attr("value") === "off") {// オフ→オン
      $("#shuffle").attr("value", "on");
      words_at_shuffle = shuffle_cards(words);
      words = words_at_shuffle.concat();
      initial_set();

    } else { // シャッフルオン→オフ
      $("#shuffle").attr("value", "off");// オン→オフ
      // リバース機能がオンの時
      if ($("#reverse").attr("value") === "on") {
        words = source_words.concat();
        words = words.reverse();
      } else {
        words = source_words.concat();
      }
      front_card = 0;
      back_card = 0;
      initial_set();
    }
  }

  // シャッフルアルゴリズム(Fisher-Yates)
    function shuffle_cards(words) {
    let i = words.length;

    while (i) {
      let j = Math.floor(Math.random() * i);
      let t = words[--i];
      words[i] = words[j];
      words[j] = t;
    }
    return words;
  }


})();
