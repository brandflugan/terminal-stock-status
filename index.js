let rp = require('request-promise-native');
require('clear')();

const stocksObj = {
    Kancera: 'KAN.ST',
    Tobii: 'TOBII.ST',
    Starbreeze: 'STAR-B.ST',
    ActiveBiotech: 'ACTI.ST',
    BioArctic: 'BIOA-B.ST',
    Oasmia: 'OASM.ST',
    Fingerprint: 'FING-B.ST'
};

for (const [key, value] of Object.entries(stocksObj)) {
    calculateStockPrice(key, value);
}

function calculateStockPrice(company, stockName) {
    getPrice(stockName)
        .then(prices => {
           console.log(printPrice(company, stockName, prices));
        })
        .catch(error => {
           console.log(error);
        });
}

function printPrice (company, stockName, prices) {
    let colorCode = '\x1b[0m';
    if (prices.currentPrice >= prices.oldPrice) {
        colorCode = '\x1b[32m';
    } else {
        colorCode = '\x1b[31m';
    }
    return `\x1b[37m${company} (${stockName}): \x1b[36m${prices.currentPrice} ${colorCode}(${calculatePercentage(prices.oldPrice, prices.currentPrice)}%)\x1b[0m`;
}

function calculatePercentage(oldPrice, newPrice) {
    return (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2);
}

function getPrice (stockName) {
    return rp("https://finance.yahoo.com/quote/" + stockName + "/")
        .then((body) => {
            return {
                currentPrice: body.split("currentPrice")[1].split("fmt\":\"")[1].split("\"")[0],
                oldPrice: body.split("previousClose")[1].split("fmt\":\"")[1].split("\"")[0]
            };
        })
        .catch((error) => {
            return error;
        });
}

