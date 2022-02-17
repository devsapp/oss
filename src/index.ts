import { spinner, reportComponent, getCredential } from '@serverless-devs/core';
import OssClient from 'ali-oss';
import {
  IOssConfig,
  IOssStatic,
  IwebsiteConfig,
  IOssRes,
  bucketIsExisting,
  put,
} from './services/oss.services';
import domain from './services/domain.service';
import { logger } from './common';
import Base from './common/base';
import { InputProps } from './common/entity';
import { get, isEmpty } from 'lodash';

export interface IResBucket {
  remoteAddress: string;
  remotePort?: string;
  requestUrls?: string;
}

export default class OssComponent extends Base {
  /**
   * deploy
   * @param inputs
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

    // add attr to bucket and put object
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
      // put file
      const ossSrc = get(inputs, 'props.codeUri');
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
      deployLoading.succeed('OSS website source deployed success');
      // Map the domain name
      const result: IOssRes = {
        Bucket: ossBucket,
        Region: get(inputs, 'props.region'),
        ossAddress: `https://oss.console.aliyun.com/bucket/${ossRegion}/${ossBucket}/object`,
      };
      index && (result.indexHtml = `http://${ossBucket}.${ossRegion}.aliyuncs.com/${index}`);
      return result;
    } catch (e) {
      return {
        errMesg: `Oss deploy Error:${e}`,
      };
    }
  }

  /**
   * domain
   * @param inputs
   */
  async domain(inputs: InputProps) {
    await domain(inputs);
  }
}
