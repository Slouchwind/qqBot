"use strict";
const { segment } = require("oicq");
const { toCqcode, fromCqcode } = require("oicq2-cq-enable/lib/utils");
const { bot } = require("./bot");
const fs = require("fs");
const path = require("path");
const runcode = require("./runcode");
const fetch = require("axios").get;

//定义群号/QQ号
const normal = [
    765730405,//🍀氧化钙社区 | 馅料群
    821144286,//原神肝帝集结
    225909320,//唔唔唔9999BOT！
    966164395,//{$}｜闲聊群
    422505067,//志怪者也
    866680587,//圣·自习室
    747648670,//猫猫群
    280247691,//旅行者的聚集地
    774097408,//锦里の五月三
    830513395//小屋
];
const mute = [
    966164395,//{$}｜闲聊群
    765730405,//🍀氧化钙社区 | 馅料群
    422505067,//志怪者也
    866680587,//圣·自习室
    747648670,//猫猫群
    280247691//旅行者的聚集地
];
const none = [
    1270935308,//SisST的机器人
    2043688733,//Vampire
    3223549845//团团备份酱
];

//定义变量
var lastMute;
var sign = {};
var muteMsg = {};
var privateMsg = {};

//定义函数

/**返回两个`Date`对象相差天数 */
function day(d1 = new Date(), d2 = new Date()) {
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round((d2 - d1) / (24 * 60 * 60 * 1000));
}

/**返回`text`中包含`splitText`的次数 */
function textNum(text, splitText) {
    return text.includes(splitText) ? text.split(splitText).length - 1 : 0;
}

/**返回可读性日期 */
const getTime = {
    /**时分秒 */
    time: function (doDate = new Date()) {
        let date = doDate;
        let h = date.getHours();
        if (h < 10) { h = "0" + h; }
        let m = date.getMinutes();
        if (m < 10) { m = "0" + m; }
        let s = date.getSeconds();
        if (s < 10) { s = "0" + s; }
        return `${h}:${m}:${s}`;
    },
    /**年月日 */
    date: function (doDate = new Date()) {
        let date = doDate;
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        if (m < 10) { m = "0" + m; }
        let d = date.getDate();
        if (d < 10) { d = "0" + d; }
        return `${y}年${m}月${d}日`;
    }
}

/**获取数组中`text`出现的次数 */
Array.prototype.textNum = function (text) {
    var num = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i] === text) {
            num++;
        }
    }
    return num;
}

/**获取`dir`路径下的随机文件名 */
function randomFile(dir) {
    var getFileList = fs.readdirSync(path.resolve(dir));
    console.log(path.resolve(dir, getFileList[Math.round(Math.random() * getFileList.length)]));
    return path.resolve(dir, getFileList[Math.round(Math.random() * getFileList.length)]);
}

const botUse = {
    reply: ["签到",
        "戳一戳",
        "涩涩",
        "不可以涩涩",
        "一言",
        "来点锦里",],
    code: ["获取头像 QQ号(number)",
        "获取群头像 群号(number)",
        "运行 js (code)",
        "群资料 人数(以及其他)",
        "群文件 已有数量(以及其他)",],
    textReply: [
        "草",
        segment.face(277),
        segment.face(178),
        segment.face(2),
    ]
}

