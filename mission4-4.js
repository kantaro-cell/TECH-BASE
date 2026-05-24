function drawLuckyNumber(){

    let array = ["大吉","中吉","小吉","末吉","凶"];
    let number1 = Math.random();
    let number2 = Math.floor(number1 * 5);
    let result = array[number2];
    
    let omikuzi = document.getElementById("omikuzi");
    omikuzi.innerHTML = "あなたの運勢は" + result + "です。";
}