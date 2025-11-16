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

    // 解答入力欄をクリア
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
    if (modeMondai.style.display !== 'none') {
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

  // ドラッグ関連変数
  let currentDragged = null;
  let offsetX = 0;
  let offsetY = 0;
  let canDrag = false;

  /**
   * ドラッグ&ドロップ機能の設定
   */
  function ugoki() {
    const draggableItems = document.querySelectorAll(".draggable-elem");

    draggableItems.forEach(item => {
      // タッチイベント
      item.addEventListener('touchstart', handleStart, { passive: false });
      item.addEventListener('touchmove', handleMove, { passive: false });
      item.addEventListener('touchend', handleEnd, { passive: false });

      // マウスイベント
      item.addEventListener('mousedown', handleStart, { passive: false });
    });
  }

  function handleStart(event) {
    event.preventDefault();
    currentDragged = event.target;

    // 財布内（#okibaBox）またはテーブルセル内のお金がドラッグ可能
    const parentElement = currentDragged.parentElement;
    canDrag = (parentElement && parentElement.id === 'okibaBox') ||
              (parentElement && parentElement.tagName === 'TD' && parentElement.classList.contains('droppable-elem'));

    if (!canDrag) {
      currentDragged = null;
      return;
    }

    const touch = event.touches ? event.touches[0] : event;
    const rect = currentDragged.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    currentDragged.style.position = 'fixed';
    currentDragged.style.zIndex = '1000';

    if (!event.touches) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    }
  }

  function handleMove(event) {
    if (!currentDragged || !canDrag) return;
    event.preventDefault();

    const touch = event.touches ? event.touches[0] : event;

    currentDragged.style.left = (touch.clientX - offsetX) + 'px';
    currentDragged.style.top = (touch.clientY - offsetY) + 'px';
  }

  function handleEnd(event) {
    if (!currentDragged || !canDrag) return;
    event.preventDefault();

    const touch = event.changedTouches ? event.changedTouches[0] : event;

    // ドロップ位置の要素を取得
    currentDragged.style.display = 'none';
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    currentDragged.style.display = '';

    // スタイルをリセット
    currentDragged.style.position = '';
    currentDragged.style.zIndex = '';
    currentDragged.style.left = '';
    currentDragged.style.top = '';

    let dropSuccess = false;

    // ドロップ先の判定
    if (elementBelow) {
      // 財布エリア（#okibaBox）への移動
      if (elementBelow.id === 'okibaBox' || elementBelow.closest('#okibaBox')) {
        const okibaBox = document.getElementById('okibaBox');
        if (okibaBox) {
          okibaBox.appendChild(currentDragged);
          dropSuccess = true;
        }
      }
      // テーブルのセル（お金を並べるエリア）への移動
      else {
        const tableCell = elementBelow.tagName === 'TD' ? elementBelow : elementBelow.closest('td');

        if (tableCell && tableCell.classList.contains('droppable-elem')) {
          tableCell.appendChild(currentDragged);
          dropSuccess = true;
        }
      }
    }

    // ドロップに失敗した場合は財布に戻す
    if (!dropSuccess) {
      const okibaBox = document.getElementById('okibaBox');
      if (okibaBox) {
        okibaBox.appendChild(currentDragged);
      }
    }

    currentDragged = null;
    canDrag = false;

    if (!event.touches) {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    }

    OkaneWrite();
  }

  OkaneWrite();
}
