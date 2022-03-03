import Cdn20180510, * as $Cdn20180510 from '@alicloud/cdn20180510';
import * as $OpenApi from '@alicloud/openapi-client';
import {
  ICredentials,
  ICdnSource,
  IReferer,
  IHttps,
  TForceHttps,
  THttp2,
  IIpFilter,
  ForceHttpsEnum,
  RefererEnum,
  IpFilterEnum,
  IOptimization,
  IRedirects,
  parseReferer,
  parseCertInfo,
  parseIpFilter,
  parseUaFilter,
  parseOptimization,
  parseRedirects,
  CDN_ERRORS,
  logger,
} from '../common';
import { get } from 'lodash';

export default class Client {
  /**
   * AK&SK Client
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  static createClient(credentials: ICredentials): Cdn20180510 {
    const { accessKeyId, accessKeySecret } = credentials;
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
    config.endpoint = 'cdn.aliyuncs.com';
    return new Cdn20180510(config);
  }

  /**
   * edge script grey config
   * @param accessKeyId
   * @param accessKeySecret
   */
  static async setEsStagingConfig(
    client,
    { domain, rule }: { domain: string; rule: string },
  ): Promise<void> {
    const setCdnDomainStagingConfigRequest = new $Cdn20180510.SetCdnDomainStagingConfigRequest({
      domainName: domain,
      functions: JSON.stringify([
        {
          functionArgs: [
            { argName: 'name', argValue: 'jamstack' },
            { argName: 'rule', argValue: rule },
            { argName: 'enable', argValue: 'on' },
            { argName: 'pri', argValue: '0' },
            { argName: 'pos', argValue: 'head' },
            { argName: 'enable', argValue: 'on' },
            { argName: 'brk', argValue: 'off' },
            { argName: 'option', argValue: '' },
          ],
          functionName: 'edge_function',
        },
      ]),
    });

    await client.setCdnDomainStagingConfig(setCdnDomainStagingConfigRequest);
  }
  /**
   * @description get grey env info
   * @param credentials
   */
  static async describeCdnDomainStagingConfig(client, domain: string): Promise<any> {
    const describeCdnDomainStagingConfigRequest =
      new $Cdn20180510.DescribeCdnDomainStagingConfigRequest({
        domainName: domain,
        functionNames: 'edge_function',
      });
    return await client.describeCdnDomainStagingConfig(describeCdnDomainStagingConfigRequest);
  }
  /**
   * make edge script grey config to prod
   * @param credentials
   */
  static async publishEsStagingConfigToProduction(client, domain: string): Promise<void> {
    const publishStagingConfigToProductionRequest =
      new $Cdn20180510.PublishStagingConfigToProductionRequest({
        domainName: domain,
        functionName: 'edge_function',
      });
    await client.publishStagingConfigToProduction(publishStagingConfigToProductionRequest);
  }

