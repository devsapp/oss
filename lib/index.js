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
var lodash_1 = require("lodash");
var ali_oss_1 = __importDefault(require("ali-oss"));
var path_1 = __importDefault(require("path"));
var walk_sync_1 = __importDefault(require("walk-sync"));
var common_1 = require("./common");
var base_1 = __importDefault(require("./common/base"));
var OssComponent = /** @class */ (function (_super) {
    __extends(OssComponent, _super);
    function OssComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * bucket is existing?
     * @param : client, bucket, ossAcl = 'private'
     */
    OssComponent.prototype.bucketIsExisting = function (client, bucket, ossAcl) {
        if (ossAcl === void 0) { ossAcl = 'private'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1, res, createLoading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 10]);
                        return [4 /*yield*/, client.getBucketInfo(bucket)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        if (!(error_1.name === 'NoSuchBucketError')) return [3 /*break*/, 8];
                        return [4 /*yield*/, core_1.inquirer.prompt([
                                {
                                    type: 'confirm',
                                    name: 'needToCreate',
                                    message: "The bucket " + bucket + " is inexistent, create the " + bucket + " now?",
                                },
                            ])];
                    case 3:
                        res = _a.sent();
                        if (!res.needToCreate) return [3 /*break*/, 6];
                        createLoading = core_1.spinner("The bucket of " + bucket + " is creating");
                        return [4 /*yield*/, client.putBucket(bucket)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, client.putBucketACL(bucket, ossAcl)];
                    case 5:
                        _a.sent();
                        createLoading.succeed("The " + bucket + " is created");
                        return [2 /*return*/, true];
                    case 6:
                        common_1.logger.log("The bucket " + bucket + " is inexistent", 'red');
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        common_1.logger.log('GetBucketInfo Server is Error', 'red');
                        _a.label = 9;
                    case 9: return [2 /*return*/, false];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * upload file
     * @param inputs
     */
    OssComponent.prototype.upload = function (ossClient, staticPath, ossPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, _i, paths_1, p, fillPath, spin, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paths = walk_sync_1.default(staticPath);
                        _i = 0, paths_1 = paths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < paths_1.length)) return [3 /*break*/, 6];
                        p = paths_1[_i];
                        fillPath = path_1.default.resolve(staticPath, p);
                        spin = core_1.spinner(p + " is uploading ");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // eslint-disable-next-line no-await-in-loop
                        return [4 /*yield*/, ossClient.put(p, fillPath)];
                    case 3:
                        // eslint-disable-next-line no-await-in-loop
                        _a.sent();
                        spin.stop();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        spin.fail(p + " has uploaded failed");
                        throw new Error(error_2.message);
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 部署
     * @param inputs
     */
    OssComponent.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, AccessKeyID, AccessKeySecret, ossRegion, ossBucket, ossAcl, ossPrefix, ossCors, ossReferer, allowEmpty, ossReferers, ossSrc, ossStatic, index, error, subDir, ossConfig, ossClient, isContinue, deployLoading, _a, _b, websiteConfig, typeMap, subDirType, _c, result, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        credentials = lodash_1.get(inputs, 'credentials');
                        if (!lodash_1.isEmpty(credentials)) return [3 /*break*/, 2];
                        return [4 /*yield*/, core_1.getCredential(inputs, inputs.project.access)];
                    case 1:
                        credentials = _d.sent();
                        _d.label = 2;
                    case 2:
                        core_1.reportComponent('oss', {
                            uid: credentials.AccountID,
                            command: 'deploy',
                        });
                        common_1.logger.debug("[" + lodash_1.get(inputs, 'project.projectName') + "] inputs params: " + JSON.stringify(inputs, null, 2));
                        AccessKeyID = credentials.AccessKeyID, AccessKeySecret = credentials.AccessKeySecret;
                        ossRegion = "oss-" + lodash_1.get(inputs, 'props.region');
                        ossBucket = lodash_1.get(inputs, 'props.bucket');
                        ossAcl = lodash_1.get(inputs, 'props.acl') || 'private';
                        ossPrefix = lodash_1.get(inputs, 'props.prefix');
                        ossCors = lodash_1.get(inputs, 'props.cors');
                        ossReferer = lodash_1.get(inputs, 'props.referer');
                        allowEmpty = ossReferer.allowEmpty, ossReferers = ossReferer.referers;
                        ossSrc = lodash_1.get(inputs, 'props.codeUri');
                        ossStatic = lodash_1.get(inputs, 'props.static', {});
                        index = ossStatic.index, error = ossStatic.error, subDir = ossStatic.subDir;
                        ossConfig = {
                            accessKeyId: AccessKeyID,
                            accessKeySecret: AccessKeySecret,
                            region: ossRegion,
                        };
                        ossClient = new ali_oss_1.default(ossConfig);
                        return [4 /*yield*/, this.bucketIsExisting(ossClient, ossBucket, ossAcl)];
                    case 3:
                        isContinue = _d.sent();
                        if (!isContinue)
                            return [2 /*return*/];
                        ossClient = new ali_oss_1.default(__assign(__assign({}, ossConfig), { bucket: ossBucket }));
                        deployLoading = core_1.spinner('The Oss is deploying');
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 15, , 16]);
                        // update ossAcl
                        _a = ossAcl;
                        if (!_a) 
                        // update ossAcl
                        return [3 /*break*/, 6];
                        return [4 /*yield*/, ossClient.putBucketACL(ossBucket, ossAcl)];
                    case 5:
                        _a = (_d.sent());
                        _d.label = 6;
                    case 6:
                        // update ossAcl
                        _a;
                        // update ossCors
                        _b = ossCors;
                        if (!_b) 
                        // update ossCors
                        return [3 /*break*/, 8];
                        return [4 /*yield*/, ossClient.putBucketCORS(ossBucket, ossCors)];
                    case 7:
                        _b = (_d.sent());
                        _d.label = 8;
                    case 8:
                        // update ossCors
                        _b;
                        if (!(allowEmpty.toString() && ossReferers)) return [3 /*break*/, 10];
                        return [4 /*yield*/, ossClient.putBucketReferer(ossBucket, allowEmpty, ossReferers)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: 
                    // upload file
                    return [4 /*yield*/, this.upload(ossClient, ossSrc, ossPrefix)];
                    case 11:
                        // upload file
                        _d.sent();
                        websiteConfig = { index: index, error: error };
                        if (subDir && subDir.type) {
                            // supportSubDir ?
                            websiteConfig.supportSubDir = true;
                            typeMap = {
                                noSuchKey: 1,
                                index: 2,
                                redirect: 0,
                            };
                            subDirType = typeMap[subDir.type] || 1;
                            websiteConfig.type = subDirType;
                        }
                        _c = index && error;
                        if (!_c) return [3 /*break*/, 13];
                        return [4 /*yield*/, ossClient.putBucketWebsite(ossBucket, websiteConfig)];
                    case 12:
                        _c = (_d.sent());
                        _d.label = 13;
                    case 13:
                        _c;
                        deployLoading.succeed('OSS static source deployed success');
                        return [4 /*yield*/, ossClient.getBucketWebsite(ossBucket)];
                    case 14:
                        _d.sent();
                        result = {
                            Bucket: ossBucket,
                            Region: lodash_1.get(inputs, 'props.region'),
                            ossAddress: "https://oss.console.aliyun.com/bucket/" + ossRegion + "/" + ossBucket + "/object",
                        };
                        index && (result.indexHtml = "http://" + ossBucket + "." + ossRegion + ".aliyuncs.com/" + index);
                        return [2 /*return*/, result];
                    case 15:
                        e_1 = _d.sent();
                        deployLoading.fail('Oss deploy is Error');
                        return [2 /*return*/, {
                                errMesg: "Oss deploy Error:" + e_1,
                            }];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    return OssComponent;
}(base_1.default));
exports.default = OssComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBMEY7QUFDMUYsaUNBQXNDO0FBQ3RDLG9EQUFnQztBQUNoQyw4Q0FBd0I7QUFFeEIsd0RBQWlDO0FBRWpDLG1DQUFrQztBQUNsQyx1REFBaUM7QUFTakM7SUFBMEMsZ0NBQUk7SUFBOUM7O0lBd0pBLENBQUM7SUF2SkM7OztPQUdHO0lBQ0csdUNBQWdCLEdBQXRCLFVBQXVCLE1BQWlCLEVBQUUsTUFBYyxFQUFFLE1BQTJCO1FBQTNCLHVCQUFBLEVBQUEsa0JBQTJCOzs7Ozs7O3dCQUVqRixxQkFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDbkMsc0JBQU8sSUFBSSxFQUFDOzs7NkJBRVIsQ0FBQSxPQUFLLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFBLEVBQWxDLHdCQUFrQzt3QkFHeEIscUJBQU0sZUFBUSxDQUFDLE1BQU0sQ0FBQztnQ0FDaEM7b0NBQ0UsSUFBSSxFQUFFLFNBQVM7b0NBQ2YsSUFBSSxFQUFFLGNBQWM7b0NBQ3BCLE9BQU8sRUFBRSxnQkFBYyxNQUFNLG1DQUE4QixNQUFNLFVBQU87aUNBQ3pFOzZCQUNGLENBQUMsRUFBQTs7d0JBTkksR0FBRyxHQUFHLFNBTVY7NkJBQ0UsR0FBRyxDQUFDLFlBQVksRUFBaEIsd0JBQWdCO3dCQUVaLGFBQWEsR0FBRyxjQUFPLENBQUMsbUJBQWlCLE1BQU0saUJBQWMsQ0FBQyxDQUFDO3dCQUNyRSxxQkFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBOUIsU0FBOEIsQ0FBQzt3QkFDL0IscUJBQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVB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