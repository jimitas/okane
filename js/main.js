'use strict'
{
  // 初期設定
  const okane = ["ichiman", "gosen", "sen", "gohyaku", "hyaku", "gojuu", "juu", "go", "ichi"];
  const TBL = document.getElementById('TBL');

  // モード切り替え機能
  const modeButtons = document.querySelectorAll('.mode-button');
  const modeContents = {
    set: document.getElementById('modeSet'),
    narabeyou: document.getElementById('modeNarabeyou'),
    mondai: document.getElementById('modeMondai')
  };

  // モードボタンのクリックイベント
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;

      // すべてのボタンからactiveクラスを削除
      modeButtons.forEach(btn => btn.classList.remove('active'));

      // クリックされたボタンにactiveクラスを追加
      button.classList.add('active');

      // すべてのモードコンテンツを非表示
      Object.values(modeContents).forEach(content => {
        content.style.display = 'none';
      });

      // 選択されたモードのコンテンツを表示
      modeContents[mode].style.display = 'block';

      // もんだいモード以外では解答入力エリアを非表示
      if (mode !== 'mondai') {
        const answerInputArea = document.getElementById('answerInputArea');
        if (answerInputArea) {
          answerInputArea.style.display = 'none';
        }
      }
    });
  });

  const set = document.getElementById('set');
  set.addEventListener('click', () => {
    if (kazu.value > 99999) {
      kazu.value = "";
      alert('１から99999までのすうじにしてね。');
    }
    kazu.style.color = "blue";
    OkaneSet();
    ugoki();
  });

  const question = document.getElementById('question');
  const answerInputArea = document.getElementById('answerInputArea');
  const answerInput = document.getElementById('answerInput');
  let correctAnswer = 0; // 正解の金額を保存

  question.addEventListener('click', () => {
    OkaneReset();
    let l = [];
    for (let i = 0; i < 9; i = i + 2) {
      let Check = document.getElementById("kurai" + i);
      if (Check.checked === true) {
        l[i] = Math.floor(Math.random() * 9 + 1);
      } else {
        l[i] = 0;
      }
    }
    correctAnswer = l[0] * 10000 + l[2] * 1000 + l[4] * 100 + l[6] * 10 + l[8] * 1;
    kazu.value = correctAnswer;
    OkaneSet();
    kazu.style.color = "ivory";
    kazu.value = "";
    box.innerHTML = "";

    // 解答入力エリアを表示
    answerInputArea.style.display = 'flex';
    answerInput.value = "";
    answerInput.style.backgroundColor = "";
    answerInput.style.color = "";

    ugoki();
  });

  const start = document.getElementById('start');
  start.addEventListener('click', () => {
    OkaneReset();
    let h = [];
    for (let i = 0; i < 9; i = i + 2) {
      let Check = document.getElementById("kurai" + i);
      if (Check.checked === true) {
        h[i] = Math.floor(Math.random() * 9 + 1);
      } else {
        h[i] = 0;
      }
    }
    box.innerHTML = h[0] * 10000 + h[2] * 1000 + h[4] * 100 + h[6] * 10 + h[8] * 1
    kazu.value = "";
    OkaneSet();
    box.style.color = "blue";
    ugoki();
  });

  // たしかめボタンのイベントリスナー（すべてのたしかめボタンに適用）
  const answerButtons = document.querySelectorAll('#answer, .answer-btn');

  const handleAnswer = () => {
    let k = [];
    for (let i = 0; i < 9; i++) {
      let a = TBL.rows[0].cells[0].getElementsByClassName(okane[i]).length;
      let b = TBL.rows[0].cells[1].getElementsByClassName(okane[i]).length;
      let c = TBL.rows[0].cells[2].getElementsByClassName(okane[i]).length;
      let d = TBL.rows[0].cells[3].getElementsByClassName(okane[i]).length;
      let e = TBL.rows[0].cells[4].getElementsByClassName(okane[i]).length;
      k[i] = a + b + c + d + e;
    }
    const total = k[0] * 10000 + k[1] * 5000 + k[2] * 1000 + k[3] * 500 + k[4] * 100 + k[5] * 50 + k[6] * 10 + k[7] * 5 + k[8] * 1;

    // もんだいモードの場合は答え合わせ
    const modeMondai = document.getElementById('modeMondai');
    if (modeMondai.style.display !== 'none' && answerInputArea.style.display === 'flex') {
      const userAnswer = parseInt(answerInput.value);
      if (isNaN(userAnswer)) {
        alert('答えを入力してください。');
        return;
      }

      if (userAnswer === total) {
        alert('せいかい！　' + total + '円です！');
        answerInput.style.backgroundColor = "#aed581";
        answerInput.style.color = "white";
      } else {
        alert('ざんねん！　正しい答えは　' + total + '円です。');
        answerInput.style.backgroundColor = "#ff6b6b";
        answerInput.style.color = "white";
      }
    } else {
      // その他のモードの場合は合計を表示
      kazu.value = total;
      kazu.style.color = "red";
      kazu.style.backgroundColor = "lightblue";
    }
  };

  // すべてのたしかめボタンにイベントリスナーを追加
  answerButtons.forEach(button => {
    button.addEventListener('click', handleAnswer);
  });

  function OkaneWrite() {
    const okibaBox = document.getElementById('okibaBox');
    var imgBox = okibaBox.getElementsByClassName('okane');
    // console.log(imgBox.length === 9);
    if (imgBox.length === 9) return;//ループ処理の負担をなくすために必要。
    while (imgBox.length > 0) {
      imgBox[0].remove();
    }
    for (let i = 0; i < 9; i++) {
      var img = document.createElement('img');
      img.setAttribute("src", "img/" + okane[i] + ".png");
      img.classList.add('okane');
      img.classList.add(okane[i]);
      img.classList.add('draggable-elem');
      okibaBox.appendChild(img);
    }
    ugoki();
  }

  function OkaneSet() {
    OkaneReset();
    let vol = kazu.value;
    for (let i = 0; i < 9; i++) {
      let Check = document.getElementById("kurai" + i);
      if (Check.checked === true) {
        let kosuu = Math.floor(vol / Check.value);
        vol = vol - Check.value * kosuu;
        for (let j = 0; j < kosuu; j++) {
          var img = document.createElement('img');
          img.setAttribute("src", "img/" + okane[i] + ".png");
          img.classList.add('okane');
          img.classList.add(okane[i]);
          img.classList.add('draggable-elem');
          switch (i) {
            case 0:
              TBL.rows[0].cells[0].appendChild(img);
              break;
            case 1:
            case 2:
              TBL.rows[0].cells[1].appendChild(img);
              break;
            case 3:
            case 4:
              TBL.rows[0].cells[2].appendChild(img);
              break;
            case 5:
            case 6:
              TBL.rows[0].cells[3].appendChild(img);
              break;
            case 7:
            case 8:
              TBL.rows[0].cells[4].appendChild(img);
              break;
          }
        }
      }
    }
  }

  function OkaneReset() {
    var imgdel = TBL.getElementsByClassName('okane');
    while (imgdel.length > 0) {
      imgdel[0].remove();
    }
  }

  function imgdel() {
    const okibaBox = document.getElementById('okibaBox');
    var imgdel = okibaBox.getElementsByClassName('okane');
    while (imgdel.length > 0) {
      imgdel[0].remove();
    }
  }

  //　関数　動かすイベント追加
  function ugoki() {
    //ドラッグ可能アイテムへのタッチイベントの設定
    var draggableItems = $(".draggable-elem");
    var kosuu = draggableItems.length;
    for (var i = 0; i < kosuu; ++i) {
      var item = draggableItems[i];
      item.addEventListener('touchstart', touchStartEvent, false);
      item.addEventListener('touchmove', touchMoveEvent, false);
      item.addEventListener('touchend', touchEndEvent, false);
    }

    //ドラッグ開始の操作
    function touchStartEvent(event) {
      //タッチによる画面スクロールを止める
      event.preventDefault();
    }

    //ドラッグ中の操作
    function touchMoveEvent(event) {
      event.preventDefault();
      //ドラッグ中のアイテムをカーソルの位置に追従
      var draggedElem = event.target;
      var touch = event.changedTouches[0];
      event.target.style.position = "fixed";
      event.target.style.top = (touch.pageY - window.pageYOffset - draggedElem.offsetHeight / 2) + "px";
      event.target.style.left = (touch.pageX - window.pageXOffset - draggedElem.offsetWidth / 2) + "px";
    }

    //ドラッグ終了後の操作
    function touchEndEvent(event) {
      event.preventDefault();
      // ドラッグ中の操作のために変更していたスタイルを元に戻す
      var droppedElem = event.target;
      droppedElem.style.position = "";
      event.target.style.top = "";
      event.target.style.left = "";
      //ドロップした位置にあるドロップ可能なエレメントに親子付けする
      var touch = event.changedTouches[0];
      // スクロール分を加味した座標に存在するエレメントを新しい親とする
      var newParentElem = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
      if (newParentElem.className == "droppable-elem") {
        newParentElem.appendChild(droppedElem);
      }
      OkaneWrite();
    }
  }
  OkaneWrite();
}
