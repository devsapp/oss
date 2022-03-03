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
   * AK&SK Client
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  static createClient(credentials: ICredentials): Alidns20150109 {
    const { accessKeyId, accessKeySecret } = credentials;
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
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
      logger.warn(
        `Failed to resolve using Ali DNS, please configure CNAME manually ${addDomainRecordParams.value}`,
      );
    }
  }

  static async describeDomainInfo(client, domain: string): Promise<any> {
    const describeDomainInfoRequest = new $Alidns20150109.DescribeDomainInfoRequest({
      domainName: domain,
    });
    const result = await client.describeDomainInfo(describeDomainInfoRequest);
    return result;
  }
}
