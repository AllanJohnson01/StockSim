var cash = 100000;
var price = 105;

function buying (currentPrice, smaLine) {
  var sharesToBuy = Math.floor(cash * 0.05 / price);
  console.log("sharesToBuy: " + sharesToBuy);
  var cashToWithdraw = sharesToBuy * price;
  console.log("cashToWithdraw: " + cashToWithdraw);
  // if(currentPrice < smaLine && currentPrice < averagePricePaid) {
  //
  // }

}

buying(50,55);
