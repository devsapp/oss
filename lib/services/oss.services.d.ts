import OssClient from 'ali-oss';
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
    region: string;
    bucket?: string;
    cors?: OssClient.CORSRule[];
    src?: ISrc;
    acl?: string;
}
export interface IOssStatic {
    index: string;
    error?: string;
    subDir?: ISubDir;
}
export interface IOssRes {
    Bucket: string;
    Region: string;
    ossAddress: string;
    indexHtml?: string;
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
declare const _default: (ossConfig: IOssConfig) => Promise<void>;
export default _default;
