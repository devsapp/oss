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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
var cdn20180510_1 = __importStar(require("@alicloud/cdn20180510")), $Cdn20180510 = cdn20180510_1;
var $OpenApi = __importStar(require("@alicloud/openapi-client"));
var common_1 = require("../common");
var lodash_1 = require("lodash");
var Client = /** @class */ (function () {
    function Client() {
    }
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    Client.createClient = function (credentials) {
        var accessKeyId = credentials.accessKeyId, accessKeySecret = credentials.accessKeySecret;
        var config = new $OpenApi.Config({
            // 您的AccessKey ID
            accessKeyId: accessKeyId,
            // 您的AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // 访问的域名
        config.endpoint = 'cdn.aliyuncs.com';
        return new cdn20180510_1.default(config);
    };
    /**
     * 设置edge script灰度配置
     * @param accessKeyId
     * @param accessKeySecret
     */
    Client.setEsStagingConfig = function (client, _a) {
        var domain = _a.domain, rule = _a.rule;
        return __awaiter(this, void 0, void 0, function () {
            var setCdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setCdnDomainStagingConfigRequest = new $Cdn20180510.SetCdnDomainStagingConfigRequest({
                            domainName: domain,
                            functions: JSON.stringify([
                                {
                                    functionArgs: [
                                        { argName: 'name', argValue: 'jamstack' },
                                        { argName: 'rule', argValue: rule },
                                        { argName: 'enable', argValue: 'on' },
                                        { argName: 'pri', argValue: '0' },
                                        { argName: 'pos', argValue: 'head' },
                                        { argName: 'enable', argValue: 'on' },
                                        { argName: 'brk', argValue: 'off' },
                                        { argName: 'option', argValue: '' },
                                    ],
                                    functionName: 'edge_function',
                                },
                            ]),
                        });
                        // 复制代码运行请自行打印 API 的返回值
                        return [4 /*yield*/, client.setCdnDomainStagingConfig(setCdnDomainStagingConfigRequest)];
                    case 1:
                        // 复制代码运行请自行打印 API 的返回值
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 获取灰度环境配置信息
     * @param credentials
     */
    Client.describeCdnDomainStagingConfig = function (client, domain) {
        return __awaiter(this, void 0, void 0, function () {
            var describeCdnDomainStagingConfigRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeCdnDomainStagingConfigRequest = new $Cdn20180510.DescribeCdnDomainStagingConfigRequest({
                            domainName: domain,
                            functionNames: 'edge_function',
                        });
                        return [4 /*yield*/, client.describeCdnDomainStagingConfig(describeCdnDomainStagingConfigRequest)];
                    case 1: 
                    // 复制代码运行请自行打印 API 的返回值
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 将edge script灰度配置发布到线上环境
     * @param credentials
     */
    Client.publishEsStagingConfigToProduction = function (client, domain) {
        return __awaiter(this, void 0, void 0, function () {
            var publishStagingConfigToProductionRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        publishStagingConfigToProductionRequest = new $Cdn20180510.PublishStagingConfigToProductionRequest({
                            domainName: domain,
                            functionName: 'edge_function',
                        });
                        // 复制代码运行请自行打印 API 的返回值
                        return [4 /*yield*/, client.publishStagingConfigToProduction(publishStagingConfigToProductionRequest)];
                    case 1:
                        // 复制代码运行请自行打印 API 的返回值
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 获取CDN域名的详细信息
     * @param credentials
     */
    Client.describeCdnDomainDetail = function (client, domain) {
        return __awaiter(this, void 0, void 0, function () {
            var describeCdnDomainDetailRequest, result, domainDetailMode, error_1, message, messageCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeCdnDomainDetailRequest = new $Cdn20180510.DescribeCdnDomainDetailRequest({
                            domainName: domain,
                        });
                        common_1.logger.debug("describeCdnDomainDetailRequest:" + JSON.stringify(describeCdnDomainDetailRequest, null, 2));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.describeCdnDomainDetail(describeCdnDomainDetailRequest)];
                    case 2:
                        result = _a.sent();
                        common_1.logger.debug("describeCdnDomainDetail result:" + JSON.stringify(result, null, 2));
                        common_1.logger.debug("describeCdnDomainDetail result.body:" + JSON.stringify(lodash_1.get(result, 'body'), null, 2));
                        common_1.logger.debug("describeCdnDomainDetail result.body.getDomainDetailModel:" + JSON.stringify(lodash_1.get(result, 'body.getDomainDetailModel'), null, 2));
                        domainDetailMode = lodash_1.get(result, 'body.getDomainDetailModel');
                        return [2 /*return*/, domainDetailMode];
                    case 3:
                        error_1 = _a.sent();
                        common_1.logger.debug("describeCdnDomainDetail error:" + JSON.stringify(error_1, null, 2));
                        message = lodash_1.get(error_1, 'message', '');
                        messageCode = message.split(':')[0];
                        if (messageCode === 'CdnServiceNotFound') {
                            throw new Error('您的帐户尚未开通CDN服务，请前往 https://common-buy.aliyun.com/?commodityCode=cdn#/open 页面进行开通');
                        }
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 域名归属校验
     * @param client
     * @param param1
     */
    Client.verifyDomainOwner = function (client, _a) {
        var domain = _a.domain, _b = _a.verifyType, verifyType = _b === void 0 ? 'bothCheck' : _b;
        return __awaiter(this, void 0, void 0, function () {
            var verifyDomainOwnerRequest, result, error_2, describeVerifyContentRequest, result, verifyContent;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        verifyDomainOwnerRequest = new $Cdn20180510.VerifyDomainOwnerRequest({
                            domainName: domain,
                            verifyType: verifyType,
                        });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, client.verifyDomainOwner(verifyDomainOwnerRequest)];
                    case 2:
                        result = _c.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _c.sent();
                        describeVerifyContentRequest = new $Cdn20180510.DescribeVerifyContentRequest({
                            domainName: domain,
                        });
                        return [4 /*yield*/, client.describeVerifyContent(describeVerifyContentRequest)];
                    case 4:
                        result = _c.sent();
                        verifyContent = lodash_1.get(result, 'body.content');
                        throw new Error("2020\u5E746\u670812\u65E5\u8D77\uFF0C\u5F53\u60A8\u9996\u6B21\u5C06\u65B0\u57DF\u540D\u6DFB\u52A0\u81F3\u963F\u91CC\u4E91CDN\u65F6\uFF0C\u9700\u6309\u8981\u6C42\u505A\u57DF\u540D\u5F52\u5C5E\u6743\u9A8C\u8BC1\uFF0C\u5F53\u60A8\u6309\u8981\u6C42\u914D\u7F6EDNS\u89E3\u6790\u6216\u6587\u4EF6\u9A8C\u8BC1\u540E\uFF0C\u624D\u80FD\u6B63\u5E38\u8C03\u7528AddCdnDomain\u63A5\u53E3\u6DFB\u52A0\u57DF\u540D\u3002 \u57DF\u540D\u5F52\u5C5E\u6743\u9A8C\u8BC1\u8BF7\u53C2\u89C1https://help.aliyun.com/document_detail/169377.html\n        \u8BF7\u524D\u5F80\u57DF\u540DDNS\u670D\u52A1\u5546\u914D\u7F6E\u8BE5TXT\u8BB0\u5F55\uFF1A\u8BB0\u5F55\u7C7B\u578B:TXT\uFF0C\u4E3B\u673A\u8BB0\u5F55:verification\uFF0C\u8BB0\u5F55\u503C:" + verifyContent + "\n        ");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 删除域名
     * @param client
     * @param domain
     */
    Client.deleteCdnDomain = function (client, domain, isThrowError) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteCdnDomainRequest, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteCdnDomainRequest = new $Cdn20180510.DeleteCdnDomainRequest({
                            domainName: domain,
                        });
                        if (!isThrowError) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.deleteCdnDomain(deleteCdnDomainRequest)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, client.deleteCdnDomain(deleteCdnDomainRequest)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 添加CDN域名
     * @param client
     * @param param1
     */
    Client.addCDNDomain = function (client, _a) {
        var domain = _a.domain, sources = _a.sources;
        return __awaiter(this, void 0, void 0, function () {
            var addCdnDomainRequest, error_4, message, messageCode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addCdnDomainRequest = new $Cdn20180510.AddCdnDomainRequest({
                            scope: 'global',
                            cdnType: 'web',
                            domainName: domain,
                            sources: JSON.stringify([].concat(sources)),
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.addCdnDomain(addCdnDomainRequest)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        message = lodash_1.get(error_4, 'message', '');
                        messageCode = message.split(':')[0];
                        throw new Error(common_1.CDN_ERRORS[messageCode] || message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 修改添加CDN域名
     * @param client
     * @param param1
     */
    Client.modifyCdnDomain = function (client, _a) {
        var domain = _a.domain, sources = _a.sources;
        return __awaiter(this, void 0, void 0, function () {
            var addCdnDomainRequest, error_5, message, messageCode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addCdnDomainRequest = new $Cdn20180510.ModifyCdnDomainRequest({
                            domainName: domain,
                            sources: JSON.stringify([].concat(sources)),
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.modifyCdnDomain(addCdnDomainRequest)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _b.sent();
                        message = lodash_1.get(error_5, 'message', '');
                        messageCode = message.split(':')[0];
                        throw new Error(common_1.CDN_ERRORS[messageCode] || message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 增加HTTP证书
     * @param client
     * @param param1
     */
    Client.setDomainServerCertificate = function (client, _a) {
        var domain = _a.domain, https = _a.https;
        return __awaiter(this, void 0, void 0, function () {
            var domainServerCertificateRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!common_1.parseCertInfo(lodash_1.get(https, 'certInfo'))) return [3 /*break*/, 2];
                        domainServerCertificateRequest = new $Cdn20180510.SetDomainServerCertificateRequest(__assign({ domainName: domain }, common_1.parseCertInfo(lodash_1.get(https, 'certInfo'))));
                        return [4 /*yield*/, client.setDomainServerCertificate(domainServerCertificateRequest)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, Client.setCdnDomainForceHttps(client, {
                            domain: domain,
                            forceHttps: lodash_1.get(https, 'protocol', 'default'),
                        })];
                    case 3:
                        _b.sent();
                        if (lodash_1.get(https, 'certInfo.switch') === 'off' && https.http2 === 'on') {
                            common_1.logger.log('HTTP/2是最新的HTTP协议，开启前您需要先配置HTTPS证书', 'red');
                        }
                        if (!(lodash_1.get(https, 'certInfo.switch') === 'on')) return [3 /*break*/, 5];
                        return [4 /*yield*/, Client.setCdnDomainHttp2(client, { domain: domain, http2: lodash_1.get(https, 'http2', 'off') })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Client.setCdnDomainHttp2 = function (client, _a) {
        var domain = _a.domain, http2 = _a.http2;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify([
                                {
                                    functionArgs: [{ argName: 'http2', argValue: http2 }],
                                    functionName: 'https_option',
                                },
                            ]),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 删除加速域名的配置
     * @param client
     * @param param1
     */
    Client.DeleteSpecificConfig = function (client, _a) {
        var domain = _a.domain, configId = _a.configId;
        return __awaiter(this, void 0, void 0, function () {
            var option;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        option = new $Cdn20180510.DeleteSpecificConfigRequest({
                            domainName: domain,
                            configId: configId,
                        });
                        return [4 /*yield*/, client.deleteSpecificConfig(option)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 获取加速域名的配置信息。
     * @param client
     * @param param1
     */
    Client.DescribeCdnDomainConfigs = function (client, _a) {
        var domain = _a.domain, functionNames = _a.functionNames;
        return __awaiter(this, void 0, void 0, function () {
            var option, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        option = new $Cdn20180510.DescribeCdnDomainConfigsRequest({
                            domainName: domain,
                            functionNames: functionNames,
                        });
                        return [4 /*yield*/, client.describeCdnDomainConfigs(option)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, lodash_1.get(result, 'body.domainConfigs.domainConfig')];
                }
            });
        });
    };
    /**
     * @description 获取用户的加速域名信息
     * @param client
     * @param param1
     */
    Client.DescribeUserDomains = function (client, _a) {
        var domain = _a.domain, checkDomainShow = _a.checkDomainShow;
        return __awaiter(this, void 0, void 0, function () {
            var option, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        option = new $Cdn20180510.DescribeUserDomainsRequest({
                            domainName: domain,
                            checkDomainShow: checkDomainShow,
                        });
                        return [4 /*yield*/, client.describeUserDomains(option)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, lodash_1.get(result, 'body.domains.pageData[0]')];
                }
            });
        });
    };
    /**
     * @description 强制HTTPS跳转
     * @param client
     * @param param1
     */
    Client.setCdnDomainForceHttps = function (client, _a) {
        var domain = _a.domain, forceHttps = _a.forceHttps;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainConfigs, forceHttpsOptioned, cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Client.DescribeCdnDomainConfigs(client, {
                            domain: domain,
                            functionNames: common_1.ForceHttpsEnum.http + "," + common_1.ForceHttpsEnum.https,
                        })];
                    case 1:
                        cdnDomainConfigs = _b.sent();
                        forceHttpsOptioned = cdnDomainConfigs.find(function (item) {
                            return item.functionName === common_1.ForceHttpsEnum.http || item.functionName === common_1.ForceHttpsEnum.https;
                        });
                        if (!forceHttpsOptioned) return [3 /*break*/, 3];
                        // 当前状态和设置的值相同，直接返回
                        if (forceHttpsOptioned.functionName === common_1.ForceHttpsEnum[forceHttps])
                            return [2 /*return*/];
                        // 不相同，则需要先删除当前状态
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, { domain: domain, configId: forceHttpsOptioned.configId })];
                    case 2:
                        // 不相同，则需要先删除当前状态
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        // 默认default，不需要设置
                        if (forceHttps === 'default')
                            return [2 /*return*/];
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify([
                                {
                                    functionArgs: [{ argName: 'enable', argValue: 'on' }],
                                    functionName: common_1.ForceHttpsEnum[forceHttps],
                                },
                            ]),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Referer防盗链
     * @param client
     * @param param1
     */
    Client.setCdnDomainReferer = function (client, _a) {
        var domain = _a.domain, referer = _a.referer;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainConfigs, refererOptioned, cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Client.DescribeCdnDomainConfigs(client, {
                            domain: domain,
                            functionNames: common_1.RefererEnum.whitelist + "," + common_1.RefererEnum.blacklist,
                        })];
                    case 1:
                        cdnDomainConfigs = _b.sent();
                        refererOptioned = cdnDomainConfigs.find(function (item) {
                            return item.functionName === common_1.RefererEnum.whitelist || item.functionName === common_1.RefererEnum.blacklist;
                        });
                        if (!(referer.switch === 'on')) return [3 /*break*/, 4];
                        if (!refererOptioned) return [3 /*break*/, 3];
                        if (!(referer.type !== refererOptioned.functionName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, { domain: domain, configId: refererOptioned.configId })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!refererOptioned) return [3 /*break*/, 6];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, {
                                domain: domain,
                                configId: refererOptioned.configId,
                            })];
                    case 5: 
                    // 未开启，且设置过 则删除
                    return [2 /*return*/, _b.sent()];
                    case 6:
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify([common_1.parseReferer(referer)]),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description IP黑/白名单
     * @param client
     * @param param1
     */
    Client.setCdnDomainIpFilter = function (client, _a) {
        var domain = _a.domain, ipFilter = _a.ipFilter;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainConfigs, ipFilterOptioned, cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Client.DescribeCdnDomainConfigs(client, {
                            domain: domain,
                            functionNames: common_1.IpFilterEnum.whitelist + "," + common_1.IpFilterEnum.blacklist,
                        })];
                    case 1:
                        cdnDomainConfigs = _b.sent();
                        ipFilterOptioned = cdnDomainConfigs.find(function (item) {
                            return item.functionName === common_1.IpFilterEnum.whitelist ||
                                item.functionName === common_1.IpFilterEnum.blacklist;
                        });
                        if (!(ipFilter.switch === 'on')) return [3 /*break*/, 4];
                        if (!ipFilterOptioned) return [3 /*break*/, 3];
                        if (!(ipFilter.type !== ipFilterOptioned.functionName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, {
                                domain: domain,
                                configId: ipFilterOptioned.configId,
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!ipFilterOptioned) return [3 /*break*/, 6];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, {
                                domain: domain,
                                configId: ipFilterOptioned.configId,
                            })];
                    case 5: 
                    // 未开启，且设置过 则删除
                    return [2 /*return*/, _b.sent()];
                    case 6:
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify([common_1.parseIpFilter(ipFilter)]),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description UA黑/白名单
     * @param client
     * @param param1
     */
    Client.setCdnDomainUaFilter = function (client, _a) {
        var domain = _a.domain, uaFilter = _a.uaFilter;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainConfigs, uaFilterOptioned, cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Client.DescribeCdnDomainConfigs(client, {
                            domain: domain,
                            functionNames: 'ali_ua',
                        })];
                    case 1:
                        cdnDomainConfigs = _b.sent();
                        uaFilterOptioned = cdnDomainConfigs.find(function (item) { return item.functionName === 'ali_ua'; });
                        if (!(uaFilter.switch === 'on')) return [3 /*break*/, 4];
                        if (!uaFilterOptioned) return [3 /*break*/, 3];
                        if (!(uaFilter.type !== uaFilterOptioned.functionName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, {
                                domain: domain,
                                configId: uaFilterOptioned.configId,
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!uaFilterOptioned) return [3 /*break*/, 6];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, {
                                domain: domain,
                                configId: uaFilterOptioned.configId,
                            })];
                    case 5: 
                    // 未开启，且设置过 则删除
                    return [2 /*return*/, _b.sent()];
                    case 6:
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify([common_1.parseUaFilter(uaFilter)]),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 性能优化
     * @param client
     * @param param1
     */
    Client.setCdnDomainOptimization = function (client, _a) {
        var domain = _a.domain, optimization = _a.optimization;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify(common_1.parseOptimization(optimization)),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 重定向
     * @param client
     * @param param1
     */
    Client.setCdnDomainRedirects = function (client, _a) {
        var domain = _a.domain, redirects = _a.redirects;
        return __awaiter(this, void 0, void 0, function () {
            var cdnDomainConfigs, configIds, cdnDomainStagingConfigRequest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Client.DescribeCdnDomainConfigs(client, {
                            domain: domain,
                            functionNames: 'host_redirect',
                        })];
                    case 1:
                        cdnDomainConfigs = _b.sent();
                        configIds = cdnDomainConfigs.map(function (item) { return item.configId; });
                        if (!(configIds.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Client.DeleteSpecificConfig(client, { domain: domain, configId: configIds.join(',') })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
                            domainNames: domain,
                            functions: JSON.stringify(common_1.parseRedirects(redirects)),
                        });
                        return [4 /*yield*/, client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Client;
}());
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RuY2xpZW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvY2RuY2xpZW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpR0FBbUU7QUFDbkUsaUVBQXFEO0FBQ3JELG9DQXFCbUI7QUFDbkIsaUNBQTZCO0FBRTdCO0lBQUE7SUFrZ0JBLENBQUM7SUFqZ0JDOzs7Ozs7T0FNRztJQUNJLG1CQUFZLEdBQW5CLFVBQW9CLFdBQXlCO1FBQ25DLElBQUEsV0FBVyxHQUFzQixXQUFXLFlBQWpDLEVBQUUsZUFBZSxHQUFLLFdBQVcsZ0JBQWhCLENBQWlCO1FBQ3JELElBQU0sTUFBTSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNqQyxpQkFBaUI7WUFDakIsV0FBVyxhQUFBO1lBQ1gscUJBQXFCO1lBQ3JCLGVBQWUsaUJBQUE7U0FDaEIsQ0FBQyxDQUFDO1FBQ0gsUUFBUTtRQUNSLE1BQU0sQ0FBQyxRQUFRLEdBQUcsa0JBQWtCLENBQUM7UUFDckMsT0FBTyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSx5QkFBa0IsR0FBL0IsVUFDRSxNQUFNLEVBQ04sRUFBa0Q7WUFBaEQsTUFBTSxZQUFBLEVBQUUsSUFBSSxVQUFBOzs7Ozs7d0JBRVIsZ0NBQWdDLEdBQUcsSUFBSSxZQUFZLENBQUMsZ0NBQWdDLENBQUM7NEJBQ3pGLFVBQVUsRUFBRSxNQUFNOzRCQUNsQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQ0FDeEI7b0NBQ0UsWUFBWSxFQUFFO3dDQUNaLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO3dDQUN6QyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTt3Q0FDbkMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7d0NBQ3JDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO3dDQUNqQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTt3Q0FDcEMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7d0NBQ3JDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO3dDQUNuQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtxQ0FDcEM7b0NBQ0QsWUFBWSxFQUFFLGVBQWU7aUNBQzlCOzZCQUNGLENBQUM7eUJBQ0gsQ0FBQyxDQUFDO3dCQUNILHVCQUF1Qjt3QkFDdkIscUJBQU0sTUFBTSxDQUFDLHlCQUF5QixDQUFDLGdDQUFnQyxDQUFDLEVBQUE7O3dCQUR4RSx1QkFBdUI7d0JBQ3ZCLFNBQXdFLENBQUM7Ozs7O0tBQzFFO0lBQ0Q7OztPQUdHO0lBQ1UscUNBQThCLEdBQTNDLFVBQTRDLE1BQU0sRUFBRSxNQUFjOzs7Ozs7d0JBQzFELHFDQUFxQyxHQUN6QyxJQUFJLFlBQVksQ0FBQyxxQ0FBcUMsQ0FBQzs0QkFDckQsVUFBVSxFQUFFLE1BQU07NEJBQ2xCLGFBQWEsRUFBRSxlQUFlO3lCQUMvQixDQUFDLENBQUM7d0JBRUUscUJBQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDLHFDQUFxQyxDQUFDLEVBQUE7O29CQUR6Rix1QkFBdUI7b0JBQ3ZCLHNCQUFPLFNBQWtGLEVBQUM7Ozs7S0FDM0Y7SUFDRDs7O09BR0c7SUFDVSx5Q0FBa0MsR0FBL0MsVUFBZ0QsTUFBTSxFQUFFLE1BQWM7Ozs7Ozt3QkFDOUQsdUNBQXVDLEdBQzNDLElBQUksWUFBWSxDQUFDLHVDQUF1QyxDQUFDOzRCQUN2RCxVQUFVLEVBQUUsTUFBTTs0QkFDbEIsWUFBWSxFQUFFLGVBQWU7eUJBQzlCLENBQUMsQ0FBQzt3QkFDTCx1QkFBdUI7d0JBQ3ZCLHFCQUFNLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFBOzt3QkFEdEYsdUJBQXVCO3dCQUN2QixTQUFzRixDQUFDOzs7OztLQUN4RjtJQUVEOzs7T0FHRztJQUNVLDhCQUF1QixHQUFwQyxVQUFxQyxNQUFNLEVBQUUsTUFBYzs7Ozs7O3dCQUNuRCw4QkFBOEIsR0FBRyxJQUFJLFlBQVksQ0FBQyw4QkFBOEIsQ0FBQzs0QkFDckYsVUFBVSxFQUFFLE1BQU07eUJBQ25CLENBQUMsQ0FBQzt3QkFDSCxlQUFNLENBQUMsS0FBSyxDQUNWLG9DQUFrQyxJQUFJLENBQUMsU0FBUyxDQUFDLDhCQUE4QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUcsQ0FDNUYsQ0FBQzs7Ozt3QkFHZSxxQkFBTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsOEJBQThCLENBQUMsRUFBQTs7d0JBQTdFLE1BQU0sR0FBRyxTQUFvRTt3QkFDbkYsZUFBTSxDQUFDLEtBQUssQ0FBQyxvQ0FBa0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBRyxDQUFDLENBQUM7d0JBQ2xGLGVBQU0sQ0FBQyxLQUFLLENBQ1YseUNBQXVDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFHLENBQ3RGLENBQUM7d0JBQ0YsZUFBTSxDQUFDLEtBQUssQ0FDViw4REFBNEQsSUFBSSxDQUFDLFNBQVMsQ0FDeEUsWUFBRyxDQUFDLE1BQU0sRUFBRSwyQkFBMkIsQ0FBQyxFQUN4QyxJQUFJLEVBQ0osQ0FBQyxDQUNBLENBQ0osQ0FBQzt3QkFFSSxnQkFBZ0IsR0FBRyxZQUFHLENBQUMsTUFBTSxFQUFFLDJCQUEyQixDQUFDLENBQUM7d0JBQ2xFLHNCQUFPLGdCQUFnQixFQUFDOzs7d0JBRXhCLGVBQU0sQ0FBQyxLQUFLLENBQUMsbUNBQWlDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUcsQ0FBQyxDQUFDO3dCQUMxRSxPQUFPLEdBQUcsWUFBRyxDQUFDLE9BQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLFdBQVcsS0FBSyxvQkFBb0IsRUFBRTs0QkFDeEMsTUFBTSxJQUFJLEtBQUssQ0FDYixpRkFBaUYsQ0FDbEYsQ0FBQzt5QkFDSDt3QkFDRCxzQkFBTyxJQUFJLEVBQUM7Ozs7O0tBRWY7SUFFRDs7OztPQUlHO0lBQ1Usd0JBQWlCLEdBQTlCLFVBQ0UsTUFBTSxFQUNOLEVBQTZFO1lBQTNFLE1BQU0sWUFBQSxFQUFFLGtCQUF3QixFQUF4QixVQUFVLG1CQUFHLFdBQVcsS0FBQTs7Ozs7O3dCQUU1Qix3QkFBd0IsR0FBRyxJQUFJLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQzs0QkFDekUsVUFBVSxFQUFFLE1BQU07NEJBQ2xCLFVBQVUsWUFBQTt5QkFDWCxDQUFDLENBQUM7Ozs7d0JBRWMscUJBQU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLHdCQUF3QixDQUFDLEVBQUE7O3dCQUFqRSxNQUFNLEdBQUcsU0FBd0Q7d0JBQ3ZFLHNCQUFPLE1BQU0sRUFBQzs7O3dCQUVSLDRCQUE0QixHQUFHLElBQUksWUFBWSxDQUFDLDRCQUE0QixDQUFDOzRCQUNqRixVQUFVLEVBQUUsTUFBTTt5QkFDbkIsQ0FBQyxDQUFDO3dCQUNZLHFCQUFNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFBOzt3QkFBekUsTUFBTSxHQUFHLFNBQWdFO3dCQUN6RSxhQUFhLEdBQUcsWUFBRyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQzt3QkFDbEQsTUFBTSxJQUFJLEtBQUssQ0FDYiw0c0JBQ3FELGFBQWEsZUFDakUsQ0FDRixDQUFDOzs7OztLQUVMO0lBRUQ7Ozs7T0FJRztJQUNVLHNCQUFlLEdBQTVCLFVBQTZCLE1BQU0sRUFBRSxNQUFjLEVBQUUsWUFBcUI7Ozs7Ozt3QkFDbEUsc0JBQXNCLEdBQUcsSUFBSSxZQUFZLENBQUMsc0JBQXNCLENBQUM7NEJBQ3JFLFVBQVUsRUFBRSxNQUFNO3lCQUNuQixDQUFDLENBQUM7NkJBQ0MsWUFBWSxFQUFaLHdCQUFZOzs7O3dCQUVaLHFCQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsRUFBQTs7d0JBQXBELFNBQW9ELENBQUM7Ozs7Ozs0QkFLdkQscUJBQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFBOzt3QkFBcEQsU0FBb0QsQ0FBQzs7Ozs7O0tBRXhEO0lBRUQ7Ozs7T0FJRztJQUNVLG1CQUFZLEdBQXpCLFVBQ0UsTUFBTSxFQUNOLEVBQTREO1lBQTFELE1BQU0sWUFBQSxFQUFFLE9BQU8sYUFBQTs7Ozs7O3dCQUdYLG1CQUFtQixHQUFHLElBQUksWUFBWSxDQUFDLG1CQUFtQixDQUFDOzRCQUMvRCxLQUFLLEVBQUUsUUFBUTs0QkFDZixPQUFPLEVBQUUsS0FBSzs0QkFDZCxVQUFVLEVBQUUsTUFBTTs0QkFDbEIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDNUMsQ0FBQyxDQUFDOzs7O3dCQUVELHFCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsRUFBQTs7d0JBQTlDLFNBQThDLENBQUM7Ozs7d0JBRXpDLE9BQU8sR0FBRyxZQUFHLENBQUMsT0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzFDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQzs7Ozs7S0FFdkQ7SUFFRDs7OztPQUlHO0lBQ1Usc0JBQWUsR0FBNUIsVUFDRSxNQUFNLEVBQ04sRUFBNkQ7WUFBM0QsTUFBTSxZQUFBLEVBQUUsT0FBTyxhQUFBOzs7Ozs7d0JBR1gsbUJBQW1CLEdBQUcsSUFBSSxZQUFZLENBQUMsc0JBQXNCLENBQUM7NEJBQ2xFLFVBQVUsRUFBRSxNQUFNOzRCQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUM1QyxDQUFDLENBQUM7Ozs7d0JBRUQscUJBQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFBOzt3QkFBakQsU0FBaUQsQ0FBQzs7Ozt3QkFFNUMsT0FBTyxHQUFHLFlBQUcsQ0FBQyxPQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDOzs7OztLQUV2RDtJQUVEOzs7O09BSUc7SUFDVSxpQ0FBMEIsR0FBdkMsVUFDRSxNQUFNLEVBQ04sRUFBcUQ7WUFBbkQsTUFBTSxZQUFBLEVBQUUsS0FBSyxXQUFBOzs7Ozs7NkJBRVgsc0JBQWEsQ0FBQyxZQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQXJDLHdCQUFxQzt3QkFDakMsOEJBQThCLEdBQUcsSUFBSSxZQUFZLENBQUMsaUNBQWlDLFlBQ3ZGLFVBQVUsRUFBRSxNQUFNLElBQ2Ysc0JBQWEsQ0FBQyxZQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQ3hDLENBQUM7d0JBQ0gscUJBQU0sTUFBTSxDQUFDLDBCQUEwQixDQUFDLDhCQUE4QixDQUFDLEVBQUE7O3dCQUF2RSxTQUF1RSxDQUFDOzs0QkFFMUUscUJBQU0sTUFBTSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRTs0QkFDMUMsTUFBTSxRQUFBOzRCQUNOLFVBQVUsRUFBRSxZQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUM7eUJBQzlDLENBQUMsRUFBQTs7d0JBSEYsU0FHRSxDQUFDO3dCQUNILElBQUksWUFBRyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTs0QkFDbkUsZUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDeEQ7NkJBQ0csQ0FBQSxZQUFHLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLEtBQUssSUFBSSxDQUFBLEVBQXRDLHdCQUFzQzt3QkFDeEMscUJBQU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLEtBQUssRUFBRSxZQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUE7O3dCQUFyRixTQUFxRixDQUFDOzs7Ozs7S0FFekY7SUFFWSx3QkFBaUIsR0FBOUIsVUFDRSxNQUFNLEVBQ04sRUFBb0Q7WUFBbEQsTUFBTSxZQUFBLEVBQUUsS0FBSyxXQUFBOzs7Ozs7d0JBRVQsNkJBQTZCLEdBQUcsSUFBSSxZQUFZLENBQUMsOEJBQThCLENBQUM7NEJBQ3BGLFdBQVcsRUFBRSxNQUFNOzRCQUNuQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQ0FDeEI7b0NBQ0UsWUFBWSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztvQ0FDckQsWUFBWSxFQUFFLGNBQWM7aUNBQzdCOzZCQUNGLENBQUM7eUJBQ0gsQ0FBQyxDQUFDO3dCQUNILHFCQUFNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFBOzt3QkFBbkUsU0FBbUUsQ0FBQzs7Ozs7S0FDckU7SUFFRDs7OztPQUlHO0lBQ1UsMkJBQW9CLEdBQWpDLFVBQ0UsTUFBTSxFQUNOLEVBQTBEO1lBQXhELE1BQU0sWUFBQSxFQUFFLFFBQVEsY0FBQTs7Ozs7O3dCQUVaLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQywyQkFBMkIsQ0FBQzs0QkFDMUQsVUFBVSxFQUFFLE1BQU07NEJBQ2xCLFFBQVEsVUFBQTt5QkFDVCxDQUFDLENBQUM7d0JBQ0gscUJBQU0sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzs7Ozs7S0FDM0M7SUFFRDs7OztPQUlHO0lBQ1UsK0JBQXdCLEdBQXJDLFVBQ0UsTUFBTSxFQUNOLEVBQW9FO1lBQWxFLE1BQU0sWUFBQSxFQUFFLGFBQWEsbUJBQUE7Ozs7Ozt3QkFFakIsTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLCtCQUErQixDQUFDOzRCQUM5RCxVQUFVLEVBQUUsTUFBTTs0QkFDbEIsYUFBYSxlQUFBO3lCQUNkLENBQUMsQ0FBQzt3QkFDWSxxQkFBTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUF0RCxNQUFNLEdBQUcsU0FBNkM7d0JBQzVELHNCQUFPLFlBQUcsQ0FBQyxNQUFNLEVBQUUsaUNBQWlDLENBQUMsRUFBQzs7OztLQUN2RDtJQUVEOzs7O09BSUc7SUFDVSwwQkFBbUIsR0FBaEMsVUFDRSxNQUFNLEVBQ04sRUFBeUU7WUFBdkUsTUFBTSxZQUFBLEVBQUUsZUFBZSxxQkFBQTs7Ozs7O3dCQUVuQixNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsMEJBQTBCLENBQUM7NEJBQ3pELFVBQVUsRUFBRSxNQUFNOzRCQUNsQixlQUFlLGlCQUFBO3lCQUNoQixDQUFDLENBQUM7d0JBQ1kscUJBQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBakQsTUFBTSxHQUFHLFNBQXdDO3dCQUN2RCxzQkFBTyxZQUFHLENBQUMsTUFBTSxFQUFFLDBCQUEwQixDQUFDLEVBQUM7Ozs7S0FDaEQ7SUFFRDs7OztPQUlHO0lBQ1UsNkJBQXNCLEdBQW5DLFVBQ0UsTUFBTSxFQUNOLEVBQW1FO1lBQWpFLE1BQU0sWUFBQSxFQUFFLFVBQVUsZ0JBQUE7Ozs7OzRCQUVLLHFCQUFNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUU7NEJBQ3JFLE1BQU0sUUFBQTs0QkFDTixhQUFhLEVBQUssdUJBQWMsQ0FBQyxJQUFJLFNBQUksdUJBQWMsQ0FBQyxLQUFPO3lCQUNoRSxDQUFDLEVBQUE7O3dCQUhJLGdCQUFnQixHQUFHLFNBR3ZCO3dCQUNJLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FDOUMsVUFBQyxJQUFJOzRCQUNILE9BQUEsSUFBSSxDQUFDLFlBQVksS0FBSyx1QkFBYyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLHVCQUFjLENBQUMsS0FBSzt3QkFBdkYsQ0FBdUYsQ0FDMUYsQ0FBQzs2QkFFRSxrQkFBa0IsRUFBbEIsd0JBQWtCO3dCQUNwQixtQkFBbUI7d0JBQ25CLElBQUksa0JBQWtCLENBQUMsWUFBWSxLQUFLLHVCQUFjLENBQUMsVUFBVSxDQUFDOzRCQUFFLHNCQUFPO3dCQUMzRSxpQkFBaUI7d0JBQ2pCLHFCQUFNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLFFBQUEsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBQTs7d0JBRDVGLGlCQUFpQjt3QkFDakIsU0FBNEYsQ0FBQzs7O3dCQUUvRixrQkFBa0I7d0JBQ2xCLElBQUksVUFBVSxLQUFLLFNBQVM7NEJBQUUsc0JBQU87d0JBRS9CLDZCQUE2QixHQUFHLElBQUksWUFBWSxDQUFDLDhCQUE4QixDQUFDOzRCQUNwRixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0NBQ3hCO29DQUNFLFlBQVksRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0NBQ3JELFlBQVksRUFBRSx1QkFBYyxDQUFDLFVBQVUsQ0FBQztpQ0FDekM7NkJBQ0YsQ0FBQzt5QkFDSCxDQUFDLENBQUM7d0JBQ0gscUJBQU0sTUFBTSxDQUFDLHVCQUF1QixDQUFDLDZCQUE2QixDQUFDLEVBQUE7O3dCQUFuRSxTQUFtRSxDQUFDOzs7OztLQUNyRTtJQUVEOzs7O09BSUc7SUFDVSwwQkFBbUIsR0FBaEMsVUFDRSxNQUFNLEVBQ04sRUFBMEQ7WUFBeEQsTUFBTSxZQUFBLEVBQUUsT0FBTyxhQUFBOzs7Ozs0QkFFUSxxQkFBTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFOzRCQUNyRSxNQUFNLFFBQUE7NEJBQ04sYUFBYSxFQUFLLG9CQUFXLENBQUMsU0FBUyxTQUFJLG9CQUFXLENBQUMsU0FBVzt5QkFDbkUsQ0FBQyxFQUFBOzt3QkFISSxnQkFBZ0IsR0FBRyxTQUd2Qjt3QkFDSSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUMzQyxVQUFDLElBQUk7NEJBQ0gsT0FBQSxJQUFJLENBQUMsWUFBWSxLQUFLLG9CQUFXLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssb0JBQVcsQ0FBQyxTQUFTO3dCQUExRixDQUEwRixDQUM3RixDQUFDOzZCQUVFLENBQUEsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUEsRUFBdkIsd0JBQXVCOzZCQUVyQixlQUFlLEVBQWYsd0JBQWU7NkJBRWIsQ0FBQSxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUEsRUFBN0Msd0JBQTZDO3dCQUMvQyxxQkFBTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxRQUFBLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFBOzt3QkFBekYsU0FBeUYsQ0FBQzs7Ozs2QkFHckYsZUFBZSxFQUFmLHdCQUFlO3dCQUVqQixxQkFBTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO2dDQUMvQyxNQUFNLFFBQUE7Z0NBQ04sUUFBUSxFQUFFLGVBQWUsQ0FBQyxRQUFROzZCQUNuQyxDQUFDLEVBQUE7O29CQUpGLGVBQWU7b0JBQ2Ysc0JBQU8sU0FHTCxFQUFDOzt3QkFHQyw2QkFBNkIsR0FBRyxJQUFJLFlBQVksQ0FBQyw4QkFBOEIsQ0FBQzs0QkFDcEYsV0FBVyxFQUFFLE1BQU07NEJBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMscUJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3lCQUNuRCxDQUFDLENBQUM7d0JBQ0gscUJBQU0sTUFBTSxDQUFDLHVCQUF1QixDQUFDLDZCQUE2QixDQUFDLEVBQUE7O3dCQUFuRSxTQUFtRSxDQUFDOzs7OztLQUNyRTtJQUVEOzs7O09BSUc7SUFDVSwyQkFBb0IsR0FBakMsVUFDRSxNQUFNLEVBQ04sRUFBNkQ7WUFBM0QsTUFBTSxZQUFBLEVBQUUsUUFBUSxjQUFBOzs7Ozs0QkFFTyxxQkFBTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFOzRCQUNyRSxNQUFNLFFBQUE7NEJBQ04sYUFBYSxFQUFLLHFCQUFZLENBQUMsU0FBUyxTQUFJLHFCQUFZLENBQUMsU0FBVzt5QkFDckUsQ0FBQyxFQUFBOzt3QkFISSxnQkFBZ0IsR0FBRyxTQUd2Qjt3QkFDSSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQzVDLFVBQUMsSUFBSTs0QkFDSCxPQUFBLElBQUksQ0FBQyxZQUFZLEtBQUsscUJBQVksQ0FBQyxTQUFTO2dDQUM1QyxJQUFJLENBQUMsWUFBWSxLQUFLLHFCQUFZLENBQUMsU0FBUzt3QkFENUMsQ0FDNEMsQ0FDL0MsQ0FBQzs2QkFFRSxDQUFBLFFBQVEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFBLEVBQXhCLHdCQUF3Qjs2QkFFdEIsZ0JBQWdCLEVBQWhCLHdCQUFnQjs2QkFFZCxDQUFBLFFBQVEsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLENBQUMsWUFBWSxDQUFBLEVBQS9DLHdCQUErQzt3QkFDakQscUJBQU0sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtnQ0FDeEMsTUFBTSxRQUFBO2dDQUNOLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFROzZCQUNwQyxDQUFDLEVBQUE7O3dCQUhGLFNBR0UsQ0FBQzs7Ozs2QkFHRSxnQkFBZ0IsRUFBaEIsd0JBQWdCO3dCQUVsQixxQkFBTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO2dDQUMvQyxNQUFNLFFBQUE7Z0NBQ04sUUFBUSxFQUFFLGdCQUFnQixDQUFDLFFBQVE7NkJBQ3BDLENBQUMsRUFBQTs7b0JBSkYsZUFBZTtvQkFDZixzQkFBTyxTQUdMLEVBQUM7O3dCQUVDLDZCQUE2QixHQUFHLElBQUksWUFBWSxDQUFDLDhCQUE4QixDQUFDOzRCQUNwRixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxzQkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7eUJBQ3JELENBQUMsQ0FBQzt3QkFDSCxxQkFBTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsNkJBQTZCLENBQUMsRUFBQTs7d0JBQW5FLFNBQW1FLENBQUM7Ozs7O0tBQ3JFO0lBRUQ7Ozs7T0FJRztJQUNVLDJCQUFvQixHQUFqQyxVQUNFLE1BQU0sRUFDTixFQUE2RDtZQUEzRCxNQUFNLFlBQUEsRUFBRSxRQUFRLGNBQUE7Ozs7OzRCQUVPLHFCQUFNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUU7NEJBQ3JFLE1BQU0sUUFBQTs0QkFDTixhQUFhLEVBQUUsUUFBUTt5QkFDeEIsQ0FBQyxFQUFBOzt3QkFISSxnQkFBZ0IsR0FBRyxTQUd2Qjt3QkFDSSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsWUFBWSxLQUFLLFFBQVEsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDOzZCQUVyRixDQUFBLFFBQVEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFBLEVBQXhCLHdCQUF3Qjs2QkFFdEIsZ0JBQWdCLEVBQWhCLHdCQUFnQjs2QkFFZCxDQUFBLFFBQVEsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLENBQUMsWUFBWSxDQUFBLEVBQS9DLHdCQUErQzt3QkFDakQscUJBQU0sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtnQ0FDeEMsTUFBTSxRQUFBO2dDQUNOLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFROzZCQUNwQyxDQUFDLEVBQUE7O3dCQUhGLFNBR0UsQ0FBQzs7Ozs2QkFHRSxnQkFBZ0IsRUFBaEIsd0JBQWdCO3dCQUVsQixxQkFBTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO2dDQUMvQyxNQUFNLFFBQUE7Z0NBQ04sUUFBUSxFQUFFLGdCQUFnQixDQUFDLFFBQVE7NkJBQ3BDLENBQUMsRUFBQTs7b0JBSkYsZUFBZTtvQkFDZixzQkFBTyxTQUdMLEVBQUM7O3dCQUVDLDZCQUE2QixHQUFHLElBQUksWUFBWSxDQUFDLDhCQUE4QixDQUFDOzRCQUNwRixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxzQkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7eUJBQ3JELENBQUMsQ0FBQzt3QkFDSCxxQkFBTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsNkJBQTZCLENBQUMsRUFBQTs7d0JBQW5FLFNBQW1FLENBQUM7Ozs7O0tBQ3JFO0lBRUQ7Ozs7T0FJRztJQUNVLCtCQUF3QixHQUFyQyxVQUNFLE1BQU0sRUFDTixFQUF5RTtZQUF2RSxNQUFNLFlBQUEsRUFBRSxZQUFZLGtCQUFBOzs7Ozs7d0JBRWhCLDZCQUE2QixHQUFHLElBQUksWUFBWSxDQUFDLDhCQUE4QixDQUFDOzRCQUNwRixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7eUJBQzNELENBQUMsQ0FBQzt3QkFDSCxxQkFBTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsNkJBQTZCLENBQUMsRUFBQTs7d0JBQW5FLFNBQW1FLENBQUM7Ozs7O0tBQ3JFO0lBRUQ7Ozs7T0FJRztJQUNVLDRCQUFxQixHQUFsQyxVQUNFLE1BQU0sRUFDTixFQUFrRTtZQUFoRSxNQUFNLFlBQUEsRUFBRSxTQUFTLGVBQUE7Ozs7OzRCQUVNLHFCQUFNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUU7NEJBQ3JFLE1BQU0sUUFBQTs0QkFDTixhQUFhLEVBQUUsZUFBZTt5QkFDL0IsQ0FBQyxFQUFBOzt3QkFISSxnQkFBZ0IsR0FBRyxTQUd2Qjt3QkFDSSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLFFBQVEsRUFBYixDQUFhLENBQUMsQ0FBQzs2QkFDNUQsQ0FBQSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUFwQix3QkFBb0I7d0JBQ3RCLHFCQUFNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLFFBQUEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUE7O3dCQUFwRixTQUFvRixDQUFDOzs7d0JBRWpGLDZCQUE2QixHQUFHLElBQUksWUFBWSxDQUFDLDhCQUE4QixDQUFDOzRCQUNwRixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDckQsQ0FBQyxDQUFDO3dCQUNILHFCQUFNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFBOzt3QkFBbkUsU0FBbUUsQ0FBQzs7Ozs7S0FDckU7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQWxnQkQsSUFrZ0JDIn0=