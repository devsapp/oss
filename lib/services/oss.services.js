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
var ali_oss_1 = __importDefault(require("ali-oss"));
var core_1 = require("@serverless-devs/core");
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var common_1 = require("../common");
var walk_sync_1 = __importDefault(require("walk-sync"));
var child_process_1 = require("child_process");
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
function put(ossClient, staticPath) {
    return __awaiter(this, void 0, void 0, function () {
        var paths, _i, paths_1, p, fillPath, stat, spin, error_1;
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
                    spin = core_1.spinner("\u4E0A\u4F20 " + p);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, ossClient.put(p, fillPath)];
                case 3:
                    _a.sent();
                    spin.stop();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    spin.fail();
                    throw new Error(error_1.message);
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getOrCreateBucket(ossClient, bucket) {
    return __awaiter(this, void 0, void 0, function () {
        var acl, error_2, vm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 11]);
                    return [4 /*yield*/, ossClient.getBucketInfo(bucket)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ossClient.getBucketACL(bucket)];
                case 2:
                    acl = (_a.sent()).acl;
                    if (!(acl !== 'public-read')) return [3 /*break*/, 4];
                    return [4 /*yield*/, ossClient.putBucketACL(bucket, 'public-read')];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 11];
                case 5:
                    error_2 = _a.sent();
                    if (!(error_2.code === 'NoSuchBucket')) return [3 /*break*/, 9];
                    vm = core_1.spinner("Create " + bucket + " bucket");
                    return [4 /*yield*/, ossClient.putBucket(bucket)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, ossClient.putBucketACL(bucket, 'public-read')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, ossClient.putBucketCORS(bucket, common_1.PUT_BUCKET_CORS)];
                case 8:
                    _a.sent();
                    vm.succeed();
                    return [3 /*break*/, 10];
                case 9: throw new Error(error_2.message);
                case 10: return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3NzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL29zcy5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUFnQztBQUNoQyw4Q0FBZ0Q7QUFDaEQsOENBQXdCO0FBQ3hCLHNEQUEwQjtBQUMxQixvQ0FBNEM7QUFDNUMsd0RBQWlDO0FBQ2pDLCtDQUEwQztBQWdEMUMsbUJBQWUsVUFBTyxTQUFxQjs7Ozs7Z0JBQ2pDLE1BQU0sR0FBc0QsU0FBUyxPQUEvRCxFQUFFLE1BQU0sR0FBOEMsU0FBUyxPQUF2RCxFQUFFLFdBQVcsR0FBaUMsU0FBUyxZQUExQyxFQUFFLGVBQWUsR0FBZ0IsU0FBUyxnQkFBekIsRUFBRSxHQUFHLEdBQVcsU0FBUyxJQUFwQixFQUFFLElBQUksR0FBSyxTQUFTLEtBQWQsQ0FBZTtxQkFDMUUsR0FBRyxDQUFDLFlBQVksRUFBaEIsd0JBQWdCO2dCQUNsQixxQkFBTSxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUE7O2dCQUFuRCxTQUFtRCxDQUFDOzs7Z0JBR2xELFNBQVMsR0FBRyxJQUFJLGlCQUFTLENBQUM7b0JBQzVCLE1BQU0sUUFBQTtvQkFDTixNQUFNLEVBQUUsU0FBTyxNQUFRO29CQUN2QixXQUFXLGFBQUE7b0JBQ1gsZUFBZSxpQkFBQTtpQkFDaEIsQ0FBQyxDQUFDO2dCQUVILGlDQUFpQztnQkFDakMscUJBQU0saUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFBOztnQkFEMUMsaUNBQWlDO2dCQUNqQyxTQUEwQyxDQUFDO2dCQUUxQixxQkFBTSxTQUFTLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUE7O2dCQUFwRCxRQUFRLEdBQUcsU0FBeUM7Z0JBQzFELFNBQVMsR0FBRyxJQUFJLGlCQUFT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