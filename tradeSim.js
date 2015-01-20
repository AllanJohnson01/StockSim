// OBJECTS
function Investor (cash) {
  // var cash = cash;
  var sharesOwned = 0;
  var pricesPaid = [];
  this.costBasis = 0;

  this.getHistory = function () {
    return pricesPaid;
  };

  this.buy = function (currentPrice, percentage) {
    // console.log("cash: " + cash + " price: " + currentPrice);
    var sharesToBuy = Math.floor(cash * percentage / currentPrice);
    // console.log("sharesToBuy: " + sharesToBuy);
    var cashToWithdraw = sharesToBuy * currentPrice;
    // console.log("cashToWithdraw: " + cashToWithdraw);
    cash -= cashToWithdraw;
    sharesOwned += sharesToBuy;
    console.log("Purchased " + sharesToBuy + " at " + currentPrice);
    console.log("cash now: " + cash + " sharesOwned now: " + sharesOwned);
    console.log("NET WORTH: " + (cash + sharesOwned * currentPrice));
    pricesPaid.push({cost: cashToWithdraw, shares: sharesToBuy});
  };
  this.sell = function (currentPrice, percentage) {
    // console.log("cash: " + cash + " price: " + currentPrice);
    var sharesToSell = Math.floor(sharesOwned * percentage);
     console.log("sharesToSell: " + sharesToSell);
    var cashToDeposit = sharesToSell * currentPrice;
     console.log("cashToDeposit: " + cashToDeposit);
    cash += cashToDeposit;
    sharesOwned -= sharesToSell;
    console.log("Sold " + sharesToSell + " at " + currentPrice);
    console.log("cash now: " + cash + " sharesOwned now: " + sharesOwned);
    console.log("NET WORTH: " + (cash + sharesOwned * currentPrice));
    pricesPaid.push({cost: cashToDeposit * (-1), shares: sharesToSell * (-1)});
  };

}
var investorA = new Investor(100000);

function Stock (price, smaPeriods,volatility) {
  this.price = price;
  this.smaPeriods = smaPeriods;                                     //*** This will change with user input
  this.volatility = volatility;

  this.tradeSim = function() {
    console.log("stockPrice: " + this.price);
    var smaArray = [];
    for (var p = 0; p < this.smaPeriods; p++) {               // Populates the smaArray with the initial stock price to make the SMA calculation easier.
      smaArray.push(this.price);
    }

    investorA.buy(this.price, 0.5);    //Initial purchase of 50% of cash
    for (var i = 0; i < 100; i++) {
      var posOrNeg = Math.round(Math.random()) * 2 - 1;     // creates a random +/-1
      var dailyChange = Math.pow(Math.random(), 3) * this.volatility * posOrNeg; // creates a random number that is more likely to be close to 0
      // console.log("dailyChange: " + dailyChange);
      this.price += this.price * dailyChange / 100;         // changes the stock price by the dailyChange percentage.
      this.price = Math.round(this.price * 100) / 100;      // reduces Price to 2 decimal places
      console.log("stockPrice: " + this.price);
      //This keeps an array of the last last (smaPeriods) stock prices
      smaArray.shift();
      smaArray.push(this.price);
      simpleMovingAverage(smaArray);
      averagePricePaid(investorA.getHistory());
      console.log("avg: " + investorA.costBasis);

      // Buying decision
      if(this.price < investorA.costBasis) {
      investorA.buy(this.price, 0.01);
      }
      // Selling Decision
      if(this.price > investorA.costBasis) {
      investorA.sell(this.price, 0.02);
      }
    }
  };
}


averagePricePaid = function (array, inv) {
  var totalCost = 0;
  var totalShares = 0;
  for(var i = 0; i < array.length; i++) {
    totalCost += array[i].cost;
    totalShares += array[i].shares;
    // console.log("total cost: " + totalCost);
    // console.log("total shares: " + totalShares);
  }
  investorA.costBasis = totalCost/totalShares;
};

  function simpleMovingAverage (sArray) {
    var smaTotal = 0;
    //  console.log(sArray);
    for (s=0; s < sArray.length; s++) {          // gives the sum of the trades over the smaPeriods
      smaTotal += sArray[s];
    }
    var sma = smaTotal/sArray.length;            // divides the sum by the number of smaPeriods
    console.log("SMA: " + sma);
    return(sma);
  }


var stockA = new Stock(100,15,12);
function startSimulation() {
  stockA.tradeSim();
}

// ***********
// Simple way to attach js code to the canvas is by using a function
function sketchProc(processing) {
  // Override draw function, by default it will be called 60 times per second
  processing.draw = function() {
    // determine center and max clock arm length
    var centerX = processing.width / 2, centerY = processing.height / 2;
    var maxArmLength = Math.min(centerX, centerY);

    function drawArm(position, lengthScale, weight) {
      processing.strokeWeight(weight);
      processing.line(centerX, centerY,
        centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
        centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
      }

      // erase background
      processing.background(224);

      var now = new Date();

      // Moving hours arm by small increments
      var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
      drawArm(hoursPosition, 0.5, 5);

      // Moving minutes arm by small increments
      var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
      drawArm(minutesPosition, 0.80, 3);

      // Moving hour arm by second increments
      var secondsPosition = now.getSeconds() / 60;
      drawArm(secondsPosition, 0.90, 1);
    };

  }

  var canvas = document.getElementById("canvas1");
  // attaching the sketchProc function to the canvas
  var p = new Processing(canvas, sketchProc);
  // p.exit(); to detach it
