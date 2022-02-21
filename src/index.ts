/* eslint-disable @typescript-eslint/dot-notation */
import { spinner, reportComponent, getCredential } from '@serverless-devs/core';
import OssClient from 'ali-oss';
import {
  IOssConfig,
  IOssStatic,
  IwebsiteConfig,
  IOssRes,
  bucketIsExisting,
  put,
  bindDomain,
} from './services/oss.services';
import { logger } from './common';
import Base from './common/base';
import { InputProps } from './common/entity';
import { get, isEmpty } from 'lodash';
import fs from 'fs-extra';

export interface IResBucket {
  remoteAddress: string;
  remotePort?: string;
  requestUrls?: string;
}

export default class OssComponent extends Base {
  /**
   * deploy
   * @param inputs
   *
   */
  async deploy(inputs: InputProps) {
    let credentials = get(inputs, 'credentials');
    if (isEmpty(credentials)) {
      credentials = await getCredential(inputs, inputs.project.access);
    }
    reportComponent('oss', {
      uid: credentials.AccountID,
      command: 'deploy',
    });
    logger.debug(
      `[${get(inputs, 'project.projectName')}] inputs params: ${JSON.stringify(inputs, null, 2)}`,
    );
    // attr
    const { AccessKeyID, AccessKeySecret } = credentials;
    const ossRegion = `oss-${get(inputs, 'props.region')}`;
    const ossBucket = get(inputs, 'props.bucket');
    const ossAcl = get(inputs, 'props.acl', 'private');
    // cofig
    const ossConfig: IOssConfig = {
      accessKeyId: AccessKeyID,
      accessKeySecret: AccessKeySecret,
      region: ossRegion,
    };
    // oss clinet
    let ossClient = new OssClient(ossConfig);
    // bucket is existing?
    const isContinue = await bucketIsExisting(ossClient, ossBucket, ossAcl);
    if (!isContinue) return;
    ossClient = new OssClient({
      ...ossConfig,
      bucket: ossBucket,
    });
    const deployLoading = spinner('The Oss is deploying');
    // file is existing?
    const ossSrc = get(inputs, 'props.codeUri');
    if (!fs.existsSync(ossSrc)) {
      const errString = `no such file or directory, stat '${ossSrc}'`;
      deployLoading.fail(errString, 'warning');
      return;
    }
    try {
      // update ossAcl
      await ossClient.putBucketACL(ossBucket, ossAcl);
      // update ossCors allowedOrigin allowedMethod 必须填写
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
      const { index = '', error = '', subDir = '' } = ossStatic;
      const websiteConfig: IwebsiteConfig = { index, error };
      if (subDir && subDir.type) {
        // supportSubDir ?
        websiteConfig.supportSubDir = true;
        const typeMap = {
          noSuchKey: 1,
          index: 2,
          redirect: 0,
        };
        const subDirType = get(typeMap, subDir.type, 1);
        websiteConfig.type = subDirType;
      }
      await ossClient.putBucketWebsite(ossBucket, websiteConfig);
      // bindDomain
      const customDomains = get(inputs, 'props.customDomains', {});
      const result: IOssRes = {
        Bucket: ossBucket,
        Region: get(inputs, 'props.region'),
      };
      if (isEmpty(customDomains)) {
        result.OssAddress = `https://oss.console.aliyun.com/bucket/${ossRegion}/${ossBucket}/object`;
      } else {
        // attr bucket region customDomains
        const { domains: domainList, reportContent } = await bindDomain(inputs);
        // report oss response
        super.__report(reportContent);
        result.Domains = domainList;
      }
      deployLoading.succeed('OSS website source deployed success');
      return result;
    } catch (e) {
      deployLoading.fail('OSS website source deployed error');
      return {
        errMesg: e,
      };
    }
  }
}
