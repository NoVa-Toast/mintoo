"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("dotenv").config();
var telegraf_1 = require("telegraf");
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var axios_1 = __importDefault(require("axios"));
var ethers_1 = require("ethers");
var TOKEN = process.env.TOKEN;
var SERVER_URL = process.env.SERVER_URL;
var PORT = process.env.PORT || 3000;
var TELEGRAM_API = "https://api.telegram.org/bot".concat(TOKEN);
var URI = "/webhook/".concat(TOKEN);
var WEBHOOK_URL = SERVER_URL + URI;
var chatId;
var bot = new telegraf_1.Telegraf(process.env.TOKEN);
var app = (0, express_1["default"])();
app.use(body_parser_1["default"].urlencoded({ extended: false }));
app.use(body_parser_1["default"].json());
// Set the bot API endpoint
app.use(bot.webhookCallback(WEBHOOK_URL));
bot.telegram.setWebhook(WEBHOOK_URL);
app.listen(process.env.PORT || 5000, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("🚀 app running on port", process.env.PORT || 5000);
        return [2 /*return*/];
    });
}); });
var groups = [];
var address = "0x7b423bb11d596b408d873a96ee583b83af7b99cc";
var abi = [
    {
        inputs: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "string", name: "baseTokenURI", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "approved",
                type: "address"
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
            },
        ],
        name: "Approval",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address"
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool"
            },
        ],
        name: "ApprovalForAll",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address"
            },
        ],
        name: "OwnershipTransferred",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
            },
        ],
        name: "Transfer",
        type: "event"
    }
];
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider, contract, options, sendMessage, topic, filter;
    return __generator(this, function (_a) {
        provider = new ethers_1.ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org");
        contract = new ethers_1.ethers.Contract(address, abi, provider);
        options = {
            filter: {
                value: []
            }
        };
        sendMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
            var _i, groups_1, group, remainingNFTS;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(groups.length > 0)) return [3 /*break*/, 5];
                        _i = 0, groups_1 = groups;
                        _a.label = 1;
                    case 1:
                        if (!(_i < groups_1.length)) return [3 /*break*/, 5];
                        group = groups_1[_i];
                        return [4 /*yield*/, contract.lastSupply()];
                    case 2:
                        remainingNFTS = _a.sent();
                        return [4 /*yield*/, axios_1["default"].post("".concat(TELEGRAM_API, "/sendMessage"), {
                                chat_id: group,
                                text: message + "\n*Remaining NFT's:* ".concat(remainingNFTS, "/2222"),
                                parse_mode: "Markdown"
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        topic = ethers_1.ethers.utils.id("Transfer(address,address,uint256)");
        filter = {
            address: address,
            topics: [topic]
        };
        provider.on(filter, function (result) {
            console.log(result);
            bot.telegram.sendMessage("-1691652792", "<b></b> mint!  #".concat(Number(result.topics[3]), " \n\n <a href=\"https://ipfs.io/ipfs//").concat(Number(result.topics[3]), ".png\">&#8205;</a>"), { parse_mode: 'HTML' });
        });
        console.log("ping");
        return [2 /*return*/];
    });
}); };
init();
app.post(URI, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, newGroup, _i, groups_2, group, err_1, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newGroup = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                chatId = req.body.message.chat.id;
                text = req.body.message.text;
                if (!(text == '/bot')) return [3 /*break*/, 9];
                if (!(groups.length <= 2)) return [3 /*break*/, 8];
                console.log(chatId);
                if (!(groups.length === 0)) return [3 /*break*/, 3];
                groups[0] = chatId;
                console.log(groups);
                return [4 /*yield*/, axios_1["default"].post("".concat(TELEGRAM_API, "/sendMessage"), {
                        chat_id: chatId,
                        text: "* Bot Activated with chat id:* ".concat(chatId),
                        parse_mode: 'Markdown'
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 7];
            case 3:
                for (_i = 0, groups_2 = groups; _i < groups_2.length; _i++) {
                    group = groups_2[_i];
                    if (group === chatId) {
                        console.log('Already activated');
                        console.log(groups);
                        newGroup = false;
                    }
                }
                if (!newGroup) return [3 /*break*/, 7];
                groups[groups.length] = chatId;
                console.log(groups);
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, axios_1["default"].post("".concat(TELEGRAM_API, "/sendMessage"), {
                        chat_id: chatId,
                        text: "* Bot Activated with chat id:* ".concat(chatId),
                        parse_mode: 'Markdown'
                    })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                console.log('Too many groups');
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/, res.send()];
        }
    });
}); });
