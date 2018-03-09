/*
 * customDimension
 * 1 => 用户工号
 * 2 => 按钮名称
 * 3 => txId
 * 4 => js异常
 * */

/* piwik初始化 */
var _paq = _paq || [];
trackPageView();
(function () {
    var u = "//10.31.31.128:8080/piwik/";
    // var u = "//10.18.160.20/project/piwik/";
    _paq.push(['setTrackerUrl', u + 'piwik.php']);
    _paq.push(['setSiteId', '10']);
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
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
}

/* 监听按钮点击事件，并记录按钮的文本内容 */
window.addEventListener('click', function (e) {
    setTimeout(function () {
        if (e.target.localName == "button") {
            var buttonText = e.target.innerText.replace(/\s+/g, "");
            _paq.push(['setUserId', getUserInfo()]); // 用户工号作为userID
            _paq.push(['setCustomDimension', 1, getUserInfo()]); // 用户工号
            _paq.push(['setCustomDimension', 2, "" + buttonText]); // 按钮的文本
            var testHeader = getHeaderValue_0();
            if (testHeader) {
                _paq.push(['setCustomDimension', 3, testHeader]); // 按钮的文本
            }
            // _paq.push([ 'setCustomDimension', 4 ]); // 按钮的文本
            _paq.push(['trackEvent', "BUTTON_CLICK", buttonText]);
        }
    }, 1);
});

/* 监听ajax请求，在头信息中插入txId */
(function (open) {
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        this.addEventListener("readystatechange", function (e) {
            if (this.readyState == 4) {
                // 在这可以获取到response数据，并且修改
                console.log(this.status);
            }
        }, true);
        open.call(this, method, url, async, user, pass);
        // 在这添加自定义数据
        var testHeader = getHeaderValue_1();
        // this.setRequestHeader("pinpoint-traceid", testHeader);
        // this.setRequestHeader("pinpoint-spanid", "1");
    };
})(XMLHttpRequest.prototype.open);

/* 获取txId,用于pinpoint */
function getHeaderValue_1() {
    console.clear(); // *****************debug
    console.info("***************** pinpoint " + new Date()); // *****************debug
    var agentId = "USER-" + getUserId();
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
    var testHeader = agentId + "^" + timeMark + "^" + serialNumber;
    console.info("*****************          " + testHeader); // *****************debug
    dispRes("pinpoint", new Date(), testHeader); // *****************debug
    return testHeader;
}

/* 获取txId,用于piwik */
function getHeaderValue_0() {
    console.info("***************** piwik    " + new Date()); // *****************debug
    var testHeader;
    var agentId = "USER-" + getUserId();
    var timeMark = sessionStorage.getItem("timeMark");
    if (timeMark) {
        var serialNumber = sessionStorage.getItem("serialNumber");
        if (serialNumber) {
            testHeader = agentId + "^" + timeMark + "^" + serialNumber;
        }
    }
    console.info("*****************          " + testHeader); // *****************debug
    dispRes("piwik", new Date(), testHeader); // *****************debug
    return testHeader;
}

/* 获取用户信息，姓名-工号 */
function getUserInfo() {
    var userInfoRes = sessionStorage.getItem("userInfo");
    if (!userInfoRes) {
        userInfoRes = "ANONYMOUS";
        var userId = getUserId();
        if (userId != "ANONYMOUS") {
            userInfoRes = getUserName() + "-" + userId;
        }
        sessionStorage.setItem("userInfo", userInfoRes);
    }
    return userInfoRes;
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
        console.info(stack);// debug
        _paq.push(['setUserId', getUserInfo()]); // 用户工号作为userID
        _paq.push(['setCustomDimension', 1, getUserInfo()]); // 用户工号
        var testHeader = getHeaderValue_0();
        if (testHeader) {
            _paq.push(['setCustomDimension', 3, testHeader]); // 当前txId
        }
        // _paq.push([ 'setCustomDimension', 2 ]); // 置为空
        _paq.push(['setCustomDimension', 2, stack]); // 异常stack
        _paq.push(['trackEvent', "JS_ERROR", stack]);
        alert(msg); // *****************debug
    }, 0);
    // return true; // 停止在控制台打印错误
}
