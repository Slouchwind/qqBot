"use strict"
const { createClient } = require("oicq");
const fs = require("fs");
var accountNum = fs.readFileSync("account.txt").toString();

const account = Number(accountNum.slice(0, accountNum.indexOf("/")));

const bot = createClient(account);

bot.on("system.login.qrcode", function (e) {
	this.logger.mark("扫码后按Enter完成登录")
	process.stdin.once("data", () => {
		this.login();
	})
}).login();

exports.bot = bot;

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:\n", promise, "\nreason:\n", reason);
});