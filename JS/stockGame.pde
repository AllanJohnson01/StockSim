var startDayY = 200;
var currentX = 50;
var currentY = startDayY;
var dma = 10;

//random stock price method
for(var i = currentX; i < 350; i= i+1){
    var dailyChange = random(-5.0, 5.0);
    var dailyPrice = currentY - dailyChange;
    line(currentX,currentY,currentX+1,dailyPrice);
    //daily moving average method
    // if (currentX >= dma) {
    //     stroke(255, 0, 0);
    //     line(currentX,xxx,currentX+1,
    // }
    
    //var dailyAvg = sum/i
    var currentX = i;
    var currentY = dailyPrice;
    
    
}
