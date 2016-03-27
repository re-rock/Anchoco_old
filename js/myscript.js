(function() {
  'use strict';

  const source_title = "DUO3.0英単語";

  // ck: 0=display, 1=nondisplay
  const source_words = [{
    'fr': '00 was so biside',
    'bk': '00 ひどく取り乱した',
    'ck': 0
  }, {
    'fr': '01 scarcely',
    'bk': '01 ほとんど〜できなかった',
    'ck': 0
  }, {
    'fr': '02 tell fact from fiction',
    'bk': '02 現実と虚構の区別',
    'ck': 0
  }, {
    'fr': '03 novel',
    'bk': '03 小説',
    'ck': 0
  }, {
    'fr': '04 gift (for) poetry',
    'bk': '04 詩の才能',
    'ck': 1
  }, {
    'fr': '05 however',
    'bk': '05 どんなに〜でも',
    'ck': 1
  }, ];

  const card = document.getElementById('card');
  const cardFront = document.getElementById('card-front');
  const cardBack = document.getElementById('card-back');
  const btn_next = document.getElementById('btn_next');
  const btn_back = document.getElementById('btn_back');
  const btn_flip = document.getElementById('btn_flip');
  const reverse = document.getElementById('reverse');
  const shuffle = document.getElementById('shuffle');

  let total = source_words.length;
  let words = source_words.concat();
  let words_at_reverse = source_words.concat();
  let words_at_shuffle;


  // 現在の表カードの位置番号
  var front_card = 0;
  // 現在の裏カードの位置番号
  var back_card = 0;

  //タイトル表示
  title_display();
  function title_display (){
    $("#card_title").text(source_title);
  }

  // カード初期表示
  initial_set();

  card.addEventListener('click', function() {
    flip();
  });
  btn_flip.addEventListener('click', function() {
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
  // 効果音機能
  $("#sound").bind('click', function() {
    sound_effect();
  });
  // チェックマーク表示・非教示機能
  checked_hide.addEventListener('click',function(){
    $("#checked_hide").toggleClass("filter_on");
    filterCheck();
  });


  // カードの初期表示処理

  function initial_set() {
    cardFront.innerHTML = words[front_card]['fr'];
    cardBack.innerHTML = words[back_card]['bk'];
    number_display();
    progressbar_display();
  }

  // カードの位置数を表示
  function number_display(){
    $("#position_number").text(front_card + 1 + " / " + total);
  }

  // プログレスバー表示
  function progressbar_display() {
    $(".progressBarValue").removeClass (function (index, className) {
      return (className.match (/\bvalue-\d+/) || []).join(' ');
    });
    let prog_value = Math.floor((front_card + 1) / total * 100);
    $(".progressBarValue").addClass(`value-${prog_value}`);
    // $(".progressBarValue").addClass("value-" + prog_value);
  }

  // カードをすすめる
  function forward() {
    cardFront.innerHTML = words[++front_card]['fr'];
    cardBack.innerHTML = words[++back_card]["bk"];
    $("#position_number").text(front_card + 1 + " / " + total);
    card.removeEventListener('transitionend', forward);
    progressbar_display();
  }

  // カードを戻す
  function backward() {
    cardFront.innerHTML = words[--front_card]['fr'];
    cardBack.innerHTML = words[--back_card]['bk'];
    $("#position_number").text(front_card + 1 + " / " + total);
    card.removeEventListener('transitionend', backward);
    progressbar_display();
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


  // ======================= リバース機能 ============================

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



  // ======================= シャッフル機能 ============================

  function shuffle_set() {

    if ($("#shuffle").attr("value") === "off") {// オフ→オン
      $("#shuffle").attr("value", "on");
      words_at_shuffle = shuffle_cards(words);
      words = words_at_shuffle.concat();
      front_card = 0;
      back_card = 0;
      initial_set();

    } else { // シャッフルオン→オフ
      $("#shuffle").attr("value", "off");// オン→オフ

      // リバース機能がオンの時
      if ($("#reverse").attr("value") === "on") {
        words = source_words.concat();
        words = words.reverse();

        // リバース機能がオフの時
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

  // 効果音機能
  function sound_effect(){
    $("#btn_back").toggleClass("sound_active");
    $("#btn_flip").toggleClass("sound_active");
    $("#btn_next").toggleClass("sound_active");
    $('#btn_back').easyAudioEffects({
      ogg : "./sound/change_card01.ogg",
      mp3 : "./sound/change_card01.mp3",
      eventType : 'click',
      playType : "oneShotMonophonic"
    });
    $('#btn_next').easyAudioEffects({
      ogg : "./sound/change_card01.ogg",
      mp3 : "./sound/change_card01.mp3",
      eventType : 'click',
      playType : "oneShotMonophonic"
    });
    $('#btn_flip').easyAudioEffects({
      ogg : "./sound/flip.ogg",
      mp3 : "./sound/flip.mp3",
      eventType : 'click',
      playType : "oneShotMonophonic"
    });
  }

  // チェックマークの表示・非教示機能
  function filterCheck(){
    let filterWords = [];

    if($("#checked_hide").hasClass("filter_on")){
      $.each(words, function(i, val){
        // チェックマーク非表示
        if(val.ck === 1){
          return true;
        }else {
          filterWords.push(val);
          words = filterWords.concat();
          total = filterWords.length;
          initial_set();
        }
      });
      // チェックマーク表示
    } else {
      total = source_words.length;
      words = source_words.concat();
      initial_set();
    }
  }


})();
