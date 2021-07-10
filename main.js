const request = require('request');
const HTML = require('html-parse-stringify');

// Main

const args = process.argv.slice(2);
const targetFund = args[0];

const j = request.jar();
const cookie = request.cookie('hasCookie=true');
const url = 'https://codequiz.azurewebsites.net';

j.setCookie(cookie, url);

request({ url: url, jar: j }, (error, response, body) => {
  var fundList = htmlToFundList(body);
  var nav = fundList[targetFund];
  console.log(nav);
});

// Function

function htmlToFundList(body) {
  var fundList = {};
  var dom = HTML.parse(body);
  var table = dom[0].children[0].children[1].children[3];
  // Doctype -> html -> body -> table

  table.children.forEach((tr) => {
    let tds = tr.children;
    let index = 0;

    if (tds[index].type == 'text') {
      index++;
    }

    let fundName = tds[index].children[0].content.trim();
    let nav = parseFloat(tds[index + 1].children[0].content);

    if (fundName == 'Name is found') {
      return; 
    }

    fundList[fundName] = nav;
  });

  return fundList;
}