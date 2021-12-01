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
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntil = exports.parseRedirects = exports.parseOptimization = exports.parseCertInfo = exports.parseUaFilter = exports.parseIpFilter = exports.parseReferer = exports.sleep = exports.parseDomain = void 0;
var interface_1 = require("./interface");
var lodash_1 = require("lodash");
var chillout_1 = __importDefault(require("chillout"));
var logger_1 = __importDefault(require("./logger"));
var core_1 = require("@serverless-devs/core");
exports.parseDomain = function (domain) {
    var arr = domain.split('.');
    return {
        topDomain: arr.slice(arr.length - 2).join('.'),
        rrDomainName: arr.slice(0, arr.length - 2).join('.'),
    };
};
function sleep(msec) {
    return new Promise(function (resolve) { return setTimeout(resolve, msec); });
}
exports.sleep = sleep;
function parseReferer(params) {
    var type = params.type, allowEmpty = params.allowEmpty, rules = params.rules;
    if (type === 'whitelist') {
        return {
            functionName: interface_1.RefererEnum.whitelist,
            functionArgs: [
                {
                    argName: 'allow_empty',
                    argValue: allowEmpty ? 'on' : 'off',
                },
                {
                    argName: 'refer_domain_allow_list',
                    argValue: rules.join(','),
                },
            ],
        };
    }
    else {
        return {
            functionName: interface_1.RefererEnum.blacklist,
            functionArgs: [
                {
                    argName: 'allow_empty',
                    argValue: allowEmpty ? 'on' : 'off',
                },
                {
                    argName: 'refer_domain_deny_list',
                    argValue: rules.join(','),
                },
            ],
        };
    }
}
exports.parseReferer = parseReferer;
function parseIpFilter(params) {
    var type = params.type, rules = params.rules;
    if (type === 'whitelist') {
        return {
            functionName: interface_1.IpFilterEnum.whitelist,
            functionArgs: [
                {
                    argName: 'ip_list',
                    argValue: rules.join(','),
                },
            ],
        };
    }
    else {
        return {
            functionName: interface_1.IpFilterEnum.blacklist,
            functionArgs: [
                {
                    argName: 'ip_list',
                    argValue: rules.join(','),
                },
            ],
        };
    }
}
exports.parseIpFilter = parseIpFilter;
function parseUaFilter(params) {
    var type = params.type, rules = params.rules;
    if (type === 'whitelist') {
        return {
            functionName: 'ali_ua',
            functionArgs: [
                {
                    argName: 'ua',
                    argValue: rules.join('|'),
                },
                { argName: 'type', argValue: 'white' },
            ],
        };
    }
    else {
        return {
            functionName: 'ali_ua',
            functionArgs: [
                {
                    argName: 'ua',
                    argValue: rules.join('|'),
                },
                { argName: 'type', argValue: 'black' },
            ],
        };
    }
}
exports.parseUaFilter = parseUaFilter;
function parseCertInfo(params) {
    if (params.certType === 'free') {
        return {
            certType: params.certType,
            serverCertificateStatus: lodash_1.get(params, 'switch', 'on'),
        };
    }
    if (params.certType === 'upload') {
        return {
            certType: params.certType,
            serverCertificateStatus: lodash_1.get(params, 'switch', 'on'),
            certName: params.certName,
            serverCertificate: params.serverCertificate,
            privateKey: params.privateKey,
        };
    }
    if (params.certType === 'csr') {
        return {
            certType: params.certType,
            serverCertificateStatus: lodash_1.get(params, 'switch', 'on'),
            serverCertificate: params.serverCertificate,
        };
    }
}
exports.parseCertInfo = parseCertInfo;
function parseOptimization(params) {
    return [
        {
            functionName: 'tesla',
            functionArgs: [
                { argName: 'enable', argValue: lodash_1.get(params, 'trim.html', 'off') },
                { argName: 'trim_css', argValue: lodash_1.get(params, 'trim.css', 'off') },
                { argName: 'trim_js', argValue: lodash_1.get(params, 'trim.javascript', 'off') },
            ],
        },
        {
            functionName: 'gzip',
            functionArgs: [{ argName: 'enable', argValue: lodash_1.get(params, 'gzip', 'off') }],
        },
        {
            functionName: 'brotli',
            functionArgs: [
                { argName: 'enable', argValue: lodash_1.get(params, 'brotli', 'off') },
                { argName: 'brotli_level', argValue: '1' },
            ],
        },
    ];
}
exports.parseOptimization = parseOptimization;
function parseRedirects(params) {
    var option = params.filter(function (item) { return lodash_1.get(item, 'switch', 'on') === 'on'; });
    return option.map(function (item) { return ({
        functionName: 'host_redirect',
        functionArgs: [
            {
                argName: 'regex',
                argValue: item.source,
            },
            {
                argName: 'replacement',
                argValue: item.destination,
            },
            {
                argName: 'flag',
                argValue: 'redirect',
            },
        ],
    }); });
}
exports.parseRedirects = parseRedirects;
// TODO: 专门针对publish.yaml来处理default字段。不需要每次都都手动处理
exports.waitUntil = function (asyncService, stopCondition, _a) {
    var _b = _a.timeout, timeout = _b === void 0 ? 10 * 60 * 1000 : _b, //10分超时时间
    _c = _a.timeInterval, //10分超时时间
    timeInterval = _c === void 0 ? 1000 : _c, timeoutMsg = _a.timeoutMsg, hint = _a.hint;
    return __awaiter(void 0, void 0, void 0, function () {
        var spin, startTime, result;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    spin = hint && core_1.spinner(hint.loading);
                    startTime = new Date().getTime();
                    return [4 /*yield*/, chillout_1.default.waitUntil(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (new Date().getTime() - startTime > timeout) {
                                            logger_1.default.debug(timeoutMsg);
                                            spin === null || spin === void 0 ? void 0 : spin.fail(hint.fail);
                                            return [2 /*return*/, chillout_1.default.StopIteration];
                                        }
                                        return [4 /*yield*/, sleep(timeInterval)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, asyncService()];
                                    case 2:
                                        result = _a.sent();
                                        if (stopCondition(result)) {
                                            spin === null || spin === void 0 ? void 0 : spin.succeed(hint.success);
                                            return [2 /*return*/, chillout_1.default.StopIteration];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _d.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbW9uL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQVNxQjtBQUNyQixpQ0FBNkI7QUFDN0Isc0RBQWdDO0FBQ2hDLG9EQUE4QjtBQUM5Qiw4Q0FBZ0Q7QUFFbkMsUUFBQSxXQUFXLEdBQUcsVUFBQyxNQUFjO0lBQ3hDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsT0FBTztRQUNMLFNBQVMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM5QyxZQUFZLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ3JELENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixTQUFnQixLQUFLLENBQUMsSUFBSTtJQUN4QixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxJQUFLLE9BQUEsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFGRCxzQkFFQztBQUVELFNBQWdCLFlBQVksQ0FBQyxNQUFnQjtJQUNuQyxJQUFBLElBQUksR0FBd0IsTUFBTSxLQUE5QixFQUFFLFVBQVUsR0FBWSxNQUFNLFdBQWxCLEVBQUUsS0FBSyxHQUFLLE1BQU0sTUFBWCxDQUFZO0lBQzNDLElBQUksSUFBSSxLQUFLLFdBQVcsRUFBRTtRQUN4QixPQUFPO1lBQ0wsWUFBWSxFQUFFLHVCQUFXLENBQUMsU0FBUztZQUNuQyxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsT0FBTyxF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