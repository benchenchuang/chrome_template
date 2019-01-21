var getText=null;
if(!getText){
	chrome.storage.sync.get('color', function(items) {
		getText=items['color'] || '';
	});
	alert('没有缓存')
}

function setStorage(params){
	chrome.storage.sync.set(params, function(items) {
		alert('信息设置成功')
	});
	chrome.storage.sync.get('color', function(items) {
		getText=items['color'] || '';
	})
}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	// console.log(request, sender, sendResponse);
	sendResponse({isWallet:true,color:getText});
	
});
