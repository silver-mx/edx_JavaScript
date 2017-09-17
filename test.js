
function Weekday (name, traffic) {
    this.name = name;
    this.traffic = traffic;
}

var monday = new Weekday("Monday", 3);
var tue = new Weekday("Tuesday", 5);
var wed = new Weekday("Wednesday", 2);
var friday = new Weekday("Friday", 5);

var weekdays = [monday, tue, wed, friday];

console.log("Result=", mostPopularDays(weekdays));

function mostPopularDays(week) {
    
    if (week === null || week.length == 0) {
        return null;
    }

    
    week.sort(function (a, b) {
        return b.traffic - a.traffic;
    });

    console.log("Sorted=", week);

    var mostPopulars = week.filter(function(element){
        return element.traffic == week[0].traffic;
     });

     if (mostPopulars.length == 1) {
         return mostPopulars[0].name;
     } else {
        return mostPopulars.map(function(element) {
            return element.name;
         });
        }
}
