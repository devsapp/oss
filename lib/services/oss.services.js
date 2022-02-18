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
var core_1 = require("@serverless-devs/core");
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var common_1 = require("../common");
var walk_sync_1 = __importDefault(require("walk-sync"));
var fs_extra_1 = __importDefault(require("fs-extra"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3NzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL29zcy5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSw4Q0FBMEQ7QUFDMUQsOENBQXdCO0FBQ3hCLCtDQUEwQztBQUMxQyxvQ0FBbUM7QUFDbkMsd0RBQWlDO0FBQ2pDLHNEQUEwQjtBQWtEMUIsU0FBc0IsY0FBYyxDQUFDLElBQVksRUFBRSxHQUFXOzs7O1lBQ3RELE1BQU0sR0FBRyx5QkFBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQ2pDLEdBQUcsRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUM7Z0JBQ3JDLEtBQUssRUFBRSxTQUFTO2dCQUNoQixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQztZQUNILElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ2hDOzs7O0NBQ0Y7QUFURCx3Q0FTQztBQUNEOzs7R0FHRztBQUNILFNBQXNCLGdCQUFnQixDQUNwQyxNQUFpQixFQUNqQixNQUFjLEVBQ2QsTUFBMkI7SUFBM0IsdUJBQUEsRUFBQSxrQkFBMkI7Ozs7Ozs7b0JBR3pCLHFCQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUE7O29CQUFsQyxTQUFrQyxDQUFDO29CQUNuQyxzQkFBTyxJQUFJLEVBQUM7Ozt5QkFFUixDQUFBLE9BQUssQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUEsRUFBbEMsd0JBQWtDO29CQUd4QixxQkFBTSxlQUFRLENBQUMsTUFBTSxDQUFDOzRCQUNoQztnQ0FDRSxJQUFJLEVBQUUsU0FBUztnQ0FDZixJQUFJLEVBQUUsY0FBYztnQ0FDcEIsT0FBTyxFQUFFLGdCQUFjLE1BQU0sbUNBQThCLE1BQU0sVUFBTzs2QkFDekU7eUJBQ0YsQ0FBQyxFQUFBOztvQkFOSSxHQUFHLEdBQUcsU0FNVjt5QkFDRSxHQUFHLENBQUMsWUFBWSxFQUFoQix3QkFBZ0I7b0JBRVosYUFBYSxHQUFHLGNBQU8sQ0FBQyxtQkFBaUIsTUFBTSxpQkFBYyxDQUFDLENBQUM7b0JBQ3JFLHFCQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUE7O29CQUE5QixTQUE4QixDQUFDO29CQUMvQixxQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBQTs7b0JBQXpDLFNBQXlDLENBQUM7b0JBQzFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBTyxNQUFNLGdCQUFhLENBQUMsQ0FBQztvQkFDbEQsc0JBQU8sSUFBSSxFQUFDOztvQkFFWixlQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFjLE1BQU0sbUJBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7b0JBRzFELGVBQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsS0FBSyxDQUFDLENBQUM7O3dCQUVyRCxzQkFBTyxLQUFLLEVBQUM7Ozs7O0NBRWhCO0FBbENELDRDQWtDQztBQUVEOzs7R0FHRztBQUNILFNBQXNCLEdBQUcsQ0FBQyxTQUFvQixFQUFFLFVBQWtCLEVBQUUsTUFBYzs7Ozs7O29CQUMxRSxLQUFLLEdBQUcsbUJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzswQkFDZCxFQUFMLGVBQUs7Ozt5QkFBTCxDQUFBLG1CQUFLLENBQUE7b0JBQVYsQ0FBQztvQkFDSixRQUFRLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBV3ZDLElBQUksR0FBRyxrQkFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDL0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFiLHdCQUFhO29CQUNULElBQUksR0FBRyxjQUFPLENBQUksQ0FBQyxtQkFBZ0IsQ0FBQyxDQUFDOzs7O29CQUVuQyxjQUFjLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBSSxNQUFNLFNBQUksQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELDRDQUE0QztvQkFDNUMscUJBQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLEVBQUE7O29CQUQ3Qyw0Q0FBNEM7b0JBQzVDLFNBQTZDLENBQUM7b0JBQzlDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7OztvQkFFWixJQUFJLENBQUMsSUFBSSxDQUFJLENBQUMseUJBQXNCLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7O29CQXRCckIsSUFBSyxDQUFBOzs7Ozs7Q0EwQnRCO0FBNUJELGtCQTRCQyJ9