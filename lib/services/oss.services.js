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
exports.put = exports.bucketIsExisting = exports.buildSpawnSync = void 0;
var ali_oss_1 = __importDefault(require("ali-oss"));
var core_1 = require("@serverless-devs/core");
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var common_1 = require("../common");
var walk_sync_1 = __importDefault(require("walk-sync"));
var fs_extra_1 = __importDefault(require("fs-extra"));
exports.default = (function (ossConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var bucket, region, accessKeyId, accessKeySecret, src, cors, ossClient, location, ossConfigObj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bucket = ossConfig.bucket, region = ossConfig.region, accessKeyId = ossConfig.accessKeyId, accessKeySecret = ossConfig.accessKeySecret, src = ossConfig.src, cors = ossConfig.cors;
                if (!src.buildCommand) return [3 /*break*/, 2];
                return [4 /*yield*/, buildSpawnSync(src.buildCommand, src.codeUri)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                ossClient = new ali_oss_1.default({
                    bucket: bucket,
                    region: "oss-" + region,
                    accessKeyId: accessKeyId,
                    accessKeySecret: accessKeySecret,
                });
                // bucket, 不存在此bucket,则创建: 并且加上权限
                return [4 /*yield*/, getOrCreateBucket(ossClient, bucket)];
            case 3:
                // bucket, 不存在此bucket,则创建: 并且加上权限
                _a.sent();
                return [4 /*yield*/, ossClient.getBucketLocation(bucket)];
            case 4:
                location = _a.sent();
                ossClient = new ali_oss_1.default({
                    bucket: bucket,
                    region: location.location,
                    accessKeyId: accessKeyId,
                    accessKeySecret: accessKeySecret,
                });
                // 文件上传
                return [4 /*yield*/, put(ossClient, src.publishDir)];
            case 5:
                // 文件上传
                _a.sent();
                ossConfigObj = { index: src.index, error: src.error };
                if (src.subDir && src.subDir.type) {
                    ossConfigObj['supportSubDir'] = true;
                    ossConfigObj['type'] =
                        {
                            noSuchKey: 1,
                            index: 2,
                            redirect: 0,
                        }[src.subDir.type] || 1;
                }
                return [4 /*yield*/, ossClient.putBucketWebsite(bucket, ossConfigObj)];
            case 6:
                _a.sent();
                if (!cors) return [3 /*break*/, 8];
                return [4 /*yield*/, ossClient.putBucketCORS(bucket, cors)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
function buildSpawnSync(hook, src) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = child_process_1.spawnSync(hook, [], {
                cwd: path_1.default.resolve(process.cwd(), src),
                stdio: 'inherit',
                shell: true,
            });
            if (result && result.status !== 0) {
                throw Error('> Execute Error');
            }
            return [2 /*return*/];
        });
    });
}
exports.buildSpawnSync = buildSpawnSync;
/**
 * bucket is existing?
 * @param : client, bucket, ossAcl = 'private'
 */
function bucketIsExisting(client, bucket, ossAcl) {
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
}
exports.bucketIsExisting = bucketIsExisting;
/**
 * upload file
 * @param ossClient staticPath  subDir
 */
function put(ossClient, staticPath, subDir) {
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
                    assignedOssdir = subDir ? subDir + "/" + p : p;
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
}
exports.put = put;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3NzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL29zcy5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBZ0M7QUFDaEMsOENBQTBEO0FBQzFELDhDQUF3QjtBQUN4QiwrQ0FBMEM7QUFDMUMsb0NBQW1DO0FBQ25DLHdEQUFpQztBQUNqQyxzREFBMEI7QUFrRDFCLG1CQUFlLFVBQU8sU0FBcUI7Ozs7O2dCQUNqQyxNQUFNLEdBQXNELFNBQVMsT0FBL0QsRUFBRSxNQUFNLEdBQThDLFNBQVMsT0FBdkQsRUFBRSxXQUFXLEdBQWlDLFNBQVMsWUFBMUMsRUFBRSxlQUFlLEdBQWdCLFNBQVMsZ0JBQXpCLEVBQUUsR0FBRyxHQUFXLFNBQVMsSUFBcEIsRUFBRSxJQUFJLEdBQUssU0FBUyxLQUFkLENBQWU7cUJBQzFFLEdBQUcsQ0FBQyxZQUFZLEVBQWhCLHdCQUFnQjtnQkFDbEIscUJBQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFBOztnQkFBbkQsU0FBbUQsQ0FBQzs7O2dCQUdsRCxTQUFTLEdBQUcsSUFBSSxpQkFBUyxDQUFDO29CQUM1QixNQUFNLFFBQUE7b0JBQ04sTUFBTSxFQUFFLFNBQU8sTUFBUTtvQkFDdkIsV0FBVyxhQUFBO29CQUNYLGVBQWUsaUJBQUE7aUJBQ2hCLENBQUMsQ0FBQztnQkFFSCxpQ0FBaUM7Z0JBQ2pDLHFCQUFNLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBQTs7Z0JBRDFDLGlDQUFpQztnQkFDakMsU0FBMEMsQ0FBQztnQkFFMUIscUJBQU0sU0FBUyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFBOztnQkFBcEQsUUFBUSxHQUFHLFNBQXlDO2dCQUMxRCxTQUFTLEdBQUcsSUFBSSxpQkFB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