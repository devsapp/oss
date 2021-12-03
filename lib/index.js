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
     * @param ossClient staticPath  ossObject
     */
    OssComponent.prototype.upload = function (ossClient, staticPath, ossObject) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, _i, paths_1, p, fillPath, stat, spin, assignedOssdir, error_2;
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
                        assignedOssdir = ossObject ? ossObject + "/" + p : p;
                        // eslint-disable-next-line no-await-in-loop
                        return [4 /*yield*/, ossClient.put(assignedOssdir, fillPath)];
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
     * deploy
     * @param inputs
     */
    OssComponent.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, AccessKeyID, AccessKeySecret, ossRegion, ossBucket, ossAcl, ossConfig, ossClient, isContinue, deployLoading, ossCors, _a, ossReferer, _b, allowEmpty, _c, ossReferers, ossSrc, ossObject, ossStatic, _d, index, _e, error, _f, subDir, websiteConfig, typeMap, subDirType, ossEndpoint, result, e_1;
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
                        return [4 /*yield*/, this.bucketIsExisting(ossClient, ossBucket, ossAcl)];
                    case 3:
                        isContinue = _g.sent();
                        if (!isContinue)
                            return [2 /*return*/];
                        ossClient = new ali_oss_1.default(__assign(__assign({}, ossConfig), { bucket: ossBucket }));
                        deployLoading = core_1.spinner('The Oss is deploying');
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, 12, , 13]);
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
                        ossObject = lodash_1.get(inputs, 'props.ossObject');
                        return [4 /*yield*/, this.upload(ossClient, ossSrc, ossObject)];
                    case 9:
                        _g.sent();
                        ossStatic = lodash_1.get(inputs, 'props.static', {});
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
                        deployLoading.succeed('OSS static source deployed success');
                        ossEndpoint = lodash_1.get(inputs, 'props.endpoint');
                        console.log('ossEndpoint', ossEndpoint);
                        // 校验域名是否可以自动添加CNAME记录
                        // DNS DOMAIN client.useBucket('examplebucket')
                        ossClient = new ali_oss_1.default({
                            accessKeyId: AccessKeyID,
                            accessKeySecret: AccessKeySecret,
                            endpoint: ossEndpoint,
                            cname: true,
                        });
                        return [4 /*yield*/, ossClient.useBucket(ossBucket)];
                    case 11:
                        _g.sent();
                        result = {
                            Bucket: ossBucket,
                            Region: lodash_1.get(inputs, 'props.region'),
                            ossAddress: "https://oss.console.aliyun.com/bucket/" + ossRegion + "/" + ossBucket + "/object",
                        };
                        index && (result.indexHtml = "http://" + ossBucket + "." + ossRegion + ".aliyuncs.com/" + index);
                        return [2 /*return*/, result];
                    case 12:
                        e_1 = _g.sent();
                        deployLoading.fail('Oss deploy is Error');
                        return [2 /*return*/, {
                                errMesg: "Oss deploy Error:" + e_1,
                            }];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return OssComponent;
}(base_1.default));
exports.default = OssComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FNK0I7QUFDL0IsaUNBQXNDO0FBQ3RDLG9EQUFnQztBQUNoQyw4Q0FBd0I7QUFDeEIsc0RBQTBCO0FBQzFCLHdEQUFpQztBQUVqQyxtQ0FBa0M7QUFDbEMsdURBQWlDO0FBU2pDO0lBQTBDLGdDQUFJO0lBQTlDOztJQXNLQSxDQUFDO0lBcktDOzs7T0FHRztJQUNHLHVDQUFnQixHQUF0QixVQUF1QixNQUFpQixFQUFFLE1BQWMsRUFBRSxNQUEyQjtRQUEzQix1QkFBQSxFQUFBLGtCQUEyQjs7Ozs7Ozt3QkFFakYscUJBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBQ25DLHNCQUFPLElBQUksRUFBQzs7OzZCQUVSLENBQUEsT0FBSyxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQSxFQUFsQyx3QkFBa0M7d0JBR3hCLHFCQUFNLGVBQVEsQ0FBQyxNQUFNLENBQUM7Z0NBQ2hDO29DQUNFLElBQUksRUFBRSxTQUFTO29DQUNmLElBQUksRUFBRSxjQUFjO29DQUNwQixPQUFPLEVBQUUsZ0JBQWMsTUFBTSxtQ0FBOEIsTUFBTSxVQUFPO2lDQUN6RTs2QkFDRixDQUFDLEVBQUE7O3dCQU5JLEdBQUcsR0FBRyxTQU1WOzZCQUNFLEdBQUcsQ0FBQyxZQUFZLEVBQWhCLHdCQUFnQjt3QkFFWixhQUFhLEdBQUcsY0FBTyxDQUFDLG1CQUFpQixNQUFNLGlCQUFjLENBQUMsQ0FBQzt3QkFDckUscUJBQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQTlCLFNBQThCLENBQUM7d0JBQy9CLHFCQUFNLE1BQU0sQ0FBQyxZQUFZ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