var fromCurrency = "";
var toCurrency = "";
var ratesUsd,ratesEur,ratesGbp,eurToGbp,eurToUsd,gbpToEur,usdToEur,usdToGbp,gbpToUsd;

function getExchangeRate() {
    var apikey = "e3348cf61a516ccbfd443c029b621805";
    $.ajax({
        url: 'http://data.fixer.io/api/latest?access_key=' + apikey,
        dataType: 'jsonp',
        success: function (json) {
            console.log(json);
            ratesEur = json.rates.EUR;
            ratesUsd = json.rates.USD;
            ratesGbp = json.rates.GBP;
        },
        fail: function (xhr, statusText, body) {
            console.log(body);
            console.log(xhr);
            console.log(statusText);
        },
        error: function (err) {
            console.log(err);
        }
    });
};

function disableSelectItemFromTo() {
    $('select[id=from]').on('change', function () {
        var selected = this;
        $("#as").text(selected.value);
        $('select[id=to]').find('option').prop('disabled', function () {return this.value == selected.value;});
    });

    $('select[id=to]').on('change', function () {
        var selected = this;
        $("#into").text(selected.value);
        $('select[id=from]').find('option').prop('disabled', function () {return this.value == selected.value;});
    });
}
function calculateRates(){
    $("#amount").on("input", function (event) {
        var x;
        $('select[id=from]').on('change', function () {
            var selected = this;
            fromCurrency = selected.value;
            $("#fromAmountFormatted").text(numeral(event.target.value).format("$0,0.00"));

            /*  convert from euro to GBP or USD*/
           if (fromCurrency === "EUR") {
                $('select[id=to]').on('change', function () {
                    var selected = this;
                    toCurrency = selected.value;
                    if (toCurrency === "GBP") {
                        x = $("#toAmountFormatted").text(numeral(event.target.value * ratesGbp).format("$0,0.00"));
                    }
                    else if (toCurrency === "USD") {
                        $("#toAmountFormatted").text(numeral(event.target.value * ratesUsd).format("$0,0.00"));
                    }
                });
            }

            /*  convert from USD to GBP or EUR*/
            if (fromCurrency === "USD") {
                $('select[id=to]').on('change', function () {
                    var selected = this;
                    toCurrency = selected.value;
                    if (toCurrency === "GBP") {
                        x = $("#toAmountFormatted").text(numeral(event.target.value * usdToGbp).format("$0,0.00"));
                    }
                    else if (toCurrency === "EUR") {
                        $("#toAmountFormatted").text(numeral(event.target.value * usdToEur).format("$0,0.00"));
                    }
                });
            }

            if (fromCurrency === "GBP") {
                $('select[id=to]').on('change', function () {
                    var selected = this;
                    toCurrency = selected.value;
                    if (toCurrency === "EUR") {
                        x = $("#toAmountFormatted").text(numeral(event.target.value * gbpToEur).format("$0,0.00"));
                    }
                    else if (toCurrency === "USD") {
                        $("#toAmountFormatted").text(numeral(event.target.value * gbpToUsd).format("$0,0.00"));
                    }
                });
            }
        });
    });
}

function displayCurrentExchangeRates(){
    $.get("https://api.fixer.io/latest?access_key=e3348cf61a516ccbfd443c029b621805&base=EUR&symbols=GBP,USD", function (json) {
        console.log(json);
        eurToGbp = json.rates.GBP;
        eurToUsd = json.rates.USD;
        gbpToEur = 1 / eurToGbp;
        usdToEur = 1 / eurToUsd;
        $(".exchangeRateEurGbp").text("1 EUR = " + eurToGbp + " GBP");
        $(".exchangeRateEurUsd").text("1 EUR= " + eurToUsd + " USD");
        $(".exchangeRateGbpEur").text("1 GBP = " + gbpToEur + " EUR");
        $(".exchangeRateUsdEur").text("1 USD = " + usdToEur + " EUR");
        $(".date").text(json.date);
    });
    $.get("https://api.fixer.io/latest?access_key=e3348cf61a516ccbfd443c029b621805&base=USD&symbols=GBP,EUR", function (json) {
        console.log(json);
        usdToGbp = json.rates.GBP;
        gbpToUsd = 1 / usdToGbp;
        $(".exchangeRateGbpUsd").text("1 GBP= " + gbpToUsd + " USD");
        $(".exchangeRateUsdGbp").text("1 USD= " + usdToGbp + " GBP");
        $(".date").text(json.date);
    });
}

$(document).ready(function () {
    displayCurrentExchangeRates();
    disableSelectItemFromTo();
    getExchangeRate();
    calculateRates();
});


