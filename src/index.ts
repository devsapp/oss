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
      // domain
      const hosts = get(inputs, 'props.hosts', {});
      const result: IOssRes = {
        Bucket: ossBucket,
        Region: get(inputs, 'props.region'),
      };
      if (isEmpty(hosts)) {
        result.OssAddress = `https://oss.console.aliyun.com/bucket/${ossRegion}/${ossBucket}/object`;
      } else {
        // attr bucket region hosts
        const domainList = await this.domain(inputs);
        result.Domains = domainList;
      }
      deployLoading.succeed('OSS website source deployed success');
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
   * 全不变亮植入domain组件，会报错，所以只获取domain相关的参数
   * report oss response
   */
  async domain(inputs: InputProps) {
    const { props, Properties, ...rest } = inputs;
    const { bucket, region, hosts } = get(inputs, 'props', {});
    const domianProps = {
      bucket,
      region,
      hosts,
    };
    const domainParms = { props: domianProps, Properties: domianProps, ...rest };
    const domains = await domain(domainParms);

    const report_content = {
      oss: [
        {
          region: get(inputs, 'props.region'),
          bucket: get(inputs, 'props.bucket'),
        },
      ],
    };

    const result = {
      Region: get(inputs, 'props.region'),
      Bucket: get(inputs, 'props.bucket'),
    };

    if (domains.length > 0) {
      result['Domains'] = domains;
      report_content['url'] = [];
      report_content['cdn'] = [];
      for (let i = 0; i < domains.length; i++) {
        const tempUrl = {};
        tempUrl[`Domain_${i}`] = domains[i];
        report_content['url'].push(tempUrl);
        report_content['cdn'].push({
          region: get(inputs, 'props.region'),
          domain: domains[i],
        });
      }
    }
    super.__report({
      name: 'oss',
      access: inputs.project.access,
      content: result,
    });
    return domains;
  }
}
