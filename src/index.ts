import { spinner, reportComponent, getCredential, inquirer } from '@serverless-devs/core';
import { get, isEmpty } from 'lodash';
import OssClient from 'ali-oss';
import path from 'path';
import fs from 'fs-extra';
import walkSync from 'walk-sync';
import { IOssConfig, IOssStatic, IwebsiteConfig, ACLType, IOssRes } from './services/oss.services';
import { logger } from './common';
import Base from './common/base';
import { InputProps } from './common/entity';

export interface IResBucket {
  remoteAddress: string;
  remotePort?: string;
  requestUrls?: string;
}

export default class OssComponent extends Base {
  /**
   * bucket is existing?
   * @param : client, bucket, ossAcl = 'private'
   */
  async bucketIsExisting(client: OssClient, bucket: string, ossAcl: ACLType = 'private') {
    try {
      await client.getBucketInfo(bucket);
      return true;
    } catch (error) {
      if (error.name === 'NoSuchBucketError') {
        // NoSuchBucketError
        // create bucket ?
        const res = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'needToCreate',
            message: `The bucket ${bucket} is inexistent, create the ${bucket} now?`,
          },
        ]);
        if (res.needToCreate) {
          // create bucket
          const createLoading = spinner(`The bucket of ${bucket} is creating`);
          await client.putBucket(bucket);
          await client.putBucketACL(bucket, ossAcl);
          createLoading.succeed(`The ${bucket} is created`);
          return true;
        } else {
          logger.log(`The bucket ${bucket} is inexistent`, 'red');
        }
      } else {
        logger.log('GetBucketInfo Server is Error', 'red');
      }
      return false;
    }
  }
  /**
   * upload file
   * @param ossClient staticPath  ossObject
   */
  async upload(ossClient: OssClient, staticPath: string, ossObject: string) {
    const paths = walkSync(staticPath);
    for (const p of paths) {
      const fillPath = path.resolve(staticPath, p);
      /**
       * upload empty direction ？
       * const stat = fs.statSync(fillPath);
       * if (stat.isFile()) {}
       */

      /**
       * local create prefix ？
       * `${staticPath}/${ossPrefix}`
       */
      const stat = fs.statSync(fillPath);
      if (stat.isFile()) {
        const spin = spinner(`${p} is uploading `);
        try {
          const assignedOssdir = ossObject ? `${ossObject}/${p}` : p;
          // eslint-disable-next-line no-await-in-loop
          await ossClient.put(assignedOssdir, fillPath);
          spin.stop();
        } catch (error) {
          spin.fail(`${p} has uploaded failed`);
          throw new Error(error.message);
        }
      }
    }
  }
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
    // isContinue
    const isContinue = await this.bucketIsExisting(ossClient, ossBucket, ossAcl);
    if (!isContinue) return;
    ossClient = new OssClient({
      ...ossConfig,
      bucket: ossBucket,
    });
    const deployLoading = spinner('The Oss is deploying');

    // add attr to bucket and upload object
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
      // upload file
      const ossSrc = get(inputs, 'props.codeUri');
      const ossObject = get(inputs, 'props.ossObject');
      await this.upload(ossClient, ossSrc, ossObject);
      // update static
      const ossStatic: IOssStatic = get(inputs, 'props.static', {});
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
      deployLoading.succeed('OSS static source deployed success');
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
}
