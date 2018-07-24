let request = require('request');

const stocks = [
    'KAN.ST',
    'TOBII.ST',
    'STAR-B.ST',
    'ACTI.ST',
    'BIOA-B.ST',
    'BINV.ST'
];

stocks.forEach(function(stockName) {
    calculateStockPrice(stockName);
}, this);

function calculateStockPrice(stockName) {
    return getPrice(stockName, function(err, prices) {
        console.log(calculatePrice(stockName, prices));
    });
}

function calculatePrice (stockName, prices) {
    let colorCode = '\x1b[0m';
    if (prices.currentPrice >= prices.oldPrice) {
        colorCode = '\x1b[32m';
    } else {
        colorCode = '\x1b[31m';
    }
    return `\x1b[35m${stockName}: \x1b[36m${prices.currentPrice} ${colorCode}(${calculatePercentage(prices.oldPrice, prices.currentPrice)}%)\x1b[0m`;
}

function calculatePercentage(oldPrice, newPrice) {
    return (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2);
}


function getPrice (stockName, callback) {

    request("https://finance.yahoo.com/quote/" + stockName + "/", function(err, res, body){

		if (err) {
			callback(err);
		}

        let prices = {
            currentPrice: body.split("currentPrice")[1].split("fmt\":\"")[1].split("\"")[0],
            oldPrice: body.split("previousClose")[1].split("fmt\":\"")[1].split("\"")[0]
        };

		callback(null, prices);

	});
}
