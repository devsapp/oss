import Alidns20150109 from '@alicloud/alidns20150109';
import { ICredentials } from '../common';
export interface IAddDomainRecord {
    domainName: string;
    RR: string;
    type: 'A' | 'NS' | 'MX' | 'TXT' | 'CNAME' | 'SRV' | 'AAAA' | 'CAA' | 'REDIRECT_URL' | 'FORWARD_URL';
    value: string;
}
export default class Client {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(credentials: ICredentials): Alidns20150109;
    static addDomainRecord(client: any, addDomainRecordParams: IAddDomainRecord): Promise<any>;
    static describeDomainInfo(client: any, domain: string): Promise<any>;
}
