import Cdn20180510 from '@alicloud/cdn20180510';
import { ICredentials, ICdnSource, IReferer, IHttps, TForceHttps, THttp2, IIpFilter, IOptimization, IRedirects } from '../common';
export default class Client {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(credentials: ICredentials): Cdn20180510;
    /**
     * 设置edge script灰度配置
     * @param accessKeyId
     * @param accessKeySecret
     */
    static setEsStagingConfig(client: any, { domain, rule }: {
        domain: string;
        rule: string;
    }): Promise<void>;
    /**
     * @description 获取灰度环境配置信息
     * @param credentials
     */
    static describeCdnDomainStagingConfig(client: any, domain: string): Promise<any>;
    /**
     * 将edge script灰度配置发布到线上环境
     * @param credentials
     */
    static publishEsStagingConfigToProduction(client: any, domain: string): Promise<void>;
    /**
     * @description 获取CDN域名的详细信息
     * @param credentials
     */
    static describeCdnDomainDetail(client: any, domain: string): Promise<any>;
    /**
     * @description 域名归属校验
     * @param client
     * @param param1
     */
    static verifyDomainOwner(client: any, { domain, verifyType }: {
        domain: string;
        verifyType?: string;
    }): Promise<any>;
    /**
     * 删除域名
     * @param client
     * @param domain
     */
    static deleteCdnDomain(client: any, domain: string, isThrowError: boolean): Promise<void>;
    /**
     * @description 添加CDN域名
     * @param client
     * @param param1
     */
    static addCDNDomain(client: any, { domain, sources }: {
        domain: string;
        sources: ICdnSource;
    }): Promise<void>;
    /**
     * @description 修改添加CDN域名
     * @param client
     * @param param1
     */
    static modifyCdnDomain(client: any, { domain, sources }: {
        domain: string;
        sources?: ICdnSource;
    }): Promise<void>;
    /**
     * @description 增加HTTP证书
     * @param client
     * @param param1
     */
    static setDomainServerCertificate(client: any, { domain, https }: {
        domain: string;
        https?: IHttps;
    }): Promise<void>;
    static setCdnDomainHttp2(client: any, { domain, http2 }: {
        domain: string;
        http2: THttp2;
    }): Promise<void>;
    /**
     * @description 删除加速域名的配置
     * @param client
     * @param param1
     */
    static DeleteSpecificConfig(client: any, { domain, configId }: {
        domain: string;
        configId: string;
    }): Promise<any>;
    /**
     * @description 获取加速域名的配置信息。
     * @param client
     * @param param1
     */
    static DescribeCdnDomainConfigs(client: any, { domain, functionNames }: {
        domain: string;
        functionNames: string;
    }): Promise<any>;
    /**
     * @description 获取用户的加速域名信息
     * @param client
     * @param param1
     */
    static DescribeUserDomains(client: any, { domain, checkDomainShow }: {
        domain: string;
        checkDomainShow: boolean;
    }): Promise<any>;
    /**
     * @description 强制HTTPS跳转
     * @param client
     * @param param1
     */
    static setCdnDomainForceHttps(client: any, { domain, forceHttps }: {
        domain: string;
        forceHttps: TForceHttps;
    }): Promise<void>;
    /**
     * @description Referer防盗链
     * @param client
     * @param param1
     */
    static setCdnDomainReferer(client: any, { domain, referer }: {
        domain: string;
        referer: IReferer;
    }): Promise<any>;
    /**
     * @description IP黑/白名单
     * @param client
     * @param param1
     */
    static setCdnDomainIpFilter(client: any, { domain, ipFilter }: {
        domain: string;
        ipFilter: IIpFilter;
    }): Promise<any>;
    /**
     * @description UA黑/白名单
     * @param client
     * @param param1
     */
    static setCdnDomainUaFilter(client: any, { domain, uaFilter }: {
        domain: string;
        uaFilter: IIpFilter;
    }): Promise<any>;
    /**
     * @description 性能优化
     * @param client
     * @param param1
     */
    static setCdnDomainOptimization(client: any, { domain, optimization }: {
        domain: string;
        optimization: IOptimization;
    }): Promise<void>;
    /**
     * @description 重定向
     * @param client
     * @param param1
     */
    static setCdnDomainRedirects(client: any, { domain, redirects }: {
        domain: string;
        redirects: IRedirects[];
    }): Promise<void>;
}
