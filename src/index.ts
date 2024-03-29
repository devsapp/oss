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
  IOssStatic,
  IwebsiteConfig,
  IOssRes,
  bucketIsExisting,
  put,
  bindDomain,
  handleInputs,
  IHandleInputsRes,
} from './services/oss.services';
import { logger } from './common';
import { InputProps } from './common/entity';
import { DEPLOY_HELP_INFO } from './common/contants';
import { every, get, isEmpty } from 'lodash';
import fs from 'fs-extra';

const { getCredential, help: coreHelp } = cores;
export default class OssComponent {
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
    let credentials = await getCredential(inputs, inputs.project.access);
    // common attribute
    const { AccessKeyID, AccessKeySecret, AccountID: uid, SecurityToken } = credentials;
    const region = get(inputs, 'props.region');
    const ossRegion = `oss-${region}`;
    const customDomains = get(inputs, 'props.customDomains', {});
    let ossBucket = get(inputs, 'props.bucket');
    if (!ossBucket) {
      throw new cores.CatchableError('bucket is required For oss');
    } else if (ossBucket === 'auto') {
      const serviceName = get(inputs, 'project.projectName');
      ossBucket = `serverless-devs-${region}-${serviceName}-${uid}`;
    }
    const ossAcl = !isEmpty(customDomains) ? 'public-read' : get(inputs, 'props.acl', 'private');
    
    const ossConfig: IOssConfig = {
      accessKeyId: AccessKeyID,
      accessKeySecret: AccessKeySecret,
      region: ossRegion,
      stsToken: SecurityToken,
    };
    let ossClient = new OssClient(ossConfig);
    // bucket is existing?
    await bucketIsExisting(ossClient, ossBucket, ossAcl, argsData);
    ossClient = new OssClient({
      ...ossConfig,
      bucket: ossBucket,
    });
    // file is existing?
    const ossSrc = get(inputs, 'props.codeUri');
    if (!fs.existsSync(ossSrc)) {
      const errString = `no such file or directory, stat '${ossSrc}'`;
      throw new cores.CatchableError(errString);
    }
    
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
    const ossStatic: IOssStatic = get(inputs, 'props.website', {});
    const { index = '', error = '' } = ossStatic;
    const websiteConfig: IwebsiteConfig = { index, error };

    const websiteConfigType = get(ossStatic, 'subDir.type', ossStatic.subDirType);
    if (websiteConfigType) {
      websiteConfig.supportSubDir = true;
      const typeMap = {
        noSuchKey: 1,
        index: 2,
        redirect: 0,
      };
      const subDirType = get(typeMap, websiteConfigType, 1);
      websiteConfig.type = subDirType;
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
      const { domains: domainList } = await bindDomain(inputs, ossBucket);
      // report oss response
      result.Domains = domainList;
    }
    const message = every(result.Domains, (child) => isEmpty(child))
      ? 'oss deployed successful without Domain'
      : 'oss deployed successful ';
    logger.info(message);
    return result;
  }
}
