function drawLuckyNumber(){

    let array = ["大吉","中吉","小吉","末吉","凶"];
    let number1 = Math.random();
    let number2 = Math.floor(number1 * 5);
    let result = array[number2];
    
    let omikuzi = document.getElementById("omikuzi");
    omikuzi.innerHTML = "あなたの運勢は" + result + "です。";

    //ボタンの文字を変更する。
    let button = document.getElementById("button");
    button.textContent = "もう一度引く";

    //結果ごとの文字色を変更する
    if(result === "大吉"){
        omikuzi.style.color = "red";
    }else if(result === "中吉"){
        omikuzi.style.color = "orange";
    }else if(result === "小吉"){
        omikuzi.style.color = "yellow";
    }else if(result === "末吉"){
        omikuzi.style.color = "green";
    }else if(result === "凶"){
        omikuzi.style.color = "blue"; 
    }

    //リスト形式で運勢の詳細を表示する
    let dateilist = document.getElementById("dateilist");
    let love = "穏やかな一日になりそうです。";
    let study = "新しいことに挑戦してみましょう。";
    let money = "無駄遣いに注意しましょう。";

    //結果に合わせて詳細テキストを分岐
    if(result === "大吉"){
        love = "恋愛運が絶好調！素敵な出会いがあるかも。";
        study = "学業運も好調！新しい知識が身につきます。";
        money = "金運も良好！臨時収入があるかもしれません。";
    }else if(result === "中吉"){
        love = "恋愛運が良好！友達との関係も深まります。";
        study = "学業運も安定！コツコツ努力が実を結びます。";
        money = "金運もまずまず！節約を心がけましょう。";
    } else if(result === "小吉"){
        love = "恋愛運がやや低下。コミュニケーションを大切に。";
        study = "学業運もやや不安定。計画的に勉強しましょう。";
        money = "金運もやや注意。無駄遣いは控えめに。";
    } else if(result === "末吉"){
        love = "恋愛運が低下。誤解を招かないように注意。";
        study = "学業運も低下。焦らずにマイペースで。";
        money = "金運も低下。大きな買い物は控えましょう。";
    } else if(result === "凶"){
        love = "恋愛運が最悪。トラブルに注意しましょう。";
        study = "学業運も最悪。無理をせず休息を優先しましょう。";
        money = "金運も最悪。大きな損失に注意してください。";
    } 

    dateilist.innerHTML = `
        <li>🔮 <strong>恋愛運：</strong>${love}</li>
        <li>✏️ <strong>勉強運：</strong>${study}</li>
        <li>💰 <strong>金運：</strong>${money}</li>
    `;

}