  /**
   * @description get cdn domain info
   * @param credentials
   */
  static async describeCdnDomainDetail(client, domain: string): Promise<any> {
    const describeCdnDomainDetailRequest = new $Cdn20180510.DescribeCdnDomainDetailRequest({
      domainName: domain,
    });
    logger.debug(
      `describeCdnDomainDetailRequest:${JSON.stringify(describeCdnDomainDetailRequest, null, 2)}`,
    );

    try {
      const result = await client.describeCdnDomainDetail(describeCdnDomainDetailRequest);
      logger.debug(`describeCdnDomainDetail result:${JSON.stringify(result, null, 2)}`);
      logger.debug(
        `describeCdnDomainDetail result.body:${JSON.stringify(get(result, 'body'), null, 2)}`,
      );
      logger.debug(
        `describeCdnDomainDetail result.body.getDomainDetailModel:${JSON.stringify(
          get(result, 'body.getDomainDetailModel'),
          null,
          2,
        )}`,
      );

      const domainDetailMode = get(result, 'body.getDomainDetailModel');
      return domainDetailMode;
    } catch (error) {
      logger.debug(`describeCdnDomainDetail error:${JSON.stringify(error, null, 2)}`);
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      if (messageCode === 'CdnServiceNotFound') {
        throw new Error(
          'Your account has not activated the CDN service, please go to https://common-buy.aliyun.com/?commodityCode=cdn#/open the page to activate',
        );
      }
      return null;
    }
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async verifyDomainOwner(
    client,
    { domain, verifyType = 'bothCheck' }: { domain: string; verifyType?: string },
  ) {
    const verifyDomainOwnerRequest = new $Cdn20180510.VerifyDomainOwnerRequest({
      domainName: domain,
      verifyType,
    });
    try {
      const result = await client.verifyDomainOwner(verifyDomainOwnerRequest);
      return result;
    } catch (error) {
      const describeVerifyContentRequest = new $Cdn20180510.DescribeVerifyContentRequest({
        domainName: domain,
      });
      const result = await client.describeVerifyContent(describeVerifyContentRequest);
      const verifyContent = get(result, 'body.content');
      throw new Error(
        `From June 12, 2020, when you add a new domain name to Alibaba Cloud CDN for the first time, you need to verify the domain name ownership as required. After you configure DNS resolution or file verification as required, you can normally call the AddCdnDomain interface to add a domain name. For domain name attribution verification, see https://help.aliyun.com/document_detail/169377.html
        Please go to the domain name DNS service provider to configure the TXT record: record type: TXT, host record: verification, record value: ${verifyContent}
        `,
      );
    }
  }

  /**
   *
   * @param client
   * @param domain
   */
  static async deleteCdnDomain(client, domain: string, isThrowError: boolean) {
    const deleteCdnDomainRequest = new $Cdn20180510.DeleteCdnDomainRequest({
      domainName: domain,
    });
    if (isThrowError) {
      try {
        await client.deleteCdnDomain(deleteCdnDomainRequest);
      } catch (error) {
        // ignore error
      }
    } else {
      await client.deleteCdnDomain(deleteCdnDomainRequest);
    }
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async addCDNDomain(
    client,
    { domain, sources }: { domain: string; sources: ICdnSource },
  ): Promise<void> {
    // 添加CDN
    const addCdnDomainRequest = new $Cdn20180510.AddCdnDomainRequest({
      scope: 'global',
      cdnType: 'web',
      domainName: domain,
      sources: JSON.stringify([].concat(sources)),
    });
    try {
      await client.addCdnDomain(addCdnDomainRequest);
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      throw new Error(CDN_ERRORS[messageCode] || message);
    }
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async modifyCdnDomain(
    client,
    { domain, sources }: { domain: string; sources?: ICdnSource },
  ): Promise<void> {
    // 修改源
    const addCdnDomainRequest = new $Cdn20180510.ModifyCdnDomainRequest({
      domainName: domain,
      sources: JSON.stringify([].concat(sources)),
    });
    try {
      await client.modifyCdnDomain(addCdnDomainRequest);
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      throw new Error(CDN_ERRORS[messageCode] || message);
    }
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async setDomainServerCertificate(
    client,
    { domain, https }: { domain: string; https?: IHttps },
  ): Promise<void> {
    if (parseCertInfo(get(https, 'certInfo'))) {
      const domainServerCertificateRequest = new $Cdn20180510.SetDomainServerCertificateRequest({
        domainName: domain,
        ...parseCertInfo(get(https, 'certInfo')),
      });
      await client.setDomainServerCertificate(domainServerCertificateRequest);
    }
    await Client.setCdnDomainForceHttps(client, {
      domain,
      forceHttps: get(https, 'protocol', 'default'),
    });
    if (get(https, 'certInfo.switch') === 'off' && https.http2 === 'on') {
      logger.log(
        'HTTP/2 is the latest HTTP protocol, you need to configure the HTTPS certificate before enabling it',
        'red',
      );
    }
    if (get(https, 'certInfo.switch') === 'on') {
      await Client.setCdnDomainHttp2(client, { domain, http2: get(https, 'http2', 'off') });
    }
  }

  static async setCdnDomainHttp2(
    client,
    { domain, http2 }: { domain: string; http2: THttp2 },
  ): Promise<void> {
    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify([
        {
          functionArgs: [{ argName: 'http2', argValue: http2 }],
          functionName: 'https_option',
        },
      ]),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async DeleteSpecificConfig(
    client,
    { domain, configId }: { domain: string; configId: string },
  ): Promise<any> {
    const option = new $Cdn20180510.DeleteSpecificConfigRequest({
      domainName: domain,
      configId,
    });
    await client.deleteSpecificConfig(option);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async DescribeCdnDomainConfigs(
    client,
    { domain, functionNames }: { domain: string; functionNames: string },
  ): Promise<any> {
    const option = new $Cdn20180510.DescribeCdnDomainConfigsRequest({
      domainName: domain,
      functionNames,
    });
    const result = await client.describeCdnDomainConfigs(option);
    return get(result, 'body.domainConfigs.domainConfig');
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async DescribeUserDomains(
    client,
    { domain, checkDomainShow }: { domain: string; checkDomainShow: boolean },
  ): Promise<any> {
    const option = new $Cdn20180510.DescribeUserDomainsRequest({
      domainName: domain,
      checkDomainShow,
    });
    const result = await client.describeUserDomains(option);
    return get(result, 'body.domains.pageData[0]');
  }

  /**
   * @description 强制HTTPS跳转
   * @param client
   * @param param1
   */
  static async setCdnDomainForceHttps(
    client,
    { domain, forceHttps }: { domain: string; forceHttps: TForceHttps },
  ): Promise<void> {
    const cdnDomainConfigs = await Client.DescribeCdnDomainConfigs(client, {
      domain,
      functionNames: `${ForceHttpsEnum.http},${ForceHttpsEnum.https}`,
    });
    const forceHttpsOptioned = cdnDomainConfigs.find(
      (item) =>
        item.functionName === ForceHttpsEnum.http || item.functionName === ForceHttpsEnum.https,
    );
    if (forceHttpsOptioned) {
      if (forceHttpsOptioned.functionName === ForceHttpsEnum[forceHttps]) return;
      await Client.DeleteSpecificConfig(client, { domain, configId: forceHttpsOptioned.configId });
    }
    if (forceHttps === 'default') return;
    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify([
        {
          functionArgs: [{ argName: 'enable', argValue: 'on' }],
          functionName: ForceHttpsEnum[forceHttps],
        },
      ]),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async setCdnDomainReferer(
    client,
    { domain, referer }: { domain: string; referer: IReferer },
  ) {
    const cdnDomainConfigs = await Client.DescribeCdnDomainConfigs(client, {
      domain,
      functionNames: `${RefererEnum.whitelist},${RefererEnum.blacklist}`,
    });
    const refererOptioned = cdnDomainConfigs.find(
      (item) =>
        item.functionName === RefererEnum.whitelist || item.functionName === RefererEnum.blacklist,
    );
    if (referer.switch === 'on') {
      if (refererOptioned) {
        if (referer.type !== refererOptioned.functionName) {
          await Client.DeleteSpecificConfig(client, { domain, configId: refererOptioned.configId });
        }
      }
    } else if (refererOptioned) {
      return await Client.DeleteSpecificConfig(client, {
        domain,
        configId: refererOptioned.configId,
      });
    }

    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify([parseReferer(referer)]),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async setCdnDomainIpFilter(
    client,
    { domain, ipFilter }: { domain: string; ipFilter: IIpFilter },
  ) {
    const cdnDomainConfigs = await Client.DescribeCdnDomainConfigs(client, {
      domain,
      functionNames: `${IpFilterEnum.whitelist},${IpFilterEnum.blacklist}`,
    });
    const ipFilterOptioned = cdnDomainConfigs.find(
      (item) =>
        item.functionName === IpFilterEnum.whitelist ||
        item.functionName === IpFilterEnum.blacklist,
    );
    if (ipFilter.switch === 'on') {
      if (ipFilterOptioned) {
        if (ipFilter.type !== ipFilterOptioned.functionName) {
          await Client.DeleteSpecificConfig(client, {
            domain,
            configId: ipFilterOptioned.configId,
          });
        }
      }
    } else if (ipFilterOptioned) {
      return await Client.DeleteSpecificConfig(client, {
        domain,
        configId: ipFilterOptioned.configId,
      });
    }
    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify([parseIpFilter(ipFilter)]),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async setCdnDomainUaFilter(
    client,
    { domain, uaFilter }: { domain: string; uaFilter: IIpFilter },
  ) {
    const cdnDomainConfigs = await Client.DescribeCdnDomainConfigs(client, {
      domain,
      functionNames: 'ali_ua',
    });
    const uaFilterOptioned = cdnDomainConfigs.find((item) => item.functionName === 'ali_ua');
    if (uaFilter.switch === 'on') {
      if (uaFilterOptioned) {
        if (uaFilter.type !== uaFilterOptioned.functionName) {
          await Client.DeleteSpecificConfig(client, {
            domain,
            configId: uaFilterOptioned.configId,
          });
        }
      }
    } else if (uaFilterOptioned) {
      return await Client.DeleteSpecificConfig(client, {
        domain,
        configId: uaFilterOptioned.configId,
      });
    }
    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify([parseUaFilter(uaFilter)]),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async setCdnDomainOptimization(
    client,
    { domain, optimization }: { domain: string; optimization: IOptimization },
  ) {
    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify(parseOptimization(optimization)),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }

  /**
   * @description
   * @param client
   * @param param1
   */
  static async setCdnDomainRedirects(
    client,
    { domain, redirects }: { domain: string; redirects: IRedirects[] },
  ) {
    const cdnDomainConfigs = await Client.DescribeCdnDomainConfigs(client, {
      domain,
      functionNames: 'host_redirect',
    });
    const configIds = cdnDomainConfigs.map((item) => item.configId);
    if (configIds.length > 0) {
      await Client.DeleteSpecificConfig(client, { domain, configId: configIds.join(',') });
    }
    const cdnDomainStagingConfigRequest = new $Cdn20180510.BatchSetCdnDomainConfigRequest({
      domainNames: domain,
      functions: JSON.stringify(parseRedirects(redirects)),
    });
    await client.batchSetCdnDomainConfig(cdnDomainStagingConfigRequest);
  }
}
