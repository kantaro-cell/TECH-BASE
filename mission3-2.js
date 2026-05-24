var math =  55;
var english = 90;

var resultDiv = document.getElementById("result");

if ( math >=60 && english >= 70 ){
  resultDiv.textContent = "合格おめでとう！";
}
else{
  resultDiv.textContent = "おしい！不合格です";
}