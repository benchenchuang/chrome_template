
var chromeBackGround = chrome.extension.getBackgroundPage()
$('#goLogin').click(function(){
	$.post('http://116.62.161.77:8051/api/index/news', function(html){
		$('#goLogin').html('已登录')
		alert('跨域调用成功！');
		chromeBackGround.setStorage({color: 'white'});
		connectContent();
		sendMessageToContentScript({cmd:'login', content:'你好，我是登录按钮'},(response) => {
			if(response) alert('登录按钮收到content-script的回复：'+response);
		});
		alert('去登录');
	});
})


// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});


// popup与content-script建立长连接
// $('#connect_to_content_script').click(() => {
// 	getCurrentTabId((tabId) => {
// 		var port = chrome.tabs.connect(tabId, {name: 'wallet-connect'});
// 		port.postMessage({question: '你是谁啊？'});
// 		port.onMessage.addListener(function(msg) {
// 			alert('收到长连接消息：'+msg.answer);
// 			if(msg.answer && msg.answer.startsWith('我是'))
// 			{
// 				port.postMessage({question: '哦，原来是你啊！'});
// 			}
// 		});
// 	});
// });
function connectContent(){
	getCurrentTabId((tabId) => {
		var port = chrome.tabs.connect(tabId, {name: 'wallet-connect'});
		port.postMessage({question: '你是谁啊？'});
		port.onMessage.addListener(function(msg) {
			alert('收到长连接消息：'+msg.answer);
			if(msg.answer && msg.answer.startsWith('我是'))
			{
				port.postMessage({question: '哦，原来是你啊！'});
			}
		});
	});
};

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}
