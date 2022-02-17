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
var core_1 = require("@serverless-devs/core");
var ali_oss_1 = __importDefault(require("ali-oss"));
var oss_services_1 = require("./services/oss.services");
var domain_service_1 = __importDefault(require("./services/domain.service"));
var common_1 = require("./common");
var base_1 = __importDefault(require("./common/base"));
var lodash_1 = require("lodash");
var OssComponent = /** @class */ (function (_super) {
    __extends(OssComponent, _super);
    function OssComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * deploy
     * @param inputs
     */
    OssComponent.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, AccessKeyID, AccessKeySecret, ossRegion, ossBucket, ossAcl, ossConfig, ossClient, isContinue, deployLoading, ossCors, _a, ossReferer, _b, allowEmpty, _c, ossReferers, ossSrc, ossSubDir, ossStatic, _d, index, _e, error, _f, subDir, websiteConfig, typeMap, subDirType, result, e_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        credentials = lodash_1.get(inputs, 'credentials');
                        if (!lodash_1.isEmpty(credentials)) return [3 /*break*/, 2];
                        return [4 /*yield*/, core_1.getCredential(inputs, inputs.project.access)];
                    case 1:
                        credentials = _g.sent();
                        _g.label = 2;
                    case 2:
                        core_1.reportComponent('oss', {
                            uid: credentials.AccountID,
                            command: 'deploy',
                        });
                        common_1.logger.debug("[" + lodash_1.get(inputs, 'project.projectName') + "] inputs params: " + JSON.stringify(inputs, null, 2));
                        AccessKeyID = credentials.AccessKeyID, AccessKeySecret = credentials.AccessKeySecret;
                        ossRegion = "oss-" + lodash_1.get(inputs, 'props.region');
                        ossBucket = lodash_1.get(inputs, 'props.bucket');
                        ossAcl = lodash_1.get(inputs, 'props.acl', 'private');
                        ossConfig = {
                            accessKeyId: AccessKeyID,
                            accessKeySecret: AccessKeySecret,
                            region: ossRegion,
                        };
                        ossClient = new ali_oss_1.default(ossConfig);
                        return [4 /*yield*/, oss_services_1.bucketIsExisting(ossClient, ossBucket, ossAcl)];
                    case 3:
                        isContinue = _g.sent();
                        if (!isContinue)
                            return [2 /*return*/];
                        ossClient = new ali_oss_1.default(__assign(__assign({}, ossConfig), { bucket: ossBucket }));
                        deployLoading = core_1.spinner('The Oss is deploying');
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, 11, , 12]);
                        // update ossAcl
                        return [4 /*yield*/, ossClient.putBucketACL(ossBucket, ossAcl)];
                    case 5:
                        // update ossAcl
                        _g.sent();
                        ossCors = lodash_1.get(inputs, 'props.cors', []);
                        _a = !lodash_1.isEmpty(ossCors);
                        if (!_a) return [3 /*break*/, 7];
                        return [4 /*yield*/, ossClient.putBucketCORS(ossBucket, ossCors)];
                    case 6:
                        _a = (_g.sent());
                        _g.label = 7;
                    case 7:
                        _a;
                        ossReferer = lodash_1.get(inputs, 'props.referer', {});
                        _b = ossReferer.allowEmpty, allowEmpty = _b === void 0 ? true : _b, _c = ossReferer.referers, ossReferers = _c === void 0 ? [] : _c;
                        return [4 /*yield*/, ossClient.putBucketReferer(ossBucket, allowEmpty, ossReferers)];
                    case 8:
                        _g.sent();
                        ossSrc = lodash_1.get(inputs, 'props.codeUri');
                        ossSubDir = lodash_1.get(inputs, 'props.subDir');
                        return [4 /*yield*/, oss_services_1.put(ossClient, ossSrc, ossSubDir)];
                    case 9:
                        _g.sent();
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
                        _g.sent();
                        deployLoading.succeed('OSS website source deployed success');
                        result = {
                            Bucket: ossBucket,
                            Region: lodash_1.get(inputs, 'props.region'),
                            ossAddress: "https://oss.console.aliyun.com/bucket/" + ossRegion + "/" + ossBucket + "/object",
                        };
                        index && (result.indexHtml = "http://" + ossBucket + "." + ossRegion + ".aliyuncs.com/" + index);
                        return [2 /*return*/, result];
                    case 11:
                        e_1 = _g.sent();
                        return [2 /*return*/, {
                                errMesg: "Oss deploy Error:" + e_1,
                            }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * domain
     * @param inputs
     */
    OssComponent.prototype.domain = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, domain_service_1.default(inputs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return OssComponent;
}(base_1.default));
exports.default = OssComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBZ0Y7QUFDaEYsb0RBQWdDO0FBQ2hDLHdEQU9pQztBQUNqQyw2RUFBK0M7QUFDL0MsbUNBQWtDO0FBQ2xDLHVEQUFpQztBQUVqQyxpQ0FBc0M7QUFRdEM7SUFBMEMsZ0NBQUk7SUFBOUM7O0lBNkZBLENBQUM7SUE1RkM7OztPQUdHO0lBQ0csNkJBQU0sR0FBWixVQUFhLE1BQWtCOzs7Ozs7d0JBQ3pCLFdBQVcsR0FBRyxZQUFHLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDOzZCQUN6QyxnQkFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFwQix3QkFBb0I7d0JBQ1IscUJBQU0sb0JBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQWhFLFdBQVcsR0FBRyxTQUFrRCxDQUFDOzs7d0JBRW5FLHNCQUFlLENBQUMsS0FBSyxFQUFFOzRCQUNyQixHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVM7NEJBQzFCLE9BQU8sRUFBRSxRQUFRO3lCQUNsQixDQUFDLENBQUM7d0JBQ0gsZUFBTSxDQUFDLEtBQUssQ0FDVixNQUFJLFlBQUcsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMseUJBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUcsQ0FDNUYsQ0FBQzt3QkFFTSxXQUFXLEdBQXNCLFdBQVcsWUFBakMsRUFBRSxlQUFlLEdBQUssV0FBVyxnQkFBaEIsQ0FBaUI7d0JBQy9DLFNBQVMsR0FBRyxTQUFPLFlBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFHLENBQUM7d0JBQ2pELFNBQVMsR0FBRyxZQUFHLENB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