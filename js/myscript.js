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
    'ck': 1
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
  let filterWords = [];



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
    comfirmCheckes();
  });
  // チェックマーク反映とck=1に
  $("#check").click(function() {
    checkmarkSwitch();
  });
  // チェックマーク反映解除とck=0へ
  $("#checked").click(function() {
    checkmarkSwitch();
  });


  // カードの初期表示処理

  function initial_set() {
    cardFront.innerHTML = words[front_card].fr;
    cardBack.innerHTML = words[back_card].bk;
    number_display();
    progressbar_display();
    checking_display();
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
  }

  // ==================== ページ進める処理 ====================
  function nextCard() {
    var current_num = front_card;

    // 最後のカード位置で進むボタンをおした時は最初のカードへ
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
  // カードをすすめる
  function forward() {
    cardFront.innerHTML = words[++front_card].fr;
    cardBack.innerHTML = words[++back_card].bk;
    checking_display();
    $("#position_number").text(front_card + 1 + " / " + total);
    card.removeEventListener('transitionend', forward);
    progressbar_display();
  }


  // ==================== ページを戻す処理 ====================

  function backCard() {
    var current_num = back_card;

    //最初のカード位置で戻るボタンをおした時最後のカードへ
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
  // カードを戻す
  function backward() {
    cardFront.innerHTML = words[--front_card].fr;
    cardBack.innerHTML = words[--back_card].bk;
    checking_display();
    $("#position_number").text(front_card + 1 + " / " + total);
    card.removeEventListener('transitionend', backward);
    progressbar_display();
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
        cardSetting();

        // チェックマークオンの場合
      } else if ($("#checked_hide").hasClass("filter_on")){
        words = filterWords.concat();
        words = words.reverse();
        words_at_reverse = words.concat();
        cardSetting();

        // シャッフル機能オフの時
      } else {
        words = source_words.concat();
        words = words.reverse();
        cardSetting();
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
        // チェックマーク非表示機能オンの時
      } else if ($("#checked_hide").hasClass("filter_on")){
        words = filterWords.concat();
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


  // ============ チェックマークされているカードを調べる ============

  function comfirmCheckes(){

    // すべてのカードがチェック済みの場合は無効
    if (findCheckedmarks()){
      // Hide機能が有効な場合、チェックマークを選択不可にする
      if(!$("#checked_hide").hasClass()) {
        $("#checked_hide").prop('checked', false);
        $("#checked_hide").attr('disabled', 'disabled');
      }
    } else {

      // チェックされていないカードがある場合は表示処理へ
      $("#checked_hide").toggleClass("filter_on");
      checkedFilter();
    }
  }


  // ============= チェックマークの表示・非教示機能 ================
  function checking_display(){
    // チェックされて(ck = 1)いたら表示
    if( words[front_card].ck === 1){
      $("#checkMarks").addClass('1');
      $("#check").toggle(false);
      $("#checked").toggle(true);
    }else {
      $("#checkMarks").removeClass();
      $("#check").show(true);
      $("#checked").hide(false);
    }
  }


  // ======= チェックマークのディスプレイ切り替えとプロパティ(ck)変更 =======
  function checkmarkSwitch(){
    // checked → check
    if ($("#checkMarks").hasClass('1')){
      words[front_card].ck = 0;
      $("#checked").toggle(false);
      $("#check").toggle(true);
      $("#checkMarks").removeClass();
      $("#checked_hide").removeAttr('disabled');

      // check → checked
    } else {
      words[front_card].ck = 1;
      $("#check").toggle(false);
      $("#checked").toggle(true);
      $("#checkMarks").addClass('1');

      // すべてのカードがチェック済みになったときのHIDE機能の切り替え判断
      if(findCheckedmarks()){
        // チェックマークがONの時はOFFの戻す
        if($("#checked_hide").hasClass("filter_on")){
          $("#checked_hide").removeClass();
          $("#checked_hide").prop('checked', false);
          words = source_words.concat();
          total = source_words.length;
          initial_set();

        } else {
          // チェックマークがOffの時はOnのに切り替えられないようにする
          $("#checked_hide").attr('disabled', 'disabled');

        }
      }
    }
  }

  // すべてのカードがチェック済みかを検査する
  function findCheckedmarks() {
    let checkedNumber = 0;
    for (let i = 0; i < source_words.length; i++){
      if(source_words[i].ck === 1){
        checkedNumber++;
      }
    }
    if(checkedNumber === source_words.length) {
      return true;
    } else {
      return false;
    }
  }


  // ======================= チェックマークのフィルター機能 ================
  function checkedFilter(){

    // チェックマークフィルター設定
    if($("#checked_hide").hasClass("filter_on")){

      $.each(words, function(i, val){
        if(val.ck === 1){
          return true;
        } else {
          filterWords.push(val);
        }
      });

      // チェックマーク非表示
      words = filterWords.concat();
      total = filterWords.length;
      front_card = 0;
      back_card = 0;
      initial_set();


      // フィルター解除（チェックマーク済みも表示）
    } else {
      words = source_words.concat();
      total = source_words.length;
      initial_set();
    }
  }



  // ======================= 効果音機能 =======================

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

  function cardSetting(){
    front_card = 0;
    back_card = 0;
    initial_set();
    if (card.className === 'open') {
      flip();
    }
  }


})();


// $("#listForCheckmark").tooltip({trigger:"hover"}).on("shown.bs.tooltip", function(e) {
//   setTimeout(function () {
//     $(e.target).tooltip("hide");
//   }, 3000);
// });
