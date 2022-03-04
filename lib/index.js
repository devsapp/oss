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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
/* eslint-disable require-atomic-updates */
/* eslint-disable @typescript-eslint/dot-notation */
/**
 * serverless-devs-${region}-${serviceName}-${uid}
 */
var cores = __importStar(require("@serverless-devs/core"));
var ali_oss_1 = __importDefault(require("ali-oss"));
var oss_services_1 = require("./services/oss.services");
var common_1 = require("./common");
var contants_1 = require("./common/contants");
var lodash_1 = require("lodash");
var fs_extra_1 = __importDefault(require("fs-extra"));
var getCredential = cores.getCredential, coreHelp = cores.help;
var OssComponent = /** @class */ (function () {
    function OssComponent() {
    }
    /**
     * deploy
     * @param inputs
     *
     */
    OssComponent.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var argsData, commandHelp, credentials, AccessKeyID, AccessKeySecret, uid, SecurityToken, region, ossRegion, customDomains, ossBucket, serviceName, ossAcl, ossConfig, ossClient, isContinue, ossSrc, errString, ossCors, _a, ossReferer, _b, allowEmpty, _c, ossReferers, ossSubDir, ossStatic, _d, index, _e, error, _f, subDir, websiteConfig, typeMap, subDirType, result, _g, domainList, reportContent, message, e_1;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        common_1.logger.debug("[" + lodash_1.get(inputs, 'project.projectName') + "] inputs params: " + JSON.stringify(inputs, null, 2));
                        argsData = oss_services_1.handleInputs(inputs);
                        commandHelp = argsData.h || argsData.help;
                        if (commandHelp) {
                            coreHelp(contants_1.DEPLOY_HELP_INFO);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, getCredential(inputs, inputs.project.access)];
                    case 1:
                        credentials = _h.sent();
                        AccessKeyID = credentials.AccessKeyID, AccessKeySecret = credentials.AccessKeySecret, uid = credentials.AccountID, SecurityToken = credentials.SecurityToken;
                        region = lodash_1.get(inputs, 'props.region');
                        ossRegion = "oss-" + region;
                        customDomains = lodash_1.get(inputs, 'props.customDomains', {});
                        ossBucket = lodash_1.get(inputs, 'props.bucket');
                        if (!ossBucket) {
                            common_1.logger.error('bucket is required For oss');
                            return [2 /*return*/];
                        }
                        else if (ossBucket === 'auto') {
                            serviceName = lodash_1.get(inputs, 'project.projectName');
                            ossBucket = "serverless-devs-" + region + "-" + serviceName + "-" + uid;
                        }
                        ossAcl = !lodash_1.isEmpty(customDomains) ? 'public-read' : lodash_1.get(inputs, 'props.acl', 'private');
                        ossConfig = {
                            accessKeyId: AccessKeyID,
                            accessKeySecret: AccessKeySecret,
                            region: ossRegion,
                            stsToken: SecurityToken,
                        };
                        ossClient = new ali_oss_1.default(ossConfig);
                        return [4 /*yield*/, oss_services_1.bucketIsExisting(ossClient, ossBucket, ossAcl, argsData)];
                    case 2:
                        isContinue = _h.sent();
                        if (!isContinue)
                            return [2 /*return*/];
                        ossClient = new ali_oss_1.default(__assign(__assign({}, ossConfig), { bucket: ossBucket }));
                        ossSrc = lodash_1.get(inputs, 'props.codeUri');
                        if (!fs_extra_1.default.existsSync(ossSrc)) {
                            errString = "no such file or directory, stat '" + ossSrc + "'";
                            common_1.logger.error(errString);
                            return [2 /*return*/];
                        }
                        _h.label = 3;
                    case 3:
                        _h.trys.push([3, 13, , 14]);
                        // update ossAcl
                        return [4 /*yield*/, ossClient.putBucketACL(ossBucket, ossAcl)];
                    case 4:
                        // update ossAcl
                        _h.sent();
                        ossCors = lodash_1.get(inputs, 'props.cors', []);
                        _a = !lodash_1.isEmpty(ossCors);
                        if (!_a) return [3 /*break*/, 6];
                        return [4 /*yield*/, ossClient.putBucketCORS(ossBucket, ossCors)];
                    case 5:
                        _a = (_h.sent());
                        _h.label = 6;
                    case 6:
                        _a;
                        ossReferer = lodash_1.get(inputs, 'props.referer', {});
                        _b = ossReferer.allowEmpty, allowEmpty = _b === void 0 ? true : _b, _c = ossReferer.referers, ossReferers = _c === void 0 ? [] : _c;
                        return [4 /*yield*/, ossClient.putBucketReferer(ossBucket, allowEmpty, ossReferers)];
                    case 7:
                        _h.sent();
                        ossSubDir = lodash_1.get(inputs, 'props.subDir');
                        return [4 /*yield*/, oss_services_1.put(ossClient, ossSrc, ossSubDir)];
                    case 8:
                        _h.sent();
                        ossStatic = lodash_1.get(inputs, 'props.website', {});
                        _d = ossStatic.index, index = _d === void 0 ? '' : _d, _e = ossStatic.error, error = _e === void 0 ? '' : _e, _f = ossStatic.subDir, subDir = _f === void 0 ? '' : _f;
                        websiteConfig = { index: index, error: error };
                        if (subDir && subDir.type) {
                            // supportSubDir ?
                            websiteConfig.supportSubDir = true;
                            typeMap = {
                                noSuchKey: 1,
                                index: 2,
                                redirect: 0,
                            };
                            subDirType = lodash_1.get(typeMap, subDir.type, 1);
                            websiteConfig.type = subDirType;
                        }
                        return [4 /*yield*/, ossClient.putBucketWebsite(ossBucket, websiteConfig)];
                    case 9:
                        _h.sent();
                        result = {
                            Bucket: ossBucket,
                            Region: lodash_1.get(inputs, 'props.region'),
                        };
                        if (!lodash_1.isEmpty(customDomains)) return [3 /*break*/, 10];
                        result.OssAddress = "https://oss.console.aliyun.com/bucket/" + ossRegion + "/" + ossBucket + "/object";
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, oss_services_1.bindDomain(inputs, ossBucket)];
                    case 11:
                        _g = _h.sent(), domainList = _g.domains, reportContent = _g.reportContent;
                        // report oss response
                        result.Domains = domainList;
                        _h.label = 12;
                    case 12:
                        message = lodash_1.every(result.Domains, function (child) { return lodash_1.isEmpty(child); })
                            ? 'oss deployed successful without Domain'
                            : 'oss deployed successful ';
                        common_1.logger.info(message);
                        return [2 /*return*/, result];
                    case 13:
                        e_1 = _h.sent();
                        common_1.logger.error('oss deployed aborted');
                        return [2 /*return*/, {
                                errMesg: e_1,
                            }];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return OssComponent;
}());
exports.default = OssComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsMkNBQTJDO0FBQzNDLG9EQUFvRDtBQUNwRDs7R0FFRztBQUNILDJEQUErQztBQUMvQyxvREFBZ0M7QUFDaEMsd0RBVWlDO0FBQ2pDLG1DQUFrQztBQUVsQyw4Q0FBcUQ7QUFDckQsaUNBQTZDO0FBQzdDLHNEQUEwQjtBQUVsQixJQUFBLGFBQWEsR0FBcUIsS0FBSyxjQUExQixFQUFRLFFBQVEsR0FBSyxLQUFLLEtBQVYsQ0FBVztBQUNoRDtJQUFBO0lBMkdBLENBQUM7SUExR0M7Ozs7T0FJRztJQUNHLDZCQUFNLEdBQVosVUFBYSxNQUFrQjs7Ozs7O3dCQUM3QixlQUFNLENBQUMsS0FBSyxDQUNWLE1BQUksWUFBRyxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyx5QkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBRyxDQUM1RixDQUFDO3dCQUNJLFFBQVEsR0FBcUIsMkJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDbEQsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDaEQsSUFBSSxXQUFXLEVBQUU7NEJBQ2YsUUFBUSxDQUFDLDJCQUFnQixDQUFDLENBQUM7NEJBQzNCLHNCQUFPO3lCQUNSO3dCQUNpQixxQkFBTSxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUFoRSxXQUFXLEdBQUcsU0FBa0Q7d0JBRTVELFdBQVcsR0FBcUQsV0FBVyxZQUFoRSxFQUFFLGVBQWUsR0FBb0MsV0FBVyxnQkFBL0MsRUFB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