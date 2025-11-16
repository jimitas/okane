'use strict'
{
  // 初期設定
  const okane = ["ichiman", "gosen", "sen", "gohyaku", "hyaku", "gojuu", "juu", "go", "ichi"];
  const TBL = document.getElementById('TBL');

  /**
   * サウンド再生関数
   */
  function sound1() { playSound('se_1'); }
  function sound2() { playSound('se_2'); }
  function sound3() { playSound('se_3'); }
  function sound4() { playSound('se_4'); }

  /**
   * サウンドファイルの再生
   */
  function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.log('Audio play failed:', err));
    }
  }

  // モード切り替え機能
  const modeButtons = document.querySelectorAll('.mode-button');
  const modeContents = {
    set: document.getElementById('modeSet'),
    narabeyou: document.getElementById('modeNarabeyou'),
    mondai: document.getElementById('modeMondai')
  };

  // トースト表示用のタイマーID
  let toastTimer = null;

  // トースト表示関数
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastContent = toast.querySelector('.toast-content');

    // 既存のタイマーをクリア
    if (toastTimer !== null) {
      clearTimeout(toastTimer);
    }

    toastContent.textContent = message;
    toast.classList.add('show');

    // 3秒後に非表示
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toastTimer = null;
    }, 3000);
  }

  // モードボタンのクリックイベント
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;

      sound1(); // モード選択時の音

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

      // モードに応じたトースト通知を表示
      let toastMessage = '';
      switch (mode) {
        case 'set':
          toastMessage = 'すうじを　入れて、お金を　ならべて　みよう！';
          break;
        case 'narabeyou':
          toastMessage = 'もんだいを　出すよ。お金を　ならべて　みよう！';
          break;
        case 'mondai':
          toastMessage = 'お金の　ごうけいを　こたえよう！';
          break;
      }
      if (toastMessage) {
        showToast(toastMessage);
      }
    });
  });

  const set = document.getElementById('set');
  set.addEventListener('click', () => {
    if (kazu.value > 99999) {
      kazu.value = "";
      sound4();
      alert('１から99999までのすうじにしてね。');
      return;
    }
    sound1();
    kazu.style.color = "blue";
    OkaneSet();
    ugoki();
  });

  const resetSet = document.getElementById('reset-set');
  resetSet.addEventListener('click', () => {
    sound1();
    OkaneReset();
    kazu.value = "";
    kazu.style.color = "";
    kazu.style.backgroundColor = "";
  });

  const question = document.getElementById('question');
  const answerInput = document.getElementById('answerInput');
  let correctAnswer = 0; // もんだいモードの正解の金額を保存
  let narabeyouAnswer = 0; // ならべようモードの正解の金額を保存
  let hasAnswered = false; // 正解してコインを獲得したかどうかのフラグ

  question.addEventListener('click', () => {
    sound1();
    OkaneReset();
    hasAnswered = false; // 新しい問題なのでフラグをリセット
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
    sound1();
    OkaneReset();
    hasAnswered = false; // 新しい問題なのでフラグをリセット
    let h = [];
    for (let i = 0; i < 9; i = i + 2) {
      let Check = document.getElementById("kurai" + i);
      if (Check.checked === true) {
        h[i] = Math.floor(Math.random() * 9 + 1);
      } else {
        h[i] = 0;
      }
    }
    narabeyouAnswer = h[0] * 10000 + h[2] * 1000 + h[4] * 100 + h[6] * 10 + h[8] * 1; // 正解を保存
    box.innerHTML = narabeyouAnswer;
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
        sound4();
        alert('答えを入力してください。');
        return;
      }

      if (userAnswer === total) {
        sound2();
        if (!hasAnswered) {
          addCoin(); // 正解時にコインを追加（初回のみ）
          hasAnswered = true; // フラグを立てる
          alert('せいかい！　' + total + '円です！\nコインを　1まい　かくとく！');
        } else {
          alert('せいかい！　' + total + '円です！');
        }
        answerInput.style.backgroundColor = "#64b5f6";
        answerInput.style.color = "white";
      } else {
        sound4();
        alert('ざんねん！　正しい　こたえは　' + total + '円です。');
        answerInput.style.backgroundColor = "#ff6b6b";
        answerInput.style.color = "white";
      }
    } else {
      // その他のモード（セット、ならべよう）の場合
      const modeNarabeyou = document.getElementById('modeNarabeyou');

      // ならべようモードで問題が出されている場合は正解判定
      if (modeNarabeyou.style.display !== 'none' && narabeyouAnswer > 0) {
        if (total === narabeyouAnswer) {
          sound2();
          if (!hasAnswered) {
            addCoin(); // 正解時にコインを追加（初回のみ）
            hasAnswered = true; // フラグを立てる
            alert('せいかい！　' + total + '円です！\nコインを　1まい　かくとく！');
          } else {
            alert('せいかい！　' + total + '円です！');
          }
          kazu.value = total;
          kazu.style.color = "white";
          kazu.style.backgroundColor = "#64b5f6";
        } else {
          sound4();
          alert('ざんねん！　正しい　こたえは　' + narabeyouAnswer + '円です。');
          kazu.value = total;
          kazu.style.color = "white";
          kazu.style.backgroundColor = "#ff6b6b";
        }
      } else {
        // セットモードの場合は合計を表示
        sound2();
        kazu.value = total;
        kazu.style.color = "red";
        kazu.style.backgroundColor = "lightblue";
      }
    }
  };

  // すべてのたしかめボタンにイベントリスナーを追加
  answerButtons.forEach(button => {
    button.addEventListener('click', handleAnswer);
  });

  function OkaneWrite() {
    const okibaBoxBills = document.getElementById('okibaBox-bills');
    const okibaBoxCoins = document.getElementById('okibaBox-coins');
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

      // お札（0:ichiman, 1:gosen, 2:sen）は上段、それ以外は下段
      if (i <= 2) {
        okibaBoxBills.appendChild(img);
      } else {
        okibaBoxCoins.appendChild(img);
      }
    }
    ugoki();
  }

  function OkaneSet() {
    OkaneReset();
    let vol = kazu.value;

    // DocumentFragmentを使用してパフォーマンスを最適化
    const fragments = [
      document.createDocumentFragment(),
      document.createDocumentFragment(),
      document.createDocumentFragment(),
      document.createDocumentFragment(),
      document.createDocumentFragment()
    ];

    for (let i = 0; i < 9; i++) {
      let Check = document.getElementById("kurai" + i);
      if (Check.checked === true) {
        let kosuu = Math.floor(vol / Check.value);
        vol = vol - Check.value * kosuu;
        for (let j = 0; j < kosuu; j++) {
          const img = document.createElement('img');
          img.setAttribute("src", "img/" + okane[i] + ".png");
          img.classList.add('okane', okane[i], 'draggable-elem');

          switch (i) {
            case 0:
              fragments[0].appendChild(img);
              break;
            case 1:
            case 2:
              fragments[1].appendChild(img);
              break;
            case 3:
            case 4:
              fragments[2].appendChild(img);
              break;
            case 5:
            case 6:
              fragments[3].appendChild(img);
              break;
            case 7:
            case 8:
              fragments[4].appendChild(img);
              break;
          }
        }
      }
    }

    // Fragmentを一括でDOMに追加
    for (let i = 0; i < 5; i++) {
      TBL.rows[0].cells[i].appendChild(fragments[i]);
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
  let originalParent = null; // 元の親要素を保存

  /**
   * イベント委譲によるドラッグ&ドロップ機能の設定（初期化時に1回だけ実行）
   */
  function setupDragAndDrop() {
    // テーブルエリアにイベントリスナーを追加（イベント委譲）
    TBL.addEventListener('touchstart', handleStart, { passive: false });
    TBL.addEventListener('mousedown', handleStart, { passive: false });

    // 財布エリアにイベントリスナーを追加（イベント委譲）
    const okibaBox = document.getElementById('okibaBox');
    okibaBox.addEventListener('touchstart', handleStart, { passive: false });
    okibaBox.addEventListener('mousedown', handleStart, { passive: false });

    // documentにもイベントリスナーを追加（bodyに移動した要素用）
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });
  }

  // ugoki関数は後方互換性のため残すが、何もしない
  function ugoki() {
    // イベント委譲により、この関数は不要
  }

  function handleStart(event) {
    // ドラッグ可能な要素かチェック
    const target = event.target;
    if (!target.classList.contains('draggable-elem')) {
      return;
    }

    event.preventDefault();
    currentDragged = target;

    // 財布内（#okibaBox, #okibaBox-bills, #okibaBox-coins）またはテーブルセル内のお金がドラッグ可能
    const parentElement = currentDragged.parentElement;
    canDrag = (parentElement && (parentElement.id === 'okibaBox' || parentElement.id === 'okibaBox-bills' || parentElement.id === 'okibaBox-coins')) ||
              (parentElement && parentElement.tagName === 'TD' && parentElement.classList.contains('droppable-elem'));

    if (!canDrag) {
      currentDragged = null;
      return;
    }

    const touch = event.touches ? event.touches[0] : event;

    // 元の親要素を保存
    originalParent = currentDragged.parentElement;

    // transformの影響を受ける前に画面上の位置とサイズを取得
    const rect = currentDragged.getBoundingClientRect();

    // bodyに移動（transformの影響を排除）
    document.body.appendChild(currentDragged);

    // position: fixedに変更して、元の位置・サイズを維持
    currentDragged.style.position = 'fixed';
    currentDragged.style.zIndex = '1000';
    currentDragged.style.left = rect.left + 'px';
    currentDragged.style.top = rect.top + 'px';
    currentDragged.style.width = rect.width + 'px';
    currentDragged.style.height = rect.height + 'px';

    // クリック位置と要素の位置の差を保存
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

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
    currentDragged.style.width = '';
    currentDragged.style.height = '';

    let dropSuccess = false;

    // ドロップ先の判定
    if (elementBelow) {
      // 財布エリア（#okibaBox）への移動
      if (elementBelow.id === 'okibaBox' || elementBelow.id === 'okibaBox-bills' || elementBelow.id === 'okibaBox-coins' || elementBelow.closest('#okibaBox')) {
        // お札かどうかを判定
        const isBill = currentDragged.classList.contains('ichiman') ||
                       currentDragged.classList.contains('gosen') ||
                       currentDragged.classList.contains('sen');

        const targetContainer = isBill ?
          document.getElementById('okibaBox-bills') :
          document.getElementById('okibaBox-coins');

        if (targetContainer) {
          targetContainer.appendChild(currentDragged);
          dropSuccess = true;
          sound3(); // ドロップ成功時の音
        }
      }
      // テーブルのセル（お金を並べるエリア）への移動
      else {
        const tableCell = elementBelow.tagName === 'TD' ? elementBelow : elementBelow.closest('td');

        if (tableCell && tableCell.classList.contains('droppable-elem')) {
          tableCell.appendChild(currentDragged);
          dropSuccess = true;
          sound3(); // ドロップ成功時の音
        }
      }
    }

    // ドロップに失敗した場合は財布に戻す
    if (!dropSuccess) {
      // お札かどうかを判定
      const isBill = currentDragged.classList.contains('ichiman') ||
                     currentDragged.classList.contains('gosen') ||
                     currentDragged.classList.contains('sen');

      const targetContainer = isBill ?
        document.getElementById('okibaBox-bills') :
        document.getElementById('okibaBox-coins');

      if (targetContainer) {
        targetContainer.appendChild(currentDragged);
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

  // ========================================
  // コイン機能
  // ========================================

  // ページ読み込み時にコインを復元
  function loadCoins() {
    const savedCoins = localStorage.getItem("coinCount");
    const coinCount = savedCoins ? parseInt(savedCoins, 10) : 0;
    const coinPallet = document.getElementById("coin-pallet");

    // 保存されているコイン数だけコイン画像を表示
    for (let i = 0; i < coinCount; i++) {
      const img = document.createElement("img");
      img.src = "./img/coin.png";
      img.alt = "コイン";
      coinPallet.appendChild(img);
    }
  }

  // コインを1枚追加してローカルストレージに保存
  function addCoin() {
    const img = document.createElement("img");
    img.src = "./img/coin.png";
    img.alt = "コイン";
    document.getElementById("coin-pallet").appendChild(img);

    // 現在のコイン数を取得して+1
    const savedCoins = localStorage.getItem("coinCount");
    const coinCount = savedCoins ? parseInt(savedCoins, 10) : 0;
    localStorage.setItem("coinCount", coinCount + 1);
  }

  // コインをリセット（計算問題による確認付き）
  const btnResetCoins = document.getElementById("btn-reset-coins");
  btnResetCoins.addEventListener("click", () => {
    sound4();

    // 2桁×1桁のランダムな計算問題を生成
    const num1 = Math.floor(Math.random() * 90) + 10; // 10-99の2桁
    const num2 = Math.floor(Math.random() * 9) + 1;   // 1-9の1桁
    const correctAnswer = num1 * num2;

    const userAnswer = prompt(`コインをリセットするには、次の計算問題を解いてください。\n\n${num1} × ${num2} = ?`);

    // キャンセルした場合
    if (userAnswer === null) {
      return;
    }

    // 答えが正しいかチェック
    if (parseInt(userAnswer, 10) === correctAnswer) {
      // ローカルストレージをクリア
      localStorage.removeItem("coinCount");
      // 画面上のコインを全て削除
      const coinPallet = document.getElementById("coin-pallet");
      coinPallet.innerHTML = "";
      sound1();
      alert("正解です！コインをリセットしました。");
    } else {
      sound4();
      alert(`不正解です。正しい答えは ${correctAnswer} でした。\nコインはリセットされませんでした。`);
    }
  });

  // 初期化
  OkaneWrite();
  setupDragAndDrop(); // イベント委譲の設定（1回だけ）
  loadCoins(); // ページ読み込み時にコインを復元

  // ページ読み込み時にアプリの説明を表示
  setTimeout(() => {
    showToast('つかう　お金に　チェックを　入れて、モードを　えらぼう！');
  }, 500);
}
