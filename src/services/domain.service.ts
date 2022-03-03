/* eslint-disable no-await-in-loop */
import { loadComponent, colors, spinner } from '@serverless-devs/core';
import CdnService from './cdnclient.service';
import DnsService from './dnsclient.service';
import { logger, ICdnSource, IDomainParams, parseDomain, waitUntil, sleep } from '../common';
import { get, cloneDeep, isEmpty } from 'lodash';

/**
 * OSS Bucket Domain
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
        `Https configuration fails, go to the console page ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/https`,
        )} and operate manually, Funcname: setDomainServerCertificate, Error code: ${messageCode}`,
      );
      logger.debug(error);
    }
  }
  // Referer
  const referer = get(access, 'referer');
  if (referer) {
    try {
      await CdnService.setCdnDomainReferer(cdnClient, { domain, referer });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `Referer configuration fails, go to the console page ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/access`,
        )} tab ${colors.green(
          'Referer',
        )} and operate manually, Funcname: setCdnDomainReferer, Error code: ${messageCode}`,
      );
      logger.debug(error);
    }
  }

  // IP
  const ipFilter = get(access, 'ipFilter');
  if (ipFilter) {
    try {
      await CdnService.setCdnDomainIpFilter(cdnClient, { domain, ipFilter });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `IP black/whitelist configuration failed, please go to the console page ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/access`,
        )} tab ${colors.green(
          'IP black/whitelist configuration',
        )} and operate manually, Funcname: setCdnDomainIpFilter, Error code: ${messageCode}`,
      );
      logger.debug(error);
    }
  }

  // UA
  const uaFilter = get(access, 'uaFilter');
  if (uaFilter) {
    try {
      await CdnService.setCdnDomainUaFilter(cdnClient, { domain, uaFilter });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `UA black/whitelist configuration failed, please go to the console page ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/access`,
        )} tab ${colors.green(
          'UA black/whitelist configuration',
        )} and operate manually, Funcname: setCdnDomainUaFilter, Error code: ${messageCode}`,
      );
      logger.debug(error);
    }
  }

  //  performance optimization
  if (optimization) {
    try {
      await CdnService.setCdnDomainOptimization(cdnClient, { domain, optimization });
    } catch (error) {
      const message = get(error, 'message', '');
      const messageCode = message.split(':')[0];
      logger.error(
        `The performance optimization configuration failed, please go to the console page ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/perform`,
        )} and operate manually, Funcname: setCdnDomainOptimization, Error code: ${messageCode}`,
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
        `Redirection configuration failed, please go to the console page ${colors.cyan.underline(
          `https://cdn.console.aliyun.com/domain/detail/${domain}/cache`,
        )} tab ${colors.green(
          'rewrite interface',
        )} and operate manually, Funcname: setCdnDomainRedirects, Error code: ${messageCode}`,
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
    return logger.warn('Domain name application failed, please try again later.');
  }

  logger.debug(`Test Domain: ${sysDomain}`);
  await setDomainAdvancedConfig(cdnClient, { domain: sysDomain, hostObj });

  // add edge script
  if (useJamstack) {
    await setCdnDomainStagingConfig(cdnClient, { domain: sysDomain, fcDomain: props.customDomain });
  }

  // logger.log(`\ndomainName: ${colors.cyan.underline(`http://${sysDomain}`)}`);
  return sysDomain;
};

// custom domain name
const generateDomain = async (params: IDomainParams) => {
  const { credentials, hostObj, sources } = params;
  const { host: domain } = hostObj;
  const cdnClient = CdnService.createClient(credentials);
  const dnsClient = DnsService.createClient(credentials);
  const { topDomain, rrDomainName } = parseDomain(domain);

  let domainDetailMode = await CdnService.describeCdnDomainDetail(cdnClient, domain);
  logger.debug(
    `Query the bound domain name information: ${JSON.stringify(domainDetailMode, null, 2)}`,
  );

  if (!domainDetailMode) {
    logger.debug(`Binding a custom domain name for the first time: ${domain}`);

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
        timeoutMsg: 'Timeout waiting for the first DNS configuration to take effect',
      },
    );

    logger.debug(
      `Domain name information bound for the first time: ${JSON.stringify(
        domainDetailMode,
        null,
        2,
      )}`,
    );
    await DnsService.addDomainRecord(dnsClient, {
      domainName: topDomain,
      RR: rrDomainName,
      type: 'CNAME',
      value: domainDetailMode.cname,
    });
  } else {
    logger.debug(`Bind a custom domain name: ${domain}`);
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
    logger.log(
      'If you need the system to generate a domain name for you, you can configure host to auto ',
      'yellow',
    );
  }
  return domains;
};
