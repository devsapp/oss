/* eslint-disable no-await-in-loop */
import { loadComponent, colors, spinner } from '@serverless-devs/core';
import CdnService from './cdnclient.service';
import DnsService from './dnsclient.service';
import { logger, ICdnSource, IDomainParams, parseDomain, waitUntil, sleep } from '../common';
import { get, cloneDeep, isEmpty } from 'lodash';

/**
 * OSS Bucket域名
 * @param region
 * @param bucket
 * @returns
 */
const getCdnOssSources = (region: string, bucket: string): ICdnSource => {
  return {
    content: `${bucket}.oss-${region}.aliyuncs.com`,
    type: 'oss',
    port: 80,
  };
};

const setDomainAdvancedConfig = async (cdnClient, { domain, hostObj }) => {
  const { access, https, optimization, redirects } = hostObj;
  // https 配置
  if (https) {
    try {
      await CdnService.setDomainServerCertificate(cdnClient, { domain, https });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `https配置失败，请前往控制台页面 ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/https`,
        )} 进行手动操作，函数名：setDomainServerCertificate，错误码：${messageCode}`,
      );
      logger.debug(error);
    }
  }
  // Referer 防盗链
  const referer = get(access, 'referer');
  if (referer) {
    try {
      await CdnService.setCdnDomainReferer(cdnClient, { domain, referer });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `Referer防盗链配置失败，请前往控制台页面 ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/access`,
        )} tab ${colors.green(
          'Referer防盗链',
        )} 界面进行手动操作，函数名：setCdnDomainReferer，错误码：${messageCode}`,
      );
      logger.debug(error);
    }
  }

  // IP黑/白名单
  const ipFilter = get(access, 'ipFilter');
  if (ipFilter) {
    try {
      await CdnService.setCdnDomainIpFilter(cdnClient, { domain, ipFilter });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `IP黑/白名单配置失败，请前往控制台页面 ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/access`,
        )} tab ${colors.green(
          'IP黑/白名单',
        )} 界面进行手动操作，函数名：setCdnDomainIpFilter，错误码：${messageCode}`,
      );
      logger.debug(error);
    }
  }

  // UA黑/白名单
  const uaFilter = get(access, 'uaFilter');
  if (uaFilter) {
    try {
      await CdnService.setCdnDomainUaFilter(cdnClient, { domain, uaFilter });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `UA黑/白名单配置失败，请前往控制台页面 ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/access`,
        )} tab ${colors.green(
          'UA黑/白名单',
        )} 界面进行手动操作，函数名：setCdnDomainUaFilter，错误码：${messageCode}`,
      );
      logger.debug(error);
    }
  }

  // 性能优化
  if (optimization) {
    try {
      await CdnService.setCdnDomainOptimization(cdnClient, { domain, optimization });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `性能优化配置失败，请前往控制台页面 ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/perform`,
        )} 进行手动操作，函数名：setCdnDomainOptimization，错误码：${messageCode}`,
      );
      logger.debug(error);
    }
  }

  // 重定向
  if (redirects) {
    try {
      await CdnService.setCdnDomainRedirects(cdnClient, { domain, redirects });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `重定向配置失败，请前往控制台页面 ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/cache`,
        )} tab ${colors.green(
          '重写',
        )} 界面进行手动操作，函数名：setCdnDomainRedirects，错误码：${messageCode}`,
      );
      logger.debug(error);
    }
  }
};

const setCdnDomainStagingConfig = async (cdnClient, { domain, fcDomain }) => {
  await CdnService.setEsStagingConfig(cdnClient, {
    domain,
    rule: `if match_re($uri, '^/api') {\n rewrite(concat('http://${fcDomain}', substr($uri, 5, len($uri))), 'redirect')\n}`,
  });
  const spin = spinner('configuring edge script...');
  for (let i = 0; i < 5; i++) {
    try {
      await sleep(5000);
      await CdnService.publishEsStagingConfigToProduction(cdnClient, domain);
      break;
    } catch (e) {
      await sleep(2000);
    }
  }
  spin.succeed('edge script configured successfully');
};

