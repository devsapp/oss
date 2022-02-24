"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var base_1 = __importDefault(require("./common/base"));
var contants_1 = require("./common/contants");
var lodash_1 = require("lodash");
var fs_extra_1 = __importDefault(require("fs-extra"));
var reportComponent = cores.reportComponent, getCredential = cores.getCredential, coreHelp = cores.help;
var OssComponent = /** @class */ (function (_super) {
    __extends(OssComponent, _super);
    function OssComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * deploy
     * @param inputs
     *
     */
    OssComponent.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var argsData, commandHelp, credentials, AccessKeyID, AccessKeySecret, uid, region, ossRegion, customDomains, ossBucket, serviceName, ossAcl, ossConfig, ossClient, isContinue, ossSrc, errString, ossCors, _a, ossReferer, _b, allowEmpty, _c, ossReferers, ossSubDir, ossStatic, _d, index, _e, error, _f, subDir, websiteConfig, typeMap, subDirType, result, _g, domainList, reportContent, message, e_1;
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
                        credentials = lodash_1.get(inputs, 'credentials');
                        if (!lodash_1.isEmpty(credentials)) return [3 /*break*/, 2];
                        return [4 /*yield*/, getCredential(inputs, inputs.project.access)];
                    case 1:
                        credentials = _h.sent();
                        _h.label = 2;
                    case 2:
                        AccessKeyID = credentials.AccessKeyID, AccessKeySecret = credentials.AccessKeySecret, uid = credentials.AccountID;
                        region = lodash_1.get(inputs, 'props.region');
                        ossRegion = "oss-" + region;
                        customDomains = lodash_1.get(inputs, 'props.customDomains', {});
                        ossBucket = lodash_1.get(inputs, 'props.bucket');
                        if (!ossBucket) {
                            common_1.logger.error('bucket is required For oss');
                            return [2 /*return*/];
                        }
                        else if (ossBucket === 'auto') {
                            serviceName = lodash_1.get(inputs, 'appName');
                            ossBucket = "serverless-devs-" + ossRegion + "-" + serviceName + "-" + uid;
                        }
                        ossAcl = !lodash_1.isEmpty(customDomains) ? 'public-read' : lodash_1.get(inputs, 'props.acl', 'private');
                        reportComponent('oss', {
                            uid: uid,
                            command: 'deploy',
                        });
                        ossConfig = {
                            accessKeyId: AccessKeyID,
                            accessKeySecret: AccessKeySecret,
                            region: ossRegion,
                        };
                        ossClient = new ali_oss_1.default(ossConfig);
                        return [4 /*yield*/, oss_services_1.bucketIsExisting(ossClient, ossBucket, ossAcl, argsData)];
                    case 3:
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
                        _h.label = 4;
                    case 4:
                        _h.trys.push([4, 14, , 15]);
                        // update ossAcl
                        return [4 /*yield*/, ossClient.putBucketACL(ossBucket, ossAcl)];
                    case 5:
                        // update ossAcl
                        _h.sent();
                        ossCors = lodash_1.get(inputs, 'props.cors', []);
                        _a = !lodash_1.isEmpty(ossCors);
                        if (!_a) return [3 /*break*/, 7];
                        return [4 /*yield*/, ossClient.putBucketCORS(ossBucket, ossCors)];
                    case 6:
                        _a = (_h.sent());
                        _h.label = 7;
                    case 7:
                        _a;
                        ossReferer = lodash_1.get(inputs, 'props.referer', {});
                        _b = ossReferer.allowEmpty, allowEmpty = _b === void 0 ? true : _b, _c = ossReferer.referers, ossReferers = _c === void 0 ? [] : _c;
                        return [4 /*yield*/, ossClient.putBucketReferer(ossBucket, allowEmpty, ossReferers)];
                    case 8:
                        _h.sent();
                        ossSubDir = lodash_1.get(inputs, 'props.subDir');
                        return [4 /*yield*/, oss_services_1.put(ossClient, ossSrc, ossSubDir)];
                    case 9:
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
                    case 10:
                        _h.sent();
                        result = {
                            Bucket: ossBucket,
                            Region: lodash_1.get(inputs, 'props.region'),
                        };
                        if (!lodash_1.isEmpty(customDomains)) return [3 /*break*/, 11];
                        result.OssAddress = "https://oss.console.aliyun.com/bucket/" + ossRegion + "/" + ossBucket + "/object";
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, oss_services_1.bindDomain(inputs, ossBucket)];
                    case 12:
                        _g = _h.sent(), domainList = _g.domains, reportContent = _g.reportContent;
                        // report oss response
                        _super.prototype.__report.call(this, reportContent);
                        result.Domains = domainList;
                        _h.label = 13;
                    case 13:
                        message = lodash_1.every(result.Domains, function (child) { return lodash_1.isEmpty(child); })
                            ? 'oss deployed successful without Domain'
                            : 'oss deployed successful ';
                        common_1.logger.info(message);
                        return [2 /*return*/, result];
                    case 14:
                        e_1 = _h.sent();
                        common_1.logger.error('oss deployed aborted');
                        return [2 /*return*/, {
                                errMesg: e_1,
                            }];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return OssComponent;
}(base_1.default));
exports.default = OssComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLDJDQUEyQztBQUMzQyxvREFBb0Q7QUFDcEQ7O0dBRUc7QUFDSCwyREFBK0M7QUFDL0Msb0RBQWdDO0FBQ2hDLHdEQVVpQztBQUNqQyxtQ0FBa0M7QUFDbEMsdURBQWlDO0FBRWpDLDhDQUFxRDtBQUNyRCxpQ0FBNkM7QUFDN0Msc0RBQTBCO0FBRWxCLElBQUEsZUFBZSxHQUFvQyxLQUFLLGdCQUF6QyxFQUFFLGFBQWEsR0FBcUIsS0FBSyxjQUExQixFQUFRLFFBQVEsR0FBSyxLQUFLLEtBQVYsQ0FBVztBQUNqRTtJQUEwQyxnQ0FBSTtJQUE5Qzs7SUFpSEEsQ0FBQztJQWhIQzs7OztPQUlHO0lBQ0csNkJBQU0sR0FBWixVQUFhLE1BQWtCOzs7Ozs7d0JBQzdCLGVBQU0sQ0FBQyxLQUFLLENBQ1YsTUFBSSxZQUFHLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLHlCQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFHLENBQzVGLENBQUM7d0JBQ0ksUUFBUSxHQUFxQiwyQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNsRCxXQUFXLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNoRCxJQUFJLFdBQVcsRUFBRTs0QkFDZixRQUFRLENBQUMsMkJBQWdCLENBQUMsQ0FBQzs0QkFDM0Isc0JBQU87eUJBQ1I7d0JBQ0csV0FBVyxHQUFHLFlBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7NkJBQ3pDLGdCQUFPLENBQUMsV0FBVyxDQUFDLEVBQXBC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