//群聊消息
bot.on("message.group", function (msg) {
    //msg.group.markRead();

    //屏蔽
    if (!(none.includes(msg.member.user_id))) {
        //this.sendGroupMsg(904992919, "[群：" + msg.group_name + " (" + msg.group_id + ") ]\n" + msg.nickname + "：" + msg.raw_message);
        //this.sendGroupMsg(904992919, fromCqcode(toCqcode(msg)));

        //氧化钙群中指令
        if (msg.group_id == "765730405") {
            if (msg.raw_message === "唔唔唔") {
                msg.group.sendMsg("嘤嘤嘤QAQ");
            }
        }

        /*if (msg.group_id == "774097408") {
            if (msg.raw_message === "萝莉涩图") {
                var setupath = "E:\\QQupppp\\pppiiic\\pic\\pic\\";
                msg.group.sendMsg([segment.image(randomFile(setupath)), segment.image(randomFile(setupath)), segment.image(randomFile(setupath))]);
            }
        }*/

        //普通功能

        if (normal.includes(msg.group_id)) {
            //签到
            if (msg.raw_message === "签到") {
                sign = fs.readFileSync("sign.json").toString();
                sign = JSON.parse(sign);
                //随机数
                var num = Math.round(Math.random() * 100);
                //签到成功的消息
                var signSend = [
                    segment.at(msg.member.user_id),
                    ` qwq您今日的人品为：${num}`
                ];
                //重复签到的消息
                var signAgain = [
                    segment.at(msg.member.user_id),
                    " QAQ您今天已经签到过了！"
                ];
                if (sign[String(msg.group_id)] === undefined) {
                    sign[String(msg.group_id)] = {};
                }
                if (sign[String(msg.group_id)][String(msg.member.user_id)] === undefined) {
                    msg.group.sendMsg(signSend);
                    sign[String(msg.group_id)][String(msg.member.user_id)] = [];
                    sign[String(msg.group_id)][String(msg.member.user_id)][0] = new Date();
                    sign[String(msg.group_id)][String(msg.member.user_id)][1] = num;
                }
                else {
                    if (day(new Date(sign[String(msg.group_id)][String(msg.member.user_id)][0]), new Date()) < 1) {
                        msg.group.sendMsg(signAgain);
                    }
                    else {
                        msg.group.sendMsg(signSend);
                        sign[String(msg.group_id)][String(msg.member.user_id)][1] = num;
                        if (num >= 90) {
                            msg.group.sendMsg(segment.image("https://gchat.qpic.cn/gchatpic_new/2241051890/966164395-3007860911-9EF80AA35536B958CF91AD2A14438A54/0?term=2,asface=false"));
                        }
                        else if (num <= 20) {
                            msg.group.sendMsg(segment.image("https://gchat.qpic.cn/gchatpic_new/2241051890/765730405-2371465024-812523D171544CBD7B28C9AD5E476B50/0?term=2,asface=false"));
                        }
                    }
                    sign[String(msg.group_id)][String(msg.member.user_id)][0] = new Date();
                }
                fs.writeFileSync("sign.json", JSON.stringify(sign, "", "\t"));
                this.sendGroupMsg(904992919, JSON.stringify(sign, "", "\t"));
            }

            //消息回应

            if (msg.raw_message === "?" || msg.raw_message === "？") {
                msg.group.sendMsg("¿");
            }

            if (msg.raw_message === "戳一戳") {
                msg.group.sendMsg(["啊…不要", segment.face(66)])
                msg.member.poke();
            }

            if (msg.raw_message === "涩涩") {
                msg.group.sendMsg(["请使用我", segment.face(66)]);
                msg.group.sendMsg(segment.image("https://wx3.sinaimg.cn/mw2000/006YXGI4gy1h2vzwr6hc0j308c03d0sl.jpg"));
            }

            if (msg.raw_message.includes("不可以涩涩")) {
                msg.group.sendMsg(["可以涩涩呐", segment.face(66)]);
            }

            if (
                msg.raw_message.includes("doge") ||
                msg.raw_message.includes("狗头") ||
                msg.raw_message.includes("[/汪汪]")
            ) {
                msg.group.sendMsg(segment.face(277));
            }
            if (
                msg.raw_message.includes("滑稽") ||
                msg.raw_message.includes("[斜眼笑]")
            ) {
                msg.group.sendMsg(segment.face(178));
            }

            if (msg.raw_message.includes("[色]")) {
                msg.group.sendMsg(segment.face(2));
            }

            if (msg.raw_message.includes("草") || msg.raw_message.includes("🌿")) {
                msg.group.sendMsg(("草").repeat(Number(textNum(msg.raw_message, "草") + textNum(msg.raw_message, "🌿"))));
            }

            if (msg.raw_message === "oicq") {
                msg.group.sendMsg("https://github.com/takayama-lily/oicq");
            }

            if (msg.raw_message === "一言") {
                let res;
                (async () => {
                    await fetch("https://v1.hitokoto.cn/?c=i&encode=json")
                        .then(result => res = result.data)
                        .catch(error => msg.group.sendMsg("获取错误"));
                    msg.group.sendMsg(res.hitokoto + "\n    ——《" + res.from + "》");
                })();
            }

            if (msg.raw_message === "来点锦里") {
                let res;
                let err = false;
                (async () => {
                    await fetch("https://art.drblack-system.com/wp-json/wp/v2/posts?per_page=1&orderby=rand")
                        .then(response => response.data)
                        .then(result => res = result)
                        .catch(error => err = true);
                    let tag = "";
                    if (err) {
                        msg.group.sendMsg("获取错误");
                    }
                    else {
                        for (let i = 0; i < res[0].tag_names.length; i++) {
                            tag += `${res[0].tag_names[i]} `;
                        }
                        msg.group.sendMsg([
                            segment.image(res[0].fimg_url.url_new),
                            "\n标题：" + res[0].title.rendered,
                            "\n作者：" + res[0].author_meta.user_nicename,
                            "\n链接：" + res[0].link,
                            "\n标签：" + tag,
                            "\n请不要过度依赖此机器人，前往锦里可查看更多消息"
                        ]);
                    }
                })();
            }

            //指令

            if (msg.raw_message.includes(" ")) {
                var split = msg.raw_message.split(" ");
                if (split[0] === "获取头像") {
                    var qqId = split[1];
                    var size = split[2];
                    var send;
                    if (qqId * 1 == qqId) {
                        if (size === undefined) {
                            size = "0";
                            var src = `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${qqId}`;
                            send = segment.image(src);
                        }
                        else if (size * 1 == size && (size == "0" || size == "40" || size == "100" || size == "140")) {
                            var src = `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${qqId}`;
                            send = segment.image(src);
                        }
                        else {
                            send = "指令参数错误！\n请使用「获取头像 QQ号(number) 大小(0 | 40 | 100 | 140)」";
                        }
                    }
                    else {
                        send = "指令参数错误！\n请使用「获取头像 QQ号(number)」";
                    }
                    msg.group.sendMsg(send);
                }

                if (split[0] === "获取群头像") {
                    var groupId = split[1];
                    var size = split[2];
                    var send;
                    if (groupId * 1 == groupId) {
                        if (size === undefined) {
                            size = "0";
                            var src = `https://p.qlogo.cn/gh/${groupId}/${groupId}/${size}`;
                            send = segment.image(src);
                        }
                        else if (size * 1 == size && (size == "0" || size == "40" || size == "100" || size == "140")) {
                            var src = `https://p.qlogo.cn/gh/${groupId}/${groupId}/${size}`;
                            send = segment.image(src);
                        }
                        else {
                            send = "指令参数错误！\n请使用「获取群头像 群号(number) 大小(0 | 40 | 100 | 140)」";
                        }
                    }
                    else {
                        send = "指令参数错误！\n请使用「获取群头像 群号(number)」";
                    }
                    msg.group.sendMsg(send);
                }

                if (split[0] === "运行") {
                    var language = split[1];
                    var code = msg.raw_message.slice(language.length + 4, msg.raw_message.length);
                    var runCodeSend = runcode.send(language, code);
                    if (runcode.isError) {
                        console.log(`\x1b[0;91m[×] ${runcode.e.name}: ${runcode.e.message}\x1b[0m`);
                    }
                    setTimeout(() => {
                        msg.reply([segment.at(msg.member.user_id), runCodeSend], true);
                    }, 600);
                }

                if (split[0] === "群资料") {
                    var use = ["人数", "最大人数", "拥有者", "创建时间", "等级", "在线人数"];
                    var index = split[1];
                    switch (use.indexOf(index)) {
                        case 0:
                            msg.group.sendMsg(String(msg.group.info.member_count));
                            break;
                        case 1:
                            msg.group.sendMsg(String(msg.group.info.max_member_count));
                            break;
                        case 2:
                            msg.group.sendMsg(String(msg.group.info.owner_id));
                            break;
                        case 3:
                            var createD = new Date(msg.group.info.create_time * 1000);
                            msg.group.sendMsg(getTime.date(createD));
                            break;
                        case 4:
                            msg.group.sendMsg(String(msg.group.info.grade));
                            break;
                        case 5:
                            msg.group.sendMsg(String(msg.group.info.active_member_count));
                            break;
                        default:
                            var signSend = "群资料用法中无此指令QAQ\n可用指令";
                            for (let i = 0; i < use.length; i++) {
                                signSend += `\n「群资料 ${use[i]}」`;
                            }
                            msg.group.sendMsg(signSend);
                            break;
                    }
                }

                if (split[0] === "群文件") {
                    var use = ["剩余空间", "全部空间", "使用空间", "已有数量", "最大数量", "列出目录"];
                    var index = split[1];
                    switch (use.indexOf(index)) {
                        case 0:
                            msg.group.fs.df().then((df) => msg.group.sendMsg(String(df.free)));
                            break;
                        case 1:
                            msg.group.fs.df().then((df) => msg.group.sendMsg(String(df.total)));
                            break;
                        case 2:
                            msg.group.fs.df().then((df) => msg.group.sendMsg(String(df.used)));
                            break;
                        case 3:
                            msg.group.fs.df().then((df) => msg.group.sendMsg(String(df.file_count)));
                            break;
                        case 4:
                            msg.group.fs.df().then((df) => msg.group.sendMsg(String(df.max_file_count)));
                            break;
                        case 5:
                            /*
                            0      1       2            3                4
                            群文件 列出目录
                            群文件 列出目录 路径(string)
                            群文件 列出目录 路径(string) 开始数目(number) 数目(number)
                            群文件 列出目录 开始数目(number) 数目(number)
                            */
                            var signSend;
                            var notError = true;
                            var pid = "/";
                            var start = 0;
                            var limit = 20;
                            if (split[2] && split[2] * 1 == split[2]) {
                                start = split[2];
                                if (split[3] * 1 == split[3]) {
                                    limit = split[3];
                                    //群文件 列出目录 开始数目(number) 数目(number) √
                                }
                                else {
                                    notError = false;
                                    signSend = "指令参数错误！\n请使用「群文件 列出目录 开始数目(number) 数目(number)」";
                                    //群文件 列出目录 开始数目(number) 数目(number ×) 
                                }
                            }
                            else if (split[3] && split[3] * 1 == split[3]) {
                                if (split[4] && split[4] * 1 == split[4]) {
                                    pid = split[2] + split[2][split[2].length - 1] == "/" ? "" : "/";
                                    start = split[3];
                                    limit = split[4];
                                    //群文件 列出目录 路径(string) 开始数目(number) 数目(number) √
                                }
                                else {
                                    notError = false;
                                    signSend = "指令参数错误！\n请使用「群文件 列出目录 路径(string) 开始数目(number) 数目(number)」";
                                    //群文件 列出目录 路径(string) 开始数目(number) 数目(number ×)
                                }
                            }
                            else {
                                if (split[2]) {
                                    pid = split[2] + split[2][split[2].length - 1] == "/" ? "" : "/";
                                    //群文件 列出目录 路径(string) √
                                }
                                else {
                                    //群文件 列出目录 √
                                }
                            }
                            msg.group.fs.dir(pid, Number(start), Number(limit)).then(
                                (dir) => {
                                    /*console.log(pid);
                                    console.log(start);
                                    console.log(limit);*/
                                    console.log(dir);
                                    if (notError) {
                                        if (limit > 20) {
                                            signSend = "QAQ列出文件数目大于20惹\n请重新填写数目";
                                        }
                                        else {
                                            signSend = `列出文件路径：${pid}`;
                                            for (let i = 0; i < dir.length; i++) {
                                                signSend += `\n${(dir[i].is_dir ? "文件夹：" : "文件：")}${dir[i].name}`;
                                            }
                                        }
                                    }
                                    msg.group.sendMsg(signSend);
                                }
                            );
                            break;
                        default:
                            var signSend = "群文件用法中无此指令QAQ\n可用指令";
                            for (let i = 0; i < use.length; i++) {
                                signSend += `\n「群文件 ${use[i]}」`;
                            }
                            msg.group.sendMsg(signSend);
                            break;
                    }
                }
            }

            //引号内容复读
            if (
                (
                    (textNum(msg.raw_message, "\"") >= 2) ||
                    (textNum(msg.raw_message, "'") >= 2) ||
                    (msg.raw_message.includes("“") && msg.raw_message.includes("”")) ||
                    (msg.raw_message.includes("‘") && msg.raw_message.includes("’"))
                ) && (!(
                    msg.raw_message.includes("我") ||
                    msg.raw_message.includes("春风")
                ))
            ) {
                if (textNum(msg.raw_message, "\"") >= 2) {
                    var symbol = "\"";
                    var lastSymbol = "\"";
                }
                else if (textNum(msg.raw_message, "'") >= 2) {
                    var symbol = "'";
                    var lastSymbol = "'";
                }
                else if (msg.raw_message.includes("“") && msg.raw_message.includes("”")) {
                    var symbol = "“";
                    var lastSymbol = "”";
                }
                else if (msg.raw_message.includes("‘") && msg.raw_message.includes("’")) {
                    var symbol = "‘";
                    var lastSymbol = "’";
                }
                let message = toCqcode(msg);
                let text1 = message.indexOf(symbol);
                let text2 = message.lastIndexOf(lastSymbol);
                let useMsg = fromCqcode(message.slice(text1 + 1, text2));
                msg.group.sendMsg(useMsg);
            }

            //at机器人时回应

            if (msg.atme) {
                if (msg.raw_message.includes("操你妈") || msg.raw_message.includes("草你妈")) {
                    msg.group.sendMsg("QAQ为什么骂人");
                }
                else if (msg.raw_message.includes("操你") || msg.raw_message.includes("草你")) {
                    msg.group.sendMsg(["啊~慢点", segment.face(66)]);
                }
                else if (msg.raw_message.includes("让我看看") || msg.raw_message.includes("让我康康")) {
                    let send = ["以下是已有的指令\n"];
                    let any;
                    send.push("\n可直接回应：\n");
                    any = botUse.reply;
                    for (let i = 0; i < any.length; i++) {
                        send.push("「", any[i], "」", "\n");
                    }
                    send.push("\n指令，带有参数：\n");
                    any = botUse.code;
                    for (let i = 0; i < any.length; i++) {
                        send.push("「", any[i], "」", "\n");
                    }
                    send.push("\n可回应：\n");
                    any = botUse.textReply;
                    for (let i = 0; i < any.length; i++) {
                        send.push("「", any[i], "」", "\n");
                    }
                    send.push("指令中括号内为描述，无需带上括号\n");
                    msg.group.sendMsg(send);
                }
                else {
                    msg.group.sendMsg(fromCqcode("[CQ:bface,type=bface,file=28319f9281772c62cc158ade881b291a35303865326636333064363732363633209209,text=嘿]"));
                }
            }

            if (
                msg.raw_message.includes("煮煮") ||
                msg.raw_message.includes("肖恩") ||
                msg.raw_message.includes("你营") ||
                msg.raw_message.includes("肖战") ||
                msg.raw_message.includes("aerfuckying") ||
                msg.raw_message.includes("尖营")
            ) {
                var xml = '<?xml version="1.0" encoding="utf-8"?>' +
                    '<msg brief="[聊天记录]" m_fileName="5C9D38F6-D862-4C75-97C5-1B902232D921" action="viewMultiMsg" tSum="2" flag="3" m_resid="wjF9oECGIs2NZE7H9077gCGeHDKpp2MTF0xV47APpQJs3LsKJCjGI31+hqVg9xgu" serviceID="35" m_fileSize="1323"  > <item layout="1">  <title color="#00ff00" size="26" > 煮煮:肖战是什么垃圾 </title> <title color="#00ff00" size="26" > 肖恩:#你营 #尖营 #垃圾煮 </title>  <hr></hr> <summary color="#808080" size="26" > 查看转发消息  </summary> </item><source name="聊天记录"></source> </msg>';
                msg.group.sendMsg(segment.xml(xml));
            }
        }

        //管理功能

        if (mute.includes(msg.group_id)) {
            if (msg.group.is_admin) {
                if (msg.raw_message.includes("禁言")) {
                    if (msg.member.user_id == 2241051890 || msg.member.is_admin || msg.member.is_owner) {
                        var qqId, time;
                        if (msg.raw_message.includes("解除禁言")) {
                            qqId = msg.raw_message === "解除禁言" ? lastMute : msg.raw_message.slice(msg.raw_message.indexOf("解除禁言") + 4, msg.raw_message.length);
                            time = 0;
                        }
                        else {
                            if (msg.raw_message.includes("*")) {
                                qqId = msg.raw_message.slice(msg.raw_message.indexOf("禁言") + 2, msg.raw_message.length);
                                let split = qqId.split("*");
                                qqId = split[0];
                                time = Number(split[1]);
                            } else {
                                qqId = msg.raw_message.slice(msg.raw_message.indexOf("禁言") + 2, msg.raw_message.length);
                                time = 10;
                            }
                        }
                        msg.group.muteMember(qqId, time * 60);
                        lastMute = qqId;
                    }
                    else {
                        msg.group.sendMsg([
                            segment.at(msg.member.user_id),
                            " 您没有此权限QAQ"
                        ]);
                    }
                }
            }

            //禁言
            muteMsg = fs.readFileSync("mute.json").toString();
            muteMsg = JSON.parse(muteMsg);
            if (muteMsg[String(msg.group_id)] === undefined) {
                muteMsg[String(msg.group_id)] = {};
            }
            if (muteMsg[String(msg.group_id)][String(msg.member.user_id)] === undefined) {
                //初始化
                muteMsg[String(msg.group_id)][String(msg.member.user_id)] = [toCqcode(msg), 1, new Date(), 0];
            }
            else if (muteMsg[String(msg.group_id)][String(msg.member.user_id)][0] == toCqcode(msg)) {
                //相同发言次数+1，更新发言时间
                muteMsg[String(msg.group_id)][String(msg.member.user_id)][1] += 1;
                muteMsg[String(msg.group_id)][String(msg.member.user_id)][2] = new Date();
                if (muteMsg[String(msg.group_id)][String(msg.member.user_id)][1] >= 5) {
                    //相同发言5次，禁言20分钟
                    msg.member.mute(20 * 60);
                    muteMsg[String(msg.group_id)][String(msg.member.user_id)][1] = 3;
                }
            }
            else if ((new Date()) - new Date(muteMsg[String(msg.group_id)][String(msg.member.user_id)][2]) < 1200) {
                //高频发言次数+1，更新发言时间
                muteMsg[String(msg.group_id)][String(msg.member.user_id)][2] = new Date();
                muteMsg[String(msg.group_id)][String(msg.member.user_id)][3] += 1;
            }
            else if (muteMsg[String(msg.group_id)][String(msg.member.user_id)][3] >= 8) {
                //高频发言8次，禁言20分钟
                msg.member.mute(20 * 60);
                muteMsg[String(msg.group_id)][String(msg.member.user_id)][2] = new Date();
                muteMsg[String(msg.group_id)][String(msg.member.user_id)][3] = 0;
            }
            else {
                //更新普通内容
                muteMsg[String(msg.group_id)][String(msg.member.user_id)] = [toCqcode(msg), 1, new Date(), 0];
            }
            fs.writeFileSync("mute.json", JSON.stringify(muteMsg, "", "\t"));
        }
    }
})

