"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/* eslint-disable no-await-in-loop */
var core_1 = require("@serverless-devs/core");
var cdnclient_service_1 = __importDefault(require("./cdnclient.service"));
var dnsclient_service_1 = __importDefault(require("./dnsclient.service"));
var common_1 = require("../common");
var lodash_1 = require("lodash");
/**
 * OSS Bucket域名
 * @param region
 * @param bucket
 * @returns
 */
var getCdnOssSources = function (region, bucket) {
    return {
        content: bucket + ".oss-" + region + ".aliyuncs.com",
        type: 'oss',
        port: 80,
    };
};
var setDomainAdvancedConfig = function (cdnClient, _a) {
    var domain = _a.domain, hostObj = _a.hostObj;
    return __awaiter(void 0, void 0, void 0, function () {
        var access, https, optimization, redirects, error_1, message, messageCode, referer, error_2, message, messageCode, ipFilter, error_3, message, messageCode, uaFilter, error_4, message, messageCode, error_5, message, messageCode, error_6, message, messageCode;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    access = hostObj.access, https = hostObj.https, optimization = hostObj.optimization, redirects = hostObj.redirects;
                    if (!https) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cdnclient_service_1.default.setDomainServerCertificate(cdnClient, { domain: domain, https: https })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    message = lodash_1.get(error_1, 'message', '');
                    messageCode = message.split(':')[0];
                    common_1.logger.error("https\u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u524D\u5F80\u63A7\u5236\u53F0\u9875\u9762 " + core_1.colors.cyan.underline("https://cdn.console.aliyun.com/domain/detail/" + domain + "/https") + " \u8FDB\u884C\u624B\u52A8\u64CD\u4F5C\uFF0C\u51FD\u6570\u540D\uFF1AsetDomainServerCertificate\uFF0C\u9519\u8BEF\u7801\uFF1A" + messageCode);
                    common_1.logger.debug(error_1);
                    return [3 /*break*/, 4];
                case 4:
                    referer = lodash_1.get(access, 'referer');
                    if (!referer) return [3 /*break*/, 8];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, cdnclient_service_1.default.setCdnDomainReferer(cdnClient, { domain: domain, referer: referer })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    message = lodash_1.get(error_2, 'message', '');
                    messageCode = message.split(':')[0];
                    common_1.logger.error("Referer\u9632\u76D7\u94FE\u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u524D\u5F80\u63A7\u5236\u53F0\u9875\u9762 " + core_1.colors.cyan.underline("https://cdn.console.aliyun.com/domain/detail/" + domain + "/access") + " tab " + core_1.colors.green('Referer防盗链') + " \u754C\u9762\u8FDB\u884C\u624B\u52A8\u64CD\u4F5C\uFF0C\u51FD\u6570\u540D\uFF1AsetCdnDomainReferer\uFF0C\u9519\u8BEF\u7801\uFF1A" + messageCode);
                    common_1.logger.debug(error_2);
                    return [3 /*break*/, 8];
                case 8:
                    ipFilter = lodash_1.get(access, 'ipFilter');
                    if (!ipFilter) return [3 /*break*/, 12];
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, cdnclient_service_1.default.setCdnDomainIpFilter(cdnClient, { domain: domain, ipFilter: ipFilter })];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    error_3 = _b.sent();
                    message = lodash_1.get(error_3, 'message', '');
                    messageCode = message.split(':')[0];
                    common_1.logger.error("IP\u9ED1/\u767D\u540D\u5355\u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u524D\u5F80\u63A7\u5236\u53F0\u9875\u9762 " + core_1.colors.cyan.underline("https://cdn.console.aliyun.com/domain/detail/" + domain + "/access") + " tab " + core_1.colors.green('IP黑/白名单') + " \u754C\u9762\u8FDB\u884C\u624B\u52A8\u64CD\u4F5C\uFF0C\u51FD\u6570\u540D\uFF1AsetCdnDomainIpFilter\uFF0C\u9519\u8BEF\u7801\uFF1A" + messageCode);
                    common_1.logger.debug(error_3);
                    return [3 /*break*/, 12];
                case 12:
                    uaFilter = lodash_1.get(access, 'uaFilter');
                    if (!uaFilter) return [3 /*break*/, 16];
                    _b.label = 13;
                case 13:
                    _b.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, cdnclient_service_1.default.setCdnDomainUaFilter(cdnClient, { domain: domain, uaFilter: uaFilter })];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 15:
                    error_4 = _b.sent();
                    message = lodash_1.get(error_4, 'message', '');
                    messageCode = message.split(':')[0];
                    common_1.logger.error("UA\u9ED1/\u767D\u540D\u5355\u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u524D\u5F80\u63A7\u5236\u53F0\u9875\u9762 " + core_1.colors.cyan.underline("https://cdn.console.aliyun.com/domain/detail/" + domain + "/access") + " tab " + core_1.colors.green('UA黑/白名单') + " \u754C\u9762\u8FDB\u884C\u624B\u52A8\u64CD\u4F5C\uFF0C\u51FD\u6570\u540D\uFF1AsetCdnDomainUaFilter\uFF0C\u9519\u8BEF\u7801\uFF1A" + messageCode);
                    common_1.logger.debug(error_4);
                    return [3 /*break*/, 16];
                case 16:
                    if (!optimization) return [3 /*break*/, 20];
                    _b.label = 17;
                case 17:
                    _b.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, cdnclient_service_1.default.setCdnDomainOptimization(cdnClient, { domain: domain, optimization: optimization })];
                case 18:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 19:
                    error_5 = _b.sent();
                    message = lodash_1.get(error_5, 'message', '');
                    messageCode = message.split(':')[0];
                    common_1.logger.error("\u6027\u80FD\u4F18\u5316\u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u524D\u5F80\u63A7\u5236\u53F0\u9875\u9762 " + core_1.colors.cyan.underline("https://cdn.console.aliyun.com/domain/detail/" + domain + "/perform") + " \u8FDB\u884C\u624B\u52A8\u64CD\u4F5C\uFF0C\u51FD\u6570\u540D\uFF1AsetCdnDomainOptimization\uFF0C\u9519\u8BEF\u7801\uFF1A" + messageCode);
                    common_1.logger.debug(error_5);
                    return [3 /*break*/, 20];
                case 20:
                    if (!redirects) return [3 /*break*/, 24];
                    _b.label = 21;
                case 21:
                    _b.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, cdnclient_service_1.default.setCdnDomainRedirects(cdnClient, { domain: domain, redirects: redirects })];
                case 22:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 23:
                    error_6 = _b.sent();
                    message = lodash_1.get(error_6, 'message', '');
                    messageCode = message.split(':')[0];
                    common_1.logger.error("\u91CD\u5B9A\u5411\u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u524D\u5F80\u63A7\u5236\u53F0\u9875\u9762 " + core_1.colors.cyan.underline("https://cdn.console.aliyun.com/domain/detail/" + domain + "/cache") + " tab " + core_1.colors.green('重写') + " \u754C\u9762\u8FDB\u884C\u624B\u52A8\u64CD\u4F5C\uFF0C\u51FD\u6570\u540D\uFF1AsetCdnDomainRedirects\uFF0C\u9519\u8BEF\u7801\uFF1A" + messageCode);
                    common_1.logger.debug(error_6);
                    return [3 /*break*/, 24];
                case 24: return [2 /*return*/];
            }
        });
    });
};
var setCdnDomainStagingConfig = function (cdnClient, _a) {
    var domain = _a.domain, fcDomain = _a.fcDomain;
    return __awaiter(void 0, void 0, void 0, function () {
        var spin, i, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cdnclient_service_1.default.setEsStagingConfig(cdnClient, {
                        domain: domain,
                        rule: "if match_re($uri, '^/api') {\n rewrite(concat('http://" + fcDomain + "', substr($uri, 5, len($uri))), 'redirect')\n}",
                    })];
                case 1:
                    _b.sent();
                    spin = core_1.spinner('configuring edge script...');
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < 5)) return [3 /*break*/, 9];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 6, , 8]);
                    return [4 /*yield*/, common_1.sleep(5000)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, cdnclient_service_1.default.publishEsStagingConfigToProduction(cdnClient, domain)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 6:
                    e_1 = _b.sent();
                    return [4 /*yield*/, common_1.sleep(2000)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9:
                    spin.succeed('edge script configured successfully');
                    return [2 /*return*/];
            }
        });
    });
};
// 生成系统域名
var generateSystemDomain = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, hostObj, inputs, props, domainConponent, cdnClient, useJamstack, sysDomain, i, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                credentials = params.credentials, hostObj = params.hostObj, inputs = params.inputs;
                props = inputs.props;
                return [4 /*yield*/, core_1.loadComponent('devsapp/domain')];
            case 1:
                domainConponent = _a.sent();
                cdnClient = cdnclient_service_1.default.createClient(credentials);
                useJamstack = Boolean(props.customDomain);
                if (useJamstack) {
                    inputs.props = __assign(__assign({}, props), { type: 'jamstack-oss' });
                }
                else {
                    inputs.props = __assign(__assign({}, props), { type: 'oss' });
                }
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < 5)) return [3 /*break*/, 8];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 7]);
                return [4 /*yield*/, domainConponent[useJamstack ? 'jamstack' : 'get'](inputs)];
            case 4:
                sysDomain = _a.sent();
                return [3 /*break*/, 8];
            case 5:
                e_2 = _a.sent();
                console.log('sysDomain---error', e_2);
                return [4 /*yield*/, common_1.sleep(5000)];
            case 6:
                _a.sent();
                return [3 /*break*/, 7];
            case 7:
                i++;
                return [3 /*break*/, 2];
            case 8:
                if (lodash_1.isEmpty(sysDomain)) {
                    return [2 /*return*/, common_1.logger.warn('域名申请失败，请稍后重试。')];
                }
                common_1.logger.debug("Test Domain: " + sysDomain);
                return [4 /*yield*/, setDomainAdvancedConfig(cdnClient, { domain: sysDomain, hostObj: hostObj })];
            case 9:
                _a.sent();
                if (!useJamstack) return [3 /*break*/, 11];
                return [4 /*yield*/, setCdnDomainStagingConfig(cdnClient, { domain: sysDomain, fcDomain: props.customDomain })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                common_1.logger.log("\ndomainName: " + core_1.colors.cyan.underline("http://" + sysDomain));
                return [2 /*return*/, sysDomain];
        }
    });
}); };
// 绑定到自定义域名
var generateDomain = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, hostObj, sources, domain, cdnClient, dnsClient, _a, topDomain, rrDomainName, domainDetailMode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                credentials = params.credentials, hostObj = params.hostObj, sources = params.sources;
                domain = hostObj.host;
                cdnClient = cdnclient_service_1.default.createClient(credentials);
                dnsClient = dnsclient_service_1.default.createClient(credentials);
                _a = common_1.parseDomain(domain), topDomain = _a.topDomain, rrDomainName = _a.rrDomainName;
                return [4 /*yield*/, cdnclient_service_1.default.describeCdnDomainDetail(cdnClient, domain)];
            case 1:
                domainDetailMode = _b.sent();
                common_1.logger.debug("\u67E5\u8BE2\u7ED1\u5B9A\u7684\u57DF\u540D\u4FE1\u606F:" + JSON.stringify(domainDetailMode, null, 2));
                if (!!domainDetailMode) return [3 /*break*/, 6];
                common_1.logger.debug("\u9996\u6B21\u7ED1\u5B9A\u81EA\u5B9A\u4E49\u57DF\u540D:" + domain);
                // 第一次添加会出强制校验
                return [4 /*yield*/, cdnclient_service_1.default.verifyDomainOwner(cdnClient, { domain: domain })];
            case 2:
                // 第一次添加会出强制校验
                _b.sent();
                return [4 /*yield*/, cdnclient_service_1.default.addCDNDomain(cdnClient, {
                        domain: domain,
                        sources: sources,
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, common_1.waitUntil(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, cdnclient_service_1.default.describeCdnDomainDetail(cdnClient, domain)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }, function (result) { return lodash_1.get(result, 'cname'); }, {
                        timeInterval: 3000,
                        timeoutMsg: 'DNS 首次配置生效时间等待超时',
                    })];
            case 4:
                domainDetailMode = _b.sent();
                common_1.logger.debug("\u9996\u6B21\u7ED1\u5B9A\u7684\u57DF\u540D\u4FE1\u606F:" + JSON.stringify(domainDetailMode, null, 2));
                return [4 /*yield*/, dnsclient_service_1.default.addDomainRecord(dnsClient, {
                        domainName: topDomain,
                        RR: rrDomainName,
                        type: 'CNAME',
                        value: domainDetailMode.cname,
                    })];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                common_1.logger.debug("\u7ED1\u5B9A\u81EA\u5B9A\u4E49\u57DF\u540D:" + domain);
                cdnclient_service_1.default.modifyCdnDomain(cdnClient, { domain: domain, sources: sources });
                _b.label = 7;
            case 7: return [4 /*yield*/, setDomainAdvancedConfig(cdnClient, { domain: domain, hostObj: hostObj })];
            case 8:
                _b.sent();
                common_1.logger.log("\ndomainName: " + core_1.colors.cyan.underline("http://" + domain));
                return [2 /*return*/, domain];
        }
    });
}); };
exports.default = (function (orinalInputs) { return __awaiter(void 0, void 0, void 0, function () {
    var inputs, props, sources, credentials, hosts, domains;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                inputs = lodash_1.cloneDeep(orinalInputs);
                props = inputs.props;
                sources = getCdnOssSources(lodash_1.get(props, 'region'), lodash_1.get(props, 'bucket'));
                credentials = {
                    accessKeyId: lodash_1.get(inputs, 'Credentials.AccessKeyID'),
                    accessKeySecret: lodash_1.get(inputs, 'Credentials.AccessKeySecret'),
                };
                hosts = props.hosts;
                domains = [];
                if (!((hosts === null || hosts === void 0 ? void 0 : hosts.length) > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.all(hosts.map(function (hostObj) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    if (!(hostObj.host === 'auto')) return [3 /*break*/, 2];
                                    _b = (_a = domains).push;
                                    return [4 /*yield*/, generateSystemDomain({ credentials: credentials, hostObj: hostObj, inputs: inputs, sources: sources })];
                                case 1:
                                    _b.apply(_a, [_e.sent()]);
                                    return [3 /*break*/, 4];
                                case 2:
                                    _d = (_c = domains).push;
                                    return [4 /*yield*/, generateDomain({ credentials: credentials, hostObj: hostObj, sources: sources })];
                                case 3:
                                    _d.apply(_c, [_e.sent()]);
                                    _e.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                common_1.logger.log('如果需要系统帮你生成一个域名，可配置host为 auto ', 'yellow');
                _a.label = 3;
            case 3: return [2 /*return*/, domains];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZG9tYWluLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBdUU7QUFDdkUsMEVBQTZDO0FBQzdDLDBFQUE2QztBQUM3QyxvQ0FBNkY7QUFDN0YsaUNBQWlEO0FBRWpEOzs7OztHQUtHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxVQUFDLE1BQWMsRUFBRSxNQUFjO0lBQ3RELE9BQU87UUFDTCxPQUFPLEVBQUssTUFBTSxhQUFRLE1BQU0sa0JBQWU7UUFDL0MsSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsRUFBRTtLQUNULENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixJQUFNLHVCQUF1QixHQUFHLFVBQU8sU0FBUyxFQUFFLEVBQW1CO1FBQWpCLE1BQU0sWUFBQSxFQUFFLE9BQU8sYUFBQTs7Ozs7O29CQUN6RCxNQUFNLEdBQXFDLE9BQU8sT0FBNUMsRUFBRSxLQUFLLEdBQThCLE9BQU8sTUFBckMsRUFBRSxZQUFZLEdBQWdCLE9BQU8sYUFBdkIsRUFBRSxTQUFTLEdBQUssT0FBTyxVQUFaLENBQWE7eUJBRXZELEtBQUssRUFBTCx3QkFBSzs7OztvQkFFTCxxQkFBTSwyQkFBVSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsRUFBQTs7b0JBQXpFLFNBQXlFLENBQUM7Ozs7b0JBRXBFLE9BQU8sR0FBRyxZQUFHLENBQUMsT0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDcEMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLGVBQU0s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