window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber,
		errorObj) {
	setTimeout(function() {
		document.getElementById("h1").innerHTML = _processStackMsg(errorObj);
	}, 0);
	console.info("errorMessage");
	console.info(errorMessage);
	console.info("scriptURI");
	console.info(scriptURI);
	console.info("lineNumber");
	console.info(lineNumber);
	console.info("columnNumber");
	console.info(columnNumber);
	console.info("errorObj");
	console.info(errorObj);
	$("#h2").empty();
	$("#h2").append("<br>");
	$("#h2").append("errorMessage: " + errorMessage + "<br>");
	$("#h2").append("scriptURI: " + scriptURI + "<br>");
	$("#h2").append("lineNumber: " + lineNumber + "<br>");
	$("#h2").append("columnNumber: " + columnNumber + "<br>");
	$("#h2").append("errorObj: " + errorObj + "<br>");
	$("#h2").append("errorObj.stack: " + errorObj.stack.replace(/@/g, " at ") + "<br>");

	alert(errorMessage);
	alert(errorObj.toString());
	
	return true;
}

function _processStackMsg(error) {
	let
	stack = error.stack.replace(/\n/gi, '').replace(/\bat\b/gi, '@').split('@')
			.slice(0, 10).map(function(v) {
				return v.replace(/^\s*|\s*$/g, '');
			}).join('~').replace(/\?[^:]+/gi, '');
	let
	msg = error.toString();
	if (stack.indexOf(msg) < 0) {
		stack = msg + '~' + stack;
	}
	return 'STACK:' + stack;
}

function makeError() {
	throw new Error('出错了!');
	alert("出错了！");
}
function makeError1() {
	makeError2();
}
function makeError2() {
	makeError3();
}
function makeError3() {
	makeError4();
}
function makeError4() {
	makeError5();
}
function makeError5() {
	makeError();
}