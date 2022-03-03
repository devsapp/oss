import Cdn20180510 from '@alicloud/cdn20180510';
import { ICredentials, ICdnSource, IReferer, IHttps, TForceHttps, THttp2, IIpFilter, IOptimization, IRedirects } from '../common';
export default class Client {
    /**
     * AK&SK Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(credentials: ICredentials): Cdn20180510;
    /**
     * edge script grey config
     * @param accessKeyId
     * @param accessKeySecret
     */
    static setEsStagingConfig(client: any, { domain, rule }: {
        domain: string;
        rule: string;
    }): Promise<void>;
    /**
     * @description get grey env info
     * @param credentials
     */
    static describeCdnDomainStagingConfig(client: any, domain: string): Promise<any>;
    /**
     * make edge script grey config to prod
     * @param credentials
     */
    static publishEsStagingConfigToProduction(client: any, domain: string): Promise<void>;
    /**
     * @description get cdn domain info
     * @param credentials
     */
    static describeCdnDomainDetail(client: any, domain: string): Promise<any>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static verifyDomainOwner(client: any, { domain, verifyType }: {
        domain: string;
        verifyType?: string;
    }): Promise<any>;
    /**
     *
     * @param client
     * @param domain
     */
    static deleteCdnDomain(client: any, domain: string, isThrowError: boolean): Promise<void>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static addCDNDomain(client: any, { domain, sources }: {
        domain: string;
        sources: ICdnSource;
    }): Promise<void>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static modifyCdnDomain(client: any, { domain, sources }: {
        domain: string;
        sources?: ICdnSource;
    }): Promise<void>;
    /**
     * @description
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
     * @description
     * @param client
     * @param param1
     */
    static DeleteSpecificConfig(client: any, { domain, configId }: {
        domain: string;
        configId: string;
    }): Promise<any>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static DescribeCdnDomainConfigs(client: any, { domain, functionNames }: {
        domain: string;
        functionNames: string;
    }): Promise<any>;
    /**
     * @description
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
     * @description
     * @param client
     * @param param1
     */
    static setCdnDomainReferer(client: any, { domain, referer }: {
        domain: string;
        referer: IReferer;
    }): Promise<any>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static setCdnDomainIpFilter(client: any, { domain, ipFilter }: {
        domain: string;
        ipFilter: IIpFilter;
    }): Promise<any>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static setCdnDomainUaFilter(client: any, { domain, uaFilter }: {
        domain: string;
        uaFilter: IIpFilter;
    }): Promise<any>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static setCdnDomainOptimization(client: any, { domain, optimization }: {
        domain: string;
        optimization: IOptimization;
    }): Promise<void>;
    /**
     * @description
     * @param client
     * @param param1
     */
    static setCdnDomainRedirects(client: any, { domain, redirects }: {
        domain: string;
        redirects: IRedirects[];
    }): Promise<void>;
}
