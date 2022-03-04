/* eslint-disable @typescript-eslint/indent */
import Alidns20150109, * as $Alidns20150109 from '@alicloud/alidns20150109';
import * as $OpenApi from '@alicloud/openapi-client';
import { ICredentials } from '../common';
import { logger } from '../common';

export interface IAddDomainRecord {
  domainName: string;
  RR: string;
  type:
    | 'A'
    | 'NS'
    | 'MX'
    | 'TXT'
    | 'CNAME'
    | 'SRV'
    | 'AAAA'
    | 'CAA'
    | 'REDIRECT_URL'
    | 'FORWARD_URL';
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
  static createClient(credentials: ICredentials): Alidns20150109 {
    const { accessKeyId, accessKeySecret, securityToken } = credentials;
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
      securityToken
    });
    // 访问的域名
    config.endpoint = 'dns.aliyuncs.com';
    return new Alidns20150109(config);
  }

  static async addDomainRecord(client, addDomainRecordParams: IAddDomainRecord): Promise<any> {
    const addDomainRecordRequest = new $Alidns20150109.AddDomainRecordRequest(
      addDomainRecordParams,
    );
    try {
      const result = await client.addDomainRecord(addDomainRecordRequest);
      return result;
    } catch (error) {
      logger.warn(`使用阿里DNS解析失败, 请手动配置CNAME${addDomainRecordParams.value}`);
    }
  }

  static async describeDomainInfo(client, domain: string): Promise<any> {
    const describeDomainInfoRequest = new $Alidns20150109.DescribeDomainInfoRequest({
      domainName: domain,
    });
    const result = await client.describeDomainInfo(describeDomainInfoRequest);
    return result;
  }

  // static async removeCDNDomain(client, domain: string): Promise<void> {
  //   const deleteDomainRequest = new $Alidns20150109.DeleteDomainRequest({ domainName: domain });
  //   // 复制代码运行请自行打印 API 的返回值
  //   try {
  //     await client.deleteDomain(deleteDomainRequest);
  //   } catch (error) {
  //     console.log(error);
  //     // 删除域名不影响正常流程
  //   }
  // }
}
