/*
 * 可以实现的功能：1，记录页面打开；2，记录按钮点击；3，记录js异常；
 * 3，记录人员工号，姓名；4，记录pinpoint交易号txId。
 * customDimension
 * 1 => 用户工号
 * 2 => 按钮名称/js异常
 * 3 => txId
 * */


var idsite = '10'; // 网站id，从piwik服务器注册。
var systemName = 'testpiwik'; // 系统名称，用户自己设定

/* piwik初始化 */
var _paq = _paq || [];
trackPageView();
(function () {
    var u = "//10.31.31.128:8080/piwik/";
    _paq.push(['setTrackerUrl', u + 'piwik.php']);
    _paq.push(['setSiteId', idsite]);
    var d = document, g = d.createElement('script'), s = d
        .getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = u + 'piwik.js';
    s.parentNode.insertBefore(g, s);
})();

/* 记录页面， trackPageView */
function trackPageView() {
    _paq.push(['setUserId', getUserInfo()]); // 用户工号作为userID
    _paq.push(['setCustomDimension', 1, getUserInfo()]); // 用户工号
    _paq.push(['setCustomUrl', window.location.href.split("?")[0]]); //排除get请求时地址栏带参数的情况
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
}

/* 记录点击的按钮 */
window.addEventListener('click', function (e) {
    setTimeout(function () {
        if (e.target.localName == "button") {
            var buttonText = e.target.innerText.replace(/\s+/g, "");
            _paq.push(['setUserId', getUserInfo()]); // 用户工号作为userID
            _paq.push(['setCustomDimension', 1, getUserInfo()]); // 用户工号
            _paq.push(['setCustomDimension', 2, "" + buttonText]); // 按钮的文本
            var traceId = getTraceId_piwik();
            if (traceId) {
                _paq.push(['setCustomDimension', 3, traceId]); // 按钮的文本
            }
            _paq.push(['trackEvent', "BUTTON_CLICK", buttonText]);
        }
    }, 1);
});

/* 监听ajax请求，在头信息中插入txId */
(function (open) {
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        this.addEventListener("readystatechange", function (e) {
            if (this.readyState == 4) {
                console.log(this.status);
            }
        }, true);
        open.call(this, method, url, async, user, pass);
        var traceId = getTraceId_pinpoint();
        this.setRequestHeader("pinpoint-traceid", traceId);
        this.setRequestHeader("pinpoint-spanid", "1");
    };
})(XMLHttpRequest.prototype.open);

/* 获取txId,用于pinpoint */
function getTraceId_pinpoint() {
    var agentId = "U-" + systemName + "-" + getUserId();
    var timeMark = sessionStorage.getItem("timeMark");
    if (!timeMark) {
        timeMark = new Date().getTime();
        sessionStorage.setItem("timeMark", timeMark);
    }
    var serialNumber = sessionStorage.getItem("serialNumber");
    if (!serialNumber) {
        serialNumber = 1;
        sessionStorage.setItem("serialNumber", serialNumber);
    } else {
        serialNumber = parseInt(serialNumber) + 1;
        sessionStorage.setItem("serialNumber", serialNumber);
    }
    var traceId = agentId + "^" + timeMark + "^" + serialNumber;
    return traceId;
}

/* 获取txId,用于piwik */
function getTraceId_piwik() {
    var traceId;
    var agentId = "U-" + systemName + "-" + getUserId();
    var timeMark = sessionStorage.getItem("timeMark");
    if (timeMark) {
        var serialNumber = sessionStorage.getItem("serialNumber");
        if (serialNumber) {
            traceId = agentId + "^" + timeMark + "^" + serialNumber;
        }
    }
    return traceId;
}

/* 获取用户信息，姓名-工号 */
function getUserInfo() {
    var userInfo;
    var userId = getUserId();
    if (userId != "ANONYMOUS") {
        var userName = getUserName();
        if (userName != "") {
            userInfo = getUserName() + "-" + userId;
        } else {
            userInfo = getUserName();
        }
    } else {
        userInfo = "ANONYMOUS";
    }
    return userInfo;
}

/* 获取用户工号 */
function getUserId() {
    return sessionStorage.getItem("userId") || "ANONYMOUS";
}

/* 获取用户姓名 */
function getUserName() {
    return sessionStorage.getItem("userName") || "";
}

/* 监听按钮点击事件，并记录按钮的文本内容 */
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber,
                           errorObj) {
    setTimeout(function () {
        var _AT = " at ";
        var stack = "" + errorObj.stack.replace(/@/g, _AT);
        var msg = errorObj.toString();
        if (stack.indexOf(msg) < 0) {
            stack = msg + _AT + stack;
        }
        _paq.push(['setUserId', getUserInfo()]);
        _paq.push(['setCustomDimension', 1, getUserInfo()]);
        var traceId = getTraceId_piwik();
        if (traceId) {
            _paq.push(['setCustomDimension', 3, traceId]);
        }
        _paq.push(['setCustomDimension', 2, stack]);
        _paq.push(['trackEvent', "JS_ERROR", msg, stack]);
    }, 0);
}