//私聊消息
bot.on("message.private", function (msg) {
    if (msg.raw_message.includes("pic ")) {
        var src = msg.raw_message.split(" ")[1];
        msg.friend.sendMsg([
            segment.image(src),
            "\n图片地址：" + src
        ]);
    }

    if (msg.raw_message.includes(" ")) {
        var split = msg.raw_message.split(" ");
        if (split[0] === "获取头像") {
            var qqId = split[1];
            var size = split[2];
            var send;
            if (qqId * 1 == qqId) {
                if (size === undefined) {
                    size = "0";
                    var src = `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${qqId}`;
                    send = segment.image(src);
                }
                else if (size * 1 == size && (size == "0" || size == "40" || size == "100" || size == "140")) {
                    var src = `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${qqId}`;
                    send = segment.image(src);
                }
                else {
                    send = "指令参数错误！\n请使用「获取头像 QQ号(number) 大小(0 | 40 | 100 | 140)」";
                }
            }
            else {
                send = "指令参数错误！\n请使用「获取头像 QQ号(number)」";
            }
            msg.friend.sendMsg(send);
        }
    }

    if (msg.raw_message === "戳一戳") {
        msg.friend.poke();
    }

    privateMsg = fs.readFileSync("private.json").toString();
    privateMsg = JSON.parse(privateMsg);
    if (privateMsg[String(msg.friend.user_id)] === undefined) {
        privateMsg[String(msg.friend.user_id)] = { "raw_message": [] };
    }
    privateMsg[String(msg.friend.user_id)].raw_message[privateMsg[String(msg.friend.user_id)].raw_message.length] = msg.raw_message;
    var privateRawMsg = privateMsg[String(msg.friend.user_id)].raw_message;
    if (msg.raw_message === "你好") {
        if (privateRawMsg.textNum("你好") > 1) {
            if (privateRawMsg.textNum("你好") > 5) {
                msg.friend.sendMsg("QAQ你干什么，是要累死我嘛");
            }
            else {
                msg.friend.sendMsg("QAQ你不是说过了嘛");
            }
        }
        else {
            msg.friend.sendMsg("你好呀qwq");
        }
    }
    fs.writeFileSync("private.json", JSON.stringify(privateMsg, "", "\t"));
    //私聊测试
    if (msg.from_id == "2241051890") {
        if (msg.raw_message === "test") {
            msg.friend.sendMsg("成功（");
        }

        if (msg.raw_message === "testjson") {
            var video = {
                "app": "com.tencent.wezone.share",
                "desc": "#你营 #尖营 #垃圾煮",
                "view": "shareView",
                "ver": "1.0.0.5",
                "prompt": "#你营 #尖营 #垃圾煮",
                "meta": {
                    "data": {
                        "feedInfo": {
                            "commentNum": 2927,
                            "content": "#你营 #尖营 #垃圾煮",
                            "coverHeight": 1280,
                            "coverUrl": "https:\/\/worldtj.photo.store.qq.com\/psc?\/world\/O0cFsaTfOlqjIAnYAvw8WjaR4E9C5cSJWtKE0eKcOCwjP4vmW0jmirMqTxPY6pRZeVCvNkQ187QCMUDDWiPDEldUV*mBmcBadkSCcGe2a4I!\/b&bo=0AIABdACAAURHyg!&ek=1&tl=1&tm=1653880403&vuin=1921313058&wm_text=QFBsdXRvcw!!&h5=1280&w5=720",
                            "coverWidth": 720,
                            "createTime": 1650872490,
                            "feedType": 3,
                            "fuelNum": 500000,
                            "height": 1280,
                            "id": "B_haa50666212190200cjwOdj4Re3oNcw0X5c",
                            "imageCount": 0,
                            "jumpUrl": "https:\/\/h5.qzone.qq.com\/v2\/wezone\/jump?_wv=3&schema=mqqapi%3A%2F%2Fqcircle%2Fopendetail%3Fcreatetime%3D1650872490%26feedid%3DB_haa50666212190200cjwOdj4Re3oNcw0X5c%26from%3D6%26getfeedlist%3D1%26is_feed_detail%3D1%26is_middle_page%3D1%26issinglefeed%3D1%26pageid%3D69%26sharecategory%3D2%26shareentrance%3D1%26shareuin%3D1921313058%26showhomebtn%3D1%26sourcetype%3D15%26timestamp%3D1653880403%26transdata%3D%25257B%252522feedid%252522%25253A%252522B_haa50666212190200cjwOdj4Re3oNcw0X5c%252522%25252C%252522uid%252522%25253A%2525221825158612%252522%25252C%252522ctime%252522%25253A1650872490%25252C%252522sharedid%252522%25253A%2525221921313058%252522%25252C%252522recomContentID%252522%25253A0%25257D%26uin%3D1825158612%26xsj_author_uin%3D1825158612%26xsj_custom_pgid%3Dpg_xsj_share_mid_page%26xsj_feed_id%3DB_haa50666212190200cjwOdj4Re3oNcw0X5c%26xsj_from_uin%3D1921313058%26xsj_main_entrance%3Dqq_aio%26xsj_sub_entrance%3Dfeed_details_and_rec%26secretid%3Dv2%26sign%3DYlFwpmMTEw9bP-Envoi_9g%3D%3D",
                            "likeNum": 200000,
                            "shareNum": 6764,
                            "width": 720
                        },
                        "shareUin": "1921313058",
                        "userInfo": {
                            "avatar": "",
                            "nickName": "肖恩",
                            "uin": "1"
                        }
                    }
                },
                "config": {
                    "autosize": 0,
                    "ctime": 1653880403,
                    "token": "913ca258ebf15ee03d5120f93a9a90a4"
                }
            }
            msg.friend.sendMsg(segment.json(video));
        }

        if (msg.raw_message === "testxml") {
            var xml = '<?xml version="1.0" encoding="utf-8"?>' +
                '<msg brief="[聊天记录]" m_fileName="5C9D38F6-D862-4C75-97C5-1B902232D921" action="viewMultiMsg" tSum="2" flag="3" m_resid="wjF9oECGIs2NZE7H9077gCGeHDKpp2MTF0xV47APpQJs3LsKJCjGI31+hqVg9xgu" serviceID="35" m_fileSize="1323"  > <item layout="1">  <title color="#00ff00" size="26" > 煮煮:肖战是什么垃圾 </title> <title color="#00ff00" size="26" > 肖恩:#你营 #尖营 #垃圾煮 </title>  <hr></hr> <summary color="#808080" size="26" > 查看转发消息  </summary> </item><source name="聊天记录"></source> </msg>';
            msg.friend.sendMsg(segment.xml(xml));
        }
    }
})