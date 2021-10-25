export interface ICredentials {
    accessKeyId: string;
    accessKeySecret: string;
}
export interface IDomain {
    topDomain: string;
    rrDomainName: string;
}
export interface ICdnSource {
    content: string;
    type: 'oss' | 'ipaddr' | 'domain' | 'fc_domain';
    port: number;
}
export interface IDomainParams {
    credentials: ICredentials;
    sources: ICdnSource;
    [key: string]: any;
}
export interface ICertInfo {
    switch: 'on' | 'off';
    certType: 'free' | 'upload' | 'csr';
    certName?: string;
    serverCertificate?: string;
    privateKey?: string;
}
export declare type TForceHttps = 'http' | 'https' | 'default';
export declare type THttp2 = 'on' | 'off';
export interface IHttps {
    certInfo: ICertInfo;
    http2?: 'on' | 'off';
    forceHttps?: TForceHttps;
}
export interface IReferer {
    switch: 'on' | 'off';
    type: 'blacklist' | 'whitelist';
    allowEmpty: boolean;
    rules: string[];
}
export interface IIpFilter {
    switch: 'on' | 'off';
    type: 'blacklist' | 'whitelist';
    rules: string[];
}
export declare enum ForceHttpsEnum {
    http = "http_force",
    https = "https_force"
}
export declare enum RefererEnum {
    whitelist = "referer_white_list_set",
    blacklist = "referer_black_list_set"
}
export declare enum IpFilterEnum {
    whitelist = "ip_allow_list_set",
    blacklist = "ip_black_list_set"
}
export interface IOptimization {
    trim: {
        html: 'on' | 'off';
        css: 'on' | 'off';
        javascript: 'on' | 'off';
    };
    gzip: 'on' | 'off';
    brotli: 'on' | 'off';
}
export interface IRedirects {
    switch: 'on' | 'off';
    source: string;
    destination: string;
}
