console.log('这是content script!');

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
	injectCustomJs();
	sendMessageToBackground('获取storage');
});

// 接收来自popup/background后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	console.log(request)
	if(request.cmd == 'login') {
		localStorage.setItem('status','new_token_wallet');
		window.location.reload();
	}
	else {
		console.log(request)
		tip(JSON.stringify(request));
		sendResponse('我收到你的消息了：'+JSON.stringify(request));
	}
});

// 主动发送消息给background后台
function sendMessageToBackground(message) {
	chrome.runtime.sendMessage({greeting: message || ''}, function(response) {
		tip('收到最新回复：' + response);
		console.log(response)
		console.log(message)
	});
}

// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'wallet-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('wallet收到长连接消息：', msg);
		});
	}
});

window.addEventListener("message", function(e)
{
	console.log('收到消息：', e);
	if(e.data.cmd=="isHave"){
		sendMessageToBackground('token');
	}
}, false);


function initCustomEventListen() {
	var hiddenDiv = document.getElementById('myCustomEventDiv');
	if(!hiddenDiv) {
		hiddenDiv = document.createElement('div');
		hiddenDiv.style.display = 'none';
		hiddenDiv.id = 'myCustomEventDiv';
		document.body.appendChild(hiddenDiv);
	}
	hiddenDiv.addEventListener('myCustomEvent', function() {
		var eventData = document.getElementById('myCustomEventDiv').innerText;
		tip('收到自定义事件：' + eventData);
	});
}

var tipCount = 0;
// 简单的消息通知
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
	ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
}

// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	// temp.onload = function()
	// {
	// 	// 放在页面不好看，执行完后移除掉
	// 	this.parentNode.removeChild(this);
	// };
	document.body.appendChild(temp);
}