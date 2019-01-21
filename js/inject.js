function getInfo(){
    alert('getInfo')
}
function invokeContentScript(code)
{
	window.postMessage({cmd: 'isHave', code: code}, '*');
}