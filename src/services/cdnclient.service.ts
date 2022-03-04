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
   * 使用AK&SK初始化账号Client
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  static createClient(credentials: ICredentials): Cdn20180510 {
    const { accessKeyId, accessKeySecret, securityToken } = credentials;
    const config = new $OpenApi.Config({
      // 您的AccessKey ID
      accessKeyId,
      // 您的AccessKey Secret
      accessKeySecret,
      securityToken,
    });
    // 访问的域名
    config.endpoint = 'cdn.aliyuncs.com';
    return new Cdn20180510(config);
  }

  /**
   * 设置edge script灰度配置
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
    // 复制代码运行请自行打印 API 的返回值
    await client.setCdnDomainStagingConfig(setCdnDomainStagingConfigRequest);
  }
  /**
   * @description 获取灰度环境配置信息
   * @param credentials
   */
  static async describeCdnDomainStagingConfig(client, domain: string): Promise<any> {
    const describeCdnDomainStagingConfigRequest =
      new $Cdn20180510.DescribeCdnDomainStagingConfigRequest({
        domainName: domain,
        functionNames: 'edge_function',
      });
    // 复制代码运行请自行打印 API 的返回值
    return await client.describeCdnDomainStagingConfig(describeCdnDomainStagingConfigRequest);
  }
  /**
   * 将edge script灰度配置发布到线上环境
   * @param credentials
   */
  static async publishEsStagingConfigToProduction(client, domain: string): Promise<void> {
    const publishStagingConfigToProductionRequest =
      new $Cdn20180510.PublishStagingConfigToProductionRequest({
        domainName: domain,
        functionName: 'edge_function',
      });
    // 复制代码运行请自行打印 API 的返回值
    await client.publishStagingConfigToProduction(publishStagingConfigToProductionRequest);
  }

  /**
   * @description 获取CDN域名的详细信息
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
          '您的帐户尚未开通CDN服务，请前往 https://common-buy.aliyun.com/?commodityCode=cdn#/open 页面进行开通',
        );
      }
      return null;
    }
  }

  /**
   * @description 域名归属校验
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
        `2020年6月12日起，当您首次将新域名添加至阿里云CDN时，需按要求做域名归属权验证，当您按要求配置DNS解析或文件验证后，才能正常调用AddCdnDomain接口添加域名。 域名归属权验证请参见https://help.aliyun.com/document_detail/169377.html
        请前往域名DNS服务商配置该TXT记录：记录类型:TXT，主机记录:verification，记录值:${verifyContent}
        `,
      );
    }
  }

  /**
   * 删除域名
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
   * @description 添加CDN域名
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
      cdnType: 'web', // 图片小文件
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
   * @description 修改添加CDN域名
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
   * @description 增加HTTP证书
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
      logger.log('HTTP/2是最新的HTTP协议，开启前您需要先配置HTTPS证书', 'red');
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
   * @description 删除加速域名的配置
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
   * @description 获取加速域名的配置信息。
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
   * @description 获取用户的加速域名信息
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
    // 存在则设置过
    if (forceHttpsOptioned) {
      // 当前状态和设置的值相同，直接返回
      if (forceHttpsOptioned.functionName === ForceHttpsEnum[forceHttps]) return;
      // 不相同，则需要先删除当前状态
      await Client.DeleteSpecificConfig(client, { domain, configId: forceHttpsOptioned.configId });
    }
    // 默认default，不需要设置
    if (forceHttps === 'default') return;
    // 不存在则直接设置
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
   * @description Referer防盗链
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
    // 开启
    if (referer.switch === 'on') {
      // 存在则设置过
      if (refererOptioned) {
        // 当前状态和设置的值不相同，则需要先删除
        if (referer.type !== refererOptioned.functionName) {
          await Client.DeleteSpecificConfig(client, { domain, configId: refererOptioned.configId });
        }
      }
    } else if (refererOptioned) {
      // 未开启，且设置过 则删除
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
   * @description IP黑/白名单
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
    // 开启
    if (ipFilter.switch === 'on') {
      // 存在则设置过
      if (ipFilterOptioned) {
        // 当前状态和设置的值不相同，则需要先删除
        if (ipFilter.type !== ipFilterOptioned.functionName) {
          await Client.DeleteSpecificConfig(client, {
            domain,
            configId: ipFilterOptioned.configId,
          });
        }
      }
    } else if (ipFilterOptioned) {
      // 未开启，且设置过 则删除
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
   * @description UA黑/白名单
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
    // 开启
    if (uaFilter.switch === 'on') {
      // 存在则设置过
      if (uaFilterOptioned) {
        // 当前状态和设置的值不相同，则需要先删除
        if (uaFilter.type !== uaFilterOptioned.functionName) {
          await Client.DeleteSpecificConfig(client, {
            domain,
            configId: uaFilterOptioned.configId,
          });
        }
      }
    } else if (uaFilterOptioned) {
      // 未开启，且设置过 则删除
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
   * @description 性能优化
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
   * @description 重定向
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