// 生成系统域名
const generateSystemDomain = async (params: IDomainParams) => {
  const { credentials, hostObj, inputs } = params;
  const { props } = inputs;
  const domainConponent = await loadComponent('devsapp/domain');
  const cdnClient = CdnService.createClient(credentials);

  // rest-api 返回 customDomain
  const useJamstack = Boolean(props.customDomain);
  if (useJamstack) {
    inputs.props = { ...props, type: 'jamstack-oss' };
  } else {
    inputs.props = { ...props, type: 'oss' };
  }
  let sysDomain: string;

  for (let i = 0; i < 5; i++) {
    try {
      sysDomain = await domainConponent[useJamstack ? 'jamstack' : 'get'](inputs);
      break;
    } catch (e) {
      console.log('sysDomain---error', e);
      await sleep(5000);
    }
  }

  if (isEmpty(sysDomain)) {
    return logger.warn('域名申请失败，请稍后重试。');
  }

  logger.debug(`Test Domain: ${sysDomain}`);
  await setDomainAdvancedConfig(cdnClient, { domain: sysDomain, hostObj });

  // 添加边缘脚本
  if (useJamstack) {
    await setCdnDomainStagingConfig(cdnClient, { domain: sysDomain, fcDomain: props.customDomain });
  }

  logger.log(`\ndomainName: ${colors.cyan.underline(`http://${sysDomain}`)}`);
  return sysDomain;
};

// 绑定到自定义域名
const generateDomain = async (params: IDomainParams) => {
  const { credentials, hostObj, sources } = params;
  const { host: domain } = hostObj;
  const cdnClient = CdnService.createClient(credentials);
  const dnsClient = DnsService.createClient(credentials);
  const { topDomain, rrDomainName } = parseDomain(domain);

  let domainDetailMode = await CdnService.describeCdnDomainDetail(cdnClient, domain);
  logger.debug(`查询绑定的域名信息:${JSON.stringify(domainDetailMode, null, 2)}`);

  // 没有域名则添加域名
  if (!domainDetailMode) {
    logger.debug(`首次绑定自定义域名:${domain}`);
    // 第一次添加会出强制校验
    await CdnService.verifyDomainOwner(cdnClient, { domain });
    await CdnService.addCDNDomain(cdnClient, {
      domain,
      sources,
    });

    domainDetailMode = await waitUntil(
      async () => {
        return await CdnService.describeCdnDomainDetail(cdnClient, domain);
      },
      (result) => get(result, 'cname'),
      {
        timeInterval: 3000,
        timeoutMsg: 'DNS 首次配置生效时间等待超时',
      },
    );

    logger.debug(`首次绑定的域名信息:${JSON.stringify(domainDetailMode, null, 2)}`);
    await DnsService.addDomainRecord(dnsClient, {
      domainName: topDomain,
      RR: rrDomainName,
      type: 'CNAME',
      value: domainDetailMode.cname,
    });
  } else {
    logger.debug(`绑定自定义域名:${domain}`);
    CdnService.modifyCdnDomain(cdnClient, { domain, sources });
  }
  await setDomainAdvancedConfig(cdnClient, { domain, hostObj });
  logger.log(`\ndomainName: ${colors.cyan.underline(`http://${domain}`)}`);
  return domain;
};

export default async (orinalInputs) => {
  const inputs = cloneDeep(orinalInputs);
  const { props } = inputs;
  const sources = getCdnOssSources(get(props, 'region'), get(props, 'bucket'));
  const credentials = {
    accessKeyId: get(inputs, 'Credentials.AccessKeyID'),
    accessKeySecret: get(inputs, 'Credentials.AccessKeySecret'),
    securityToken:  get(inputs, 'Credentials.SecurityToken'),
  };
  const { hosts } = props;
  const domains = [];
  if (hosts?.length > 0) {
    await Promise.all(
      hosts.map(async (hostObj) => {
        if (hostObj.host === 'auto') {
          domains.push(await generateSystemDomain({ credentials, hostObj, inputs, sources }));
        } else {
          domains.push(await generateDomain({ credentials, hostObj, sources }));
        }
      }),
    );
  } else {
    logger.log('如果需要系统帮你生成一个域名，可配置host为 auto ', 'yellow');
  }
  return domains;
};
