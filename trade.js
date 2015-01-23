var x=0;
var smaInput;
var buyPercInput;
var stockDropPercInput;
var percentSellInput;
var volatilitySlider;

function setup() {
   frameRate(100);
   smaInput = createInput(15).attribute( "type", "number").attribute("min", 2).attribute("max", 100).size(40).parent("smaPeriods1").value();
   console.log("smaInput: " + smaInput);
   buyPercInput = createInput(5).attribute("type", "number").attribute("min",1).attribute("max", 100).size(40).parent("cashAmount").value();
   console.log("buyPercInput: " + buyPercInput);
   //stockDropPercInput = createInput(5).attribute("type", "number").attribute("min",1).attribute("max", 100).size(40).parent("stockDrop").value();
   percentSellInput = createInput(5).attribute("type", "number").attribute("min",1).attribute("max", 100).size(40).parent("percentSell").value();
   console.log("percentSellInput: " + percentSellInput);
   volatilitySlider = createSlider(0,30,15).value();
   console.log("volatility: " + volatilitySlider);

   createCanvas(800, 400).position(350,100);

   background(244, 244, 255);
   translate(0, height);
   stockA.tradeSim(investorA);

}

function draw() {
   stroke(152, 152, 152, 70);
   line(0, stockA.allPrices[0].price*(-1), width, stockA.allPrices[0].price*(-1));
   stroke(0);
   line(x, stockA.allPrices[x].price*(-1), x+1, stockA.allPrices[x+1].price*(-1));
   stroke(250, 41, 236);
   line(x, stockA.allPrices[x].sma*(-1), x+1, stockA.allPrices[x+1].sma*(-1));
   stroke(185, 120, 16);
   line(x, stockA.allPrices[x].costBasis*(-1), x+1, stockA.allPrices[x+1].costBasis*(-1));
   stroke(53, 199, 0);
   line(x, stockA.allPrices[x].profit*(-1), x+1, stockA.allPrices[x+1].profit*(-1));
   text(stockA.allPrices[x].net, width-100,40);

   while(x < width-2) {
      x++;
      return;
   }
}

function startSimulation() {
    stockA.tradeSim(investorA);
}


function Investor (cash) {
  // var cash = cash;
  this.sharesOwned = 0;
  var pricesPaid = [];
  this.costBasis = 0;
  var startDollars = cash;

  this.profit = function (currentPrice) {
   //   console.log("Profit: " + this.netWorth(currentPrice)/startDollars*100);
     return this.netWorth(currentPrice)/startDollars*100;
 };

  this.netWorth = function (currentPrice) {
     return(this.sharesOwned * currentPrice + cash);
 };

  this.getHistory = function () {
    return pricesPaid;
  };
  this.buy = function (currentPrice, percentage) {
    var sharesToBuy = Math.floor((cash * percentage) / currentPrice);
    var cashToWithdraw = sharesToBuy * currentPrice;
    cash -= cashToWithdraw;
    this.sharesOwned += sharesToBuy;
    pricesPaid.push({cost: cashToWithdraw, shares: sharesToBuy});
  };
  this.sell = function (currentPrice, percentage) {
    var sharesToSell = Math.floor(this.sharesOwned * percentage);
    var cashToDeposit = sharesToSell * currentPrice;
    cash += cashToDeposit;
    this.sharesOwned -= sharesToSell;
    pricesPaid.push({cost: -cashToDeposit, shares: -sharesToSell});
  };
}
var investorA = new Investor(1000000);


function Stock (price, smaPeriods, volatility) {
  this.price = price;
  this.smaPeriods = smaPeriods;                                     //*** This will change with user input
  this.volatility = volatility;
  this.allPrices = [];
  this.dailyChange = 0;
  this.tradeSim = function(invest) {
   //  console.log("stockPrice: " + this.price);
    var smaArray = [];
    for (var p = 0; p < this.smaPeriods; p++) {               // Populates the smaArray with the initial stock price to make the SMA calculation easier.
      smaArray.push(this.price);
    }
    invest.buy(this.price, 0.5);    //Initial purchase of 50% of cash
    for (var i = 0; i < width; i++) {
      var posOrNeg = Math.round(Math.random()) * 2 - 1;     // creates a random +/-1
      this.dailyChange = Math.pow(Math.random(), 3) * this.volatility * posOrNeg; // creates a random number that is more likely to be close to 0
      this.price += this.price * this.dailyChange / 100;         // changes the stock price by the dailyChange percentage.
      this.price = Math.round(this.price * 100) / 100;      // rgb(255,0,0)uces Price to 2 decimal places
      //This keeps an array of the last last (smaPeriods) stock prices
      smaArray.shift();
      smaArray.push(this.price);


      simpleMovingAverage(smaArray);
      averagePricePaid(invest.getHistory(), invest);
      // Buying decision
      if(this.price < simpleMovingAverage(smaArray)) {
        invest.buy(this.price, buyPercInput/100);
      }
      // Selling Decision
      else if(this.price > invest.costBasis) {
        invest.sell(this.price, percentSellInput/100);
      }

      this.allPrices.push({
         price: this.price,
         change: this.dailyChange,
         sma: simpleMovingAverage(smaArray),
         costBasis: invest.costBasis,
         net: invest.netWorth(this.price),
         profit: invest.profit(this.price),
      });
      // console.log("Net worth: " + invest.netWorth(this.price) + " Profit: " + invest.profit(this.price));
    }
  };
}
var stockA = new Stock(100, smaInput, volatilitySlider);


averagePricePaid = function (array, inv) {
  var totalCost = 0;
  var totalShares = 0;
  for(var i = 0; i < array.length; i++) {
    totalCost += array[i].cost;
    totalShares += array[i].shares;
  }
  inv.costBasis = totalCost/totalShares;
  return(inv.costBasis);
};

function simpleMovingAverage (sArray) {
  var smaTotal = 0;
  //  console.log(sArray);
  for (s=0; s < sArray.length; s++) {          // gives the sum of the trades over the smaPeriods
    smaTotal += sArray[s];
  }
  var sma = smaTotal/sArray.length;            // divides the sum by the number of smaPeriods

  return(sma);
}
