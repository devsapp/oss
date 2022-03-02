/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-param-reassign */
/* eslint-disable require-atomic-updates */
/* eslint-disable @typescript-eslint/dot-notation */
/**
 * serverless-devs-${region}-${serviceName}-${uid}
 */
import * as cores from '@serverless-devs/core';
import OssClient from 'ali-oss';
import {
  IOssConfig,
  IOssWebsite,
  IwebsiteConfig,
  IOssRes,
  bucketIsExisting,
  put,
  bindDomain,
  handleInputs,
  IHandleInputsRes,
} from './services/oss.services';
import { logger } from './common';
import Base from './common/base';
import { InputProps } from './common/entity';
import { DEPLOY_HELP_INFO } from './common/contants';
import { each, every, get, isEmpty } from 'lodash';
import fs from 'fs-extra';
import dns from 'dns';

const { reportComponent, getCredential, help: coreHelp, colors } = cores;
export default class OssComponent extends Base {
  /**
   * deploy
   * @param inputs
   *
   */
  async deploy(inputs: InputProps) {
    logger.debug(
      `[${get(inputs, 'project.projectName')}] inputs params: ${JSON.stringify(inputs, null, 2)}`,
    );
    const argsData: IHandleInputsRes = handleInputs(inputs);
    const commandHelp = argsData.h || argsData.help;
    if (commandHelp) {
      coreHelp(DEPLOY_HELP_INFO);
      return;
    }
    let credentials = get(inputs, 'credentials');
    if (isEmpty(credentials)) {
      credentials = await getCredential(inputs, inputs.project.access);
    }
    // common attribute
    const { AccessKeyID, AccessKeySecret, AccountID: uid } = credentials;
    const region = get(inputs, 'props.region');
    const ossRegion = `oss-${region}`;
    const customDomains = get(inputs, 'props.customDomains', {});
    let ossBucket = get(inputs, 'props.bucket');
    if (!ossBucket) {
      logger.error('bucket is required For oss');
      return;
    } else if (ossBucket === 'auto') {
      const projectName = get(inputs, 'project.projectName');
      logger.debug(`[projectName] inputs params: ${projectName}`);
      logger.debug(`[appName] inputs params: ${get(inputs, 'appName')}`);
      ossBucket = `serverless-devs-${region}-${projectName}-${uid}`;
      argsData.assumeYes = true;
      argsData.y = true;
      argsData['assume-yes'] = true;
    }
    const ossAcl = !isEmpty(customDomains) ? 'public-read' : get(inputs, 'props.acl', 'private');
    reportComponent('oss', {
      uid,
      command: 'deploy',
    });
    const ossConfig: IOssConfig = {
      accessKeyId: AccessKeyID,
      accessKeySecret: AccessKeySecret,
      region: ossRegion,
    };
    let ossClient = new OssClient(ossConfig);
    // bucket is existing?
    const isContinue = await bucketIsExisting(ossClient, ossBucket, ossAcl, argsData);
    if (!isContinue) return;
    ossClient = new OssClient({
      ...ossConfig,
      bucket: ossBucket,
    });
    // file is existing?
    const ossSrc = get(inputs, 'props.codeUri');
    if (!fs.existsSync(ossSrc)) {
      const errString = `no such file or directory, stat '${ossSrc}'`;
      logger.error(errString);
      return;
    }
    try {
      // update ossAcl
      await ossClient.putBucketACL(ossBucket, ossAcl);
      // update ossCors allowedOrigin allowedMethod,  params is required
      const ossCors = get(inputs, 'props.cors', []);
      !isEmpty(ossCors) && (await ossClient.putBucketCORS(ossBucket, ossCors));
      // update ossReferer
      const ossReferer = get(inputs, 'props.referer', {});
      const { allowEmpty = true, referers: ossReferers = [] } = ossReferer;
      await ossClient.putBucketReferer(ossBucket, allowEmpty, ossReferers);
      // put file ossSrc
      const ossSubDir = get(inputs, 'props.subDir');
      await put(ossClient, ossSrc, ossSubDir);
      // update website
      const website: IOssWebsite = get(inputs, 'props.website', {});
      const { index = '', error = '', subDirType = '' } = website;
      const websiteConfig: IwebsiteConfig = { index, error };
      if (subDirType) {
        // supportSubDir ?
        websiteConfig.supportSubDir = true;
        const typeMap = {
          noSuchKey: 1,
          index: 2,
          redirect: 0,
        };
        websiteConfig.type = typeMap[subDirType] || 0;
      }
      await ossClient.putBucketWebsite(ossBucket, websiteConfig);
      // bindDomain
      const result: IOssRes = {
        Bucket: ossBucket,
        Region: get(inputs, 'props.region'),
      };
      if (isEmpty(customDomains)) {
        result.OssAddress = `https://oss.console.aliyun.com/bucket/${ossRegion}/${ossBucket}/object`;
      } else {
        // 如果auto 修改 bucket
        const { domains: domainList, reportContent } = await bindDomain(inputs, ossBucket);
        // report oss response
        super.__report(reportContent);
        result.Domains = domainList;
      }
      const message = every(result.Domains, (child) => isEmpty(child))
        ? 'oss deployed successful without Domain'
        : 'oss deployed successful ';
      logger.info(message);
      let dnsRes = { address: '' };
      try {
        if (result.Domains.length > 0) {
          dnsRes = await dns.promises.lookup(result.Domains[0]);
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
      // process.on('exit', () => {});
      let domainStr = '';
      each(result.Domains, (child) => {
        const childLabel = `http://${child}`;
        domainStr += `  -
        domain: ${colors.cyan.underline(childLabel)}
        `;
      });
      const finalMsg = `
oss:
  bucket: ${colors.cyan(ossBucket)}
  region: ${colors.cyan(get(inputs, 'props.region'))}
  url:
    custom_domain: 
    ${domainStr}
`;
      if (!dnsRes.address) {
        const warnMsg = `
${colors.yellow('tips for domain')}
${colors.yellow('===============================')}
${colors.yellow('* 正在为您绑定域名，预计花费1分钟')}
`;
        console.log(warnMsg);
      }
      console.log(finalMsg);
      return;
    } catch (e) {
      logger.error('oss deployed aborted');
      return {
        errMesg: e,
      };
    }
  }
}
