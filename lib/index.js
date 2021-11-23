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
var fs_extra_1 = __importDefault(require("fs-extra"));
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
    OssComponent.prototype.upload = function (ossClient, staticPath) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, _i, paths_1, p, fillPath, stat, spin, error_2;
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
                        stat = fs_extra_1.default.statSync(fillPath);
                        if (!stat.isFile()) return [3 /*break*/, 5];
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
            var credentials, AccessKeyID, AccessKeySecret, ossRegion, ossBucket, ossAcl, ossCors, ossReferer, allowEmpty, ossReferers, ossSrc, ossStatic, index, error, subDir, ossConfig, ossClient, isContinue, deployLoading, _a, _b, websiteConfig, typeMap, subDirType, _c, result, e_1;
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
                    return [4 /*yield*/, this.upload(ossClient, ossSrc)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBMEY7QUFDMUYsaUNBQXNDO0FBQ3RDLG9EQUFnQztBQUNoQyw4Q0FBd0I7QUFDeEIsc0RBQTBCO0FBQzFCLHdEQUFpQztBQUVqQyxtQ0FBa0M7QUFDbEMsdURBQWlDO0FBU2pDO0lBQTBDLGdDQUFJO0lBQTlDOztJQTBKQSxDQUFDO0lBekpDOzs7T0FHRztJQUNHLHVDQUFnQixHQUF0QixVQUF1QixNQUFpQixFQUFFLE1BQWMsRUFBRSxNQUEyQjtRQUEzQix1QkFBQSxFQUFBLGtCQUEyQjs7Ozs7Ozt3QkFFakYscUJBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBQ25DLHNCQUFPLElBQUksRUFBQzs7OzZCQUVSLENBQUEsT0FBSyxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQSxFQUFsQyx3QkFBa0M7d0JBR3hCLHFCQUFNLGVBQVEsQ0FBQyxNQUFNLENBQUM7Z0NBQ2hDO29DQUNFLElBQUksRUFBRSxTQUFTO29DQUNmLElBQUksRUFBRSxjQUFjO29DQUNwQixPQUFPLEVBQUUsZ0JBQWMsTUFBTSxtQ0FBOEIsTUFBTSxVQUFPO2lDQUN6RTs2QkFDRixDQUFDLEVBQUE7O3dCQU5JLEdBQUcsR0FBRyxTQU1WOzZCQUNFLEdBQUcsQ0FBQyxZQUFZLEVBQWhCLHdCQUFnQjt3QkFFWixhQUFhLEdBQUcsY0FBTyxDQUFDLG1CQUFpQixNQUFNLGlCQUFjLENBQUMsQ0FBQzt3QkFDckUscUJBQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQTlCLFNBQThCLENBQUM7d0JBQy9CLHFCQUFNLE1BQU0sQ0FBQyxZQUFZ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