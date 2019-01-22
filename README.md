# chrome_template
### background.js一直运行，可以访问任何chrome.api，popup.js插件页面上的js,可以通过window.backgroundpage访问background.js方法，也可以传消息给content-script.js
### content-script可以直接访问网站dom，但是 不可以访问chrome很多api,需要background.js传消息；
### injected.js 属于注入网站的js,可以被网站内的方法调用，可以用方法访问content-script
