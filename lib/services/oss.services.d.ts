import OssClient from 'ali-oss';
import { InputProps } from '../common/entity';
interface ISrc {
    subDir: any;
    publishDir: string;
    codeUri?: string;
    buildCommand?: string;
    index?: string;
    error?: string;
}
export interface IOssConfig {
    accessKeyId: string;
    accessKeySecret: string;
    region?: string;
    bucket?: string;
    cors?: OssClient.CORSRule[];
    src?: ISrc;
    acl?: string;
    cname?: boolean;
    endpoint?: string;
}
export interface IOssStatic {
    index: string;
    error?: string;
    subDir?: ISubDir;
}
export interface IOssRes {
    Bucket: string;
    Region: string;
    OssAddress?: string;
    Domains?: string | string[];
}
export declare type ACLType = 'public-read-write' | 'public-read' | 'private';
export interface ISubDir {
    type: string;
}
export interface IwebsiteConfig {
    index: string;
    error?: string;
    supportSubDir?: boolean;
    type?: number;
    subDirType?: number;
}
export interface IResBucket {
    remoteAddress: string;
    remotePort?: string;
    requestUrls?: string;
}
export declare function buildSpawnSync(hook: string, src: string): Promise<void>;
/**
 * bucket is existing?
 * @param : client, bucket, ossAcl = 'private'
 */
export declare function bucketIsExisting(client: OssClient, bucket: string, ossAcl?: ACLType): Promise<boolean>;
/**
 * upload file
 * @param ossClient staticPath  subDir
 */
export declare function put(ossClient: OssClient, staticPath: string, subDir: string): Promise<void>;
/**
 * domain
 * @param inputs
 * 全不变量植入domain组件，会报错，所以只获取domain相关的参数
 */
export declare function bindDomain(inputs: InputProps): Promise<{
    domains: any[];
    reportContent: {
        name: string;
        access: string;
        content: {
            Region: any;
            Bucket: any;
        };
    };
}>;
export {};
