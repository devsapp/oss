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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputs = exports.bindDomain = exports.put = exports.bucketIsExisting = exports.buildSpawnSync = void 0;
var core_1 = require("@serverless-devs/core");
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var common_1 = require("../common");
var walk_sync_1 = __importDefault(require("walk-sync"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var lodash_1 = require("lodash");
var domain_service_1 = __importDefault(require("../services/domain.service"));
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
function bucketIsExisting(client, bucket, ossAcl, argsData) {
    if (ossAcl === void 0) { ossAcl = 'private'; }
    return __awaiter(this, void 0, void 0, function () {
        var assumeYes, error_1, autoCreateObj, createLoading;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assumeYes = argsData.y || argsData.assumeYes || argsData['assume-yes'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 13]);
                    return [4 /*yield*/, client.getBucketInfo(bucket)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    if (!(error_1.name === 'NoSuchBucketError')) return [3 /*break*/, 11];
                    autoCreateObj = { needToCreate: false };
                    if (!assumeYes) return [3 /*break*/, 4];
                    autoCreateObj = { needToCreate: true };
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, core_1.inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'needToCreate',
                            message: "The bucket " + bucket + " is inexistent, create the " + bucket + " now?",
                        },
                    ])];
                case 5:
                    autoCreateObj = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!autoCreateObj.needToCreate) return [3 /*break*/, 9];
                    createLoading = core_1.spinner("The bucket of " + bucket + " is creating");
                    return [4 /*yield*/, client.putBucket(bucket)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, client.putBucketACL(bucket, ossAcl)];
                case 8:
                    _a.sent();
                    createLoading.succeed("The " + bucket + " is created");
                    return [2 /*return*/, true];
                case 9:
                    common_1.logger.log("The bucket " + bucket + " is inexistent", 'red');
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    common_1.logger.log('GetBucketInfo Server is Error', 'red');
                    _a.label = 12;
                case 12: return [2 /*return*/, false];
                case 13: return [2 /*return*/];
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
/**
 * domain
 * @param inputs
 * 全不变量植入domain组件，会报错，所以只获取domain相关的参数
 */
function bindDomain(inputs, ossBucket) {
    return __awaiter(this, void 0, void 0, function () {
        var props, Properties, rest, _a, region, customDomains, hosts, domianProps, domainParms, domains, report_content, result, i, tempUrl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    props = inputs.props, Properties = inputs.Properties, rest = __rest(inputs, ["props", "Properties"]);
                    _a = lodash_1.get(inputs, 'props', {}), region = _a.region, customDomains = _a.customDomains;
                    hosts = lodash_1.map(customDomains, function (child) { return (__assign({ host: child.domainName }, child)); });
                    domianProps = {
                        bucket: ossBucket,
                        region: region,
                        hosts: hosts,
                    };
                    domainParms = __assign({ props: domianProps, Properties: domianProps }, rest);
                    return [4 /*yield*/, domain_service_1.default(domainParms)];
                case 1:
                    domains = _b.sent();
                    report_content = {
                        oss: [
                            {
                                region: lodash_1.get(inputs, 'props.region'),
                                bucket: lodash_1.get(inputs, 'props.bucket'),
                            },
                        ],
                    };
                    result = {
                        Region: lodash_1.get(inputs, 'props.region'),
                        Bucket: lodash_1.get(inputs, 'props.bucket'),
                    };
                    if (domains.length > 0) {
                        result['Domains'] = domains;
                        report_content['url'] = [];
                        report_content['cdn'] = [];
                        for (i = 0; i < domains.length; i++) {
                            tempUrl = {};
                            tempUrl["Domain_" + i] = domains[i];
                            report_content['url'].push(tempUrl);
                            report_content['cdn'].push({
                                region: lodash_1.get(inputs, 'props.region'),
                                domain: domains[i],
                            });
                        }
                    }
                    return [2 /*return*/, {
                            domains: domains,
                            reportContent: {
                                name: 'oss',
                                access: inputs.project.access,
                                content: result,
                            },
                        }];
            }
        });
    });
}
exports.bindDomain = bindDomain;
function handleInputs(inputs) {
    var parsedArgs = core_1.commandParse(inputs, {
        boolean: ['help', 'assume-yes'],
        string: ['type'],
        alias: { help: ['h', 'H'], 'assume-yes': ['y', 'Y'] },
    });
    var argsData = (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.data) || {};
    return argsData;
}
exports.handleInputs = handleInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3NzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL29zcy5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsOENBQXdFO0FBQ3hFLDhDQUF3QjtBQUN4QiwrQ0FBMEM7QUFDMUMsb0NBQW1DO0FBQ25DLHdEQUFpQztBQUVqQyxzREFBMEI7QUFDMUIsaUNBQWtDO0FBQ2xDLDhFQUFnRDtBQXNEaEQsU0FBc0IsY0FBYyxDQUFDLElBQVksRUFBRSxHQUFXOzs7O1lBQ3RELE1BQU0sR0FBRyx5QkFBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQ2pDLEdBQUcsRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUM7Z0JBQ3JDLEtBQUssRUFBRSxTQUFTO2dCQUNoQixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQztZQUNILElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ2hDOzs7O0NBQ0Y7QUFURCx3Q0FTQztBQUNEOzs7R0FHRztBQUNILFNBQXNCLGdCQUFnQixDQUNwQyxNQUFpQixFQUNqQixNQUFjLEVBQ2QsTUFBMkIsRUFDM0IsUUFBMEI7SUFEMUIsdUJBQUEsRUFBQSxrQkFBMkI7Ozs7OztvQkFHckIsU0FBUyxHQUFZLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7b0JBRXBGLHFCQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUE7O29CQUFsQyxTQUFrQyxDQUFDO29CQUNuQyxzQkFBTyxJQUFJ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