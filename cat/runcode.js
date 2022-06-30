"use strict";
//返回thing的对象类型
function getConstructor(thing) {
    return thing ? String(thing.constructor).split(" ")[1].slice(0, String(thing.constructor).split(" ")[1].indexOf("(")) : "Object";
}

exports.send = function (language, code) {
    if (language == "javascript" || language == "js") {
        var runJs = new Function("try { " + code + " } catch (e) { return e; }");
        var codeReturn = runJs();
        setTimeout(() => {
            return "此代码在0.6秒内无响应惹/_ \\";
        }, 600);
        if (String(codeReturn).length > 150) {
            exports.isError = false;
            return " QAQ返回数据长度大于150惹";
        }
        else if (getConstructor(codeReturn).includes("Error")) {
            exports.isError = true;
            exports.e = {
                name: codeReturn.name,
                message: codeReturn.message
            };
            return ` QAQ出错惹\nUncaught ${String(codeReturn)}`;
        }
        else {
            exports.isError = false;
            return `\n返回数据：${String(codeReturn)}\n返回类型：${getConstructor(codeReturn)}`;
        }
    }
}