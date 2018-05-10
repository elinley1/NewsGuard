var cheerio = require("cheerio");
var axios = require("axios");

axios.get("https://www.theguardian.com").then(function(response) {
    let $ = cheerio.load(response.data);
    
    $(".fc-item__title").each(function(i, el) {
        var result = {};
        
        result.title = $(this).find(".fc-item__kicker").text()
        console.log(result.title)
     
        result.link = $(this).find(".fc-item__link").attr("href");
         console.log(result.link);
     
        result.summary = $(this).find(".js-headline-text").text();
         console.log(result.summary);
     
})});