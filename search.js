'use strict';

(()=>{

  let targetURL = 'https://www.google.co.jp/';

let getURLData = (aURL)=> {
  var parser = document.createElement('a');
  parser.href = aURL;
  return {
    hash     : parser.hash,
    host     : parser.host,
    hostname : parser.hostname,
    href     : parser.href,
    pathname : parser.pathname,
    port     : parser.port,
    protocol : parser.protocol,
    search   : parser.search
  };
};

//ポップアップを閉じる
let closeFunc = ()=> {
  window.close();  // popupを閉じる処理
};

let getWindowInfo = (aCallback)=> {

  chrome.tabs.query({
    active: true,
    url: targetURL + '*'
  }, aCallback);

};

let setURL = (tabID, aURL)=> {
  chrome.tabs.update(tabID, {url: aURL });
};

//タブのデータにアクセス
getWindowInfo((tabs)=> {
  let tab = tabs[0];

  console.log(tab);

  if (tab == null || tab.url == null ||
      tab.url.indexOf(targetURL) == null) {
    closeFunc();
  }


  let urlObj = getURLData(tab.url);



  let queries = urlObj.search.replace(/^\?/, '').split('&');
  let URL = urlObj.protocol + '//' + urlObj.host + urlObj.pathname + '?' + queries[0];


  let domList = document.querySelectorAll(".year");

  for(let cnt= 0, len= domList.length; cnt<len; cnt++) {
    let dom = domList[cnt];
    dom.addEventListener('click', ()=>{
      let year = dom.dataset.year;

      if ( year === "1" ) {
        URL += '&tbs=qdr:y';
      }
      else if ( year === "0.083" ) {
        URL += '&tbs=qdr:m';
      }
      else if ( year === "0" ) {
      }
      else {
        let max = moment().format('YYYY/MM/DD');
        let min = moment().subtract(parseFloat(year, 10), 'years').format('YYYY/MM/DD');

        URL += `&tbs=cdr:1,cd_min:${min},cd_max:${max}`;
      }

      setURL(tab.id, URL);

    }, false);
  }



});




})();

